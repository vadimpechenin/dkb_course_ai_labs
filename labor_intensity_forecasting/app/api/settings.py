from fastapi import APIRouter, HTTPException

from app.db.core.session import SQLDataBase

from app.services.settings import (
    SettingsService
)

router = APIRouter(
    prefix="/settings",
    tags=["Settings"]
)

def get_database():

    database = SQLDataBase()
    database.create_session()

    return database

@router.get("")
async def settings():
    """
    Настройки приложения.
    """

    database = get_database()

    try:

        service = SettingsService(
            database.session
        )

        return service.get_settings()

    finally:

        database.session.close()


@router.get("/health")
async def health():

    """
    Проверка работоспособности сервиса.
    """

    database = get_database()

    try:

        database.session.execute(
            __import__("sqlalchemy").text(
                "SELECT 1"
            )
        )

        return {
            "status": "ok",
            "database": "ok"
        }

    except Exception as exception:

        return {
            "status": "error",
            "database": "error",
            "message": str(exception)
        }

    finally:

        database.session.close()

@router.post("/reset")
async def reset_database():

    """
    Полное восстановление базы данных
    в исходное состояние.
    """

    database = get_database()

    try:

        service = SettingsService(
            database.session
        )

        result = service.reset_database()

        return result

    except Exception as exception:

        raise HTTPException(
            status_code=500,
            detail=str(exception)
        )

    finally:

        database.session.close()