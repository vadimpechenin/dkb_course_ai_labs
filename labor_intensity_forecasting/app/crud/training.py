from app.db.core.support.UUIDClass import UUIDClass

from sqlalchemy import func

from app.db.models.ml_model import MLModel
from app.db.models.training_run import TrainingRun
from app.db.models.model_file import ModelFile
from app.db.models.operation import Operation
from app.db.models.feature_setting import FeatureSetting


class TrainingCRUD:

    def __init__(self, session):

        self.session = session

    # =========================================================
    # MODELS
    # =========================================================

    def get_model(self, model_id):

        return (
            self.session.query(MLModel)
            .filter(
                MLModel.id == model_id
            )
            .first()
        )

    def get_all_models(self):

        return (
            self.session.query(MLModel)
            .order_by(
                MLModel.name
            )
            .all()
        )

    # =========================================================
    # FEATURES
    # =========================================================

    def get_enabled_features(self):
        res = self.session.query(
                FeatureSetting
            ).filter(
                FeatureSetting.enabled == True
            ).order_by(
                FeatureSetting.feature_order
            ).all()
        return res

    # =========================================================
    # DATASET
    # =========================================================

    def get_operations(self):

        return (
            self.session.query(
                Operation
            )
            .filter(
                Operation.target_hours.isnot(None)
            )
            .all()
        )

    def get_operations_size(self):
        result =  self.session.query(
                Operation
            ).filter(
                Operation.target_hours.isnot(None)
            ).count()
        return result

    def get_operations_sample(self, dataset_size):
        return (
            self.session.query(
                Operation
            )
            .filter(
                Operation.target_hours.isnot(None)
            )
            .order_by(
                __import__("sqlalchemy").func.random()
            )
            .limit(dataset_size)
            .all()
        )
    # =========================================================
    # TRAINING RUN
    # =========================================================

    def deactivate_all_training_runs(self):

        self.session.query(
            TrainingRun
        ).update(
            {
                TrainingRun.is_active: False
            }
        )

    def create_training_run(
        self,
        model_id,
        dataset_size,
        training_config
    ):

        training_run = TrainingRun(

            id=UUIDClass.geterateUUIDWithout_(),

            model_id=model_id,

            dataset_size=dataset_size,

            training_config=training_config,

            is_active=False
        )

        self.session.add(
            training_run
        )

        self.session.flush()

        return training_run

    def update_training_run_metrics(
        self,
        training_run,
        mae,
        rmse,
        r2,
        training_time
    ):

        training_run.mae = mae

        training_run.rmse = rmse

        training_run.r2 = r2

        training_run.training_time = training_time

        self.session.flush()

    def activate_training_run(
        self,
        training_run
    ):

        self.deactivate_all_training_runs()

        training_run.is_active = True

        self.session.flush()

    # =========================================================
    # MODEL FILE
    # =========================================================

    def create_model_file(
        self,
        training_run_id,
        model_id,
        version,
        weights_path,
        scaler_path,
        encoder_path,
        feature_list_path
    ):

        model_file = ModelFile(

            id=UUIDClass.geterateUUIDWithout_(),

            training_run_id=
                training_run_id,

            model_id=
                model_id,

            version=
                version,

            weights_path=
                weights_path,

            scaler_path=
                scaler_path,

            encoder_path=
                encoder_path,

            feature_list_path=
                feature_list_path
        )

        self.session.add(
            model_file
        )

        self.session.flush()

        return model_file

    # =========================================================
    # ROLLBACK
    # =========================================================

    def get_active_training_run(self):

        return (
            self.session.query(
                TrainingRun
            )
            .filter(
                TrainingRun.is_active == True
            )
            .order_by(
                TrainingRun.created_at.desc()
            )
            .first()
        )

    def get_previous_training_run(
        self,
        current_run_id
    ):

        return (
            self.session.query(
                TrainingRun
            )
            .filter(
                TrainingRun.id != current_run_id
            )
            .order_by(
                TrainingRun.created_at.desc()
            )
            .first()
        )

    def get_latest_training_run(self):

        return (
            self.session.query(
                TrainingRun
            )
            .order_by(
                TrainingRun.created_at.desc()
            )
            .first()
        )

    # =========================================================
    # COMMIT
    # =========================================================

    def commit(self):

        self.session.commit()

    def rollback(self):

        self.session.rollback()