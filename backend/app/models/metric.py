import uuid
from datetime import datetime
from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.core.database import Base


class StoreMetric(Base):
    __tablename__ = "store_metrics"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    store_id = Column(UUID(as_uuid=True), ForeignKey("stores.id", ondelete="CASCADE"), nullable=False)
    ts = Column(DateTime, nullable=False)
    sales = Column(Float, nullable=True)
    customers = Column(Integer, nullable=True)
    incidents_open = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    store = relationship("Store", back_populates="metrics")

    __table_args__ = (
        Index("idx_store_metrics_store_ts", "store_id", "ts"),
        Index("idx_store_metrics_ts", "ts"),
        Index("idx_store_metrics_store_ts_desc", "store_id", ts.desc()),
    )
