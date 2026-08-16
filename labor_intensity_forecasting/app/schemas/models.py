from datetime import datetime
from typing import Any, Optional

from pydantic import BaseModel


class ModelResponse(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    framework: Optional[str] = None
    active: bool

    training_runs_count: int = 0


class ActiveModelResponse(BaseModel):
    model_id: str
    model_name: str
    framework: Optional[str] = None

    training_run_id: str

    dataset_size: int

    mae: Optional[float] = None
    rmse: Optional[float] = None
    r2: Optional[float] = None

    training_time: Optional[float] = None

    created_at: Optional[datetime] = None


class ActivateModelResponse(BaseModel):
    success: bool
    model_id: str
    training_run_id: str
    message: str


class TrainingRunResponse(BaseModel):
    id: str

    model_id: str
    model_name: str

    dataset_size: int

    training_config: dict[str, Any]

    mae: Optional[float] = None
    rmse: Optional[float] = None
    r2: Optional[float] = None

    training_time: Optional[float] = None

    is_active: bool

    created_at: Optional[datetime] = None


class ExperimentResponse(BaseModel):
    id: str

    model_id: str
    model_name: str
    framework: Optional[str] = None

    dataset_size: int

    training_config: dict[str, Any]

    mae: Optional[float] = None
    rmse: Optional[float] = None
    r2: Optional[float] = None

    training_time: Optional[float] = None

    is_active: bool

    created_at: Optional[datetime] = None

    model_files: list[dict] = []