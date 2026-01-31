'use client';

import { useQuery } from '@tanstack/react-query';
import type { Store } from '@/types';
import { useDashboardStore } from '@/lib/store';
import { getStoreMetrics, getMetrics } from '@/lib/api';
import { formatMetricValue, METRIC_LABELS, getColorForValue } from '@/lib/colors';
import { useMemo, useState } from 'react';

interface StoreDetailProps {
  store: Store;
}

export function StoreDetail({ store }: StoreDetailProps) {
  const { selectedMetric, selectedTimestamp, setSelectedStore } = useDashboardStore();
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  const { data: currentMetrics } = useQuery({
    queryKey: ['metrics', selectedMetric, selectedTimestamp?.toISOString()],
    queryFn: () =>
      getMetrics({
        metric: selectedMetric,
        ts: selectedTimestamp?.toISOString() || new Date().toISOString(),
      }),
    enabled: !!selectedTimestamp,
  });

  const currentMetric = useMemo(() => {
    return currentMetrics?.points.find((p) => p.store_id === store.id);
  }, [currentMetrics, store.id]);

  const { data: timeSeries } = useQuery({
    queryKey: ['storeMetrics', store.id, selectedMetric, selectedTimestamp?.toISOString()],
    queryFn: () => {
      if (!selectedTimestamp) return null;
      const to = selectedTimestamp;
      const from = new Date(to.getTime() - 24 * 60 * 60 * 1000);
      return getStoreMetrics({
        storeId: store.id,
        metric: selectedMetric,
        from: from.toISOString(),
        to: to.toISOString(),
        interval: '1h',
      });
    },
    enabled: !!selectedTimestamp,
  });

  const allValues = useMemo(() => {
    return currentMetrics?.points.map((p) => p.value).filter((v): v is number => v !== null) || [];
  }, [currentMetrics]);

  const minValue = allValues.length > 0 ? Math.min(...allValues) : 0;
  const maxValue = allValues.length > 0 ? Math.max(...allValues) : 1;

  const chartData = useMemo(() => {
    if (!timeSeries?.data) return [];
    return timeSeries.data.map((d) => ({
      ts: new Date(d.ts),
      value: d[selectedMetric as keyof typeof d] as number | null,
    }));
  }, [timeSeries, selectedMetric]);

  const chartMax = useMemo(() => {
    const values = chartData.map((d) => d.value).filter((v): v is number => v !== null);
    return values.length > 0 ? Math.max(...values) * 1.1 : 100;
  }, [chartData]);

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">{store.name}</h2>
          <div className="text-sm text-gray-500">{store.store_code}</div>
        </div>
        <button
          onClick={() => setSelectedStore(null)}
          className="p-1 text-gray-400 hover:text-gray-600"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="space-y-4">
        {/* Current Metrics */}
        <div className="border-t pt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            現在の指標値（{selectedTimestamp?.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}）
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {(['sales', 'customers', 'incidents_open'] as const).map((metric) => {
              const metricData = currentMetrics?.points.find((p) => p.store_id === store.id);
              let value: number | null = null;
              if (metricData && metric === selectedMetric) {
                value = metricData.value;
              }
              const color = value !== null && metric === selectedMetric
                ? getColorForValue(value, minValue, maxValue)
                : '#6b7280';

              return (
                <div
                  key={metric}
                  className={`rounded-lg p-2 ${
                    metric === selectedMetric ? 'bg-blue-50 ring-2 ring-blue-200' : 'bg-gray-50'
                  }`}
                >
                  <div className="text-xs text-gray-500">{METRIC_LABELS[metric]}</div>
                  <div
                    className="text-lg font-bold"
                    style={{ color: metric === selectedMetric ? color : undefined }}
                  >
                    {metric === selectedMetric
                      ? formatMetricValue(value, metric)
                      : '-'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart */}
        {chartData.length > 0 && (
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              直近24時間の推移
            </h3>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="h-32 flex items-end gap-1">
                {chartData.map((d, i) => {
                  const height = d.value !== null ? (d.value / chartMax) * 100 : 0;
                  return (
                    <div
                      key={i}
                      className="flex-1 bg-blue-400 rounded-t transition-all hover:bg-blue-500"
                      style={{ height: `${Math.max(2, height)}%` }}
                      title={`${d.ts.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}: ${formatMetricValue(d.value, selectedMetric)}`}
                    />
                  );
                })}
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>24時間前</span>
                <span>現在</span>
              </div>
            </div>
          </div>
        )}

        {/* Store Info Accordion */}
        <div className="border-t pt-4">
          <button
            onClick={() => setIsInfoOpen(!isInfoOpen)}
            className="flex items-center justify-between w-full text-left"
          >
            <h3 className="text-sm font-medium text-gray-700">店舗情報</h3>
            <svg
              className={`w-5 h-5 text-gray-500 transition-transform ${isInfoOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {isInfoOpen && (
            <div className="mt-3 space-y-3">
              {/* Status */}
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">ステータス</div>
                <span
                  className={`inline-block px-2 py-1 rounded text-sm font-medium ${
                    store.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {store.status === 'active' ? '稼働中' : '休止中'}
                </span>
              </div>

              {/* Address */}
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">住所</div>
                <div className="text-sm text-gray-900">{store.address}</div>
              </div>

              {/* Phone */}
              {store.phone && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">電話番号</div>
                  <div className="text-sm text-gray-900">{store.phone}</div>
                </div>
              )}

              {/* Manager */}
              {store.manager_name && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">責任者</div>
                  <div className="text-sm text-gray-900">{store.manager_name}</div>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
