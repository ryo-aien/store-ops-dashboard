'use client';

import { useMemo, useState } from 'react';
import type { Store, MetricPoint } from '@/types';
import { useDashboardStore } from '@/lib/store';
import { formatMetricValue, getColorForValue } from '@/lib/colors';

interface StoreListProps {
  stores: Store[];
  metrics: MetricPoint[];
}

const PREFECTURES = [
  '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
  '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
  '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
  '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
  '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
  '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
  '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県',
];

export function StoreList({ stores, metrics }: StoreListProps) {
  const {
    selectedMetric,
    searchQuery,
    setSearchQuery,
    filterPrefecture,
    setFilterPrefecture,
    filterStatus,
    setFilterStatus,
    setSelectedStore,
    selectedStore,
  } = useDashboardStore();

  const [page, setPage] = useState(1);
  const pageSize = 20;

  const metricMap = useMemo(() => {
    const m = new Map<string, MetricPoint>();
    metrics.forEach((p) => m.set(p.store_id, p));
    return m;
  }, [metrics]);

  const { minValue, maxValue } = useMemo(() => {
    const values = metrics.map((p) => p.value).filter((v): v is number => v !== null);
    if (values.length === 0) return { minValue: 0, maxValue: 1 };
    return {
      minValue: Math.min(...values),
      maxValue: Math.max(...values),
    };
  }, [metrics]);

  const filteredStores = useMemo(() => {
    return stores.filter((store) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (
          !store.name.toLowerCase().includes(q) &&
          !store.store_code.toLowerCase().includes(q) &&
          !store.address.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      if (filterPrefecture && store.prefecture !== filterPrefecture) {
        return false;
      }
      if (filterStatus && store.status !== filterStatus) {
        return false;
      }
      return true;
    });
  }, [stores, searchQuery, filterPrefecture, filterStatus]);

  const paginatedStores = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredStores.slice(start, start + pageSize);
  }, [filteredStores, page, pageSize]);

  const totalPages = Math.ceil(filteredStores.length / pageSize);

  return (
    <div className="flex flex-col h-full">
      {/* Search & Filters */}
      <div className="p-4 border-b border-gray-200 space-y-3">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="店舗名・コード・住所で検索..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={filterPrefecture}
            onChange={(e) => {
              setFilterPrefecture(e.target.value);
              setPage(1);
            }}
            className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200"
          >
            <option value="">全都道府県</option>
            {PREFECTURES.map((pref) => (
              <option key={pref} value={pref}>
                {pref}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setPage(1);
            }}
            className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200"
          >
            <option value="">全ステータス</option>
            <option value="active">稼働中</option>
            <option value="inactive">休止中</option>
          </select>
        </div>

        <div className="text-xs text-gray-500">
          {filteredStores.length}件の店舗
        </div>
      </div>

      {/* Store List */}
      <div className="flex-1 overflow-y-auto">
        {paginatedStores.map((store) => {
          const metricPoint = metricMap.get(store.id);
          const value = metricPoint?.value ?? null;
          const color = value !== null
            ? getColorForValue(value, minValue, maxValue)
            : '#9ca3af';
          const isSelected = selectedStore?.id === store.id;

          return (
            <div
              key={store.id}
              onClick={() => setSelectedStore(store)}
              className={`p-3 border-b border-gray-100 cursor-pointer transition-colors ${
                isSelected ? 'bg-blue-50 border-l-2 border-l-blue-500' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Metric Indicator */}
                <div
                  className="w-3 h-3 rounded-full mt-1.5 flex-shrink-0"
                  style={{ backgroundColor: color }}
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 truncate">
                      {store.name}
                    </span>
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded ${
                        store.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {store.status === 'active' ? '稼働中' : '休止中'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {store.prefecture} | {store.store_code}
                  </div>
                  <div className="text-sm font-medium font-mono mt-1" style={{ color }}>
                    {formatMetricValue(value, selectedMetric)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-3 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
          >
            前へ
          </button>
          <span className="text-sm text-gray-600">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
          >
            次へ
          </button>
        </div>
      )}
    </div>
  );
}
