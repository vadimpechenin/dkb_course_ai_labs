import json

from app.crud.dashboard import DashboardCRUD
from app.schemas.dashboard import DashboardResponse, RMSEHistory


class DashboardService:

    def __init__(self, session):
        self.crud = DashboardCRUD(session)

    def get_dashboard(self):

        # ---------------------------------------------------------
        # 1. Количество операций
        # ---------------------------------------------------------

        operations = self.crud.get_operations_count()

        # ---------------------------------------------------------
        # 2. Количество включенных признаков
        # ---------------------------------------------------------

        features = self.crud.get_features_count()

        # ---------------------------------------------------------
        # 3. Последнее обучение
        # ---------------------------------------------------------

        training = self.crud.get_last_training()

        # ---------------------------------------------------------
        # 4. Активная модель
        # ---------------------------------------------------------

        model, files = self.crud.get_active_model()

        # ---------------------------------------------------------
        # 5. История RMSE
        # ---------------------------------------------------------

        history = []

        for item in self.crud.get_history():

            history.append(
                RMSEHistory(
                    date=(
                        item.created_at.strftime("%d.%m")
                        if item.created_at
                        else "-"
                    ),
                    rmse=item.rmse
                )
            )

        # ---------------------------------------------------------
        # Значения по умолчанию
        # ---------------------------------------------------------

        dataset_size = 0

        train_percent = 0

        test_percent = 0

        last_training = "-"

        mae = None
        rmse = None
        r2 = None
        training_time = None

        # ---------------------------------------------------------
        # 6. Информация об обучении
        # ---------------------------------------------------------

        if training is not None:

            dataset_size = training.dataset_size or 0

            mae = training.mae
            rmse = training.rmse
            r2 = training.r2
            training_time = training.training_time

            if training.created_at:

                last_training = (
                    training.created_at.strftime("%d.%m.%Y")
                )

            config = training.training_config

            if config:

                if isinstance(config, str):

                    try:
                        config = json.loads(config)

                    except (json.JSONDecodeError, TypeError):

                        config = {}

                if isinstance(config, dict):

                    train_percent = (
                        config.get("train_percent", 0)
                    )

                    test_percent = (
                        config.get("test_percent", 0)
                    )

        # ---------------------------------------------------------
        # 7. Информация о модели
        # ---------------------------------------------------------

        active_model = "-"
        framework = "-"
        weights_path = "-"

        if model is not None:

            active_model = model.name or "-"
            framework = model.framework or "-"

        if files is not None:

            weights_path = files.weights_path or "-"

        # ---------------------------------------------------------
        # 8. Формирование ответа
        # ---------------------------------------------------------

        return DashboardResponse(

            operationsCount=operations or 0,

            featuresCount=features or 0,

            activeModel=active_model,

            framework=framework,

            weightsPath=weights_path,

            datasetSize=dataset_size,

            trainPercent=train_percent,

            testPercent=test_percent,

            lastImport="-",

            lastTraining=last_training,

            mae=mae,

            rmse=rmse,

            r2=r2,

            trainingTime=training_time,

            history=history

        )