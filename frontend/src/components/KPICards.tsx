'use client';

import type { MetricSummary, MetricType } from '@/types';
import { formatMetricValue, METRIC_LABELS } from '@/lib/colors';

interface KPICardsProps {
  storeCount: number;
  activeCount: number;
  inactiveCount: number;
  summary: MetricSummary | undefined;
  metric: MetricType;
}

export function KPICards({
  storeCount,
  activeCount,
  inactiveCount,
  summary,
  metric,
}: KPICardsProps) {
  const cards = [
    {
      label: '店舗総数',
      value: storeCount,
      format: (v: number) => v.toLocaleString(),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      color: '#3b82f6',
      bgColor: '#eff6ff',
    },
    {
      label: '稼働中',
      value: activeCount,
      format: (v: number) => v.toLocaleString(),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: '#10b981',
      bgColor: '#ecfdf5',
    },
    {
      label: '休止中',
      value: inactiveCount,
      format: (v: number) => v.toLocaleString(),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
      ),
      color: '#94a3b8',
      bgColor: '#f8fafc',
    },
    {
      label: `${METRIC_LABELS[metric]} 合計`,
      value: summary?.sum ?? null,
      format: (v: number | null) => formatMetricValue(v, metric),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: '#0ea5e9',
      bgColor: '#f0f9ff',
    },
    {
      label: `${METRIC_LABELS[metric]} 平均`,
      value: summary?.avg ?? null,
      format: (v: number | null) => formatMetricValue(v, metric),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: '#8b5cf6',
      bgColor: '#f5f3ff',
    },
    {
      label: 'インシデント',
      value: metric === 'incidents_open' ? (summary?.sum ?? null) : null,
      format: (v: number | null) => v !== null ? `${v}件` : '-',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      color: '#f59e0b',
      bgColor: '#fffbeb',
    },
  ];

  return (
    <div className="grid grid-cols-6 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-2 mb-2">
            <div
              className="p-1.5 rounded-lg"
              style={{ backgroundColor: card.bgColor, color: card.color }}
            >
              {card.icon}
            </div>
            <span className="text-xs font-medium text-gray-500">
              {card.label}
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-gray-900">
            {card.format(card.value as any)}
          </div>
        </div>
      ))}
    </div>
  );
}
