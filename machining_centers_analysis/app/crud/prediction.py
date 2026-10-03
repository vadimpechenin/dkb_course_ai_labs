from sqlalchemy import select

from app.db.models.prediction import Prediction
from app.db.models.prediction_batch import PredictionBatch
from app.db.models.training_run import TrainingRun
from app.db.models.ml_model import MLModel
from app.db.models.model_file import ModelFile

class PredictionCRUD:

    def __init__(self, session):
        self.session = session

    def create_batch(self, batch):
        self.session.add(batch)
        self.session.flush()

    def create_prediction(self, prediction):
        self.session.add(prediction)

    def get_batch(self, batch_id: str):
        statement = (
            select(PredictionBatch)
            .where(PredictionBatch.id == batch_id)
        )

        result = self.session.execute(statement)

        return result.scalars().first()

    def get_predictions_by_batch(self, batch_id: str):
        statement = (
            select(
                Prediction,
                TrainingRun,
                MLModel
            )
            .join(
                TrainingRun,
                Prediction.training_run_id
                == TrainingRun.id
            )
            .join(
                MLModel,
                TrainingRun.model_id
                == MLModel.id
            )
            .where(
                Prediction.batch_id == batch_id
            )
            .order_by(
                Prediction.created_at,
                Prediction.training_run_id,
                Prediction.input_sample_id
            )
        )

        result = self.session.execute(
            statement
        )

        return result.all()

    def get_training_runs_for_delete(
            self,
            training_run_ids: list[str]
    ):
        statement = (
            select(TrainingRun)
            .where(
                TrainingRun.id.in_(
                    training_run_ids
                )
            )
        )

        result = self.session.execute(
            statement
        )

        return result.scalars().all()

    def get_model_files_for_training_runs(
            self,
            training_run_ids: list[str]
    ):
        statement = (
            select(ModelFile)
            .where(
                ModelFile.training_run_id.in_(
                    training_run_ids
                )
            )
        )

        result = self.session.execute(
            statement
        )

        return result.scalars().all()

    def delete_predictions_for_training_runs(
            self,
            training_run_ids: list[str]
    ):
        statement = (
            select(Prediction)
            .where(
                Prediction.training_run_id.in_(
                    training_run_ids
                )
            )
        )

        result = self.session.execute(
            statement
        )

        predictions = result.scalars().all()

        batch_ids = {
            prediction.batch_id
            for prediction in predictions
        }

        for prediction in predictions:
            self.session.delete(
                prediction
            )

        return batch_ids

    def delete_model_files(
            self,
            model_files
    ):
        for model_file in model_files:
            self.session.delete(
                model_file
            )

    def delete_training_runs(
            self,
            training_runs
    ):
        for training_run in training_runs:
            self.session.delete(
                training_run
            )

    def delete_empty_prediction_batches(
            self,
            batch_ids: set[str]
    ):
        for batch_id in batch_ids:

            statement = (
                select(Prediction)
                .where(
                    Prediction.batch_id == batch_id
                )
                .limit(1)
            )

            result = self.session.execute(
                statement
            )

            prediction = result.scalars().first()

            if prediction is None:

                batch = self.session.get(
                    PredictionBatch,
                    batch_id
                )

                if batch is not None:
                    self.session.delete(
                        batch
                    )