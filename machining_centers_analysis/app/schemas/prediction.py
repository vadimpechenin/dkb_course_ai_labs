from typing import Any, Optional

from pydantic import BaseModel


class PredictionRequest(BaseModel):
    training_run_ids: list[str]
    sample_ids: list[str]


class PredictionItemResponse(BaseModel):
    id: str
    training_run_id: str
    model_name: Optional[str] = None
    sample_id: str

    predicted_class: Optional[str] = None
    confidence: Optional[float] = None
    probabilities: Optional[dict[str, float]] = None


class PredictionBatchResponse(BaseModel):
    id: str
    created_at: Optional[str] = None

    training_run_ids: list[str]
    sample_ids: list[str]

    predictions: list[PredictionItemResponse]
