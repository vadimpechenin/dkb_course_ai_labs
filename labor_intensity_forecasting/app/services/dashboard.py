import json

from app.crud.dashboard import DashboardCRUD

from app.schemas.dashboard import DashboardResponse, RMSEHistory


class DashboardService:

    def __init__(self, session):

        self.crud = DashboardCRUD(session)

    def get_dashboard(self):

        operations = self.crud.get_operations_count()

        features = self.crud.get_features_count()

        training = self.crud.get_last_training()

        model, files = self.crud.get_active_model()

        history = []

        for item in self.crud.get_history():

            history.append(

                RMSEHistory(

                    date=item.created_at.strftime("%d.%m"),

                    rmse=item.rmse

                )

            )

        config = training.training_config

        if isinstance(config, str):

            config = json.loads(config)

        return DashboardResponse(

            operationsCount=operations,

            featuresCount=features,

            activeModel=model.name,

            framework=model.framework,

            weightsPath=files.weights_path,

            datasetSize=training.dataset_size,

            trainPercent=config["train_percent"],

            testPercent=config["test_percent"],

            lastImport="-",

            lastTraining=training.created_at.strftime("%d.%m.%Y"),

            mae=training.mae,

            rmse=training.rmse,

            r2=training.r2,

            trainingTime=training.training_time,

            history=history

        )