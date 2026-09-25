from fastapi import APIRouter
from app.db.core.session import SQLDataBase
from app.services.datasets import DatasetsService
from app.schemas.datasets import DatasetsResponse

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