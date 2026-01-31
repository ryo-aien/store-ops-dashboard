import type {
  Store,
  StoreListResponse,
  MetricListResponse,
  MetricSummary,
  TimeRange,
  StoreMetricTimeSeries,
  StoreStatus,
  MetricType,
  MetricCompareResponse,
  MetricDecompositionResponse,
  KpiSummaryWithTarget,
  MetricsBulkResponse,
} from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `API Error: ${response.status}`);
  }

  return response.json();
}

export interface StoreListParams {
  search?: string;
  prefecture?: string;
  status?: StoreStatus;
  bbox?: string;
  page?: number;
  page_size?: number;
}

export async function getStores(params: StoreListParams = {}): Promise<StoreListResponse> {
  const searchParams = new URLSearchParams();
  if (params.search) searchParams.set('search', params.search);
  if (params.prefecture) searchParams.set('prefecture', params.prefecture);
  if (params.status) searchParams.set('status', params.status);
  if (params.bbox) searchParams.set('bbox', params.bbox);
  if (params.page) searchParams.set('page', params.page.toString());
  if (params.page_size) searchParams.set('page_size', params.page_size.toString());

  const query = searchParams.toString();
  return fetchApi<StoreListResponse>(`/api/stores${query ? `?${query}` : ''}`);
}

export async function getStore(id: string): Promise<Store> {
  return fetchApi<Store>(`/api/stores/${id}`);
}

export interface MetricParams {
  metric: MetricType;
  ts: string;
  bbox?: string;
  prefecture?: string;
  status?: StoreStatus;
  threshold_min?: number;
  threshold_max?: number;
}

export async function getMetrics(params: MetricParams): Promise<MetricListResponse> {
  const searchParams = new URLSearchParams();
  searchParams.set('metric', params.metric);
  searchParams.set('ts', params.ts);
  if (params.bbox) searchParams.set('bbox', params.bbox);
  if (params.prefecture) searchParams.set('prefecture', params.prefecture);
  if (params.status) searchParams.set('status', params.status);
  if (params.threshold_min !== undefined) searchParams.set('threshold_min', params.threshold_min.toString());
  if (params.threshold_max !== undefined) searchParams.set('threshold_max', params.threshold_max.toString());

  return fetchApi<MetricListResponse>(`/api/metrics?${searchParams.toString()}`);
}

export interface MetricSummaryParams {
  metric: MetricType;
  ts: string;
  bbox?: string;
  prefecture?: string;
  status?: StoreStatus;
}

export async function getMetricSummary(params: MetricSummaryParams): Promise<MetricSummary> {
  const searchParams = new URLSearchParams();
  searchParams.set('metric', params.metric);
  searchParams.set('ts', params.ts);
  if (params.bbox) searchParams.set('bbox', params.bbox);
  if (params.prefecture) searchParams.set('prefecture', params.prefecture);
  if (params.status) searchParams.set('status', params.status);

  return fetchApi<MetricSummary>(`/api/metrics/summary?${searchParams.toString()}`);
}

export async function getTimeRange(): Promise<TimeRange> {
  return fetchApi<TimeRange>('/api/metrics/time-range');
}

export interface StoreMetricParams {
  storeId: string;
  metric: MetricType;
  from: string;
  to: string;
  interval?: string;
}

export async function getStoreMetrics(params: StoreMetricParams): Promise<StoreMetricTimeSeries> {
  const searchParams = new URLSearchParams();
  searchParams.set('metric', params.metric);
  searchParams.set('from', params.from);
  searchParams.set('to', params.to);
  if (params.interval) searchParams.set('interval', params.interval);

  return fetchApi<StoreMetricTimeSeries>(`/api/metrics/stores/${params.storeId}?${searchParams.toString()}`);
}

export interface MetricCompareParams {
  metric: MetricType;
  base_from: string;
  base_to: string;
  compare_from: string;
  compare_to: string;
  group_by?: 'prefecture' | 'store';
  prefecture?: string;
  status?: StoreStatus;
}

export async function getMetricCompare(params: MetricCompareParams): Promise<MetricCompareResponse> {
  const searchParams = new URLSearchParams();
  searchParams.set('metric', params.metric);
  searchParams.set('base_from', params.base_from);
  searchParams.set('base_to', params.base_to);
  searchParams.set('compare_from', params.compare_from);
  searchParams.set('compare_to', params.compare_to);
  if (params.group_by) searchParams.set('group_by', params.group_by);
  if (params.prefecture) searchParams.set('prefecture', params.prefecture);
  if (params.status) searchParams.set('status', params.status);

  return fetchApi<MetricCompareResponse>(`/api/metrics/compare?${searchParams.toString()}`);
}

export interface DecompositionParams {
  base_from: string;
  base_to: string;
  compare_from: string;
  compare_to: string;
  group_by?: 'prefecture' | 'store';
  prefecture?: string;
  status?: StoreStatus;
}

export async function getDecomposition(params: DecompositionParams): Promise<MetricDecompositionResponse> {
  const searchParams = new URLSearchParams();
  searchParams.set('base_from', params.base_from);
  searchParams.set('base_to', params.base_to);
  searchParams.set('compare_from', params.compare_from);
  searchParams.set('compare_to', params.compare_to);
  if (params.group_by) searchParams.set('group_by', params.group_by);
  if (params.prefecture) searchParams.set('prefecture', params.prefecture);
  if (params.status) searchParams.set('status', params.status);

  return fetchApi<MetricDecompositionResponse>(`/api/metrics/decomposition?${searchParams.toString()}`);
}

export interface KpiSummaryWithTargetParams {
  metric: MetricType;
  ts: string;
  bbox?: string;
  prefecture?: string;
  status?: StoreStatus;
}

export async function getKpiSummaryWithTarget(params: KpiSummaryWithTargetParams): Promise<KpiSummaryWithTarget> {
  const searchParams = new URLSearchParams();
  searchParams.set('metric', params.metric);
  searchParams.set('ts', params.ts);
  if (params.bbox) searchParams.set('bbox', params.bbox);
  if (params.prefecture) searchParams.set('prefecture', params.prefecture);
  if (params.status) searchParams.set('status', params.status);

  return fetchApi<KpiSummaryWithTarget>(`/api/metrics/summary-with-target?${searchParams.toString()}`);
}

export interface MetricsBulkParams {
  metric: MetricType;
  from: string;
  to: string;
  bbox?: string;
  prefecture?: string;
  status?: StoreStatus;
}

export async function getMetricsBulk(params: MetricsBulkParams): Promise<MetricsBulkResponse> {
  const searchParams = new URLSearchParams();
  searchParams.set('metric', params.metric);
  searchParams.set('from', params.from);
  searchParams.set('to', params.to);
  if (params.bbox) searchParams.set('bbox', params.bbox);
  if (params.prefecture) searchParams.set('prefecture', params.prefecture);
  if (params.status) searchParams.set('status', params.status);

  return fetchApi<MetricsBulkResponse>(`/api/metrics/bulk?${searchParams.toString()}`);
}
