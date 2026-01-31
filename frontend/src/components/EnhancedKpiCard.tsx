'use client';

import { useQuery } from '@tanstack/react-query';
import { getKpiSummaryWithTarget } from '@/lib/api';
import { formatMetricValue, METRIC_LABELS, isGoodChange } from '@/lib/colors';
import type { MetricType } from '@/types';

interface EnhancedKpiCardProps {
  metric: MetricType;
  ts: Date;
}

export function EnhancedKpiCard({ metric, ts }: EnhancedKpiCardProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['kpiSummaryWithTarget', metric, ts.toISOString()],
    queryFn: () =>
      getKpiSummaryWithTarget({
        metric,
        ts: ts.toISOString(),
      }),
    enabled: !!ts,
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
      </div>
    );
  }

  if (!data) return null;

  const DiffBadge = ({
    label,
    diffValue,
    diffRate,
  }: {
    label: string;
    diffValue: number;
    diffRate: number | null;
  }) => {
    const isPositive = diffValue > 0;
    const isNegative = diffValue < 0;
    const goodChange = isGoodChange(metric, diffValue);
    const color = goodChange === true ? 'text-green-600' : goodChange === false ? 'text-red-600' : 'text-gray-500';
    const bgColor = goodChange === true ? 'bg-green-50' : goodChange === false ? 'bg-red-50' : 'bg-gray-50';
    const arrow = isPositive ? '↑' : isNegative ? '↓' : '';

    return (
      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${bgColor}`}>
        <span className="text-gray-500">{label}:</span>
        <span className={`font-medium ${color}`}>
          {arrow} {formatMetricValue(Math.abs(diffValue), metric)}
          {diffRate !== null && ` (${diffRate > 0 ? '+' : ''}${diffRate.toFixed(1)}%)`}
        </span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-600">{METRIC_LABELS[metric]}</h3>
        {data.target && (
          <div
            className={`text-xs px-2 py-0.5 rounded ${
              (data.target.achievement_rate || 0) >= 100
                ? 'bg-green-100 text-green-700'
                : 'bg-amber-100 text-amber-700'
            }`}
          >
            達成率: {data.target.achievement_rate?.toFixed(1)}%
          </div>
        )}
      </div>

      <div className="mb-3">
        <div className="text-2xl font-bold text-gray-900">
          {formatMetricValue(data.sum, metric)}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          平均: {formatMetricValue(data.avg, metric)} / 中央値: {formatMetricValue(data.median, metric)}
        </div>
      </div>

      {data.target && (
        <div className="mb-3 p-2 bg-gray-50 rounded">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">目標</span>
            <span className="font-medium">{formatMetricValue(data.target.target_value, metric)}</span>
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span className="text-gray-500">乖離</span>
            <span
              className={`font-medium ${
                (data.target.gap || 0) >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {(data.target.gap || 0) >= 0 ? '+' : ''}
              {formatMetricValue(data.target.gap, metric)}
            </span>
          </div>
          <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                (data.target.achievement_rate || 0) >= 100 ? 'bg-green-500' : 'bg-amber-500'
              }`}
              style={{ width: `${Math.min(data.target.achievement_rate || 0, 100)}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {data.yoy && (
          <DiffBadge
            label="前年比"
            diffValue={data.yoy.diff_value}
            diffRate={data.yoy.diff_rate}
          />
        )}
        {data.mom && (
          <DiffBadge
            label="前月比"
            diffValue={data.mom.diff_value}
            diffRate={data.mom.diff_rate}
          />
        )}
      </div>
    </div>
  );
}
