from fastapi import APIRouter


router = APIRouter(
    prefix="/features",
    tags=["Features"]
)


@router.get("")
async def get_features():

    """
    Возвращает список доступных признаков.

    Пока БД не используется.
    """

    return []