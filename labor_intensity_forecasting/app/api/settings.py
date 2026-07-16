from fastapi import APIRouter

router = APIRouter(
    prefix="/settings",
    tags=["Settings"]
)


@router.get("")
async def settings():

    """
    Настройки приложения
    """

    pass


@router.get("/health")
async def health():

    """
    Проверка работоспособности сервиса
    """

    return {
        "status": "ok"
    }