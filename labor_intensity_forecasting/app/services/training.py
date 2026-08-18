import json
import os
import time
import shutil

import joblib

import numpy as np
import pandas as pd

from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LinearRegression
from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score
)
from sklearn.model_selection import train_test_split
from sklearn.neural_network import MLPRegressor
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import (
    OneHotEncoder,
    StandardScaler
)
from sklearn.ensemble import RandomForestRegressor

from app.crud.training import TrainingCRUD
from app.core.settings import WEIGHTS_DIR
from app.services.model_factory import ModelFactory


class TrainingService:

    def __init__(self, session):

        self.session = session

        self.crud = TrainingCRUD(
            session
        )

    # =========================================================
    # RETRAIN
    # =========================================================

    def retrain(
        self,
        request
    ):

        # -----------------------------------------------------
        # Проверяем проценты
        # -----------------------------------------------------

        if request.train_percent + request.test_percent != 100:

            raise ValueError(
                "train_percent + test_percent "
                "должно быть равно 100"
            )

        # -----------------------------------------------------
        # Получаем модель
        # -----------------------------------------------------

        model_info = self.crud.get_model(
            request.model_id
        )

        if model_info is None:

            raise ValueError(
                f"Модель {request.model_id} не найдена"
            )

        # -----------------------------------------------------
        # Получаем признаки
        # -----------------------------------------------------
        if not request.features:
            raise ValueError(
                "Не выбрано ни одного признака"
            )

        feature_objects = (
            self.crud.get_enabled_features()
        )

        features_all = [item.feature_name for item in feature_objects]

        invalid_features = (
                set(request.features)
                - set(features_all)
        )

        if invalid_features:
            raise ValueError(
                f"Неизвестные признаки: "
                f"{', '.join(invalid_features)}"
            )

        # --------------------------------------------------
        # 3. Получаем размер датасета
        # --------------------------------------------------

        total_count = (
            self.crud.get_operations_size()
        )
        if total_count == 0:
            raise ValueError(
                "В таблице operations нет данных "
                "для обучения"
            )
        dataset_size = min(
            request.dataset_size,
            total_count
        )
        # -----------------------------------------------------
        # Получаем dataset
        # -----------------------------------------------------

        operations = (
            self.crud.get_operations_sample(dataset_size)
        )

        if not operations:
            raise ValueError(
                "Не удалось получить данные"
            )

        rows = []

        for operation in operations:

            row = {}

            for feature in request.features:
                row[feature] = getattr(
                    operation,
                    feature,
                    None
                )

            row["target_hours"] = (
                operation.target_hours
            )

            rows.append(row)

        df = pd.DataFrame(
            rows
        )

        # -----------------------------------------------------
        # Удаляем записи без target
        # -----------------------------------------------------

        df = df[
            df["target_hours"].notna()
        ].copy()

        if len(df) < 10:

            raise ValueError(
                "Недостаточно данных для обучения. "
                "Минимум 10 записей."
            )

        # -----------------------------------------------------
        # Дата
        # -----------------------------------------------------

        if "fill_date" in df.columns:

            df["fill_date"] = (
                df["fill_date"]
                .astype(str)
            )

        # -----------------------------------------------------
        # X / y
        # -----------------------------------------------------

        X = df[
            request.features
        ].copy()

        y = df[
            "target_hours"
        ].astype(float)

        # -----------------------------------------------------
        # Типы признаков
        # -----------------------------------------------------

        categorical_cols = [

            column

            for column in X.columns

            if X[column].dtype == "object"
        ]

        numerical_cols = [

            column

            for column in X.columns

            if column not in categorical_cols
        ]

        # -----------------------------------------------------
        # Pipeline
        # -----------------------------------------------------

        numeric_transformer = Pipeline([

            (
                "imputer",

                SimpleImputer(
                    strategy="median"
                )
            ),

            (
                "scaler",

                StandardScaler()
            )
        ])

        categorical_transformer = Pipeline([

            (
                "imputer",

                SimpleImputer(
                    strategy="constant",
                    fill_value="missing"
                )
            ),

            (
                "ohe",

                OneHotEncoder(
                    handle_unknown="ignore",
                    sparse_output=False
                )
            )
        ])

        preprocessor = ColumnTransformer(

            transformers=[

                (
                    "num",
                    numeric_transformer,
                    numerical_cols
                ),

                (
                    "cat",
                    categorical_transformer,
                    categorical_cols
                )

            ],

            remainder="drop"
        )

        # -----------------------------------------------------
        # Модель
        # -----------------------------------------------------

        estimator = ModelFactory.create(
            model_info.name,
            request.model_params
        )

        pipeline = Pipeline([

            (
                "preprocessor",
                preprocessor
            ),

            (
                "regressor",
                estimator
            )

        ])

        # -----------------------------------------------------
        # Train/test
        # -----------------------------------------------------

        test_size = (
            request.test_percent / 100
        )

        X_train, X_test, y_train, y_test = (
            train_test_split(
                X,
                y,
                test_size=test_size,
                random_state=request.random_state
            )
        )

        # -----------------------------------------------------
        # Training
        # -----------------------------------------------------

        started_at = time.perf_counter()

        pipeline.fit(
            X_train,
            y_train
        )

        training_time = (
            time.perf_counter()
            - started_at
        )

        # -----------------------------------------------------
        # Prediction
        # -----------------------------------------------------

        y_pred = pipeline.predict(
            X_test
        )

        # -----------------------------------------------------
        # Metrics
        # -----------------------------------------------------

        mae = mean_absolute_error(
            y_test,
            y_pred
        )

        rmse = np.sqrt(
            mean_squared_error(
                y_test,
                y_pred
            )
        )

        r2 = r2_score(
            y_test,
            y_pred
        )

        # -----------------------------------------------------
        # TrainingRun
        # -----------------------------------------------------

        training_config = {

            "model_name":
                model_info.name,

            "train_percent":
                request.train_percent,

            "test_percent":
                request.test_percent,

            "random_state":
                request.random_state,

            "features":
                request.features,

            "categorical_features":
                categorical_cols,

            "numerical_features":
                numerical_cols,

            "dataset_size":
                len(df),

            "train_size":
                len(X_train),

            "test_size":
                len(X_test)
        }

        training_run = (
            self.crud.create_training_run(

                model_id=request.model_id,

                dataset_size=len(df),

                training_config=
                    training_config
            )
        )

        self.crud.update_training_run_metrics(

            training_run,

            mae=mae,

            rmse=rmse,

            r2=r2,

            training_time=
                training_time
        )

        # -----------------------------------------------------
        # Save model
        # -----------------------------------------------------

        version = (
            time.strftime(
                "%Y%m%d_%H%M%S"
            )
        )

        model_directory = os.path.join(

            WEIGHTS_DIR,

            training_run.id
        )

        os.makedirs(
            model_directory,
            exist_ok=True
        )

        # -----------------------------------------------------
        # Full pipeline
        # -----------------------------------------------------

        weights_path = os.path.join(

            model_directory,

            "pipeline.joblib"
        )

        joblib.dump(

            pipeline,

            weights_path
        )

        # -----------------------------------------------------
        # Scaler
        # -----------------------------------------------------

        scaler_path = os.path.join(

            model_directory,

            "scaler.joblib"
        )

        scaler = (

            pipeline
            .named_steps[
                "preprocessor"
            ]
            .named_transformers_[
                "num"
            ]
            .named_steps[
                "scaler"
            ]
            if numerical_cols
            else None
        )

        if scaler is not None:

            joblib.dump(
                scaler,
                scaler_path
            )

        else:

            scaler_path = None

        # -----------------------------------------------------
        # Encoder
        # -----------------------------------------------------

        encoder_path = os.path.join(

            model_directory,

            "encoder.joblib"
        )

        encoder = (

            pipeline
            .named_steps[
                "preprocessor"
            ]
            .named_transformers_[
                "cat"
            ]
            .named_steps[
                "ohe"
            ]
            if categorical_cols
            else None
        )

        if encoder is not None:

            joblib.dump(
                encoder,
                encoder_path
            )

        else:

            encoder_path = None

        # -----------------------------------------------------
        # Feature list
        # -----------------------------------------------------

        feature_list_path = os.path.join(

            model_directory,

            "features.json"
        )

        with open(

            feature_list_path,

            "w",

            encoding="utf-8"

        ) as file:

            json.dump(

                {

                    "features":
                        request.features,

                    "categorical_features":
                        categorical_cols,

                    "numerical_features":
                        numerical_cols

                },

                file,

                ensure_ascii=False,

                indent=4
            )

        # -----------------------------------------------------
        # ModelFile
        # -----------------------------------------------------

        self.crud.create_model_file(

            training_run_id=
                training_run.id,

            model_id=
                request.model_id,

            version=
                version,

            weights_path=
                weights_path,

            scaler_path=
                scaler_path,

            encoder_path=
                encoder_path,

            feature_list_path=
                feature_list_path
        )

        # -----------------------------------------------------
        # Новая модель становится активной
        # -----------------------------------------------------

        self.crud.activate_training_run(
            training_run
        )

        self.crud.commit()

        return {

            "success": True,

            "training_run_id":
                training_run.id,

            "model_name":
                model_info.name,

            "dataset_size":
                len(df),

            "train_size":
                len(X_train),

            "test_size":
                len(X_test),

            "mae":
                float(mae),

            "rmse":
                float(rmse),

            "r2":
                float(r2),

            "training_time":
                float(training_time),

            "message":
                "Модель успешно обучена "
                "и активирована."
        }

    # =========================================================
    # CREATE MODEL
    # =========================================================

    @staticmethod
    def _create_model(
        model_name,
        random_state
    ):

        name = model_name.lower()

        if (
            "linear" in name
        ):

            return LinearRegression()

        if (
            "random forest" in name
            or "randomforest" in name
            or name == "rf"
        ):

            return RandomForestRegressor(

                n_estimators=200,

                random_state=
                    random_state,

                n_jobs=-1
            )

        if (
            "xgboost" in name
            or name == "xgb"
        ):

            from xgboost import (
                XGBRegressor
            )

            return XGBRegressor(

                n_estimators=200,

                random_state=
                    random_state,

                n_jobs=-1,

                objective=
                    "reg:squarederror",

                eval_metric=
                    "rmse"
            )

        if (
            "catboost" in name
        ):

            from catboost import (
                CatBoostRegressor
            )

            return CatBoostRegressor(

                iterations=300,

                depth=6,

                learning_rate=0.05,

                loss_function="RMSE",

                random_seed=
                    random_state,

                verbose=False
            )

        if (
            "mlp" in name
            or "перцептрон" in name
        ):

            return MLPRegressor(

                hidden_layer_sizes=(
                    10,
                    10
                ),

                activation="relu",

                solver="adam",

                max_iter=1000,

                random_state=
                    random_state
            )

        raise ValueError(
            f"Неизвестная модель: "
            f"{model_name}"
        )

    # =========================================================
    # ROLLBACK
    # =========================================================

    def rollback(self):

        current = (
            self.crud.get_active_training_run()
        )

        if current is None:

            raise ValueError(
                "Активной модели нет"
            )

        previous = (
            self.crud.get_previous_training_run(
                current.id
            )
        )

        if previous is None:

            raise ValueError(
                "Предыдущей версии модели нет"
            )

        self.crud.activate_training_run(
            previous
        )

        self.crud.commit()

        model_name = (
            previous.model.name
            if previous.model
            else None
        )

        return {

            "success": True,

            "training_run_id":
                previous.id,

            "model_name":
                model_name,

            "message":
                "Выполнен возврат "
                "к предыдущей версии модели."
        }

    # =========================================================
    # EXPORT
    # =========================================================

    def export_model(
        self,
        output_directory
    ):

        import tarfile

        active_run = (
            self.crud.get_active_training_run()
        )

        if active_run is None:

            raise ValueError(
                "Активной модели нет"
            )

        model_file = (
            active_run.model_files[0]
            if active_run.model_files
            else None
        )

        if model_file is None:

            raise ValueError(
                "Файлы модели не найдены"
            )

        export_directory = os.path.join(

            output_directory,

            active_run.id
        )

        os.makedirs(
            export_directory,
            exist_ok=True
        )

        # -----------------------------------------------------
        # Metadata
        # -----------------------------------------------------

        metadata_path = os.path.join(

            export_directory,

            "metadata.json"
        )

        metadata = {

            "training_run_id":
                active_run.id,

            "model_id":
                active_run.model_id,

            "model_name":
                active_run.model.name,

            "dataset_size":
                active_run.dataset_size,

            "training_config":
                active_run.training_config,

            "mae":
                active_run.mae,

            "rmse":
                active_run.rmse,

            "r2":
                active_run.r2,

            "training_time":
                active_run.training_time,

            "version":
                model_file.version
        }

        with open(

            metadata_path,

            "w",

            encoding="utf-8"

        ) as file:

            json.dump(

                metadata,

                file,

                ensure_ascii=False,

                indent=4
            )

        # -----------------------------------------------------
        # Копируем файлы
        # -----------------------------------------------------

        files = [

            model_file.weights_path,

            model_file.scaler_path,

            model_file.encoder_path,

            model_file.feature_list_path
        ]

        for path in files:

            if path and os.path.exists(path):

                shutil.copy2(

                    path,

                    export_directory
                )

        # -----------------------------------------------------
        # TAR
        # -----------------------------------------------------

        archive_path = os.path.join(

            output_directory,

            f"model_{active_run.id}.tar"
        )

        with tarfile.open(

            archive_path,

            "w"

        ) as archive:

            archive.add(

                export_directory,

                arcname="model"
            )

        return archive_path

    # =========================================================
    # IMPORT
    # =========================================================

    def import_model(
        self,
        archive_path
    ):

        import tarfile

        import tempfile

        if not os.path.exists(
            archive_path
        ):

            raise FileNotFoundError(
                "Архив не найден"
            )

        temporary_directory = (
            tempfile.mkdtemp()
        )

        try:

            # -------------------------------------------------
            # Безопасное извлечение TAR
            # -------------------------------------------------

            with tarfile.open(
                archive_path,
                "r"
            ) as archive:

                self._safe_extract(
                    archive,
                    temporary_directory
                )

            model_directory = os.path.join(

                temporary_directory,

                "model"
            )

            metadata_path = os.path.join(

                model_directory,

                "metadata.json"
            )

            if not os.path.exists(
                metadata_path
            ):

                raise ValueError(
                    "В архиве отсутствует "
                    "metadata.json"
                )

            with open(

                metadata_path,

                "r",

                encoding="utf-8"

            ) as file:

                metadata = json.load(
                    file
                )

            model_id = metadata[
                "model_id"
            ]

            model = self.crud.get_model(
                model_id
            )

            if model is None:

                raise ValueError(
                    f"Модель {model_id} "
                    "отсутствует в БД"
                )

            # -------------------------------------------------
            # Новый TrainingRun
            # -------------------------------------------------

            training_run = (
                self.crud.create_training_run(

                    model_id=
                        model_id,

                    dataset_size=
                        metadata.get(
                            "dataset_size",
                            0
                        ),

                    training_config=
                        metadata.get(
                            "training_config",
                            {}
                        )
                )
            )

            self.crud.update_training_run_metrics(

                training_run,

                metadata.get("mae"),

                metadata.get("rmse"),

                metadata.get("r2"),

                metadata.get(
                    "training_time"
                )
            )

            # -------------------------------------------------
            # Новая директория
            # -------------------------------------------------

            destination = os.path.join(

                WEIGHTS_DIR,

                training_run.id
            )

            os.makedirs(

                destination,

                exist_ok=True
            )

            # -------------------------------------------------
            # Файлы
            # -------------------------------------------------

            weights_source = os.path.join(

                model_directory,

                "pipeline.joblib"
            )

            feature_source = os.path.join(

                model_directory,

                "features.json"
            )

            scaler_source = os.path.join(

                model_directory,

                "scaler.joblib"
            )

            encoder_source = os.path.join(

                model_directory,

                "encoder.joblib"
            )

            weights_path = (
                self._copy_if_exists(
                    weights_source,
                    destination
                )
            )

            feature_list_path = (
                self._copy_if_exists(
                    feature_source,
                    destination
                )
            )

            scaler_path = (
                self._copy_if_exists(
                    scaler_source,
                    destination
                )
            )

            encoder_path = (
                self._copy_if_exists(
                    encoder_source,
                    destination
                )
            )

            # -------------------------------------------------
            # ModelFile
            # -------------------------------------------------

            self.crud.create_model_file(

                training_run_id=
                    training_run.id,

                model_id=
                    model_id,

                version=
                    metadata.get(
                        "version"
                    ),

                weights_path=
                    weights_path,

                scaler_path=
                    scaler_path,

                encoder_path=
                    encoder_path,

                feature_list_path=
                    feature_list_path
            )

            # -------------------------------------------------
            # Активируем импортированную модель
            # -------------------------------------------------

            self.crud.activate_training_run(
                training_run
            )

            self.crud.commit()

            return {

                "success": True,

                "training_run_id":
                    training_run.id,

                "model_name":
                    model.name,

                "message":
                    "Модель успешно импортирована "
                    "и активирована."
            }

        except Exception:

            self.crud.rollback()

            raise

        finally:

            shutil.rmtree(
                temporary_directory,
                ignore_errors=True
            )

    # =========================================================
    # SAFE TAR EXTRACTION
    # =========================================================

    @staticmethod
    def _safe_extract(
        archive,
        destination
    ):

        destination = os.path.abspath(
            destination
        )

        for member in archive.getmembers():

            member_path = os.path.abspath(

                os.path.join(

                    destination,

                    member.name
                )
            )

            if not member_path.startswith(
                destination + os.sep
            ):

                raise ValueError(
                    "Небезопасный TAR архив"
                )

        archive.extractall(
            destination
        )

    # =========================================================
    # COPY
    # =========================================================

    @staticmethod
    def _copy_if_exists(
        source,
        destination
    ):

        if not os.path.exists(
            source
        ):

            return None

        target = os.path.join(

            destination,

            os.path.basename(source)
        )

        shutil.copy2(
            source,
            target
        )

        return target