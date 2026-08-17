import json
import os
import tempfile

from fastapi import (
    APIRouter,
    HTTPException
)

from fastapi.responses import FileResponse

from app.db.core.session import SQLDataBase

from app.services.predictions import (
    PredictionsService
)

router = APIRouter(
    prefix="/predictions",
    tags=["Predictions"]
)

def get_database():

    database = SQLDataBase()
    database.create_session()

    return database

@router.post("/dump")
async def dump_predictions():
    """
       Выгрузка истории прогнозов в JSON.
       """

    database = get_database()

    temporary_directory = (
        tempfile.mkdtemp()
    )

    try:

        service = PredictionsService(
            database.session
        )

        data = (
            service.dump_predictions()
        )

        file_path = os.path.join(
            temporary_directory,
            "predictions.json"
        )

        with open(
                file_path,
                "w",
                encoding="utf-8"
        ) as file:

            json.dump(
                data,
                file,
                ensure_ascii=False,
                indent=4,
                default=str
            )

        return FileResponse(
            path=file_path,
            filename="predictions.json",
            media_type="application/json"
        )

    except Exception as exception:

        raise HTTPException(
            status_code=500,
            detail=(
                    "Ошибка выгрузки прогнозов: "
                    + str(exception)
            )
        )

    finally:

        database.session.close()


@router.get("/history")
async def history(
    limit: int = 100,
    offset: int = 0
):

    """
    История прогнозов.
    """

    if limit < 1 or limit > 1000:

        raise HTTPException(
            status_code=400,
            detail="limit должен быть от 1 до 1000"
        )

    if offset < 0:

        raise HTTPException(
            status_code=400,
            detail="offset не может быть отрицательным"
        )

    database = get_database()

    try:

        service = PredictionsService(
            database.session
        )

        return service.get_history(
            limit,
            offset
        )

    finally:

        database.session.close()
