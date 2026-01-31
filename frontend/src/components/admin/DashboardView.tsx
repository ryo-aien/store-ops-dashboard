'use client';

import dynamic from 'next/dynamic';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { getTimeRange, getStores, getMetricsBulk } from '@/lib/api';
import { useDashboardStore } from '@/lib/store';
import { KPICards } from '@/components/KPICards';
import { MetricSelector } from '@/components/MetricSelector';
import { TimeSlider } from '@/components/TimeSlider';
import { StoreList } from '@/components/StoreList';
import { StoreDetail } from '@/components/StoreDetail';
import { Legend } from '@/components/Legend';
import { SearchFilter } from '@/components/SearchFilter';
import type { MetricPoint, MetricSummary, TimestampMetrics } from '@/types';

const MapComponent = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-gray-500 text-sm">マップを読み込み中...</span>
      </div>
    </div>
  ),
});

export function DashboardView() {
  const {
    selectedMetric,
    selectedTimestamp,
    setSelectedTimestamp,
    setDataTimestamp,
    searchQuery,
    filterPrefecture,
    filterStatus,
    selectedStore,
  } = useDashboardStore();

  // フィルターで設定された表示期間
  const [filterDateRange, setFilterDateRange] = useState<{ from: Date; to: Date } | null>(null);

  const handleDateRangeChange = useCallback((from: Date, to: Date) => {
    setFilterDateRange({ from, to });
  }, []);

  const { data: timeRange } = useQuery({
    queryKey: ['timeRange'],
    queryFn: getTimeRange,
  });

  // 初期値として1年前から現在までを設定
  const effectiveDateRange = useMemo(() => {
    if (filterDateRange) {
      return filterDateRange;
    }
    if (timeRange?.max_ts) {
      const maxDate = new Date(timeRange.max_ts);
      const minDate = timeRange.min_ts ? new Date(timeRange.min_ts) : new Date(maxDate.getTime() - 365 * 24 * 60 * 60 * 1000);
      return { from: minDate, to: maxDate };
    }
    return null;
  }, [filterDateRange, timeRange]);

  useEffect(() => {
    if (timeRange?.max_ts && !selectedTimestamp) {
      const ts = new Date(timeRange.max_ts);
      setSelectedTimestamp(ts);
      setDataTimestamp(ts);
    }
  }, [timeRange, selectedTimestamp, setSelectedTimestamp, setDataTimestamp]);

  const { data: stores } = useQuery({
    queryKey: ['stores', searchQuery, filterPrefecture, filterStatus],
    queryFn: () =>
      getStores({
        search: searchQuery || undefined,
        prefecture: filterPrefecture || undefined,
        status: filterStatus as 'active' | 'inactive' | undefined,
        page_size: 500,
      }),
  });

  // バルクデータ取得（期間範囲の全データを一括取得）
  const { data: bulkMetrics, isLoading: isBulkLoading } = useQuery({
    queryKey: ['metricsBulk', selectedMetric, effectiveDateRange?.from?.toISOString(), effectiveDateRange?.to?.toISOString()],
    queryFn: () =>
      getMetricsBulk({
        metric: selectedMetric,
        from: effectiveDateRange!.from.toISOString(),
        to: effectiveDateRange!.to.toISOString(),
      }),
    enabled: !!effectiveDateRange,
    staleTime: 5 * 60 * 1000, // 5分間キャッシュ
  });

  // 現在のタイムスタンプに最も近いデータを取得
  const currentMetricsData = useMemo((): { points: MetricPoint[]; summary: MetricSummary | undefined } => {
    if (!selectedTimestamp || !bulkMetrics?.timestamps?.length) {
      return { points: [], summary: undefined };
    }

    const targetTime = selectedTimestamp.getTime();
    let closestTs: TimestampMetrics | null = null;
    let closestDiff = Infinity;

    // 選択時刻以前で最も近いタイムスタンプを探す
    for (const data of bulkMetrics.timestamps) {
      const tsTime = new Date(data.ts).getTime();
      if (tsTime <= targetTime) {
        const diff = targetTime - tsTime;
        if (diff < closestDiff) {
          closestDiff = diff;
          closestTs = data;
        }
      }
    }

    if (closestTs) {
      return { points: closestTs.points, summary: closestTs.summary };
    }

    return { points: [], summary: undefined };
  }, [selectedTimestamp, bulkMetrics]);

  return (
    <div className="h-full flex flex-col overflow-hidden bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">地図ダッシュボード</h2>
            <p className="text-xs text-gray-500">リアルタイム店舗分析</p>
          </div>
          <div className="flex items-center gap-4">
            {isBulkLoading && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                データ読み込み中...
              </div>
            )}
            {selectedTimestamp && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <div>
                  <div className="text-xs text-gray-500">表示時刻</div>
                  <div className="font-mono text-sm text-gray-900">
                    {selectedTimestamp.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* KPI Section */}
      <div className="px-6 py-3 flex-shrink-0">
        <KPICards
          storeCount={stores?.total || 0}
          activeCount={stores?.items.filter((s) => s.status === 'active').length || 0}
          inactiveCount={stores?.items.filter((s) => s.status === 'inactive').length || 0}
          summary={currentMetricsData.summary}
          metric={selectedMetric}
        />
      </div>

      {/* Search Filter Section */}
      <div className="px-6 py-2 flex-shrink-0">
        <SearchFilter
          minTs={timeRange?.min_ts ? new Date(timeRange.min_ts) : null}
          maxTs={timeRange?.max_ts ? new Date(timeRange.max_ts) : null}
          onDateRangeChange={handleDateRangeChange}
        />
      </div>

      {/* Controls Section */}
      <div className="px-6 py-2 flex-shrink-0 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-6">
          <MetricSelector />
          {timeRange && (
            <div className="flex-1">
              <TimeSlider
                minTs={effectiveDateRange?.from ?? (timeRange.min_ts ? new Date(timeRange.min_ts) : null)}
                maxTs={effectiveDateRange?.to ?? (timeRange.max_ts ? new Date(timeRange.max_ts) : null)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Store List Sidebar */}
        <aside className="w-72 flex-shrink-0 flex flex-col overflow-hidden bg-white border-r border-gray-200">
          <StoreList stores={stores?.items || []} metrics={currentMetricsData.points} />
        </aside>

        {/* Map */}
        <main className="flex-1 relative">
          <MapComponent
            stores={stores?.items || []}
            metrics={currentMetricsData.points}
          />
          {/* Legend */}
          <div className="absolute bottom-6 left-6 z-[1000]">
            <Legend metric={selectedMetric} points={currentMetricsData.points} />
          </div>
        </main>

        {/* Detail Panel */}
        {selectedStore && (
          <aside className="w-80 flex-shrink-0 overflow-y-auto bg-white border-l border-gray-200">
            <StoreDetail store={selectedStore} />
          </aside>
        )}
      </div>
    </div>
  );
}
