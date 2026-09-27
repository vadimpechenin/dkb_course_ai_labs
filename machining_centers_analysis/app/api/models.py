from fastapi import APIRouter

from app.db.core.session import SQLDataBase

from app.services.model import ModelService

from app.schemas.model import (
    MLModelResponse,
    MLModelsResponse
)


router = APIRouter(
    prefix="/models",
    tags=["Models"]
)


@router.get(
    "",
    response_model=MLModelsResponse
)
async def get_models():

    database = SQLDataBase()

    database.create_session()

    try:

        service = ModelService(
            database.session
        )

        models = service.get_models()

        return {
            "models": models
        }

    finally:

        database.session.close()


@router.get(
    "/{model_id}",
    response_model=MLModelResponse
)
async def get_model(
    model_id: str
):

    database = SQLDataBase()

    database.create_session()

    try:

        service = ModelService(
            database.session
        )

        return service.get_model(
            model_id
        )

    finally:

        database.session.close()