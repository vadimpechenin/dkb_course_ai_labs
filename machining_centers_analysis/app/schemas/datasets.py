from typing import List, Optional

from pydantic import BaseModel


class DatasetResponse(BaseModel):

    id: str
    name: str
    description: Optional[str] = None
    source_type: Optional[str] = None
    source_name: Optional[str] = None
    samples_count: int = 0
    tools_count: int = 0


class DatasetsResponse(BaseModel):

    datasets: List[DatasetResponse]