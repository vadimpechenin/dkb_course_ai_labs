from typing import Optional

from pydantic import BaseModel


class PredictionItemResponse(BaseModel):

    id: str

    training_run_id: str

    model_name: Optional[str] = None

    # ID образца из JSON.
    sample_id: str

    actual_wear: Optional[float] = None

    actual_class: Optional[str] = None

    predicted_class: Optional[str] = None

    confidence: Optional[float] = None

    probabilities: Optional[
        dict[str, float]
    ] = None


class PredictionBatchResponse(BaseModel):

    id: str

    created_at: Optional[str] = None

    training_run_ids: list[str]

    sample_ids: list[str]

    predictions: list[
        PredictionItemResponse
    ]

class DeleteTrainingRunsRequest(BaseModel):
    training_run_ids: list[str]