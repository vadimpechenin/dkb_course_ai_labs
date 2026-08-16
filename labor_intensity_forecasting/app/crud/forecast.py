from app.db.models.training_run import TrainingRun
from app.db.models.ml_model import MLModel
from app.db.models.model_file import ModelFile
from app.db.models.feature_setting import FeatureSetting
from app.db.models.prediction import Prediction
from app.db.models.prediction_input import PredictionInput


class ForecastCRUD:

    def __init__(self, session):

        self.session = session

    # =========================================================
    # ACTIVE MODEL
    # =========================================================

    def get_active_training_run(self):

        return (
            self.session.query(TrainingRun)
            .filter(
                TrainingRun.is_active == True
            )
            .order_by(
                TrainingRun.created_at.desc()
            )
            .first()
        )

    # =========================================================
    # MODEL FILE
    # =========================================================

    def get_model_file(
        self,
        training_run_id
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
            .first()
        )

    # =========================================================
    # MODEL
    # =========================================================

    def get_model(
        self,
        model_id
    ):

        return (
            self.session.query(MLModel)
            .filter(
                MLModel.id == model_id
            )
            .first()
        )

    # =========================================================
    # FEATURES
    # =========================================================

    def get_enabled_features(self):

        return (
            self.session.query(
                FeatureSetting
            )
            .filter(
                FeatureSetting.enabled == True
            )
            .order_by(
                FeatureSetting.feature_order.asc()
            )
            .all()
        )

    # =========================================================
    # PREDICTIONS
    # =========================================================

    def save_prediction(
        self,
        prediction,
        prediction_input
    ):

        self.session.add(
            prediction
        )

        self.session.add(
            prediction_input
        )

        self.session.commit()

    def save_predictions(
        self,
        predictions
    ):

        for prediction, prediction_input in predictions:

            self.session.add(
                prediction
            )

            self.session.add(
                prediction_input
            )

        self.session.commit()