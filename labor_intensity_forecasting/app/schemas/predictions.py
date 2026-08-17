from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class PredictionHistoryItem(BaseModel):

    id: str

    training_run_id: str

    model_name: Optional[str] = None

    forecast: Optional[float] = None

    std: Optional[float] = None

    created_at: Optional[datetime] = None

    input: Optional[dict] = None