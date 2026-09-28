from typing import Optional, Any

from pydantic import BaseModel


class TrainingRequest(BaseModel):

    dataset_id: str

    feature_ids: list[str]

    model_ids: list[str]

    test_size: float = 0.2

    random_state: int = 42

    scaler: str = "standard"


class TrainingRunResponse(BaseModel):

    id: str

    model_id: str

    model_name: str

    dataset_id: str

    dataset_size: int

    accuracy: Optional[float] = None

    precision_weighted: Optional[float] = None

    recall_weighted: Optional[float] = None

    f1_weighted: Optional[float] = None

    cv_score: Optional[float] = None

    training_time: Optional[float] = None

    created_at: Optional[str] = None


class TrainingResponse(BaseModel):

    training_runs: list[TrainingRunResponse]


class ModelFileResponse(BaseModel):
    id: str
    model_id: str
    version: Optional[str] = None

    has_weights: bool
    has_scaler: bool
    has_feature_list: bool
    has_metadata: bool

    created_at: Optional[str] = None


class TrainingRunDetailResponse(BaseModel):
    id: str

    model_id: str
    model_name: Optional[str] = None

    dataset_id: str
    dataset_name: Optional[str] = None

    dataset_size: int

    accuracy: Optional[float] = None
    precision_weighted: Optional[float] = None
    recall_weighted: Optional[float] = None
    f1_weighted: Optional[float] = None
    cv_score: Optional[float] = None

    training_time: Optional[float] = None

    is_active: bool

    training_config: dict[str, Any]

    model_files: list[ModelFileResponse]

    created_at: Optional[str] = None