from fastapi import APIRouter

from app.db.core.session import SQLDataBase

from app.schemas.training import (
    TrainingRequest,
    TrainingResponse,
    TrainingRunResponse
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


        results = service.train(
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
    response_model=TrainingRunResponse
)
async def get_training_run(
    training_run_id: str
):

    database = SQLDataBase()

    database.create_session()

    try:

        service = TrainingService(
            database.session
        )

        return service.get_training_run(
            training_run_id
        )

    finally:

        database.session.close()