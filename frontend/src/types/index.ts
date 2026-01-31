export type StoreStatus = 'active' | 'inactive';

export interface Store {
  id: string;
  store_code: string;
  name: string;
  address: string;
  prefecture: string;
  lat: number;
  lng: number;
  phone: string | null;
  manager_name: string | null;
  status: StoreStatus;
  created_at: string;
  updated_at: string;
}

export interface StoreWithMetricValue extends Store {
  metric_value: number | null;
  metric_ts: string | null;
}

export interface StoreListResponse {
  items: Store[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface MetricPoint {
  store_id: string;
  lat: number;
  lng: number;
  value: number | null;
  ts: string | null;
}

export interface MetricListResponse {
  metric: string;
  requested_ts: string;
  interpolation: string;
  points: MetricPoint[];
}

export interface MetricSummary {
  metric: string;
  ts: string;
  count: number;
  sum: number | null;
  avg: number | null;
  median: number | null;
  max: number | null;
  min: number | null;
}

export interface TimeRange {
  min_ts: string | null;
  max_ts: string | null;
}

export interface MetricData {
  ts: string;
  sales: number | null;
  customers: number | null;
  incidents_open: number | null;
}

export interface StoreMetricTimeSeries {
  store_id: string;
  metric: string;
  from_ts: string;
  to_ts: string;
  interval: string;
  data: MetricData[];
}

export type MetricType = 'sales' | 'customers' | 'incidents_open';
export type DisplayMode = 'pins' | 'heat' | 'both';
export type ScaleMode = 'auto' | 'fixed';
export type CompareType = 'yoy' | 'mom' | 'custom';

export interface PeriodSummary {
  period_start: string;
  period_end: string;
  count: number;
  sum: number | null;
  avg: number | null;
  median: number | null;
  max: number | null;
  min: number | null;
}

export interface GroupCompare {
  group_key: string;
  base_value: number | null;
  compare_value: number | null;
  diff_value: number | null;
  diff_rate: number | null;
}

export interface MetricCompareResponse {
  metric: string;
  base_summary: PeriodSummary;
  compare_summary: PeriodSummary;
  diff_value: number | null;
  diff_rate: number | null;
  group_by: string | null;
  groups: GroupCompare[] | null;
}

export interface DecompositionResult {
  group_key: string | null;
  base_sales: number | null;
  compare_sales: number | null;
  sales_diff: number | null;
  base_customers: number | null;
  compare_customers: number | null;
  base_unit_price: number | null;
  compare_unit_price: number | null;
  customers_contrib: number | null;
  unit_price_contrib: number | null;
}

export interface MetricDecompositionResponse {
  base_period_start: string;
  base_period_end: string;
  compare_period_start: string;
  compare_period_end: string;
  total: DecompositionResult;
  group_by: string | null;
  groups: DecompositionResult[] | null;
}

export interface TargetResponse {
  metric: string;
  target_value: number;
  actual_value: number | null;
  achievement_rate: number | null;
  gap: number | null;
}

export interface KpiSummaryWithTarget {
  metric: string;
  ts: string;
  count: number;
  sum: number | null;
  avg: number | null;
  median: number | null;
  max: number | null;
  min: number | null;
  target: TargetResponse | null;
  yoy: {
    compare_value: number;
    diff_value: number;
    diff_rate: number | null;
  } | null;
  mom: {
    compare_value: number;
    diff_value: number;
    diff_rate: number | null;
  } | null;
}

export interface TimestampMetrics {
  ts: string;
  points: MetricPoint[];
  summary: MetricSummary;
}

export interface MetricsBulkResponse {
  metric: string;
  from_ts: string;
  to_ts: string;
  timestamps: TimestampMetrics[];
}
