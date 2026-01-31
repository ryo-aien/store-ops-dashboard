'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMetricCompare } from '@/lib/api';
import { formatMetricValue, METRIC_LABELS, isGoodChange } from '@/lib/colors';
import type { MetricType, CompareType } from '@/types';

interface KpiComparisonProps {
  metric: MetricType;
  baseFrom: Date;
  baseTo: Date;
  compareFrom: Date;
  compareTo: Date;
  compareType: CompareType;
  groupBy?: 'prefecture' | 'store';
}

export function KpiComparison({
  metric,
  baseFrom,
  baseTo,
  compareFrom,
  compareTo,
  compareType,
  groupBy,
}: KpiComparisonProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['metricCompare', metric, baseFrom, baseTo, compareFrom, compareTo, groupBy],
    queryFn: () =>
      getMetricCompare({
        metric,
        base_from: baseFrom.toISOString(),
        base_to: baseTo.toISOString(),
        compare_from: compareFrom.toISOString(),
        compare_to: compareTo.toISOString(),
        group_by: groupBy,
      }),
    enabled: !!baseFrom && !!baseTo && !!compareFrom && !!compareTo,
  });

  const compareLabel = useMemo(() => {
    switch (compareType) {
      case 'yoy':
        return '前年同期';
      case 'mom':
        return '前月同期';
      default:
        return '比較期間';
    }
  }, [compareType]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-8 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="text-sm text-gray-500">データを取得できません</div>
      </div>
    );
  }

  const DiffIndicator = ({ value, rate }: { value: number | null; rate: number | null }) => {
    if (value === null) return <span className="text-gray-400">-</span>;

    const isPositive = value > 0;
    const isNegative = value < 0;
    const goodChange = isGoodChange(metric, value);
    const color = goodChange === true ? 'text-green-600' : goodChange === false ? 'text-red-600' : 'text-gray-500';
    const bgColor = goodChange === true ? 'bg-green-50' : goodChange === false ? 'bg-red-50' : 'bg-gray-50';
    const arrow = isPositive ? '↑' : isNegative ? '↓' : '';

    return (
      <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded ${bgColor} ${color}`}>
        <span className="text-sm font-medium">
          {arrow} {formatMetricValue(Math.abs(value), metric)}
        </span>
        {rate !== null && (
          <span className="text-xs">({rate > 0 ? '+' : ''}{rate.toFixed(1)}%)</span>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">
        {METRIC_LABELS[metric]} - 期間比較
      </h3>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="text-xs text-blue-600 mb-1">基準期間</div>
          <div className="text-lg font-bold text-blue-700">
            {formatMetricValue(data.base_summary.sum, metric)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            平均: {formatMetricValue(data.base_summary.avg, metric)}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-600 mb-1">{compareLabel}</div>
          <div className="text-lg font-bold text-gray-700">
            {formatMetricValue(data.compare_summary.sum, metric)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            平均: {formatMetricValue(data.compare_summary.avg, metric)}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <div className="text-xs text-gray-600 mb-1">差分</div>
          <DiffIndicator value={data.diff_value} rate={data.diff_rate} />
        </div>
      </div>

      {data.groups && data.groups.length > 0 && (
        <div className="border-t pt-4">
          <h4 className="text-xs font-medium text-gray-500 mb-2">
            {groupBy === 'prefecture' ? '都道府県別' : '店舗別'}
          </h4>
          <div className="max-h-48 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-white">
                <tr className="text-left text-xs text-gray-500 border-b">
                  <th className="pb-2">{groupBy === 'prefecture' ? '都道府県' : '店舗'}</th>
                  <th className="pb-2 text-right">基準</th>
                  <th className="pb-2 text-right">比較</th>
                  <th className="pb-2 text-right">差分</th>
                </tr>
              </thead>
              <tbody>
                {data.groups
                  .sort((a, b) => Math.abs(b.diff_value || 0) - Math.abs(a.diff_value || 0))
                  .slice(0, 10)
                  .map((group) => (
                    <tr key={group.group_key} className="border-b border-gray-100">
                      <td className="py-2 font-medium">{group.group_key}</td>
                      <td className="py-2 text-right">
                        {formatMetricValue(group.base_value, metric)}
                      </td>
                      <td className="py-2 text-right text-gray-500">
                        {formatMetricValue(group.compare_value, metric)}
                      </td>
                      <td className="py-2 text-right">
                        <DiffIndicator value={group.diff_value} rate={group.diff_rate} />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
