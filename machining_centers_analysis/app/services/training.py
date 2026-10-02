import numpy as np
from app.db.models.feature_setting import FeatureSetting

import json
import os
import time
from sqlalchemy import select

import joblib

from fastapi import HTTPException

from app.crud.training import TrainingCRUD

from app.db.models.training_run import TrainingRun

from app.db.models.model_file import ModelFile

from app.services.ml.classifier_service import (
    ClassifierService
)

from app.db.core.support.UUIDClass import (
    UUIDClass
)


MODEL_DIR = "models"


class TrainingService:

    def __init__(self, session):
        self.crud = TrainingCRUD(
            session
        )

        self.ml_service = (
            ClassifierService()
        )

    async def train(
            self,
            request
    ):

        if not request.model_ids:
            raise HTTPException(
                status_code=400,
                detail="Не выбрана ни одна модель."
            )

        if not request.feature_ids:
            raise HTTPException(
                status_code=400,
                detail="Не выбран ни один признак."
            )

        models = (
            self.crud.get_models_by_ids(
                request.model_ids
            )
        )

        if len(models) != len(
                request.model_ids
        ):
            raise HTTPException(
                status_code=400,
                detail=(
                    "Одна или несколько "
                    "выбранных моделей "
                    "не найдены."
                )
            )

        rows = (
              self.crud.get_feature_vectors(
                request.dataset_id
            )
        )

        if not rows: #not rows
            raise HTTPException(
                status_code=400,
                detail=(
                    "Для выбранного набора "
                    "данных нет FeatureVector."
                )
            )


        print(
            "TRAINING: rows count =",
            len(rows)
        )
        """
        if rows:
            print(
                "TRAINING: first row type =",
                type(rows[0])
            )
            print(
                "TRAINING: first row =",
                rows[0]
            )

        try:
        """
        X, y, groups = self._prepare_data(rows, request.feature_ids)
        """
            print(
                "TRAINING: data prepared:",
                "X =", X.shape,
                "y =", len(y),
                "groups =", len(groups)
            )

        except HTTPException as e:
            print(
                "TRAINING: HTTPException in _prepare_data:",
                e.status_code,
                e.detail
            )
            raise

        except Exception as e:
            print(
                "TRAINING: Exception in _prepare_data:",
                type(e).__name__,
                str(e)
            )
            raise
        """
        results = []

        for model in models:
            training_run = (
                self._train_model(
                    model=model,
                    request=request,
                    X=X,
                    y=y,
                    groups=groups
                )
            )

            results.append(
                training_run
            )

        return results

    def _prepare_data(
            self,
            rows,
            feature_ids
    ):

        statement = (
            select(
                FeatureSetting.id,
                FeatureSetting.feature_name
            )
            .where(
                FeatureSetting.id.in_(feature_ids)
            )
        )

        result = self.crud.session.execute(statement)

        id_to_name = {
            feature_id: feature_name
            for feature_id, feature_name in result.all()
        }

        if len(id_to_name) != len(feature_ids):
            raise ValueError(
                "Один или несколько выбранных признаков не найдены"
            )

        X = []

        y = []

        groups = []
        sample_ = []
        for vector, sample in rows:

            features = vector.features

            if not isinstance(features, dict):
                raise ValueError(
                    f"FeatureVector {vector.id} "
                    "имеет некорректный формат features"
                )

            values = []

            for feature_id in feature_ids:

                feature_name = id_to_name[feature_id]

                if feature_name not in features:
                    raise ValueError(
                        f"Признак {feature_name} "
                        f"отсутствует в FeatureVector {vector.id}"
                    )

                values.append(
                    float(features[feature_name])
                )

            X.append(
                values
            )

            if vector.target_class is None:
                raise ValueError(
                    f"FeatureVector "
                    f"{vector.id} "
                    "не содержит target_class"
                )

            y.append(
                vector.target_class
            )
            #print('Экземпляр:' + sample.id)
            #print('Эксперимент:' + sample.tool_id)
            #print('Инструмент:' + sample.tool_id)
            sample_.append(sample.id)
            groups.append(
                sample.tool_id
            )

        X = np.asarray(
            X,
            dtype=float
        )

        y = np.asarray(y)

        groups = np.asarray(
            groups
        )

        if len(
                X.shape
        ) != 2:
            raise ValueError(
                "FeatureVector имеет "
                "некорректную размерность."
            )

        if len(
                np.unique(groups)
        ) < 2:
            raise HTTPException(
                status_code=400,
                detail=(
                    "Для группового "
                    "разделения train/test "
                    "необходимо минимум "
                    "два инструмента."
                )
            )

        return X, y, groups

    def _train_model(
        self,
        model,
        request,
        X,
        y,
        groups
    ):

        run_id = (
            UUIDClass
            .geterateUUIDWithout_()
        )


        try:

            estimator, metrics = (
                self.ml_service.train(
                    model_type=model.model_type,
                    X=X,
                    y=y,
                    groups=groups,
                    test_size=request.test_size,
                    random_state=request.random_state,
                    scaler=request.scaler
                )
            )

        except Exception as exc:

            raise HTTPException(
                status_code=400,
                detail=(
                    f"Ошибка обучения "
                    f"{model.name}: {str(exc)}"
                )
            )


        training_config = {

            "dataset_id":
                request.dataset_id,

            "feature_ids":
                request.feature_ids,

            "model_id":
                model.id,

            "test_size":
                request.test_size,

            "random_state":
                request.random_state,

            "split_method":
                "group_by_tool",

            "scaler":
                request.scaler,

            "train_size":
                metrics["train_size"],

            "test_size_actual":
                metrics["test_size"],

            "train_groups":
                metrics["train_groups"],

            "test_groups":
                metrics["test_groups"]
        }


        training_run = TrainingRun(

            id=run_id,

            model_id=model.id,

            dataset_id=request.dataset_id,

            dataset_size=len(X),

            training_config=
                training_config,

            accuracy=
                metrics["accuracy"],

            precision_weighted=
                metrics[
                    "precision_weighted"
                ],

            recall_weighted=
                metrics[
                    "recall_weighted"
                ],

            f1_weighted=
                metrics[
                    "f1_weighted"
                ],

            training_time=
                metrics["training_time"],

            is_active=True
        )


        self.crud.create_training_run(
            training_run
        )


        model_file = (
            self._save_model(
                estimator=estimator,
                training_run=training_run,
                feature_ids=request.feature_ids,
                training_config=
                    training_config
            )
        )


        self.crud.create_model_file(
            model_file
        )


        return {

            "id":
                training_run.id,

            "model_id":
                model.id,

            "model_name":
                model.name,

            "dataset_id":
                request.dataset_id,

            "dataset_size":
                len(X),

            "accuracy":
                metrics["accuracy"],

            "precision_weighted":
                metrics[
                    "precision_weighted"
                ],

            "recall_weighted":
                metrics[
                    "recall_weighted"
                ],

            "f1_weighted":
                metrics[
                    "f1_weighted"
                ],

            "training_time":
                metrics[
                    "training_time"
                ],

            "created_at":
                (
                    training_run.created_at.isoformat()
                    if training_run.created_at
                    else None
                )
        }

    def _save_model(
            self,
            estimator,
            training_run,
            feature_ids,
            training_config
    ):

        directory = os.path.join(
            MODEL_DIR,
            training_run.id
        )

        os.makedirs(
            directory,
            exist_ok=True
        )

        weights_path = os.path.join(
            directory,
            "model.joblib"
        )

        metadata_path = os.path.join(
            directory,
            "metadata.json"
        )

        feature_list_path = os.path.join(
            directory,
            "feature_list.json"
        )

        joblib.dump(
            estimator,
            weights_path
        )

        with open(
                metadata_path,
                "w",
                encoding="utf-8"
        ) as file:
            json.dump(
                training_config,
                file,
                ensure_ascii=False,
                indent=4
            )

        with open(
                feature_list_path,
                "w",
                encoding="utf-8"
        ) as file:
            json.dump(
                feature_ids,
                file,
                ensure_ascii=False,
                indent=4
            )

        return ModelFile(

            id=
            UUIDClass
            .geterateUUIDWithout_(),

            training_run_id=
            training_run.id,

            model_id=
            training_run.model_id,

            version="1.0",

            weights_path=
            weights_path,

            feature_list_path=
            feature_list_path,

            metadata_path=
            metadata_path
        )

    def get_training_runs(
            self
    ):

        runs = (
            self.crud
            .get_training_runs()
        )

        result = []

        for run in runs:
            result.append({

                "id": run.id,

                "model_id":
                    run.model_id,

                "model_name":
                    run.model.name,

                "dataset_id":
                    run.dataset_id,

                "dataset_size":
                    run.dataset_size,

                "accuracy":
                    run.accuracy,

                "precision_weighted":
                    run.precision_weighted,

                "recall_weighted":
                    run.recall_weighted,

                "f1_weighted":
                    run.f1_weighted,

                "cv_score":
                    run.cv_score,

                "training_time":
                    run.training_time,

                "created_at":
                    (
                        run.created_at.isoformat()
                        if run.created_at
                        else None
                    )
            })

        return result

    def get_training_run(
            self,
            training_run_id
    ):

        run = (
            self.crud
            .get_training_run(
                training_run_id
            )
        )

        if run is None:
            raise HTTPException(
                status_code=404,
                detail="TrainingRun не найден."
            )

        return {

            "id":
                run.id,

            "model_id":
                run.model_id,

            "model_name":
                run.model.name,

            "dataset_id":
                run.dataset_id,

            "dataset_size":
                run.dataset_size,

            "accuracy":
                run.accuracy,

            "precision_weighted":
                run.precision_weighted,

            "recall_weighted":
                run.recall_weighted,

            "f1_weighted":
                run.f1_weighted,

            "cv_score":
                run.cv_score,

            "training_time":
                run.training_time,

            "created_at":
                (
                    run.created_at.isoformat()
                    if run.created_at
                    else None
                )
        }

