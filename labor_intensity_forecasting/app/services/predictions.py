import json

from sqlalchemy.orm import Session

from app.crud.predictions import (
    PredictionsCRUD
)


class PredictionsService:

    def __init__(
        self,
        session: Session
    ):

        self.crud = PredictionsCRUD(
            session
        )

    # =========================================================
    # HISTORY
    # =========================================================

    def get_history(
        self,
        limit: int = 100,
        offset: int = 0
    ):

        predictions = (
            self.crud.get_history(
                limit,
                offset
            )
        )

        result = []

        for prediction in predictions:

            input_data = None

            if prediction.prediction_input:

                input_data = {
                    "detail_mass":
                        prediction.prediction_input.detail_mass,

                    "blank_length":
                        prediction.prediction_input.blank_length,

                    "work_center":
                        prediction.prediction_input.work_center,

                    "operation":
                        prediction.prediction_input.operation,

                    "material":
                        prediction.prediction_input.material,

                    "nomenclature":
                        prediction.prediction_input.nomenclature,

                    "note":
                        prediction.prediction_input.note,

                    "user_name":
                        prediction.prediction_input.user_name,

                    "fill_date":
                        prediction.prediction_input.fill_date,

                    "row_number":
                        prediction.prediction_input.row_number
                }

            result.append(
                {
                    "id":
                        prediction.id,

                    "training_run_id":
                        prediction.training_run_id,

                    "model_name":
                        prediction.training_run.model.name
                        if prediction.training_run
                        else None,

                    "forecast":
                        prediction.forecast,

                    "std":
                        prediction.std,

                    "created_at":
                        prediction.created_at,

                    "input":
                        input_data
                }
            )

        return result

    # =========================================================
    # DUMP
    # =========================================================

    def dump_predictions(self):

        predictions = (
            self.crud.get_all()
        )

        result = []

        for prediction in predictions:

            input_data = {}

            if prediction.prediction_input:

                input_data = {
                    "detail_mass":
                        prediction.prediction_input.detail_mass,

                    "blank_length":
                        prediction.prediction_input.blank_length,

                    "work_center":
                        prediction.prediction_input.work_center,

                    "operation":
                        prediction.prediction_input.operation,

                    "material":
                        prediction.prediction_input.material,

                    "nomenclature":
                        prediction.prediction_input.nomenclature,

                    "note":
                        prediction.prediction_input.note,

                    "user_name":
                        prediction.prediction_input.user_name,

                    "fill_date":
                        prediction.prediction_input.fill_date,

                    "row_number":
                        prediction.prediction_input.row_number
                }

            result.append(
                {
                    "id":
                        prediction.id,

                    "training_run_id":
                        prediction.training_run_id,

                    "model_name":
                        prediction.training_run.model.name
                        if prediction.training_run
                        else None,

                    "created_at":
                        prediction.created_at,

                    "data":
                        input_data,

                    "result": {
                        "forecast":
                            prediction.forecast,

                        "std":
                            prediction.std
                    }
                }
            )

        return result