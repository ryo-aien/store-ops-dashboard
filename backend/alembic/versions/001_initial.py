"""Initial migration

Revision ID: 001
Revises:
Create Date: 2026-01-30

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
import geoalchemy2

revision: str = '001'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("CREATE EXTENSION IF NOT EXISTS postgis")

    op.create_table(
        'stores',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('store_code', sa.String(50), nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('address', sa.String(500), nullable=False),
        sa.Column('prefecture', sa.String(50), nullable=False),
        sa.Column('lat', sa.Float(), nullable=False),
        sa.Column('lng', sa.Float(), nullable=False),
        sa.Column('geom', geoalchemy2.types.Geometry(geometry_type='POINT', srid=4326), nullable=True),
        sa.Column('phone', sa.String(50), nullable=True),
        sa.Column('manager_name', sa.String(100), nullable=True),
        sa.Column('status', sa.Enum('active', 'inactive', name='storestatus'), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('idx_stores_store_code', 'stores', ['store_code'], unique=True)
    op.create_index('idx_stores_prefecture', 'stores', ['prefecture'])
    op.create_index('idx_stores_status', 'stores', ['status'])
    op.create_index('idx_stores_status_prefecture', 'stores', ['status', 'prefecture'])

    op.create_table(
        'store_metrics',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('store_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('ts', sa.DateTime(), nullable=False),
        sa.Column('sales', sa.Float(), nullable=True),
        sa.Column('customers', sa.Integer(), nullable=True),
        sa.Column('incidents_open', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['store_id'], ['stores.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('idx_store_metrics_store_ts', 'store_metrics', ['store_id', 'ts'])
    op.create_index('idx_store_metrics_ts', 'store_metrics', ['ts'])
    op.create_index('idx_store_metrics_store_ts_desc', 'store_metrics', ['store_id', sa.text('ts DESC')])


def downgrade() -> None:
    op.drop_table('store_metrics')
    op.drop_table('stores')
    op.execute("DROP TYPE IF EXISTS storestatus")
