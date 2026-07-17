from fastapi import APIRouter, Query, UploadFile, File

router = APIRouter(
    prefix="/dataset",
    tags=["Dataset"]
)


@router.get("")
async def dataset():

    """
    Получить датасет
    """

    pass


@router.get("/features")
async def features():

    """
    Получить список признаков
    """

    pass


@router.post("/features")
async def save_features():

    """
    Сохранить выбранные признаки
    """

    pass

@router.get("/operations")
async def operations(
    page: int = Query(1, ge=1),
    size: int = Query(100, ge=1, le=1000)
):

    """
    Получить операции постранично.

    page - номер страницы.

    size - размер страницы.
    """

    pass


@router.post("/operations/import-csv")
async def import_csv(
    file: UploadFile = File(...)
):

    """
    Импорт CSV файла в таблицу operations.
    """

    pass