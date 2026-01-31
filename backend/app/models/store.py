import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, Enum, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from geoalchemy2 import Geometry
import enum

from app.core.database import Base


class StoreStatus(str, enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"


class Store(Base):
    __tablename__ = "stores"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    store_code = Column(String(50), unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=False)
    address = Column(String(500), nullable=False)
    prefecture = Column(String(50), nullable=False, index=True)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    geom = Column(Geometry("POINT", srid=4326), nullable=True)
    phone = Column(String(50), nullable=True)
    manager_name = Column(String(100), nullable=True)
    status = Column(Enum(StoreStatus, values_callable=lambda x: [e.value for e in x]), default=StoreStatus.ACTIVE, nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    metrics = relationship("StoreMetric", back_populates="store", cascade="all, delete-orphan")

    __table_args__ = (
        Index("idx_stores_geom", "geom", postgresql_using="gist"),
        Index("idx_stores_status_prefecture", "status", "prefecture"),
    )
