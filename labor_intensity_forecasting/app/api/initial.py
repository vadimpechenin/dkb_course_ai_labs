from fastapi import APIRouter

router = APIRouter(prefix="", tags=["Get"])


@router.get("/")
def read_root():
    return {"status": "working", "message": "Привет! Cервер прогноза трудоемкости технологических операций доступен по сети!"}