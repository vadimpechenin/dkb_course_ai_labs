from fastapi import APIRouter


router = APIRouter(
    prefix="/predictions",
    tags=["Predictions"]
)


@router.get("")
async def get_predictions():

    """
    Возвращает результаты классификации.

    Пока БД не используется.
    """

    return []