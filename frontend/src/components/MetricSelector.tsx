'use client';

import { useDashboardStore } from '@/lib/store';
import { METRIC_LABELS } from '@/lib/colors';
import type { MetricType, DisplayMode, ScaleMode } from '@/types';

export function MetricSelector() {
  const {
    selectedMetric,
    setSelectedMetric,
    displayMode,
    setDisplayMode,
    scaleMode,
    setScaleMode,
    fixedScaleMin,
    fixedScaleMax,
    setFixedScale,
  } = useDashboardStore();

  const metrics: MetricType[] = ['sales', 'customers', 'incidents_open'];
  const displayModes: { value: DisplayMode; label: string; icon: JSX.Element }[] = [
    {
      value: 'pins',
      label: 'ピン',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        </svg>
      ),
    },
    {
      value: 'heat',
      label: 'ヒート',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
        </svg>
      ),
    },
    {
      value: 'both',
      label: '両方',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex items-center gap-6">
      {/* Metric Selector */}
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-gray-500">
          指標
        </label>
        <select
          value={selectedMetric}
          onChange={(e) => setSelectedMetric(e.target.value as MetricType)}
          className="min-w-[140px]"
        >
          {metrics.map((metric) => (
            <option key={metric} value={metric}>
              {METRIC_LABELS[metric]}
            </option>
          ))}
        </select>
      </div>

      {/* Display Mode */}
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-gray-500">
          表示
        </label>
        <div className="flex rounded-lg overflow-hidden border border-gray-200">
          {displayModes.map((mode) => (
            <button
              key={mode.value}
              onClick={() => setDisplayMode(mode.value)}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm transition-colors ${
                displayMode === mode.value
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {mode.icon}
              <span>{mode.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Scale Mode */}
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-gray-500">
          スケール
        </label>
        <select
          value={scaleMode}
          onChange={(e) => setScaleMode(e.target.value as ScaleMode)}
          className="min-w-[100px]"
        >
          <option value="auto">自動</option>
          <option value="fixed">固定</option>
        </select>
      </div>

      {/* Fixed Scale Inputs */}
      {scaleMode === 'fixed' && (
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={fixedScaleMin}
            onChange={(e) => setFixedScale(parseInt(e.target.value) || 0, fixedScaleMax)}
            className="w-24"
            placeholder="最小"
          />
          <span className="text-gray-400">〜</span>
          <input
            type="number"
            value={fixedScaleMax}
            onChange={(e) => setFixedScale(fixedScaleMin, parseInt(e.target.value) || 0)}
            className="w-24"
            placeholder="最大"
          />
        </div>
      )}
    </div>
  );
}
