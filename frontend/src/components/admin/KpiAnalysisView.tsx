'use client';

import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getStores, getTimeRange } from '@/lib/api';
import { PeriodPicker } from '@/components/PeriodPicker';
import { KpiComparison } from '@/components/KpiComparison';
import { KpiDecomposition } from '@/components/KpiDecomposition';
import { EnhancedKpiCard } from '@/components/EnhancedKpiCard';
import { StoreKpiDetail } from '@/components/StoreKpiDetail';
import type { MetricType, CompareType } from '@/types';

export function KpiAnalysisView() {
  const [selectedScope, setSelectedScope] = useState<'company' | string>('company');
  const [activeTab, setActiveTab] = useState<'overview' | 'compare' | 'decomposition'>('overview');
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('sales');
  const [groupBy, setGroupBy] = useState<'prefecture' | 'store' | undefined>('prefecture');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: timeRange } = useQuery({
    queryKey: ['timeRange'],
    queryFn: getTimeRange,
  });

  const { data: stores } = useQuery({
    queryKey: ['stores', 'all'],
    queryFn: () => getStores({ page_size: 500 }),
  });

  const selectedTimestamp = useMemo(() => {
    return timeRange?.max_ts ? new Date(timeRange.max_ts) : new Date();
  }, [timeRange]);

  const now = selectedTimestamp;
  const defaultBaseFrom = useMemo(() => {
    const d = new Date(now);
    d.setDate(d.getDate() - 7);
    return d;
  }, [now]);

  const [baseFrom, setBaseFrom] = useState(defaultBaseFrom);
  const [baseTo, setBaseTo] = useState(now);
  const [compareType, setCompareType] = useState<CompareType>('yoy');

  // timeRange取得後に期間を同期
  useEffect(() => {
    if (timeRange?.max_ts) {
      const maxDate = new Date(timeRange.max_ts);
      const fromDate = new Date(maxDate);
      fromDate.setDate(fromDate.getDate() - 7);
      setBaseFrom(fromDate);
      setBaseTo(maxDate);
    }
  }, [timeRange?.max_ts]);

  const [compareFrom, compareTo] = useMemo(() => {
    if (compareType === 'yoy') {
      const from = new Date(baseFrom);
      from.setFullYear(from.getFullYear() - 1);
      const to = new Date(baseTo);
      to.setFullYear(to.getFullYear() - 1);
      return [from, to];
    } else if (compareType === 'mom') {
      const from = new Date(baseFrom);
      from.setMonth(from.getMonth() - 1);
      const to = new Date(baseTo);
      to.setMonth(to.getMonth() - 1);
      return [from, to];
    }
    return [baseFrom, baseTo];
  }, [baseFrom, baseTo, compareType]);

  const [customCompareFrom, setCustomCompareFrom] = useState(compareFrom);
  const [customCompareTo, setCustomCompareTo] = useState(compareTo);

  const actualCompareFrom = compareType === 'custom' ? customCompareFrom : compareFrom;
  const actualCompareTo = compareType === 'custom' ? customCompareTo : compareTo;

  const filteredStores = useMemo(() => {
    if (!stores?.items) return [];
    if (!searchQuery) return stores.items;
    const q = searchQuery.toLowerCase();
    return stores.items.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.store_code.toLowerCase().includes(q) ||
        s.prefecture.toLowerCase().includes(q)
    );
  }, [stores, searchQuery]);

  const selectedStore = useMemo(() => {
    if (selectedScope === 'company') return null;
    return stores?.items.find((s) => s.id === selectedScope) || null;
  }, [selectedScope, stores]);

  return (
    <div className="h-full flex bg-gray-50">
      {/* Scope Selector Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-700">分析対象</h2>
        </div>

        {/* Company Overall */}
        <div className="p-2">
          <button
            onClick={() => setSelectedScope('company')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
              selectedScope === 'company'
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'hover:bg-gray-50 text-gray-700'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              selectedScope === 'company' ? 'bg-blue-500' : 'bg-gray-400'
            }`}>
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="text-left">
              <div className="font-medium text-sm">会社全体</div>
              <div className="text-xs text-gray-500">{stores?.total || 0}店舗</div>
            </div>
          </button>
        </div>

        <div className="px-4 py-2">
          <div className="text-xs font-medium text-gray-500 mb-2">店舗別</div>
          <input
            type="text"
            placeholder="店舗を検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Store List */}
        <div className="flex-1 overflow-y-auto px-2 pb-4">
          {filteredStores.map((store) => (
            <button
              key={store.id}
              onClick={() => setSelectedScope(store.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors mb-1 ${
                selectedScope === store.id
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${
                store.status === 'active' ? 'bg-green-500' : 'bg-gray-300'
              }`} />
              <div className="text-left flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{store.name}</div>
                <div className="text-xs text-gray-500">{store.prefecture}</div>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {selectedScope === 'company' ? '会社全体' : selectedStore?.name}
              </h2>
              <p className="text-xs text-gray-500">
                {selectedScope === 'company'
                  ? `全${stores?.total || 0}店舗の経営指標`
                  : `${selectedStore?.prefecture} / ${selectedStore?.store_code}`}
              </p>
            </div>
          </div>
        </header>

        {/* Tabs */}
        <div className="bg-white border-b border-gray-200 px-6 py-2 flex-shrink-0">
          <div className="flex gap-2">
            {[
              { value: 'overview' as const, label: 'KPI概要' },
              { value: 'compare' as const, label: '期間比較' },
              { value: 'decomposition' as const, label: '要因分解' },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab.value
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {selectedScope === 'company' ? (
            <>
              {activeTab === 'overview' && (
                <div className="grid grid-cols-3 gap-6">
                  {(['sales', 'customers', 'incidents_open'] as MetricType[]).map((metric) => (
                    <EnhancedKpiCard key={metric} metric={metric} ts={selectedTimestamp} />
                  ))}
                </div>
              )}

              {activeTab === 'compare' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <PeriodPicker
                      baseFrom={baseFrom}
                      baseTo={baseTo}
                      compareType={compareType}
                      compareFrom={actualCompareFrom}
                      compareTo={actualCompareTo}
                      onBaseChange={(from, to) => {
                        setBaseFrom(from);
                        setBaseTo(to);
                      }}
                      onCompareTypeChange={setCompareType}
                      onCompareChange={(from, to) => {
                        setCustomCompareFrom(from);
                        setCustomCompareTo(to);
                      }}
                    />

                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                      <h3 className="text-sm font-semibold text-gray-700 mb-3">表示設定</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">指標</label>
                          <select
                            value={selectedMetric}
                            onChange={(e) => setSelectedMetric(e.target.value as MetricType)}
                            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md"
                          >
                            <option value="sales">売上</option>
                            <option value="customers">客数</option>
                            <option value="incidents_open">インシデント</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">グループ化</label>
                          <select
                            value={groupBy || ''}
                            onChange={(e) => setGroupBy(e.target.value as 'prefecture' | 'store' | undefined || undefined)}
                            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md"
                          >
                            <option value="">なし</option>
                            <option value="prefecture">都道府県</option>
                            <option value="store">店舗</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <KpiComparison
                    metric={selectedMetric}
                    baseFrom={baseFrom}
                    baseTo={baseTo}
                    compareFrom={actualCompareFrom}
                    compareTo={actualCompareTo}
                    compareType={compareType}
                    groupBy={groupBy}
                  />
                </div>
              )}

              {activeTab === 'decomposition' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <PeriodPicker
                      baseFrom={baseFrom}
                      baseTo={baseTo}
                      compareType={compareType}
                      compareFrom={actualCompareFrom}
                      compareTo={actualCompareTo}
                      onBaseChange={(from, to) => {
                        setBaseFrom(from);
                        setBaseTo(to);
                      }}
                      onCompareTypeChange={setCompareType}
                      onCompareChange={(from, to) => {
                        setCustomCompareFrom(from);
                        setCustomCompareTo(to);
                      }}
                    />

                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                      <h3 className="text-sm font-semibold text-gray-700 mb-3">表示設定</h3>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">グループ化</label>
                        <select
                          value={groupBy || ''}
                          onChange={(e) => setGroupBy(e.target.value as 'prefecture' | 'store' | undefined || undefined)}
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md"
                        >
                          <option value="">なし</option>
                          <option value="prefecture">都道府県</option>
                          <option value="store">店舗</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <KpiDecomposition
                    baseFrom={baseFrom}
                    baseTo={baseTo}
                    compareFrom={actualCompareFrom}
                    compareTo={actualCompareTo}
                    groupBy={groupBy}
                  />
                </div>
              )}
            </>
          ) : (
            selectedStore && (
              <StoreKpiDetail
                store={selectedStore}
                activeTab={activeTab}
                selectedTimestamp={selectedTimestamp}
                baseFrom={baseFrom}
                baseTo={baseTo}
                compareFrom={actualCompareFrom}
                compareTo={actualCompareTo}
                compareType={compareType}
                onBaseChange={(from, to) => {
                  setBaseFrom(from);
                  setBaseTo(to);
                }}
                onCompareTypeChange={setCompareType}
                onCompareChange={(from, to) => {
                  setCustomCompareFrom(from);
                  setCustomCompareTo(to);
                }}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}
