from fastapi import APIRouter, HTTPException

from app.crud.training import TrainingRunCRUD
from app.db.core.session import SQLDataBase

from app.schemas.training import (
    TrainingRequest,
    TrainingResponse,
    TrainingRunResponse,
    TrainingRunDetailResponse,
    ModelFileResponse
)

from app.services.training import (
    TrainingService
)


router = APIRouter(
    prefix="/training",
    tags=["Training"]
)


@router.post(
    "",
    response_model=TrainingResponse
)
async def start_training(
    request: TrainingRequest
):

    database = SQLDataBase()

    database.create_session()

    try:

        service = TrainingService(
            database.session
        )


        results = await service.train(
            request
        )


        return {
            "training_runs":
                results
        }

    finally:

        database.session.close()

@router.get(
    "",
    response_model=TrainingResponse
)
async def get_training_runs():

    database = SQLDataBase()

    database.create_session()

    try:

        service = TrainingService(
            database.session
        )

        return {
            "training_runs":
                service.get_training_runs()
        }

    finally:

        database.session.close()

@router.get(
    "/{training_run_id}",
    response_model=TrainingRunDetailResponse
)
async def get_training_run(
    training_run_id: str
):

    database = SQLDataBase()

    database.create_session()

    try:
        crud = TrainingRunCRUD(database.session)

        row = crud.get_training_run_by_id(
            training_run_id
        )

        if row is None:
            raise HTTPException(
                status_code=404,
                detail="TrainingRun не найден"
            )

        training_run, model, dataset = row

        model_files = crud.get_model_files(
            training_run_id
        )

        files_response = []

        for model_file in model_files:
            files_response.append(
                ModelFileResponse(
                    id=model_file.id,
                    model_id=model_file.model_id,
                    version=model_file.version,

                    has_weights=bool(
                        model_file.weights_path
                    ),

                    has_scaler=bool(
                        model_file.scaler_path
                    ),

                    has_feature_list=bool(
                        model_file.feature_list_path
                    ),

                    has_metadata=bool(
                        model_file.metadata_path
                    ),

                    created_at=(
                        model_file.created_at.isoformat()
                        if model_file.created_at
                        else None
                    )
                )
            )

        return TrainingRunDetailResponse(
            id=training_run.id,

            model_id=training_run.model_id,
            model_name=model.name,

            dataset_id=training_run.dataset_id,
            dataset_name=dataset.name,

            dataset_size=training_run.dataset_size,

            accuracy=training_run.accuracy,
            precision_weighted=(
                training_run.precision_weighted
            ),
            recall_weighted=(
                training_run.recall_weighted
            ),
            f1_weighted=(
                training_run.f1_weighted
            ),
            cv_score=training_run.cv_score,

            training_time=training_run.training_time,

            is_active=bool(
                training_run.is_active
            ),

            training_config=(
                    training_run.training_config or {}
            ),

            model_files=files_response,

            created_at=(
                training_run.created_at.isoformat()
                if training_run.created_at
                else None
            )
        )

    finally:
        database.session.close()