from pydantic import BaseModel
from typing import Optional


class DatasetInfoResponse(BaseModel):
    dataset_size: int
    features_count: int
    enabled_features_count: int
    target_column: str


class FeatureResponse(BaseModel):
    id: str
    feature_name: str
    display_name: Optional[str] = None
    enabled: bool
    feature_order: Optional[int] = None


class FeaturesSaveRequest(BaseModel):
    feature_names: list[str]


class FeaturesSaveResponse(BaseModel):
    success: bool
    enabled_features: list[str]


class OperationResponse(BaseModel):
    id: str

    nomenclature: Optional[str] = None
    work_center: Optional[str] = None
    operation: Optional[str] = None
    material: Optional[str] = None

    detail_mass: Optional[float] = None
    blank_length: Optional[float] = None

    note: Optional[str] = None
    user_name: Optional[str] = None

    fill_date: Optional[str] = None

    row_number: Optional[int] = None

    target_hours: Optional[float] = None


class OperationsPageResponse(BaseModel):
    items: list[OperationResponse]

    page: int
    size: int

    total: int
    pages: int


class CSVImportResponse(BaseModel):
    success: bool
    imported: int
    message: str