from sqlalchemy.orm import Session

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