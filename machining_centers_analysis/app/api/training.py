from fastapi import APIRouter


router = APIRouter(
    prefix="/training",
    tags=["Training"]
)


@router.get("")
async def get_training():

    """
    Возвращает данные для страницы обучения.

    Пока БД не используется.
    """

    return {
        "datasets": [],
        "features": [],
        "models": []
    }