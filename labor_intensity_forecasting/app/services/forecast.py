import os
import json
from app.db.core.support.UUIDClass import UUIDClass
import pickle

import joblib

import numpy as np

from datetime import datetime

from app.crud.forecast import ForecastCRUD

from app.db.models.prediction import Prediction
from app.db.models.prediction_input import PredictionInput

from app.schemas.forecast import ForecastInput


class ForecastService:

    def __init__(
        self,
        session
    ):

        self.crud = ForecastCRUD(
            session
        )

        self.model = None

        self.scaler = None

        self.encoder = None

        self.feature_list = None

        self.training_run = None

        self.model_file = None

    # =========================================================
    # PUBLIC METHOD
    # =========================================================

    def forecast(
        self,
        inputs: list[ForecastInput]
    ):

        # -----------------------------------------------------
        # Загружаем активную модель
        # -----------------------------------------------------

        self._load_active_model()

        results = []

        database_predictions = []

        for item in inputs:

            # -------------------------------------------------
            # Проверяем диапазоны
            # -------------------------------------------------

            error_code = (
                self._check_boundaries(item)
            )

            # -------------------------------------------------
            # Проверяем номенклатуру
            # -------------------------------------------------

            nomenclature_error = (
                self._check_nomenclature(
                    item.nomenclature
                )
            )

            error_code += nomenclature_error

            # -------------------------------------------------
            # Формируем признаки
            # -------------------------------------------------

            X = self._build_features(
                item
            )

            # -------------------------------------------------
            # Расчет
            # -------------------------------------------------

            prediction = self._predict(
                X
            )

            # -------------------------------------------------
            # std
            # -------------------------------------------------

            if error_code != 0:

                std = float(
                    -abs(error_code)
                )

            else:

                std = self._calculate_std()

            # -------------------------------------------------
            # Результат API
            # -------------------------------------------------

            results.append({

                "forecast":
                    round(
                        float(prediction),
                        2
                    ),

                "std":
                    round(
                        float(std),
                        2
                    )
            })

            # -------------------------------------------------
            # Сохраняем результат в БД
            # -------------------------------------------------

            prediction_id = UUIDClass.geterateUUIDWithout_()

            input_id = UUIDClass.geterateUUIDWithout_()

            prediction_object = Prediction(

                id=prediction_id,

                training_run_id=
                    self.training_run.id,

                forecast=float(
                    prediction
                ),

                std=float(
                    std
                )
            )

            input_object = PredictionInput(

                id=input_id,

                prediction_id=
                    prediction_id,

                detail_mass=
                    item.detail_mass,

                blank_length=
                    item.blank_length,

                work_center=
                    item.work_center,

                operation=
                    item.operation,

                material=
                    item.material,

                nomenclature=
                    item.nomenclature,

                note=
                    item.note,

                user_name=
                    item.user_name,

                fill_date=
                    self._parse_date(
                        item.fill_date
                    ),

                row_number=
                    item.row_number
            )

            database_predictions.append(
                (
                    prediction_object,
                    input_object
                )
            )

        # -----------------------------------------------------
        # Сохраняем все прогнозы одной транзакцией
        # -----------------------------------------------------

        self.crud.save_predictions(
            database_predictions
        )

        return results

    # =========================================================
    # LOAD MODEL
    # =========================================================

    def _load_active_model(self):

        self.training_run = (
            self.crud.get_active_training_run()
        )

        if self.training_run is None:

            raise RuntimeError(
                "Активная модель не найдена"
            )

        self.model_file = (
            self.crud.get_model_file(
                self.training_run.id
            )
        )

        if self.model_file is None:

            raise RuntimeError(
                "Файл активной модели не найден"
            )

        # -----------------------------------------------------
        # Модель
        # -----------------------------------------------------

        self.model = self._load_file(
            self.model_file.weights_path
        )

        # -----------------------------------------------------
        # Scaler
        # -----------------------------------------------------

        if self.model_file.scaler_path:

            self.scaler = self._load_file(
                self.model_file.scaler_path
            )

        # -----------------------------------------------------
        # Encoder
        # -----------------------------------------------------

        if self.model_file.encoder_path:

            self.encoder = self._load_file(
                self.model_file.encoder_path
            )

        # -----------------------------------------------------
        # Список признаков
        # -----------------------------------------------------

        if self.model_file.feature_list_path:

            self.feature_list = (
                self._load_feature_list(
                    self.model_file.feature_list_path
                )
            )

        else:

            features = (
                self.crud.get_enabled_features()
            )

            self.feature_list = [

                feature.feature_name

                for feature in features

            ]

    # =========================================================
    # LOAD FILE
    # =========================================================

    @staticmethod
    def _load_file(path):

        if not path:

            raise RuntimeError(
                "Путь к файлу модели не указан"
            )

        if not os.path.exists(path):

            raise FileNotFoundError(
                f"Файл модели не найден: {path}"
            )

        extension = (
            os.path.splitext(path)[1]
            .lower()
        )

        if extension in (
            ".joblib",
            ".pkl",
            ".pickle"
        ):

            return joblib.load(path)

        raise RuntimeError(
            f"Неподдерживаемый формат модели: "
            f"{extension}"
        )

    # =========================================================
    # FEATURE LIST
    # =========================================================

    @staticmethod
    def _load_feature_list(path):

        if not os.path.exists(path):

            raise FileNotFoundError(
                f"Файл признаков не найден: {path}"
            )

        extension = (
            os.path.splitext(path)[1]
            .lower()
        )

        if extension == ".json":

            with open(
                path,
                "r",
                encoding="utf-8"
            ) as file:

                data = json.load(file)

                if isinstance(data, dict):

                    return data.get(
                        "features",
                        []
                    )

                return data

        if extension == ".txt":

            with open(
                path,
                "r",
                encoding="utf-8"
            ) as file:

                return [
                    line.strip()
                    for line in file
                    if line.strip()
                ]

        raise RuntimeError(
            "Неподдерживаемый формат "
            "списка признаков"
        )

    # =========================================================
    # FEATURES
    # =========================================================

    def _build_features(
        self,
        item: ForecastInput
    ):

        values = []

        for feature in self.feature_list:

            value = getattr(
                item,
                feature,
                None
            )

            values.append(
                self._prepare_feature(
                    feature,
                    value
                )
            )

        X = np.array(
            [values],
            dtype=object
        )

        # -----------------------------------------------------
        # Encoder
        # -----------------------------------------------------

        if self.encoder is not None:

            try:

                X = self.encoder.transform(
                    X
                )

            except Exception:

                # Некоторые энкодеры ожидают
                # DataFrame.
                X = self.encoder.transform(
                    [values]
                )

        # -----------------------------------------------------
        # Scaler
        # -----------------------------------------------------

        if self.scaler is not None:

            X = self.scaler.transform(
                X
            )

        return X

    # =========================================================
    # FEATURE PREPARATION
    # =========================================================

    @staticmethod
    def _prepare_feature(
        feature,
        value
    ):

        if value is None:

            return ""

        return value

    # =========================================================
    # PREDICTION
    # =========================================================

    def _predict(
        self,
        X
    ):

        result = self.model.predict(
            X
        )

        return float(
            np.asarray(result).reshape(-1)[0]
        )

    # =========================================================
    # STD
    # =========================================================

    def _calculate_std(self):

        # -----------------------------------------------------
        # Если модель имеет собственный метод оценки
        # неопределенности — используем его.
        # -----------------------------------------------------

        if hasattr(
            self.model,
            "predict_std"
        ):

            try:

                value = self.model.predict_std()

                return float(
                    np.asarray(value)
                    .reshape(-1)[0]
                )

            except Exception:

                pass

        # -----------------------------------------------------
        # Для учебной версии используем RMSE
        # последнего обучения как оценку неопределенности.
        # -----------------------------------------------------

        if self.training_run.rmse is not None:

            return float(
                self.training_run.rmse
            )

        return 0.0

    # =========================================================
    # BOUNDARY CHECK
    # =========================================================

    def _check_boundaries(
        self,
        item: ForecastInput
    ):

        code = 0

        # -----------------------------------------------------
        # detail_mass
        # -----------------------------------------------------

        code += self._check_numeric(
            item.detail_mass,
            "detail_mass",
            -1,
            -2
        )

        # -----------------------------------------------------
        # blank_length
        # -----------------------------------------------------

        code += self._check_numeric(
            item.blank_length,
            "blank_length",
            -10,
            -20
        )

        return code

    # =========================================================
    # NUMERIC BOUNDS
    # =========================================================

    def _check_numeric(
        self,
        value,
        feature_name,
        min_code,
        max_code
    ):

        if value is None:

            return 0

        from app.db.models.operation import Operation

        # Используем session из CRUD
        session = self.crud.session

        minimum, maximum = session.query(

            getattr(Operation, feature_name).label(
                "value"
            )

        ).filter(

            getattr(Operation, feature_name)
            .isnot(None)

        ).with_entities(

            getattr(Operation, feature_name)

        ).first(), None

        # -----------------------------------------------------
        # Получаем min/max отдельным запросом
        # -----------------------------------------------------

        from sqlalchemy import func

        result = session.query(

            func.min(
                getattr(Operation, feature_name)
            ),

            func.max(
                getattr(Operation, feature_name)
            )

        ).filter(

            getattr(Operation, feature_name)
            .isnot(None)

        ).first()

        if result is None:

            return 0

        min_value, max_value = result

        if min_value is None or max_value is None:

            return 0

        if value < min_value:

            return min_code

        if value > max_value:

            return max_code

        return 0

    # =========================================================
    # NOMENCLATURE
    # =========================================================

    def _check_nomenclature(
        self,
        nomenclature
    ):

        if not nomenclature:

            return 0

        # -----------------------------------------------------
        # Если используется encoder с методом semantic
        # distance, можно использовать его.
        # -----------------------------------------------------

        if self.encoder is not None and hasattr(
            self.encoder,
            "semantic_distance"
        ):

            distance = (
                self.encoder.semantic_distance(
                    nomenclature
                )
            )

            if distance > 0.8:

                return -10000

        return 0

    # =========================================================
    # DATE
    # =========================================================

    @staticmethod
    def _parse_date(value):

        if not value:

            return None

        if hasattr(
            value,
            "year"
        ):

            return value

        formats = [

            "%Y-%m-%d",

            "%d.%m.%Y",

            "%Y/%m/%d"

        ]

        for fmt in formats:

            try:

                return datetime.strptime(
                    value,
                    fmt
                ).date()

            except ValueError:

                continue

        return None