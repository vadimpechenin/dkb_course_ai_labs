from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.db.models.datasets import Dataset
from app.db.models.experiments import Experiment
from app.db.models.signal_samples import SignalSample
from app.db.models.feature_setting import FeatureSetting
from app.db.models.feature_vectors import FeatureVector
from app.db.models.ml_model import MLModel
from app.db.models.training_run import TrainingRun
from app.db.models.prediction import Prediction


class DashboardCRUD:

    def __init__(self, session: Session):
        self.session = session

    def get_datasets_count(self):
        return self.session.scalar(
            select(func.count(Dataset.id))
        )

    def get_experiments_count(self):
        return self.session.scalar(
            select(func.count(Experiment.id))
        )

    def get_signal_samples_count(self):
        return self.session.scalar(
            select(func.count(SignalSample.id))
        )

    def get_feature_vectors_count(self):
        return self.session.scalar(
            select(func.count(FeatureVector.id))
        )

    def get_features_count(self):
        return self.session.scalar(
            select(
                func.count(FeatureSetting.id)
            ).where(
                FeatureSetting.enabled == True
            )
        )

    def get_ml_models_count(self):
        return self.session.scalar(
            select(func.count(MLModel.id))
        )

    def get_training_runs_count(self):
        return self.session.scalar(
            select(func.count(TrainingRun.id))
        )

    def get_predictions_count(self):
        return self.session.scalar(
            select(func.count(Prediction.id))
        )

    def get_active_models(self):
        statement = (
            select(MLModel)
            .where(MLModel.active == True)
            .order_by(MLModel.name)
        )

        result = self.session.execute(statement)

        return result.scalars().all()

    def get_last_training(self):
        statement = (
            select(TrainingRun)
            .order_by(
                TrainingRun.created_at.desc()
            )
            .limit(1)
        )

        result = self.session.execute(statement)

        return result.scalars().first()