from fastapi import APIRouter

router = APIRouter(
    prefix="/models",
    tags=["Models"]
)


@router.get("")
async def get_models():

    """
    Список моделей
    """

    pass


@router.get("/active")
async def active_model():

    """
    Текущая активная модель
    """

    pass


@router.post("/{model_id}/activate")
async def activate_model(model_id: str):

    """
    Сделать модель активной
    """

    pass


@router.get("/training-runs")
async def training_runs():

    """
    История обучения
    """

    pass