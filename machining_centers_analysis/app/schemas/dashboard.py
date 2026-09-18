from typing import Optional

from pydantic import BaseModel


class DashboardStatistics(BaseModel):

    datasets_count: int
    experiments_count: int
    signal_samples_count: int
    feature_vectors_count: int
    features_count: int
    ml_models_count: int
    training_runs_count: int
    predictions_count: int


class DashboardModel(BaseModel):

    id: str
    name: str
    model_type: str
    framework: Optional[str] = None
    task_type: Optional[str] = None
    active: bool


class DashboardLastTraining(BaseModel):

    id: str
    model_name: str
    dataset_id: str
    dataset_size: int

    accuracy: Optional[float] = None
    f1_weighted: Optional[float] = None
    precision_weighted: Optional[float] = None
    recall_weighted: Optional[float] = None
    cv_score: Optional[float] = None

    training_time: Optional[float] = None
    created_at: Optional[str] = None


class DashboardResponse(BaseModel):

    statistics: DashboardStatistics

    active_models: list[DashboardModel]

    last_training: Optional[DashboardLastTraining] = None