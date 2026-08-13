from fastapi import (
    APIRouter,
    HTTPException
)

from app.db.core.session import SQLDataBase

from app.schemas.forecast import (
    ForecastInput
)

from app.services.forecast import (
    ForecastService
)

router = APIRouter(
    prefix="",
    tags=["Forecast"]
)


@router.post("/forecast")
async def forecast(operations: list[ForecastInput]):

    """
    Расчет трудоемкости операций.

    На вход передается список операций.

    target_hours для расчета не используется.
    """

    database = SQLDataBase()

    database.create_session()

    try:

        service = ForecastService(
            database.session
        )

        return service.forecast(
            operations
        )

    except FileNotFoundError as exception:

        database.session.rollback()

        raise HTTPException(
            status_code=500,
            detail=str(exception)
        )

    except RuntimeError as exception:

        database.session.rollback()

        raise HTTPException(
            status_code=500,
            detail=str(exception)
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
            detail=(
                "Ошибка расчета трудоемкости: "
                + str(exception)
            )
        )

    finally:

        database.session.close()