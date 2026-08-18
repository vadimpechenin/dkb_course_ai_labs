from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List


class RetrainRequest(BaseModel):

    model_id: str = Field(
        ...,
        description="ID модели из ml_models"
    )

    train_percent: int = Field(
        80,
        ge=50,
        le=95
    )

    test_percent: int = Field(
        20,
        ge=5,
        le=50
    )
    dataset_size: int = Field(
        ...,
        gt=0
    )

    features: List[str] = Field(
        ...,
        min_length=1
    )

    model_params: Dict[str, Any] = Field(
        default_factory=dict
    )

    random_state: int = 42


class RetrainResponse(BaseModel):

    success: bool

    training_run_id: Optional[str] = None

    model_name: Optional[str] = None

    dataset_size: Optional[int] = None

    train_size: Optional[int] = None

    test_size: Optional[int] = None

    mae: Optional[float] = None

    rmse: Optional[float] = None

    r2: Optional[float] = None

    training_time: Optional[float] = None

    message: str


class RollbackResponse(BaseModel):

    success: bool

    training_run_id: Optional[str] = None

    model_name: Optional[str] = None

    message: str