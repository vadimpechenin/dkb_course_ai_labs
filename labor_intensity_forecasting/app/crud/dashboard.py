from sqlalchemy import func

from app.db.models.operation import Operation
from app.db.models.feature_setting import FeatureSetting
from app.db.models.training_run import TrainingRun
from app.db.models.ml_model import MLModel
from app.db.models.model_file import ModelFile


class DashboardCRUD:

    def __init__(self, session):

        self.session = session

    def get_operations_count(self):

        return (self.session.query(
            func.count(Operation.id)
        ).scalar()
                or 0
                )

    def get_features_count(self):

        return (self.session.query(
            func.count(FeatureSetting.id)
        ).filter(
            FeatureSetting.enabled == True
        ).scalar()
                or 0
    )

    def get_last_training(self):

        return self.session.query(
            TrainingRun
        ).filter(
            TrainingRun.is_active == True
        ).first()

    def get_active_model(self):
        model = (
            self.session.query(MLModel)
            .filter(
                MLModel.active == True
            )
            .first()
        )

        if model is None:
            return None, None

        files = (
            self.session.query(ModelFile)
            .filter(
                ModelFile.model_id == model.id
            )
            .order_by(
                ModelFile.created_at.desc()
            )
            .first()
        )

        return model, files

    def get_history(self):

        runs = (

            self.session.query(

                TrainingRun

            )

            .order_by(

                TrainingRun.created_at

            )

            .all()

        )

        return runs