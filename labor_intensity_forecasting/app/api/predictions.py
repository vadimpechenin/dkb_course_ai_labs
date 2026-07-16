from fastapi import APIRouter

router = APIRouter(
    prefix="",
    tags=["Predictions"]
)


@router.post("/dump")
async def dump_predictions():

    """
    Выгрузка истории прогнозов
    """

    pass


@router.get("/history")
async def history():

    """
    История прогнозов
    """

    pass