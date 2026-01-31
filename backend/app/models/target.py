from sqlalchemy import Column, String, Float, Date, DateTime, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime

from app.core.database import Base


class Target(Base):
    __tablename__ = "targets"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    metric = Column(String(50), nullable=False)
    period_start = Column(Date, nullable=False)
    period_end = Column(Date, nullable=False)
    target_value = Column(Float, nullable=False)
    scope_type = Column(String(20), nullable=False, default="global")
    scope_id = Column(UUID(as_uuid=True), nullable=True)
    prefecture = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    __table_args__ = (
        CheckConstraint(
            "scope_type IN ('global', 'region', 'store')",
            name="chk_scope_type"
        ),
    )
