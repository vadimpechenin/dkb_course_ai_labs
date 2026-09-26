from fastapi import APIRouter, HTTPException

from app.db.core.session import SQLDataBase

from app.schemas.features import (
    FeatureResponse,
    FeaturesResponse
)

from app.services.features import FeaturesService



router = APIRouter(
    prefix="/features",
    tags=["Features"]
)


@router.get("",
    response_model=FeaturesResponse)
async def get_features():

    """
    Возвращает список доступных признаков.
    """

    database = SQLDataBase()
    database.create_session()

    try:

        service = FeaturesService(
            database.session
        )

        return service.get_features()

    finally:

        database.session.close()


@router.get(
    "/{feature_id}",
    response_model=FeatureResponse
)
async def get_feature(
        feature_id: str
):
    database = SQLDataBase()
    database.create_session()

    try:

        service = FeaturesService(
            database.session
        )

        feature = service.get_feature(
            feature_id
        )

        if feature is None:
            raise HTTPException(
                status_code=404,
                detail="Feature not found"
            )

        return feature

    finally:

        database.session.close()