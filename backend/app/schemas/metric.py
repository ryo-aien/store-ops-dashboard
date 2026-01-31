from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel


class MetricBase(BaseModel):
    ts: datetime
    sales: Optional[float] = None
    customers: Optional[int] = None
    incidents_open: Optional[int] = None


class MetricCreate(MetricBase):
    store_id: UUID


class MetricResponse(MetricBase):
    id: UUID
    store_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True


class MetricPoint(BaseModel):
    store_id: UUID
    lat: float
    lng: float
    value: Optional[float] = None
    ts: Optional[datetime] = None


class MetricListResponse(BaseModel):
    metric: str
    requested_ts: datetime
    interpolation: str
    points: list[MetricPoint]


class MetricSummary(BaseModel):
    metric: str
    ts: datetime
    count: int
    sum: Optional[float] = None
    avg: Optional[float] = None
    median: Optional[float] = None
    max: Optional[float] = None
    min: Optional[float] = None


class TimeRange(BaseModel):
    min_ts: Optional[datetime] = None
    max_ts: Optional[datetime] = None


class StoreMetricTimeSeries(BaseModel):
    store_id: UUID
    metric: str
    from_ts: datetime
    to_ts: datetime
    interval: str
    data: list[MetricBase]


class PeriodSummary(BaseModel):
    period_start: datetime
    period_end: datetime
    count: int
    sum: Optional[float] = None
    avg: Optional[float] = None
    median: Optional[float] = None
    max: Optional[float] = None
    min: Optional[float] = None


class GroupCompare(BaseModel):
    group_key: str
    base_value: Optional[float] = None
    compare_value: Optional[float] = None
    diff_value: Optional[float] = None
    diff_rate: Optional[float] = None


class MetricCompareResponse(BaseModel):
    metric: str
    base_summary: PeriodSummary
    compare_summary: PeriodSummary
    diff_value: Optional[float] = None
    diff_rate: Optional[float] = None
    group_by: Optional[str] = None
    groups: Optional[list[GroupCompare]] = None


class DecompositionResult(BaseModel):
    group_key: Optional[str] = None
    base_sales: Optional[float] = None
    compare_sales: Optional[float] = None
    sales_diff: Optional[float] = None
    base_customers: Optional[float] = None
    compare_customers: Optional[float] = None
    base_unit_price: Optional[float] = None
    compare_unit_price: Optional[float] = None
    customers_contrib: Optional[float] = None
    unit_price_contrib: Optional[float] = None


class MetricDecompositionResponse(BaseModel):
    base_period_start: datetime
    base_period_end: datetime
    compare_period_start: datetime
    compare_period_end: datetime
    total: DecompositionResult
    group_by: Optional[str] = None
    groups: Optional[list[DecompositionResult]] = None


class TargetResponse(BaseModel):
    metric: str
    target_value: float
    actual_value: Optional[float] = None
    achievement_rate: Optional[float] = None
    gap: Optional[float] = None


class KpiSummaryWithTarget(BaseModel):
    metric: str
    ts: datetime
    count: int
    sum: Optional[float] = None
    avg: Optional[float] = None
    median: Optional[float] = None
    max: Optional[float] = None
    min: Optional[float] = None
    target: Optional[TargetResponse] = None
    yoy: Optional[dict] = None
    mom: Optional[dict] = None


class TimestampMetrics(BaseModel):
    ts: datetime
    points: list[MetricPoint]
    summary: MetricSummary


class MetricsBulkResponse(BaseModel):
    metric: str
    from_ts: datetime
    to_ts: datetime
    timestamps: list[TimestampMetrics]
