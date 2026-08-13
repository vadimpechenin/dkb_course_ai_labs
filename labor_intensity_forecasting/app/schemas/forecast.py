from pydantic import BaseModel
from typing import Optional


class ForecastInput(BaseModel):

    id: Optional[str] = None

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

    # В forecast фактическое значение не требуется.
    # Поле оставляем для совместимости с CSV/operations.
    target_hours: Optional[float] = None


class ForecastResult(BaseModel):

    forecast: float

    std: float