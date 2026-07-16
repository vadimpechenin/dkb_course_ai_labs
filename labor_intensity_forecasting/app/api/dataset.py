from fastapi import APIRouter

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