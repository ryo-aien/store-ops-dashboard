-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create stores table
CREATE TABLE IF NOT EXISTS stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(500) NOT NULL,
    prefecture VARCHAR(50) NOT NULL,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    geom GEOMETRY(POINT, 4326),
    phone VARCHAR(50),
    manager_name VARCHAR(100),
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create store_metrics table
CREATE TABLE IF NOT EXISTS store_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    ts TIMESTAMP NOT NULL,
    sales DOUBLE PRECISION,
    customers INTEGER,
    incidents_open INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_stores_store_code ON stores(store_code);
CREATE INDEX IF NOT EXISTS idx_stores_prefecture ON stores(prefecture);
CREATE INDEX IF NOT EXISTS idx_stores_status ON stores(status);
CREATE INDEX IF NOT EXISTS idx_stores_geom ON stores USING GIST(geom);
CREATE INDEX IF NOT EXISTS idx_stores_status_prefecture ON stores(status, prefecture);

CREATE INDEX IF NOT EXISTS idx_store_metrics_store_ts ON store_metrics(store_id, ts);
CREATE INDEX IF NOT EXISTS idx_store_metrics_ts ON store_metrics(ts);
CREATE INDEX IF NOT EXISTS idx_store_metrics_store_ts_desc ON store_metrics(store_id, ts DESC);

-- Create targets table for KPI targets
CREATE TABLE IF NOT EXISTS targets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric VARCHAR(50) NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    target_value DOUBLE PRECISION NOT NULL,
    scope_type VARCHAR(20) NOT NULL DEFAULT 'global',
    scope_id UUID,
    prefecture VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_scope_type CHECK (scope_type IN ('global', 'region', 'store'))
);

CREATE INDEX IF NOT EXISTS idx_targets_metric_period ON targets(metric, period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_targets_scope ON targets(scope_type, scope_id);
CREATE INDEX IF NOT EXISTS idx_targets_prefecture ON targets(prefecture);
