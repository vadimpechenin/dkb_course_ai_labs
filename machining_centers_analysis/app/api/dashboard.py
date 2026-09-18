from fastapi import APIRouter

from app.db.core.session import SQLDataBase
from app.services.dashboard import DashboardService
from app.schemas.dashboard import DashboardResponse


router = APIRouter(
    prefix="",
    tags=["Dashboard"]
)


@router.get(
    "/dashboard",
    response_model=DashboardResponse
)


@router.get("/dashboard")
async def dashboard():

    """
    Сводная информация для главной страницы.

    Возвращает:
    - статистику данных;
    - количество признаков;
    - доступные ML-модели;
    - последнее обучение;
    - метрики последнего обучения.
    """

    database = SQLDataBase()

    database.create_session()

    try:

        service = DashboardService(database.session)

        return service.get_dashboard()

    finally:

        database.session.close()