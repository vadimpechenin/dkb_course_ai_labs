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

    mae: float

    rmse: float

    r2: float

    trainingTime: float

    history: list[RMSEHistory]