from fastapi import APIRouter

from app.db.core.session import SQLDataBase

from app.services.dashboard import DashboardService

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

    database = SQLDataBase()

    database.create_session()

    try:

        service = DashboardService(database.session)

        return service.get_dashboard()

    finally:

        database.session.close()