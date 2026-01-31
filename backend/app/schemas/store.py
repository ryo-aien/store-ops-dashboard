from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field

from app.models.store import StoreStatus


class StoreBase(BaseModel):
    store_code: str
    name: str
    address: str
    prefecture: str
    lat: float = Field(..., ge=-90, le=90)
    lng: float = Field(..., ge=-180, le=180)
    phone: Optional[str] = None
    manager_name: Optional[str] = None
    status: StoreStatus = StoreStatus.ACTIVE


class StoreCreate(StoreBase):
    pass


class StoreUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    prefecture: Optional[str] = None
    lat: Optional[float] = Field(None, ge=-90, le=90)
    lng: Optional[float] = Field(None, ge=-180, le=180)
    phone: Optional[str] = None
    manager_name: Optional[str] = None
    status: Optional[StoreStatus] = None


class StoreResponse(StoreBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class StoreWithMetricValue(BaseModel):
    id: UUID
    store_code: str
    name: str
    prefecture: str
    lat: float
    lng: float
    status: StoreStatus
    metric_value: Optional[float] = None
    metric_ts: Optional[datetime] = None

    class Config:
        from_attributes = True


class StoreListResponse(BaseModel):
    items: list[StoreResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
