import os
import tempfile

from fastapi import (
    APIRouter,
    HTTPException,
    UploadFile,
    File
)

from fastapi.responses import FileResponse

from app.db.core.session import SQLDataBase

from app.schemas.training import (
    RetrainRequest,
    RetrainResponse,
    RollbackResponse
)

from app.services.training import (
    TrainingService
)

router = APIRouter(
    prefix="",
    tags=["Training"]
)


# =============================================================
# RETRAIN
# =============================================================

@router.post(
    "/retrain",
    response_model=RetrainResponse
)
async def retrain(
    request: RetrainRequest
):

    """
    Переобучение модели.
    """

    database = SQLDataBase()

    database.create_session()

    try:

        service = TrainingService(
            database.session
        )

        result = service.retrain(

            model_id=
                request.model_id,

            train_percent=
                request.train_percent,

            test_percent=
                request.test_percent,

            random_state=
                request.random_state
        )

        return result

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
                "Ошибка переобучения: "
                + str(exception)
            )
        )

    finally:

        database.session.close()


# =============================================================
# ROLLBACK
# =============================================================

@router.post(
    "/rollback",
    response_model=RollbackResponse
)
async def rollback():

    """
    Возврат предыдущей версии модели.
    """

    database = SQLDataBase()

    database.create_session()

    try:

        service = TrainingService(
            database.session
        )

        return service.rollback()

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
                "Ошибка rollback: "
                + str(exception)
            )
        )

    finally:

        database.session.close()


# =============================================================
# EXPORT
# =============================================================

@router.post(
    "/export"
)
async def export_model():

    """
    Экспорт активной модели.
    """

    database = SQLDataBase()

    database.create_session()

    temporary_directory = (
        tempfile.mkdtemp()
    )

    try:

        service = TrainingService(
            database.session
        )

        archive_path = (
            service.export_model(
                temporary_directory
            )
        )

        return FileResponse(

            path=archive_path,

            filename=
                os.path.basename(
                    archive_path
                ),

            media_type=
                "application/x-tar"
        )

    except ValueError as exception:

        raise HTTPException(

            status_code=400,

            detail=str(exception)
        )

    except Exception as exception:

        raise HTTPException(

            status_code=500,

            detail=(
                "Ошибка экспорта модели: "
                + str(exception)
            )
        )

    finally:

        database.session.close()


# =============================================================
# IMPORT
# =============================================================

@router.post(
    "/import"
)
async def import_model(
    file: UploadFile = File(...)
):

    """
    Импорт модели из TAR архива.
    """

    if not file.filename:

        raise HTTPException(

            status_code=400,

            detail="Файл не выбран"
        )

    if not file.filename.lower().endswith(
        ".tar"
    ):

        raise HTTPException(

            status_code=400,

            detail="Ожидается TAR архив"
        )

    temporary_directory = (
        tempfile.mkdtemp()
    )

    archive_path = os.path.join(

        temporary_directory,

        file.filename
    )

    database = SQLDataBase()

    database.create_session()

    try:

        with open(
            archive_path,
            "wb"
        ) as output:

            while True:

                chunk = await file.read(
                    1024 * 1024
                )

                if not chunk:

                    break

                output.write(
                    chunk
                )

        service = TrainingService(
            database.session
        )

        result = service.import_model(
            archive_path
        )

        return result

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
                "Ошибка импорта модели: "
                + str(exception)
            )
        )

    finally:

        database.session.close()

        import shutil

        shutil.rmtree(
            temporary_directory,
            ignore_errors=True
        )