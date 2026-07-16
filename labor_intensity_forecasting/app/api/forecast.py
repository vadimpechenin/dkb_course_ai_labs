from fastapi import APIRouter

router = APIRouter(
    prefix="",
    tags=["Forecast"]
)


@router.post("/forecast")
async def forecast():

    """
    Расчет трудоемкости операций
    """

    pass