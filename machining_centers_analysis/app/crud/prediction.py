from sqlalchemy import select

from app.db.models.prediction import Prediction
from app.db.models.prediction_batch import PredictionBatch
from app.db.models.training_run import TrainingRun
from app.db.models.ml_model import MLModel


class PredictionCRUD:

    def __init__(self, session):
        self.session = session

    def create_batch(self, batch):
        self.session.add(batch)

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
                Prediction.training_run_id == TrainingRun.id
            )
            .join(
                MLModel,
                TrainingRun.model_id == MLModel.id
            )
            .where(
                Prediction.batch_id == batch_id
            )
            .order_by(
                Prediction.created_at,
                Prediction.training_run_id,
                Prediction.sample_id
            )
        )

        result = self.session.execute(statement)

        return result.all()
