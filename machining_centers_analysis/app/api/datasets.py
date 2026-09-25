from fastapi import APIRouter, HTTPException
from app.db.core.session import SQLDataBase
from app.services.datasets import DatasetsService
from app.schemas.datasets import (
    DatasetResponse,
    DatasetsResponse,
    DatasetStatisticsResponse
)

router = APIRouter(
    prefix="/datasets",
    tags=["Datasets"]
)


@router.get("")
async def get_datasets():

     """
     Возвращает список доступных наборов данных.
     """

     database = SQLDataBase()

     database.create_session()

     try:

        service = DatasetsService(
            database.session
        )

        return service.get_datasets()

     finally:

        database.session.close()

@router.get(
    "/{dataset_id}/statistics",
    response_model=DatasetStatisticsResponse
)
async def get_dataset_statistics(
    dataset_id: str
):

    database = SQLDataBase()
    database.create_session()

    try:

        service = DatasetsService(
            database.session
        )

        statistics = (
            service.get_dataset_statistics(
                dataset_id
            )
        )

        if statistics is None:

            raise HTTPException(
                status_code=404,
                detail="Dataset not found"
            )

        return statistics

    finally:

        database.session.close()

@router.get(
    "/{dataset_id}",
    response_model=DatasetResponse
)
async def get_dataset(dataset_id: str):

    database = SQLDataBase()
    database.create_session()

    try:

        service = DatasetsService(
            database.session
        )

        dataset = service.get_dataset(
            dataset_id
        )

        if dataset is None:
            raise HTTPException(
                status_code=404,
                detail="Dataset not found"
            )

        return dataset

    finally:

        database.session.close()

