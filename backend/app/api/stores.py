from typing import Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, or_
from geoalchemy2.functions import ST_MakePoint, ST_SetSRID, ST_MakeEnvelope, ST_Within
import pandas as pd
import io

from app.core.database import get_db
from app.core.security import verify_api_key
from app.models.store import Store, StoreStatus
from app.schemas.store import (
    StoreCreate,
    StoreUpdate,
    StoreResponse,
    StoreListResponse,
)

router = APIRouter(prefix="/api/stores", tags=["stores"])


@router.get("", response_model=StoreListResponse)
def list_stores(
    search: Optional[str] = None,
    prefecture: Optional[str] = None,
    status: Optional[StoreStatus] = None,
    bbox: Optional[str] = Query(None, description="min_lng,min_lat,max_lng,max_lat"),
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=500),
    db: Session = Depends(get_db),
):
    query = db.query(Store)

    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                Store.name.ilike(search_term),
                Store.store_code.ilike(search_term),
                Store.address.ilike(search_term),
            )
        )

    if prefecture:
        query = query.filter(Store.prefecture == prefecture)

    if status:
        query = query.filter(Store.status == status)

    if bbox:
        try:
            min_lng, min_lat, max_lng, max_lat = map(float, bbox.split(","))
            envelope = ST_MakeEnvelope(min_lng, min_lat, max_lng, max_lat, 4326)
            query = query.filter(ST_Within(Store.geom, envelope))
        except (ValueError, TypeError):
            raise HTTPException(status_code=400, detail="Invalid bbox format")

    total = query.count()
    total_pages = (total + page_size - 1) // page_size

    stores = query.order_by(Store.created_at.desc()).offset((page - 1) * page_size).limit(page_size).all()

    return StoreListResponse(
        items=[StoreResponse.model_validate(s) for s in stores],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )


@router.get("/{store_id}", response_model=StoreResponse)
def get_store(store_id: UUID, db: Session = Depends(get_db)):
    store = db.query(Store).filter(Store.id == store_id).first()
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")
    return StoreResponse.model_validate(store)


@router.post("", response_model=StoreResponse, dependencies=[Depends(verify_api_key)])
def create_store(store_data: StoreCreate, db: Session = Depends(get_db)):
    existing = db.query(Store).filter(Store.store_code == store_data.store_code).first()
    if existing:
        raise HTTPException(status_code=400, detail="Store code already exists")

    store = Store(
        **store_data.model_dump(),
        geom=ST_SetSRID(ST_MakePoint(store_data.lng, store_data.lat), 4326),
    )
    db.add(store)
    db.commit()
    db.refresh(store)
    return StoreResponse.model_validate(store)


@router.put("/{store_id}", response_model=StoreResponse, dependencies=[Depends(verify_api_key)])
def update_store(store_id: UUID, store_data: StoreUpdate, db: Session = Depends(get_db)):
    store = db.query(Store).filter(Store.id == store_id).first()
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")

    update_dict = store_data.model_dump(exclude_unset=True)
    for key, value in update_dict.items():
        setattr(store, key, value)

    if "lat" in update_dict or "lng" in update_dict:
        lat = update_dict.get("lat", store.lat)
        lng = update_dict.get("lng", store.lng)
        store.geom = ST_SetSRID(ST_MakePoint(lng, lat), 4326)

    db.commit()
    db.refresh(store)
    return StoreResponse.model_validate(store)


@router.delete("/{store_id}", dependencies=[Depends(verify_api_key)])
def delete_store(store_id: UUID, db: Session = Depends(get_db)):
    store = db.query(Store).filter(Store.id == store_id).first()
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")
    db.delete(store)
    db.commit()
    return {"message": "Store deleted successfully"}


@router.post("/import", dependencies=[Depends(verify_api_key)])
async def import_stores(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="File must be a CSV")

    contents = await file.read()
    df = pd.read_csv(io.StringIO(contents.decode("utf-8")))

    required_cols = ["store_code", "name", "address", "prefecture", "lat", "lng", "status"]
    missing = [col for col in required_cols if col not in df.columns]
    if missing:
        raise HTTPException(status_code=400, detail=f"Missing columns: {missing}")

    created_count = 0
    updated_count = 0
    errors = []

    for idx, row in df.iterrows():
        try:
            existing = db.query(Store).filter(Store.store_code == row["store_code"]).first()

            store_data = {
                "store_code": row["store_code"],
                "name": row["name"],
                "address": row["address"],
                "prefecture": row["prefecture"],
                "lat": float(row["lat"]),
                "lng": float(row["lng"]),
                "status": StoreStatus(row["status"]),
                "phone": row.get("phone") if pd.notna(row.get("phone")) else None,
                "manager_name": row.get("manager_name") if pd.notna(row.get("manager_name")) else None,
            }

            if existing:
                for key, value in store_data.items():
                    if key != "store_code":
                        setattr(existing, key, value)
                existing.geom = ST_SetSRID(ST_MakePoint(store_data["lng"], store_data["lat"]), 4326)
                updated_count += 1
            else:
                store = Store(
                    **store_data,
                    geom=ST_SetSRID(ST_MakePoint(store_data["lng"], store_data["lat"]), 4326),
                )
                db.add(store)
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
