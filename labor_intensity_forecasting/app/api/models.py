from fastapi import (
    APIRouter,
    HTTPException
)

from app.db.core.session import SQLDataBase

from app.services.models import ModelsService

router = APIRouter(
    prefix="/models",
    tags=["Models"]
)

def get_database():

    database = SQLDataBase()
    database.create_session()

    return database


@router.get("")
async def get_models():

    """
    Список доступных моделей.
    """

    database = get_database()

    try:

        service = ModelsService(
            database.session
        )

        return service.get_models()

    finally:

        database.session.close()


@router.get("/active")
async def active_model():

    """
    Текущая активная модель
    и активный training run.
    """

    database = get_database()

    try:

        service = ModelsService(
            database.session
        )

        result = service.get_active_model()

        if result is None:

            raise HTTPException(
                status_code=404,
                detail="Активная модель отсутствует"
            )

        return result

    finally:

        database.session.close()


@router.post("/{model_id}/activate")
async def activate_model(model_id: str):

    """
    Активировать последнюю обученную
    версию указанной модели.
    """

    database = get_database()

    try:

        service = ModelsService(
            database.session
        )

        return service.activate_model(
            model_id
        )

    except ValueError as exception:

        database.session.rollback()

        raise HTTPException(
            status_code=400,
            detail=str(exception)
        )

    except Exception as exception:

        database.session.rollback()

        raise HTTPException(
            status_code=500,
            detail=str(exception)
        )

    finally:

        database.session.close()


@router.get("/training-runs")
async def training_runs():

    """
    История обучения всех моделей.
    """

    database = get_database()

    try:

        service = ModelsService(
            database.session
        )

        return service.get_training_runs()

    finally:

        database.session.close()

@router.get("/experiments/{training_run_id}")
async def experiment(training_run_id: str):

    """
    Полная информация о конкретном эксперименте.

    Возвращает:
        - модель
        - training_config
        - RMSE
        - MAE
        - R2
        - время обучения
        - дату обучения
    """

    database = get_database()

    try:

        service = ModelsService(
            database.session
        )

        return service.get_experiment(
            training_run_id
        )

    except ValueError as exception:

        raise HTTPException(
            status_code=404,
            detail=str(exception)
        )

    finally:

        database.session.close()