from typing import Optional
from pydantic import BaseModel


class RMSEHistory(BaseModel):
    date: str
    rmse: float


class DashboardResponse(BaseModel):

    operationsCount: int

    featuresCount: int

    activeModel: str

    framework: str

    weightsPath: str

    datasetSize: int

    trainPercent: int

    testPercent: int

    lastImport: str

    lastTraining: str

    mae: Optional[float] = None
    rmse: Optional[float] = None
    r2: Optional[float] = None
    trainingTime: Optional[float] = None

    history: list[RMSEHistory]