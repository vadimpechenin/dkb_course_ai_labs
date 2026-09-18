from app.crud.dashboard import DashboardCRUD
from app.schemas.dashboard import (
    DashboardResponse,
    DashboardStatistics,
    DashboardModel,
    DashboardLastTraining
)


class DashboardService:

    def __init__(self, session):

        self.crud = DashboardCRUD(session)

    def get_dashboard(self):

        statistics = DashboardStatistics(
            datasets_count=self.crud.get_datasets_count() or 0,
            experiments_count=self.crud.get_experiments_count() or 0,
            signal_samples_count=self.crud.get_signal_samples_count() or 0,
            feature_vectors_count=self.crud.get_feature_vectors_count() or 0,
            features_count=self.crud.get_features_count() or 0,
            ml_models_count=self.crud.get_ml_models_count() or 0,
            training_runs_count=self.crud.get_training_runs_count() or 0,
            predictions_count=self.crud.get_predictions_count() or 0
        )

        active_models = []

        for model in self.crud.get_active_models():

            active_models.append(
                DashboardModel(
                    id=model.id,
                    name=model.name,
                    model_type=model.model_type,
                    framework=model.framework,
                    task_type=model.task_type,
                    active=model.active
                )
            )

        training = self.crud.get_last_training()

        last_training = None

        if training is not None:

            last_training = DashboardLastTraining(
                id=training.id,
                model_name=training.model.name,
                dataset_id=training.dataset_id,
                dataset_size=training.dataset_size,
                accuracy=training.accuracy,
                f1_weighted=training.f1_weighted,
                precision_weighted=training.precision_weighted,
                recall_weighted=training.recall_weighted,
                cv_score=training.cv_score,
                training_time=training.training_time,
                created_at=(
                    training.created_at.isoformat()
                    if training.created_at is not None
                    else None
                )
            )

        return DashboardResponse(
            statistics=statistics,
            active_models=active_models,
            last_training=last_training
        )