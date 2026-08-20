from sqlalchemy.orm import Session

from app.db.models import PredictionInput, Prediction, ModelFile, Operation
from app.db.models.feature_setting import FeatureSetting
from app.db.models.ml_model import MLModel
from app.db.models.training_run import TrainingRun


class SettingsCRUD:

    def __init__(
        self,
        session: Session
    ):

        self.session = session

    def get_features(self):

        return (
            self.session.query(
                FeatureSetting
            )
            .order_by(
                FeatureSetting.feature_order.asc()
            )
            .all()
        )

    def get_models_count(self):

        return (
            self.session.query(
                MLModel
            ).count()
        )

    def get_features_count(self):

        return (
            self.session.query(
                FeatureSetting
            ).count()
        )

    def get_enabled_features_count(self):

        return (
            self.session.query(
                FeatureSetting
            )
            .filter(
                FeatureSetting.enabled.is_(True)
            )
            .count()
        )

    def get_active_training_run(self):

        return (
            self.session.query(
                TrainingRun
            )
            .filter(
                TrainingRun.is_active.is_(True)
            )
            .order_by(
                TrainingRun.created_at.desc()
            )
            .first()
        )

    def delete_prediction_inputs(self):

        return (
            self.session.query(
                PredictionInput
            ).delete(synchronize_session=False)
        )

    def delete_predictions(self):

        return (
            self.session.query(
                Prediction
            ).delete(synchronize_session=False)
        )

    def delete_model_files(self):

        return (
            self.session.query(
                ModelFile
            ).delete(synchronize_session=False)
        )

    def delete_training_runs(self):

        return (
            self.session.query(
                TrainingRun
            ).delete(synchronize_session=False)
        )

    def delete_operations(self):

        return (
            self.session.query(
                Operation
            ).delete(synchronize_session=False)
        )

    def delete_feature_settings(self):

        return (
            self.session.query(
                FeatureSetting
            ).delete(synchronize_session=False)
        )

    def delete_ml_models(self):

        return (
            self.session.query(
                MLModel
            ).delete(synchronize_session=False)
        )