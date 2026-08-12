from fastapi import (
    APIRouter,
    Query,
    UploadFile,
    File,
    HTTPException
)

from app.db.core.session import SQLDataBase

from app.services.dataset import DatasetService

from app.schemas.dataset import (
    FeaturesSaveRequest
)

router = APIRouter(
    prefix="/dataset",
    tags=["Dataset"]
)

def get_service():

    database = SQLDataBase()

    database.create_session()

    return database

@router.get("")
async def dataset():

    """
    Получить информацию о датасете.
    """

    database = get_service()

    try:

        service = DatasetService(
            database.session
        )

        return service.get_dataset()

    finally:

        database.session.close()


@router.get("/features")
async def features():

    """
    Получить список признаков.
    """

    database = get_service()

    try:

        service = DatasetService(
            database.session
        )

        return service.get_features()

    finally:

        database.session.close()


@router.post("/features")
async def save_features(request: FeaturesSaveRequest):

    """
    Сохранить выбранные признаки.
    """

    database = get_service()

    try:

        service = DatasetService(
            database.session
        )

        return service.save_features(
            request.feature_names
        )

    except Exception as exception:

        database.session.rollback()

        raise HTTPException(
            status_code=500,
            detail=str(exception)
        )

    finally:

        database.session.close()

@router.get("/operations")
async def operations(
    page: int = Query(1, ge=1),
    size: int = Query(100, ge=1, le=1000)
):

    """
    Получить операции постранично.

    page — номер страницы.

    size — количество записей.
    """

    database = get_service()

    try:

        service = DatasetService(
            database.session
        )

        return service.get_operations(
            page,
            size
        )

    finally:

        database.session.close()



@router.post("/operations/import-csv")
async def import_csv(
    file: UploadFile = File(...)
):

    """
    Импорт CSV файла
    в таблицу operations.
    """

    # ---------------------------------------------------------
    # Проверяем расширение
    # ---------------------------------------------------------

    if not file.filename:

        raise HTTPException(
            status_code=400,
            detail="Файл не указан"
        )

    if not file.filename.lower().endswith(
        ".csv"
    ):

        raise HTTPException(
            status_code=400,
            detail="Необходимо загрузить CSV-файл"
        )

    # ---------------------------------------------------------
    # Читаем файл
    # ---------------------------------------------------------

    content = await file.read()

    if not content:

        raise HTTPException(
            status_code=400,
            detail="CSV-файл пуст"
        )

    database = get_service()

    try:

        service = DatasetService(
            database.session
        )

        return service.import_csv(
            content
        )

    except ValueError as exception:

        database.session.rollback()

        raise HTTPException(
            status_code=400,
            detail=str(exception)
        )

    except Exception as exception:

        database.session.rollback()

        raise HTTPException(
            status_code=500,
            detail=(
                "Ошибка импорта CSV: "
                + str(exception)
            )
        )

    finally:

        database.session.close()