'use client';

import { useMemo } from 'react';
import type { MetricPoint, MetricType } from '@/types';
import { HEAT_COLORS, formatMetricValue, METRIC_LABELS } from '@/lib/colors';
import { useDashboardStore } from '@/lib/store';

interface LegendProps {
  metric: MetricType;
  points: MetricPoint[];
}

export function Legend({ metric, points }: LegendProps) {
  const { scaleMode, fixedScaleMin, fixedScaleMax } = useDashboardStore();

  const { minValue, maxValue } = useMemo(() => {
    const values = points.map((p) => p.value).filter((v): v is number => v !== null);
    if (values.length === 0) return { minValue: 0, maxValue: 1 };

    if (scaleMode === 'fixed') {
      return { minValue: fixedScaleMin, maxValue: fixedScaleMax };
    }

    return {
      minValue: Math.min(...values),
      maxValue: Math.max(...values),
    };
  }, [points, scaleMode, fixedScaleMin, fixedScaleMax]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-3 min-w-[180px]">
      <div className="text-sm font-medium text-gray-700 mb-2">
        {METRIC_LABELS[metric]}
      </div>
      <div className="flex items-center gap-1">
        <div
          className="h-4 flex-1 rounded"
          style={{
            background: `linear-gradient(to right, ${HEAT_COLORS.map((c) => c.color).join(', ')})`,
          }}
        />
      </div>
      <div className="flex justify-between mt-1 text-xs text-gray-600">
        <span>{formatMetricValue(minValue, metric)}</span>
        <span>{formatMetricValue((minValue + maxValue) / 2, metric)}</span>
        <span>{formatMetricValue(maxValue, metric)}</span>
      </div>
    </div>
  );
}
