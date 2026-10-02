from fastapi import APIRouter, HTTPException, UploadFile

from app.db.core.session import SQLDataBase
from app.schemas.prediction import (
    PredictionRequest,
    PredictionBatchResponse,
    PredictionItemResponse
)
from app.services.prediction import (
    PredictionService
)
from app.crud.prediction import PredictionCRUD



router = APIRouter(
    prefix="/predictions",
    tags=["Predictions"]
)


@router.post(
    "",
    response_model=PredictionBatchResponse
)
def create_predictions(
    request: PredictionRequest
):
    database = SQLDataBase()
    database.create_session()

    try:
        service = PredictionService(
            database.session
        )

        result = service.predict(
            training_run_ids=request.training_run_ids,
            sample_ids=request.sample_ids
        )

        return PredictionBatchResponse(
            id=result["id"],
            created_at=result["created_at"],
            training_run_ids=result[
                "training_run_ids"
            ],
            sample_ids=result[
                "sample_ids"
            ],
            predictions=[
                PredictionItemResponse(
                    **item
                )
                for item in result["predictions"]
            ]
        )

    except ValueError as exc:

        database.session.rollback()

        raise HTTPException(
            status_code=400,
            detail=str(exc)
        )

    except Exception:

        database.session.rollback()

        raise HTTPException(
            status_code=500,
            detail="Ошибка выполнения Prediction"
        )

    finally:
        database.session.close()


@router.get(
    "/{prediction_id}",
    response_model=PredictionBatchResponse
)
def get_predictions(
    prediction_id: str
):
    database = SQLDataBase()
    database.create_session()

    try:
        crud = PredictionCRUD(
            database.session
        )

        batch = crud.get_batch(
            prediction_id
        )

        if batch is None:
            raise HTTPException(
                status_code=404,
                detail="Prediction batch не найден"
            )

        rows = crud.get_predictions_by_batch(
            prediction_id
        )

        if not rows:
            raise HTTPException(
                status_code=404,
                detail="Предсказания не найдены"
            )

        predictions = []

        training_run_ids = []
        sample_ids = []

        for prediction, training_run, ml_model in rows:

            if (
                prediction.training_run_id
                not in training_run_ids
            ):
                training_run_ids.append(
                    prediction.training_run_id
                )

            if (
                prediction.sample_id
                not in sample_ids
            ):
                sample_ids.append(
                    prediction.sample_id
                )

            predictions.append(
                PredictionItemResponse(
                    id=prediction.id,
                    training_run_id=(
                        prediction.training_run_id
                    ),
                    model_name=ml_model.name,
                    sample_id=prediction.sample_id,
                    predicted_class=(
                        prediction.predicted_class
                    ),
                    confidence=(
                        prediction.confidence
                    ),
                    probabilities=(
                        prediction.probabilities
                    )
                )
            )

        return PredictionBatchResponse(
            id=batch.id,
            created_at=(
                batch.created_at.isoformat()
                if batch.created_at
                else None
            ),
            training_run_ids=training_run_ids,
            sample_ids=sample_ids,
            predictions=predictions
        )

    finally:
        database.session.close()
