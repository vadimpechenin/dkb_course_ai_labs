from typing import List, Optional

from pydantic import BaseModel


class FeatureResponse(BaseModel):

    id: str

    feature_name: str

    display_name: Optional[str] = None

    description: Optional[str] = None

    data_type: Optional[str] = None

    enabled: bool

    feature_order: Optional[int] = None

    channel: Optional[str] = None

    unit: Optional[str] = None


class FeaturesResponse(BaseModel):

    features: List[FeatureResponse]