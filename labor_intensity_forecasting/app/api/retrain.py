from fastapi import APIRouter

router = APIRouter(
    prefix="",
    tags=["Training"]
)


@router.post("/retrain")
async def retrain():

    """
    Переобучение модели
    """

    pass


@router.post("/rollback")
async def rollback():

    """
    Возврат предыдущей версии модели
    """

    pass


@router.post("/export")
async def export_model():

    """
    Экспорт модели
    """

    pass


@router.post("/import")
async def import_model():

    """
    Импорт модели
    """

    pass