from datetime import datetime, timedelta
from typing import Optional, Literal
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, text, case
from geoalchemy2.functions import ST_MakeEnvelope, ST_Within
import pandas as pd
import io

from app.core.database import get_db
from app.core.security import verify_api_key
from app.models.store import Store, StoreStatus
from app.models.metric import StoreMetric
from app.models.target import Target
from app.schemas.metric import (
    MetricPoint,
    MetricListResponse,
    MetricSummary,
    TimeRange,
    StoreMetricTimeSeries,
    MetricBase,
    MetricCompareResponse,
    PeriodSummary,
    GroupCompare,
    MetricDecompositionResponse,
    DecompositionResult,
    KpiSummaryWithTarget,
    TargetResponse,
    TimestampMetrics,
    MetricsBulkResponse,
)

router = APIRouter(prefix="/api/metrics", tags=["metrics"])

VALID_METRICS = ["sales", "customers", "incidents_open"]


@router.get("/time-range", response_model=TimeRange)
def get_time_range(db: Session = Depends(get_db)):
    result = db.query(
        func.min(StoreMetric.ts).label("min_ts"),
        func.max(StoreMetric.ts).label("max_ts"),
    ).first()

    return TimeRange(min_ts=result.min_ts, max_ts=result.max_ts)


@router.get("", response_model=MetricListResponse)
def get_metrics(
    metric: str = Query(..., description="Metric name: sales, customers, incidents_open"),
    ts: datetime = Query(..., description="Target timestamp"),
    bbox: Optional[str] = Query(None, description="min_lng,min_lat,max_lng,max_lat"),
    prefecture: Optional[str] = None,
    status: Optional[StoreStatus] = None,
    threshold_min: Optional[float] = None,
    threshold_max: Optional[float] = None,
    db: Session = Depends(get_db),
):
    if metric not in VALID_METRICS:
        raise HTTPException(status_code=400, detail=f"Invalid metric. Choose from: {VALID_METRICS}")

    metric_column = getattr(StoreMetric, metric)

    latest_ts_subquery = (
        db.query(
            StoreMetric.store_id,
            func.max(StoreMetric.ts).label("latest_ts"),
        )
        .filter(StoreMetric.ts <= ts)
        .group_by(StoreMetric.store_id)
        .subquery()
    )

    query = (
        db.query(
            Store.id.label("store_id"),
            Store.lat,
            Store.lng,
            metric_column.label("value"),
            StoreMetric.ts,
        )
        .join(
            latest_ts_subquery,
            Store.id == latest_ts_subquery.c.store_id,
        )
        .join(
            StoreMetric,
            and_(
                StoreMetric.store_id == Store.id,
                StoreMetric.ts == latest_ts_subquery.c.latest_ts,
            ),
        )
    )

    if bbox:
        try:
            min_lng, min_lat, max_lng, max_lat = map(float, bbox.split(","))
            envelope = ST_MakeEnvelope(min_lng, min_lat, max_lng, max_lat, 4326)
            query = query.filter(ST_Within(Store.geom, envelope))
        except (ValueError, TypeError):
            raise HTTPException(status_code=400, detail="Invalid bbox format")

    if prefecture:
        query = query.filter(Store.prefecture == prefecture)

    if status:
        query = query.filter(Store.status == status)

    if threshold_min is not None:
        query = query.filter(metric_column >= threshold_min)

    if threshold_max is not None:
        query = query.filter(metric_column <= threshold_max)

    results = query.all()

    points = [
        MetricPoint(
            store_id=r.store_id,
            lat=r.lat,
            lng=r.lng,
            value=r.value,
            ts=r.ts,
        )
        for r in results
    ]

    return MetricListResponse(
        metric=metric,
        requested_ts=ts,
        interpolation="latest_at_or_before",
        points=points,
    )


@router.get("/bulk", response_model=MetricsBulkResponse)
def get_metrics_bulk(
    metric: str = Query(..., description="Metric name: sales, customers, incidents_open"),
    from_ts: datetime = Query(..., alias="from", description="Start timestamp"),
    to_ts: datetime = Query(..., alias="to", description="End timestamp"),
    bbox: Optional[str] = Query(None, description="min_lng,min_lat,max_lng,max_lat"),
    prefecture: Optional[str] = None,
    status: Optional[StoreStatus] = None,
    db: Session = Depends(get_db),
):
    """期間内の全タイムスタンプのメトリクスを一括取得"""
    if metric not in VALID_METRICS:
        raise HTTPException(status_code=400, detail=f"Invalid metric. Choose from: {VALID_METRICS}")

    metric_column = getattr(StoreMetric, metric)

    # 期間内の全タイムスタンプを取得
    ts_query = (
        db.query(StoreMetric.ts)
        .filter(StoreMetric.ts >= from_ts, StoreMetric.ts <= to_ts)
        .distinct()
        .order_by(StoreMetric.ts)
    )
    timestamps = [r.ts for r in ts_query.all()]

    # 店舗のベース情報を取得
    store_query = db.query(Store)
    if bbox:
        try:
            min_lng, min_lat, max_lng, max_lat = map(float, bbox.split(","))
            envelope = ST_MakeEnvelope(min_lng, min_lat, max_lng, max_lat, 4326)
            store_query = store_query.filter(ST_Within(Store.geom, envelope))
        except (ValueError, TypeError):
            raise HTTPException(status_code=400, detail="Invalid bbox format")
    if prefecture:
        store_query = store_query.filter(Store.prefecture == prefecture)
    if status:
        store_query = store_query.filter(Store.status == status)

    stores = {str(s.id): s for s in store_query.all()}
    store_ids = list(stores.keys())

    if not store_ids:
        return MetricsBulkResponse(
            metric=metric,
            from_ts=from_ts,
            to_ts=to_ts,
            timestamps=[],
        )

    # 期間内の全メトリクスを一括取得
    metrics_query = (
        db.query(StoreMetric)
        .filter(
            StoreMetric.ts >= from_ts,
            StoreMetric.ts <= to_ts,
        )
        .order_by(StoreMetric.ts)
    )
    all_metrics = metrics_query.all()

    # タイムスタンプごとにグループ化
    metrics_by_ts = {}
    for m in all_metrics:
        if m.ts not in metrics_by_ts:
            metrics_by_ts[m.ts] = []
        metrics_by_ts[m.ts].append(m)

    result_timestamps = []
    for ts in timestamps:
        ts_metrics = metrics_by_ts.get(ts, [])

        points = []
        values = []
        for m in ts_metrics:
            store_id_str = str(m.store_id)
            if store_id_str in stores:
                store = stores[store_id_str]
                value = getattr(m, metric)
                points.append(MetricPoint(
                    store_id=m.store_id,
                    lat=store.lat,
                    lng=store.lng,
                    value=value,
                    ts=m.ts,
                ))
                if value is not None:
                    values.append(value)

        # サマリ計算
        if values:
            sorted_values = sorted(values)
            n = len(sorted_values)
            median = (
                sorted_values[n // 2]
                if n % 2 == 1
                else (sorted_values[n // 2 - 1] + sorted_values[n // 2]) / 2
            )
            summary = MetricSummary(
                metric=metric,
                ts=ts,
                count=n,
                sum=sum(values),
                avg=sum(values) / n,
                median=median,
                max=max(values),
                min=min(values),
            )
        else:
            summary = MetricSummary(
                metric=metric,
                ts=ts,
                count=0,
            )

        result_timestamps.append(TimestampMetrics(
            ts=ts,
            points=points,
            summary=summary,
        ))

    return MetricsBulkResponse(
        metric=metric,
        from_ts=from_ts,
        to_ts=to_ts,
        timestamps=result_timestamps,
    )


@router.get("/summary", response_model=MetricSummary)
def get_metric_summary(
    metric: str = Query(..., description="Metric name: sales, customers, incidents_open"),
    ts: datetime = Query(..., description="Target timestamp"),
    bbox: Optional[str] = Query(None, description="min_lng,min_lat,max_lng,max_lat"),
    prefecture: Optional[str] = None,
    status: Optional[StoreStatus] = None,
    db: Session = Depends(get_db),
):
    if metric not in VALID_METRICS:
        raise HTTPException(status_code=400, detail=f"Invalid metric. Choose from: {VALID_METRICS}")

    metric_column = getattr(StoreMetric, metric)

    latest_ts_subquery = (
        db.query(
            StoreMetric.store_id,
            func.max(StoreMetric.ts).label("latest_ts"),
        )
        .filter(StoreMetric.ts <= ts)
        .group_by(StoreMetric.store_id)
        .subquery()
    )

    query = (
        db.query(StoreMetric)
        .join(Store, Store.id == StoreMetric.store_id)
        .join(
            latest_ts_subquery,
            and_(
                StoreMetric.store_id == latest_ts_subquery.c.store_id,
                StoreMetric.ts == latest_ts_subquery.c.latest_ts,
            ),
        )
    )

    if bbox:
        try:
            min_lng, min_lat, max_lng, max_lat = map(float, bbox.split(","))
            envelope = ST_MakeEnvelope(min_lng, min_lat, max_lng, max_lat, 4326)
            query = query.filter(ST_Within(Store.geom, envelope))
        except (ValueError, TypeError):
            raise HTTPException(status_code=400, detail="Invalid bbox format")

    if prefecture:
        query = query.filter(Store.prefecture == prefecture)

    if status:
        query = query.filter(Store.status == status)

    metrics_data = query.all()
    values = [getattr(m, metric) for m in metrics_data if getattr(m, metric) is not None]

    if not values:
        return MetricSummary(
            metric=metric,
            ts=ts,
            count=0,
            sum=None,
            avg=None,
            median=None,
            max=None,
            min=None,
        )

    sorted_values = sorted(values)
    n = len(sorted_values)
    median = (
        sorted_values[n // 2]
        if n % 2 == 1
        else (sorted_values[n // 2 - 1] + sorted_values[n // 2]) / 2
    )

    return MetricSummary(
        metric=metric,
        ts=ts,
        count=n,
        sum=sum(values),
        avg=sum(values) / n,
        median=median,
        max=max(values),
        min=min(values),
    )


@router.post("/import", dependencies=[Depends(verify_api_key)])
async def import_metrics(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="File must be a CSV")

    contents = await file.read()
    df = pd.read_csv(io.StringIO(contents.decode("utf-8")))

    required_cols = ["store_code", "ts"]
    missing = [col for col in required_cols if col not in df.columns]
    if missing:
        raise HTTPException(status_code=400, detail=f"Missing columns: {missing}")

    stores = {s.store_code: s.id for s in db.query(Store).all()}

    created_count = 0
    updated_count = 0
    errors = []

    for idx, row in df.iterrows():
        try:
            store_code = row["store_code"]
            if store_code not in stores:
                errors.append({"row": idx + 2, "error": f"Store code not found: {store_code}"})
                continue

            store_id = stores[store_code]
            ts = pd.to_datetime(row["ts"])

            existing = (
                db.query(StoreMetric)
                .filter(StoreMetric.store_id == store_id, StoreMetric.ts == ts)
                .first()
            )

            metric_data = {
                "store_id": store_id,
                "ts": ts,
                "sales": float(row["sales"]) if pd.notna(row.get("sales")) else None,
                "customers": int(row["customers"]) if pd.notna(row.get("customers")) else None,
                "incidents_open": int(row["incidents_open"]) if pd.notna(row.get("incidents_open")) else None,
            }

            if existing:
                for key, value in metric_data.items():
                    if key not in ["store_id", "ts"]:
                        setattr(existing, key, value)
                updated_count += 1
            else:
                metric = StoreMetric(**metric_data)
                db.add(metric)
                created_count += 1

        except Exception as e:
            errors.append({"row": idx + 2, "error": str(e)})

    db.commit()

    return {
        "message": "Import completed",
        "created": created_count,
        "updated": updated_count,
        "errors": errors,
    }


@router.get("/stores/{store_id}", response_model=StoreMetricTimeSeries)
def get_store_metrics(
    store_id: UUID,
    metric: str = Query(..., description="Metric name: sales, customers, incidents_open"),
    from_ts: datetime = Query(..., alias="from"),
    to_ts: datetime = Query(..., alias="to"),
    interval: str = Query("1h", description="Interval: 1h, 1d"),
    db: Session = Depends(get_db),
):
    if metric not in VALID_METRICS:
        raise HTTPException(status_code=400, detail=f"Invalid metric. Choose from: {VALID_METRICS}")

    store = db.query(Store).filter(Store.id == store_id).first()
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")

    metrics = (
        db.query(StoreMetric)
        .filter(
            StoreMetric.store_id == store_id,
            StoreMetric.ts >= from_ts,
            StoreMetric.ts <= to_ts,
        )
        .order_by(StoreMetric.ts)
        .all()
    )

    data = [
        MetricBase(
            ts=m.ts,
            sales=m.sales,
            customers=m.customers,
            incidents_open=m.incidents_open,
        )
        for m in metrics
    ]

    return StoreMetricTimeSeries(
        store_id=store_id,
        metric=metric,
        from_ts=from_ts,
        to_ts=to_ts,
        interval=interval,
        data=data,
    )


def calculate_period_summary(
    db: Session,
    metric: str,
    from_ts: datetime,
    to_ts: datetime,
    prefecture: Optional[str] = None,
    status: Optional[StoreStatus] = None,
) -> PeriodSummary:
    metric_column = getattr(StoreMetric, metric)

    query = (
        db.query(metric_column)
        .join(Store, Store.id == StoreMetric.store_id)
        .filter(
            StoreMetric.ts >= from_ts,
            StoreMetric.ts <= to_ts,
            metric_column.isnot(None),
        )
    )

    if prefecture:
        query = query.filter(Store.prefecture == prefecture)
    if status:
        query = query.filter(Store.status == status)

    values = [r[0] for r in query.all()]

    if not values:
        return PeriodSummary(
            period_start=from_ts,
            period_end=to_ts,
            count=0,
        )

    sorted_values = sorted(values)
    n = len(sorted_values)
    median = (
        sorted_values[n // 2]
        if n % 2 == 1
        else (sorted_values[n // 2 - 1] + sorted_values[n // 2]) / 2
    )

    return PeriodSummary(
        period_start=from_ts,
        period_end=to_ts,
        count=n,
        sum=sum(values),
        avg=sum(values) / n,
        median=median,
        max=max(values),
        min=min(values),
    )


@router.get("/compare", response_model=MetricCompareResponse)
def compare_metrics(
    metric: str = Query(..., description="Metric name: sales, customers, incidents_open"),
    base_from: datetime = Query(..., description="Base period start"),
    base_to: datetime = Query(..., description="Base period end"),
    compare_from: datetime = Query(..., description="Compare period start"),
    compare_to: datetime = Query(..., description="Compare period end"),
    group_by: Optional[str] = Query(None, description="Group by: prefecture, store"),
    prefecture: Optional[str] = None,
    status: Optional[StoreStatus] = None,
    db: Session = Depends(get_db),
):
    if metric not in VALID_METRICS:
        raise HTTPException(status_code=400, detail=f"Invalid metric. Choose from: {VALID_METRICS}")

    base_summary = calculate_period_summary(db, metric, base_from, base_to, prefecture, status)
    compare_summary = calculate_period_summary(db, metric, compare_from, compare_to, prefecture, status)

    diff_value = None
    diff_rate = None
    if base_summary.sum is not None and compare_summary.sum is not None:
        diff_value = base_summary.sum - compare_summary.sum
        if compare_summary.sum != 0:
            diff_rate = (diff_value / compare_summary.sum) * 100

    groups = None
    if group_by in ["prefecture", "store"]:
        groups = []
        metric_column = getattr(StoreMetric, metric)

        if group_by == "prefecture":
            group_column = Store.prefecture
        else:
            group_column = Store.name

        base_query = (
            db.query(
                group_column.label("group_key"),
                func.sum(metric_column).label("total"),
            )
            .join(Store, Store.id == StoreMetric.store_id)
            .filter(
                StoreMetric.ts >= base_from,
                StoreMetric.ts <= base_to,
                metric_column.isnot(None),
            )
        )

        compare_query = (
            db.query(
                group_column.label("group_key"),
                func.sum(metric_column).label("total"),
            )
            .join(Store, Store.id == StoreMetric.store_id)
            .filter(
                StoreMetric.ts >= compare_from,
                StoreMetric.ts <= compare_to,
                metric_column.isnot(None),
            )
        )

        if prefecture:
            base_query = base_query.filter(Store.prefecture == prefecture)
            compare_query = compare_query.filter(Store.prefecture == prefecture)
        if status:
            base_query = base_query.filter(Store.status == status)
            compare_query = compare_query.filter(Store.status == status)

        base_results = {str(r.group_key): r.total for r in base_query.group_by(group_column).all()}
        compare_results = {str(r.group_key): r.total for r in compare_query.group_by(group_column).all()}

        all_keys = set(base_results.keys()) | set(compare_results.keys())
        for key in all_keys:
            base_val = base_results.get(key)
            compare_val = compare_results.get(key)
            diff = None
            rate = None
            if base_val is not None and compare_val is not None:
                diff = base_val - compare_val
                if compare_val != 0:
                    rate = (diff / compare_val) * 100
            groups.append(GroupCompare(
                group_key=key,
                base_value=base_val,
                compare_value=compare_val,
                diff_value=diff,
                diff_rate=rate,
            ))

    return MetricCompareResponse(
        metric=metric,
        base_summary=base_summary,
        compare_summary=compare_summary,
        diff_value=diff_value,
        diff_rate=diff_rate,
        group_by=group_by,
        groups=groups,
    )


@router.get("/decomposition", response_model=MetricDecompositionResponse)
def get_decomposition(
    base_from: datetime = Query(..., description="Base period start"),
    base_to: datetime = Query(..., description="Base period end"),
    compare_from: datetime = Query(..., description="Compare period start"),
    compare_to: datetime = Query(..., description="Compare period end"),
    group_by: Optional[str] = Query(None, description="Group by: prefecture, store"),
    prefecture: Optional[str] = None,
    status: Optional[StoreStatus] = None,
    db: Session = Depends(get_db),
):
    def calculate_decomposition(
        base_sales: Optional[float],
        base_customers: Optional[float],
        compare_sales: Optional[float],
        compare_customers: Optional[float],
    ) -> tuple:
        if None in [base_sales, base_customers, compare_sales, compare_customers]:
            return None, None, None, None
        if base_customers == 0 or compare_customers == 0:
            return None, None, None, None

        base_unit_price = base_sales / base_customers
        compare_unit_price = compare_sales / compare_customers
        sales_diff = base_sales - compare_sales

        customers_contrib = (base_customers - compare_customers) * compare_unit_price
        unit_price_contrib = (base_unit_price - compare_unit_price) * base_customers

        return sales_diff, customers_contrib, unit_price_contrib, base_unit_price, compare_unit_price

    def get_period_totals(from_ts: datetime, to_ts: datetime, pref: Optional[str] = None):
        query = (
            db.query(
                func.sum(StoreMetric.sales).label("sales"),
                func.sum(StoreMetric.customers).label("customers"),
            )
            .join(Store, Store.id == StoreMetric.store_id)
            .filter(
                StoreMetric.ts >= from_ts,
                StoreMetric.ts <= to_ts,
            )
        )
        if pref:
            query = query.filter(Store.prefecture == pref)
        if prefecture:
            query = query.filter(Store.prefecture == prefecture)
        if status:
            query = query.filter(Store.status == status)
        return query.first()

    base_totals = get_period_totals(base_from, base_to)
    compare_totals = get_period_totals(compare_from, compare_to)

    result = calculate_decomposition(
        base_totals.sales, base_totals.customers,
        compare_totals.sales, compare_totals.customers
    )

    total_result = DecompositionResult(
        base_sales=base_totals.sales,
        compare_sales=compare_totals.sales,
        sales_diff=result[0] if result[0] is not None else None,
        base_customers=float(base_totals.customers) if base_totals.customers is not None else None,
        compare_customers=float(compare_totals.customers) if compare_totals.customers is not None else None,
        base_unit_price=result[3] if len(result) > 3 and result[3] is not None else None,
        compare_unit_price=result[4] if len(result) > 4 and result[4] is not None else None,
        customers_contrib=result[1] if result[1] is not None else None,
        unit_price_contrib=result[2] if result[2] is not None else None,
    )

    groups = None
    if group_by in ["prefecture", "store"]:
        groups = []

        if group_by == "prefecture":
            group_column = Store.prefecture
        else:
            group_column = Store.name

        base_query = (
            db.query(
                group_column.label("group_key"),
                func.sum(StoreMetric.sales).label("sales"),
                func.sum(StoreMetric.customers).label("customers"),
            )
            .join(Store, Store.id == StoreMetric.store_id)
            .filter(StoreMetric.ts >= base_from, StoreMetric.ts <= base_to)
        )

        compare_query = (
            db.query(
                group_column.label("group_key"),
                func.sum(StoreMetric.sales).label("sales"),
                func.sum(StoreMetric.customers).label("customers"),
            )
            .join(Store, Store.id == StoreMetric.store_id)
            .filter(StoreMetric.ts >= compare_from, StoreMetric.ts <= compare_to)
        )

        if prefecture:
            base_query = base_query.filter(Store.prefecture == prefecture)
            compare_query = compare_query.filter(Store.prefecture == prefecture)
        if status:
            base_query = base_query.filter(Store.status == status)
            compare_query = compare_query.filter(Store.status == status)

        base_results = {str(r.group_key): (r.sales, r.customers) for r in base_query.group_by(group_column).all()}
        compare_results = {str(r.group_key): (r.sales, r.customers) for r in compare_query.group_by(group_column).all()}

        all_keys = set(base_results.keys()) | set(compare_results.keys())
        for key in all_keys:
            base_data = base_results.get(key, (None, None))
            compare_data = compare_results.get(key, (None, None))

            decomp = calculate_decomposition(
                base_data[0], base_data[1],
                compare_data[0], compare_data[1]
            )

            groups.append(DecompositionResult(
                group_key=key,
                base_sales=base_data[0],
                compare_sales=compare_data[0],
                sales_diff=decomp[0] if decomp[0] is not None else None,
                base_customers=float(base_data[1]) if base_data[1] is not None else None,
                compare_customers=float(compare_data[1]) if compare_data[1] is not None else None,
                base_unit_price=decomp[3] if len(decomp) > 3 and decomp[3] is not None else None,
                compare_unit_price=decomp[4] if len(decomp) > 4 and decomp[4] is not None else None,
                customers_contrib=decomp[1] if decomp[1] is not None else None,
                unit_price_contrib=decomp[2] if decomp[2] is not None else None,
            ))

    return MetricDecompositionResponse(
        base_period_start=base_from,
        base_period_end=base_to,
        compare_period_start=compare_from,
        compare_period_end=compare_to,
        total=total_result,
        group_by=group_by,
        groups=groups,
    )


@router.get("/summary-with-target", response_model=KpiSummaryWithTarget)
def get_summary_with_target(
    metric: str = Query(..., description="Metric name: sales, customers, incidents_open"),
    ts: datetime = Query(..., description="Target timestamp"),
    bbox: Optional[str] = Query(None, description="min_lng,min_lat,max_lng,max_lat"),
    prefecture: Optional[str] = None,
    status: Optional[StoreStatus] = None,
    db: Session = Depends(get_db),
):
    if metric not in VALID_METRICS:
        raise HTTPException(status_code=400, detail=f"Invalid metric. Choose from: {VALID_METRICS}")

    base_summary = get_metric_summary(metric, ts, bbox, prefecture, status, db)

    target_query = (
        db.query(Target)
        .filter(
            Target.metric == metric,
            Target.period_start <= ts.date(),
            Target.period_end >= ts.date(),
        )
    )

    if prefecture:
        target_query = target_query.filter(
            (Target.scope_type == "global") |
            ((Target.scope_type == "region") & (Target.prefecture == prefecture))
        )
    else:
        target_query = target_query.filter(Target.scope_type == "global")

    target = target_query.first()

    target_response = None
    if target and base_summary.sum is not None:
        achievement_rate = (base_summary.sum / target.target_value * 100) if target.target_value else None
        gap = base_summary.sum - target.target_value
        target_response = TargetResponse(
            metric=metric,
            target_value=target.target_value,
            actual_value=base_summary.sum,
            achievement_rate=achievement_rate,
            gap=gap,
        )

    yoy_ts = ts - timedelta(days=365)
    yoy_summary = calculate_period_summary(
        db, metric,
        yoy_ts - timedelta(hours=12),
        yoy_ts + timedelta(hours=12),
        prefecture, status if status else None
    )

    yoy = None
    if yoy_summary.sum is not None and base_summary.sum is not None:
        yoy_diff = base_summary.sum - yoy_summary.sum
        yoy_rate = (yoy_diff / yoy_summary.sum * 100) if yoy_summary.sum != 0 else None
        yoy = {
            "compare_value": yoy_summary.sum,
            "diff_value": yoy_diff,
            "diff_rate": yoy_rate,
        }

    mom_ts = ts - timedelta(days=30)
    mom_summary = calculate_period_summary(
        db, metric,
        mom_ts - timedelta(hours=12),
        mom_ts + timedelta(hours=12),
        prefecture, status if status else None
    )

    mom = None
    if mom_summary.sum is not None and base_summary.sum is not None:
        mom_diff = base_summary.sum - mom_summary.sum
        mom_rate = (mom_diff / mom_summary.sum * 100) if mom_summary.sum != 0 else None
        mom = {
            "compare_value": mom_summary.sum,
            "diff_value": mom_diff,
            "diff_rate": mom_rate,
        }

    return KpiSummaryWithTarget(
        metric=metric,
        ts=ts,
        count=base_summary.count,
        sum=base_summary.sum,
        avg=base_summary.avg,
        median=base_summary.median,
        max=base_summary.max,
        min=base_summary.min,
        target=target_response,
        yoy=yoy,
        mom=mom,
    )
