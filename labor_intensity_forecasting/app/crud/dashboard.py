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

        return self.session.query(
            func.count(Operation.id)
        ).scalar()

    def get_features_count(self):

        return self.session.query(
            func.count(FeatureSetting.id)
        ).filter(
            FeatureSetting.enabled == True
        ).scalar()

    def get_last_training(self):

        return self.session.query(
            TrainingRun
        ).filter(
            TrainingRun.is_active == True
        ).first()

    def get_active_model(self):

        return (
            self.session.query(
                MLModel,
                ModelFile
            )
            .join(
                ModelFile,
                MLModel.id == ModelFile.model_id
            )
            .join(
                TrainingRun,
                TrainingRun.id == ModelFile.training_run_id
            )
            .filter(
                TrainingRun.is_active == True
            )
            .first()
        )

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