from fastapi import APIRouter


router = APIRouter(
    prefix="/datasets",
    tags=["Datasets"]
)


@router.get("")
async def get_datasets():

    """
    Возвращает список доступных наборов данных.

    Пока БД не используется.
    """

    return []