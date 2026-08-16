from sqlalchemy.orm import Session

from app.db.models.ml_model import MLModel
from app.db.models.training_run import TrainingRun
from app.db.models.model_file import ModelFile


class ModelsCRUD:

    def __init__(self, session: Session):
        self.session = session

    # =========================================================
    # MODELS
    # =========================================================

    def get_models(self):

        return (
            self.session.query(MLModel)
            .order_by(MLModel.name.asc())
            .all()
        )

    def get_model(
        self,
        model_id: str
    ):

        return (
            self.session.query(MLModel)
            .filter(
                MLModel.id == model_id
            )
            .first()
        )

    # =========================================================
    # TRAINING RUNS
    # =========================================================

    def get_training_runs(
        self
    ):

        return (
            self.session.query(TrainingRun)
            .join(
                MLModel,
                TrainingRun.model_id == MLModel.id
            )
            .order_by(
                TrainingRun.created_at.desc()
            )
            .all()
        )

    def get_training_run(
        self,
        training_run_id: str
    ):

        return (
            self.session.query(TrainingRun)
            .filter(
                TrainingRun.id == training_run_id
            )
            .first()
        )

    def get_active_training_run(self):

        return (
            self.session.query(TrainingRun)
            .filter(
                TrainingRun.is_active.is_(True)
            )
            .order_by(
                TrainingRun.created_at.desc()
            )
            .first()
        )

    def get_latest_training_run_for_model(
        self,
        model_id: str
    ):

        return (
            self.session.query(TrainingRun)
            .filter(
                TrainingRun.model_id == model_id
            )
            .order_by(
                TrainingRun.created_at.desc()
            )
            .first()
        )

    # =========================================================
    # MODEL FILES
    # =========================================================

    def get_model_files(
        self,
        training_run_id: str
    ):

        return (
            self.session.query(ModelFile)
            .filter(
                ModelFile.training_run_id
                == training_run_id
            )
            .order_by(
                ModelFile.created_at.desc()
            )
            .all()
        )

    # =========================================================
    # ACTIVATE
    # =========================================================

    def deactivate_all_training_runs(self):

        self.session.query(
            TrainingRun
        ).update(
            {
                TrainingRun.is_active: False
            },
            synchronize_session=False
        )

    def deactivate_all_models(self):

        self.session.query(
            MLModel
        ).update(
            {
                MLModel.active: False
            },
            synchronize_session=False
        )

    def activate_model(
        self,
        model: MLModel,
        training_run: TrainingRun
    ):

        self.deactivate_all_training_runs()
        self.deactivate_all_models()

        training_run.is_active = True
        model.active = True

        self.session.commit()

        self.session.refresh(
            training_run
        )

        self.session.refresh(
            model
        )

        return training_run