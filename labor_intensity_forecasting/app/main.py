# точка входа в сервер
import uvicorn
from fastapi import FastAPI
from app.api import *
from fastapi.middleware.cors import CORSMiddleware

from app.core.settings import CORS_ORIGINS

app = FastAPI(title="Labor intensity forecasting")

#Блок добавления связи с фронтэндом
pl_doc = 'docker'
#pl = 'docker'
if (pl_doc=='docker'):
    origins = [
        "http://localhost:8080",
        "http://127.0.0.1:8080",
        CORS_ORIGINS
    ]
else:
    origins = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        CORS_ORIGINS
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Все пути
app.include_router(initial.router)
app.include_router(forecast_router)
app.include_router(retrain_router)
app.include_router(models_router)
app.include_router(dataset_router)
app.include_router(predictions_router)
app.include_router(settings_router)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)