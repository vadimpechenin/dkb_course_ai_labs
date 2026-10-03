import json

from fastapi import (
    APIRouter,
    HTTPException,
    UploadFile,
    File,
    Form
)

from app.db.core.session import SQLDataBase

from app.schemas.prediction import (
    PredictionBatchResponse,
    PredictionItemResponse,
    DeleteTrainingRunsRequest
)

from app.services.prediction import (
    PredictionService
)

from app.crud.prediction import (
    PredictionCRUD
)


router = APIRouter(
    prefix="/predictions",
    tags=["Predictions"]
)


@router.post(
    "",
    response_model=PredictionBatchResponse
)
async def create_predictions(
    training_run_ids: list[str] = Form(...),
    file: UploadFile = File(...)
):

    database = SQLDataBase()
    database.create_session()

    try:

        if not training_run_ids:

            raise HTTPException(
                status_code=400,
                detail=(
                    "Не выбрана ни одна "
                    "TrainingRun"
                )
            )

        if not file.filename:

            raise HTTPException(
                status_code=400,
                detail="JSON-файл не выбран"
            )

        if not file.filename.lower().endswith(
                ".json"
        ):

            raise HTTPException(
                status_code=400,
                detail=(
                    "Необходимо загрузить "
                    "JSON-файл"
                )
            )

        raw = await file.read()

        if not raw:

            raise HTTPException(
                status_code=400,
                detail="JSON-файл пуст"
            )

        try:

            data = json.loads(
                raw.decode("utf-8")
            )

        except (
            UnicodeDecodeError,
            json.JSONDecodeError
        ):

            raise HTTPException(
                status_code=400,
                detail=(
                    "Не удалось прочитать "
                    "JSON-файл"
                )
            )

        service = PredictionService(
            database.session
        )

        result = service.predict_json(
            training_run_ids=(
                training_run_ids
            ),
            data=data
        )

        return PredictionBatchResponse(

            id=result["id"],

            created_at=(
                result["created_at"]
            ),

            training_run_ids=(
                result[
                    "training_run_ids"
                ]
            ),

            sample_ids=(
                result[
                    "sample_ids"
                ]
            ),

            predictions=[
                PredictionItemResponse(
                    **item
                )
                for item
                in result["predictions"]
            ]
        )

    except HTTPException:
        database.session.rollback()
        raise

    except ValueError as exc:

        database.session.rollback()

        raise HTTPException(
            status_code=400,
            detail=str(exc)
        )

    except Exception as exc:

        database.session.rollback()

        print(
            "PREDICTION ERROR:",
            type(exc).__name__,
            str(exc)
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Ошибка выполнения Prediction"
            )
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
                    prediction.input_sample_id
                    not in sample_ids
            ):
                sample_ids.append(
                    prediction.input_sample_id
                )

            predictions.append(
                PredictionItemResponse(
                    id=prediction.id,

                    training_run_id=(
                        prediction.training_run_id
                    ),

                    model_name=ml_model.name,

                    sample_id=(
                        prediction.input_sample_id
                    ),

                    actual_wear=(
                        prediction.actual_wear
                    ),

                    actual_class=(
                        prediction.actual_class
                    ),

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

@router.delete(
    "/training-runs"
)
async def delete_training_runs(
    request: DeleteTrainingRunsRequest
):
    database = SQLDataBase()
    database.create_session()

    try:

        service = PredictionService(
            database.session
        )

        result = (
            service.delete_training_runs(
                request.training_run_ids
            )
        )

        return result

    except ValueError as error:

        database.session.rollback()

        raise HTTPException(
            status_code=400,
            detail=str(error)
        )

    except Exception as error:

        database.session.rollback()

        print(
            "DELETE TRAINING RUNS ERROR:",
            repr(error)
        )

        raise HTTPException(
            status_code=500,
            detail="Ошибка удаления моделей"
        )

    finally:

        database.session.close()