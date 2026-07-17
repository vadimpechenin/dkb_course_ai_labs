from fastapi import APIRouter

router = APIRouter(
    prefix="",
    tags=["Dashboard"]
)


@router.get("/dashboard")
async def dashboard():

    """
    Сводная информация для главной страницы.

    Возвращает:
    - количество операций;
    - количество признаков;
    - активную модель;
    - последнюю метрику RMSE;
    - дату последнего обучения;
    """

    pass