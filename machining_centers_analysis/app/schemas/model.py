from typing import Optional

from pydantic import BaseModel


class MLModelResponse(BaseModel):

    id: str

    name: str

    description: Optional[str] = None

    framework: Optional[str] = None

    model_type: Optional[str] = None

    task_type: Optional[str] = None

    active: bool


class MLModelsResponse(BaseModel):

    models: list[MLModelResponse]