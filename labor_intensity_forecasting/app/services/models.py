from sqlalchemy.orm import Session

from app.crud.models import ModelsCRUD


class ModelsService:

    def __init__(
        self,
        session: Session
    ):

        self.crud = ModelsCRUD(
            session
        )

    # =========================================================
    # GET MODELS
    # =========================================================

    def get_models(self):

        models = self.crud.get_models()

        result = []

        for model in models:

            result.append(
                {
                    "id": model.id,
                    "name": model.name,
                    "description": model.description,
                    "framework": model.framework,
                    "active": model.active,
                    "training_runs_count":
                        len(model.training_runs)
                }
            )

        return result

    # =========================================================
    # ACTIVE MODEL
    # =========================================================

    def get_active_model(self):

        training_run = (
            self.crud.get_active_training_run()
        )

        if training_run is None:

            return None

        model = training_run.model

        return {
            "model_id": model.id,
            "model_name": model.name,
            "framework": model.framework,

            "training_run_id":
                training_run.id,

            "dataset_size":
                training_run.dataset_size,

            "mae":
                training_run.mae,

            "rmse":
                training_run.rmse,

            "r2":
                training_run.r2,

            "training_time":
                training_run.training_time,

            "created_at":
                training_run.created_at
        }

    # =========================================================
    # ACTIVATE
    # =========================================================

    def activate_model(
        self,
        model_id: str
    ):

        model = self.crud.get_model(
            model_id
        )

        if model is None:

            raise ValueError(
                f"Модель '{model_id}' не найдена"
            )

        training_run = (
            self.crud.get_latest_training_run_for_model(
                model_id
            )
        )

        if training_run is None:

            raise ValueError(
                "Для модели нет обученных версий"
            )

        self.crud.activate_model(
            model,
            training_run
        )

        return {
            "success": True,
            "model_id": model.id,
            "training_run_id":
                training_run.id,
            "message":
                "Модель успешно активирована"
        }

    # =========================================================
    # TRAINING RUNS
    # =========================================================

    def get_training_runs(self):

        runs = self.crud.get_training_runs()

        result = []

        for run in runs:

            result.append(
                {
                    "id": run.id,

                    "model_id":
                        run.model_id,

                    "model_name":
                        run.model.name,

                    "dataset_size":
                        run.dataset_size,

                    "training_config":
                        run.training_config,

                    "mae":
                        run.mae,

                    "rmse":
                        run.rmse,

                    "r2":
                        run.r2,

                    "training_time":
                        run.training_time,

                    "is_active":
                        run.is_active,

                    "created_at":
                        run.created_at
                }
            )

        return result

    # =========================================================
    # EXPERIMENT
    # =========================================================

    def get_experiment(
        self,
        training_run_id: str
    ):

        run = self.crud.get_training_run(
            training_run_id
        )

        if run is None:

            raise ValueError(
                f"Эксперимент '{training_run_id}' не найден"
            )

        model_files = (
            self.crud.get_model_files(
                training_run_id
            )
        )

        files = []

        for model_file in model_files:

            files.append(
                {
                    "id": model_file.id,
                    "version": model_file.version,
                    "weights_path":
                        model_file.weights_path,
                    "scaler_path":
                        model_file.scaler_path,
                    "encoder_path":
                        model_file.encoder_path,
                    "feature_list_path":
                        model_file.feature_list_path,
                    "created_at":
                        model_file.created_at
                }
            )

        return {
            "id": run.id,

            "model_id":
                run.model_id,

            "model_name":
                run.model.name,

            "framework":
                run.model.framework,

            "dataset_size":
                run.dataset_size,

            "training_config":
                run.training_config,

            "mae":
                run.mae,

            "rmse":
                run.rmse,

            "r2":
                run.r2,

            "training_time":
                run.training_time,

            "is_active":
                run.is_active,

            "created_at":
                run.created_at,

            "model_files":
                files
        }