import json
import os
import uuid

import joblib
import numpy as np
from sqlalchemy import select

from app.db.models.prediction import Prediction
from app.db.models.prediction_batch import PredictionBatch
from app.db.models.feature_vectors import FeatureVector
from app.db.models.feature_setting import FeatureSetting
from app.db.models.signal_samples import SignalSample
from app.db.models.training_run import TrainingRun
from app.db.models.model_file import ModelFile
from app.db.models.ml_model import MLModel


class PredictionService:

    def __init__(self, session):
        self.session = session
        #Словарь feature_settings
        self.feature_dict = self._get_feature_dict()

    def _get_feature_dict(self):
        """Возвращает словарь {feature_name: id} из таблицы FeatureSetting."""
        # Строим запрос только для двух необходимых колонок
        stmt = select(FeatureSetting.feature_name, FeatureSetting.id)

        # Выполняем запрос и собираем результат в словарь
        with self.session.begin_nested():  # Опционально: если нужна изоляция внутри транзакции
            result = self.session.execute(stmt).all()

        return {feature_name: feature_id for feature_name, feature_id in result}


    def predict(
        self,
        training_run_ids,
        sample_ids
    ):
        if not training_run_ids:
            raise ValueError(
                "Необходимо указать хотя бы один training_run_id"
            )

        if not sample_ids:
            raise ValueError(
                "Необходимо указать хотя бы один sample_id"
            )

        # -------------------------------------------------
        # 1. Загружаем модели
        # -------------------------------------------------

        training_rows = self._get_training_runs(
            training_run_ids
        )

        # -------------------------------------------------
        # 2. Загружаем FeatureVector
        # -------------------------------------------------

        feature_rows = self._get_feature_vectors(
            sample_ids
        )

        feature_by_sample = {
            feature_vector.sample_id: (
                feature_vector,
                signal_sample
            )
            for feature_vector, signal_sample
            in feature_rows
        }

        # -------------------------------------------------
        # 3. Создаем Batch
        # -------------------------------------------------

        batch_id = uuid.uuid4().hex

        batch = PredictionBatch(
            id=batch_id
        )

        self.session.add(batch)

        result_items = []

        # -------------------------------------------------
        # 4. Запускаем каждую TrainingRun
        # -------------------------------------------------

        for training_run, ml_model, model_file in training_rows:

            model = self._load_model(
                model_file
            )

            training_config = (
                training_run.training_config
                or {}
            )

            feature_ids = (
                training_config.get(
                    "feature_ids",
                    []
                )
            )

            if not feature_ids:
                raise ValueError(
                    f"В TrainingRun "
                    f"{training_run.id} "
                    f"не найден feature_ids"
                )

            # ---------------------------------------------
            # 5. Формируем X для этой модели
            # ---------------------------------------------

            X = []

            ordered_sample_ids = []

            for sample_id in sample_ids:

                feature_vector, signal_sample = (
                    feature_by_sample[sample_id]
                )

                values = self._extract_features(
                    feature_vector,
                    feature_ids
                )

                X.append(values)

                ordered_sample_ids.append(
                    sample_id
                )

            X = np.asarray(
                X,
                dtype=float
            )

            # ---------------------------------------------
            # 6. Prediction
            # ---------------------------------------------

            y_pred = model.predict(X)

            probabilities_array = None

            if hasattr(
                model,
                "predict_proba"
            ):
                probabilities_array = (
                    model.predict_proba(X)
                )

            classes = getattr(
                model,
                "classes_",
                None
            )

            # ---------------------------------------------
            # 7. Сохраняем каждое предсказание
            # ---------------------------------------------

            for index, sample_id in enumerate(
                ordered_sample_ids
            ):

                predicted_class = str(
                    y_pred[index]
                )

                confidence = None
                probabilities = None

                if probabilities_array is not None:

                    probabilities_row = (
                        probabilities_array[index]
                    )

                    confidence = float(
                        np.max(
                            probabilities_row
                        )
                    )

                    if classes is not None:
                        probabilities = {
                            str(cls): float(prob)
                            for cls, prob in zip(
                                classes,
                                probabilities_row
                            )
                        }

                prediction_id = uuid.uuid4().hex

                prediction = Prediction(
                    id=prediction_id,
                    batch_id=batch_id,
                    training_run_id=training_run.id,
                    sample_id=sample_id,
                    predicted_class=predicted_class,
                    confidence=confidence,
                    probabilities=probabilities
                )

                self.session.add(
                    prediction
                )

                result_items.append({
                    "id": prediction_id,
                    "training_run_id": training_run.id,
                    "model_name": ml_model.name,
                    "sample_id": sample_id,
                    "predicted_class": predicted_class,
                    "confidence": confidence,
                    "probabilities": probabilities
                })

        self.session.commit()

        return {
            "id": batch_id,
            "created_at": (
                batch.created_at.isoformat()
                if batch.created_at
                else None
            ),
            "training_run_ids": training_run_ids,
            "sample_ids": sample_ids,
            "predictions": result_items
        }


    def _get_training_runs(self, training_run_ids):

        statement = (
            select(
                TrainingRun,
                MLModel,
                ModelFile
            )
            .join(
                MLModel,
                TrainingRun.model_id == MLModel.id
            )
            .join(
                ModelFile,
                ModelFile.training_run_id == TrainingRun.id
            )
            .where(
                TrainingRun.id.in_(training_run_ids)
            )
        )

        result = self.session.execute(statement)

        rows = result.all()

        if len(rows) != len(training_run_ids):
            found_ids = {
                row[0].id
                for row in rows
            }

            missing_ids = [
                training_run_id
                for training_run_id in training_run_ids
                if training_run_id not in found_ids
            ]

            raise ValueError(
                "Не найдены TrainingRun: "
                + ", ".join(missing_ids)
            )

        return rows


    def _get_feature_vectors(self, sample_ids):

        statement = (
            select(
                FeatureVector,
                SignalSample
            )
            .join(
                SignalSample,
                FeatureVector.sample_id == SignalSample.id
            )
            .where(
                FeatureVector.sample_id.in_(sample_ids)
            )
        )

        result = self.session.execute(statement)

        rows = result.all()

        found_ids = {
            row[0].sample_id
            for row in rows
        }

        missing_ids = [
            sample_id
            for sample_id in sample_ids
            if sample_id not in found_ids
        ]

        if missing_ids:
            raise ValueError(
                "Не найдены FeatureVector для sample_id: "
                + ", ".join(missing_ids)
            )

        return rows

    def _extract_features(
            self,
            feature_vector,
            feature_ids
    ):
        features_json = feature_vector.features

        if not isinstance(features_json, dict):
            raise ValueError(
                "FeatureVector.features должен быть JSON-объектом"
            )

        # Создаем обратный маппинг {id: feature_name} для быстрого поиска O(1)
        id_to_name = {f_id: f_name for f_name, f_id in self.feature_dict.items()}

        values = []

        for feature_id in feature_ids:
            # 1. Находим человекочитаемое имя признака по его id
            feature_name = id_to_name.get(feature_id)

            # 2. Проверяем, есть ли такое имя в JSON-словаре признаков
            if feature_name and feature_name in features_json:
                values.append(features_json[feature_name])
                continue

            raise ValueError(
                f"Признак {feature_id} отсутствует "
                f"в FeatureVector {feature_vector.id}"
            )

        return values

    def _load_model(self, model_file):
        if not model_file.weights_path:
            raise ValueError(
                f"Для ModelFile {model_file.id} "
                f"не указан weights_path"
            )

        if not os.path.exists(
            model_file.weights_path
        ):
            raise ValueError(
                f"Файл модели не найден: "
                f"{model_file.weights_path}"
            )

        return joblib.load(
            model_file.weights_path
        )

    def _predict_one(
        self,
        model,
        X
    ):
        y_pred = model.predict(X)

        predicted_class = y_pred[0]

        confidence = None
        probabilities = None

        if hasattr(model, "predict_proba"):

            proba = model.predict_proba(X)[0]

            confidence = float(
                np.max(proba)
            )

            classes = getattr(
                model,
                "classes_",
                None
            )

            if classes is not None:
                probabilities = {
                    str(cls): float(prob)
                    for cls, prob in zip(
                        classes,
                        proba
                    )
                }

        return (
            str(predicted_class),
            confidence,
            probabilities
        )
