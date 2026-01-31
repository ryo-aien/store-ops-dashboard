'use client';

import { useQuery } from '@tanstack/react-query';
import { getStoreMetrics, getMetricCompare, getDecomposition } from '@/lib/api';
import { formatMetricValue, METRIC_LABELS } from '@/lib/colors';
import { PeriodPicker } from './PeriodPicker';
import type { Store, MetricType, CompareType } from '@/types';

interface StoreKpiDetailProps {
  store: Store;
  activeTab: 'overview' | 'compare' | 'decomposition';
  selectedTimestamp: Date;
  baseFrom: Date;
  baseTo: Date;
  compareFrom: Date;
  compareTo: Date;
  compareType: CompareType;
  onBaseChange: (from: Date, to: Date) => void;
  onCompareTypeChange: (type: CompareType) => void;
  onCompareChange: (from: Date, to: Date) => void;
}

export function StoreKpiDetail({
  store,
  activeTab,
  selectedTimestamp,
  baseFrom,
  baseTo,
  compareFrom,
  compareTo,
  compareType,
  onBaseChange,
  onCompareTypeChange,
  onCompareChange,
}: StoreKpiDetailProps) {
  const { data: salesData } = useQuery({
    queryKey: ['storeMetrics', store.id, 'sales', baseFrom, baseTo],
    queryFn: () =>
      getStoreMetrics({
        storeId: store.id,
        metric: 'sales',
        from: baseFrom.toISOString(),
        to: baseTo.toISOString(),
        interval: '1d',
      }),
  });

  const { data: customersData } = useQuery({
    queryKey: ['storeMetrics', store.id, 'customers', baseFrom, baseTo],
    queryFn: () =>
      getStoreMetrics({
        storeId: store.id,
        metric: 'customers',
        from: baseFrom.toISOString(),
        to: baseTo.toISOString(),
        interval: '1d',
      }),
  });

  const { data: incidentsData } = useQuery({
    queryKey: ['storeMetrics', store.id, 'incidents_open', baseFrom, baseTo],
    queryFn: () =>
      getStoreMetrics({
        storeId: store.id,
        metric: 'incidents_open',
        from: baseFrom.toISOString(),
        to: baseTo.toISOString(),
        interval: '1d',
      }),
  });

  const calculateSummary = (data: typeof salesData, metric: MetricType) => {
    if (!data?.data || data.data.length === 0) return null;
    const values = data.data
      .map((d) => d[metric])
      .filter((v): v is number => v !== null);
    if (values.length === 0) return null;
    return {
      sum: values.reduce((a, b) => a + b, 0),
      avg: values.reduce((a, b) => a + b, 0) / values.length,
      max: Math.max(...values),
      min: Math.min(...values),
      count: values.length,
    };
  };

  const salesSummary = calculateSummary(salesData, 'sales');
  const customersSummary = calculateSummary(customersData, 'customers');
  const incidentsSummary = calculateSummary(incidentsData, 'incidents_open');

  const KpiCard = ({
    metric,
    summary,
  }: {
    metric: MetricType;
    summary: ReturnType<typeof calculateSummary>;
  }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-medium text-gray-600 mb-2">{METRIC_LABELS[metric]}</h3>
      {summary ? (
        <>
          <div className="text-2xl font-bold text-gray-900 mb-2">
            {formatMetricValue(summary.sum, metric)}
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-gray-500">平均:</span>{' '}
              <span className="font-medium">{formatMetricValue(summary.avg, metric)}</span>
            </div>
            <div>
              <span className="text-gray-500">件数:</span>{' '}
              <span className="font-medium">{summary.count}件</span>
            </div>
            <div>
              <span className="text-gray-500">最大:</span>{' '}
              <span className="font-medium">{formatMetricValue(summary.max, metric)}</span>
            </div>
            <div>
              <span className="text-gray-500">最小:</span>{' '}
              <span className="font-medium">{formatMetricValue(summary.min, metric)}</span>
            </div>
          </div>
        </>
      ) : (
        <div className="text-gray-400">データなし</div>
      )}
    </div>
  );

  const TimeSeriesChart = ({
    data,
    metric,
  }: {
    data: typeof salesData;
    metric: MetricType;
  }) => {
    if (!data?.data || data.data.length === 0) {
      return <div className="text-gray-400 text-sm">データなし</div>;
    }

    const values = data.data.map((d) => d[metric]).filter((v): v is number => v !== null);
    const maxValue = Math.max(...values) * 1.1 || 1;

    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">{METRIC_LABELS[metric]}推移</h4>
        <div className="h-32 flex items-end gap-1">
          {data.data.map((d, i) => {
            const value = d[metric];
            const height = value !== null ? (value / maxValue) * 100 : 0;
            return (
              <div
                key={i}
                className="flex-1 bg-blue-400 rounded-t transition-all hover:bg-blue-500"
                style={{ height: `${Math.max(2, height)}%` }}
                title={`${new Date(d.ts).toLocaleDateString('ja-JP')}: ${formatMetricValue(value, metric)}`}
              />
            );
          })}
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>{new Date(data.data[0]?.ts).toLocaleDateString('ja-JP')}</span>
          <span>{new Date(data.data[data.data.length - 1]?.ts).toLocaleDateString('ja-JP')}</span>
        </div>
      </div>
    );
  };

  // Store-specific comparison
  const { data: salesCompare } = useQuery({
    queryKey: ['storeCompare', store.id, 'sales', baseFrom, baseTo, compareFrom, compareTo],
    queryFn: async () => {
      const [base, compare] = await Promise.all([
        getStoreMetrics({
          storeId: store.id,
          metric: 'sales',
          from: baseFrom.toISOString(),
          to: baseTo.toISOString(),
        }),
        getStoreMetrics({
          storeId: store.id,
          metric: 'sales',
          from: compareFrom.toISOString(),
          to: compareTo.toISOString(),
        }),
      ]);
      const baseSum = base.data.reduce((acc, d) => acc + (d.sales || 0), 0);
      const compareSum = compare.data.reduce((acc, d) => acc + (d.sales || 0), 0);
      return {
        base: baseSum,
        compare: compareSum,
        diff: baseSum - compareSum,
        rate: compareSum !== 0 ? ((baseSum - compareSum) / compareSum) * 100 : null,
      };
    },
    enabled: activeTab === 'compare',
  });

  const { data: customersCompare } = useQuery({
    queryKey: ['storeCompare', store.id, 'customers', baseFrom, baseTo, compareFrom, compareTo],
    queryFn: async () => {
      const [base, compare] = await Promise.all([
        getStoreMetrics({
          storeId: store.id,
          metric: 'customers',
          from: baseFrom.toISOString(),
          to: baseTo.toISOString(),
        }),
        getStoreMetrics({
          storeId: store.id,
          metric: 'customers',
          from: compareFrom.toISOString(),
          to: compareTo.toISOString(),
        }),
      ]);
      const baseSum = base.data.reduce((acc, d) => acc + (d.customers || 0), 0);
      const compareSum = compare.data.reduce((acc, d) => acc + (d.customers || 0), 0);
      return {
        base: baseSum,
        compare: compareSum,
        diff: baseSum - compareSum,
        rate: compareSum !== 0 ? ((baseSum - compareSum) / compareSum) * 100 : null,
      };
    },
    enabled: activeTab === 'compare',
  });

  const CompareCard = ({
    metric,
    data,
  }: {
    metric: MetricType;
    data: typeof salesCompare;
  }) => {
    const isPositive = (data?.diff || 0) > 0;
    const isNegative = (data?.diff || 0) < 0;

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-medium text-gray-600 mb-3">{METRIC_LABELS[metric]}</h3>
        {data ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-xs text-blue-600">基準期間</div>
                <div className="text-lg font-bold text-blue-700">
                  {formatMetricValue(data.base, metric)}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-600">比較期間</div>
                <div className="text-lg font-bold text-gray-700">
                  {formatMetricValue(data.compare, metric)}
                </div>
              </div>
            </div>
            <div className={`text-center p-2 rounded-lg ${
              isPositive ? 'bg-green-50' : isNegative ? 'bg-red-50' : 'bg-gray-50'
            }`}>
              <span className={`font-bold ${
                isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-600'
              }`}>
                {isPositive ? '↑' : isNegative ? '↓' : ''}{' '}
                {formatMetricValue(Math.abs(data.diff), metric)}
                {data.rate !== null && ` (${data.rate > 0 ? '+' : ''}${data.rate.toFixed(1)}%)`}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-gray-400">読み込み中...</div>
        )}
      </div>
    );
  };

  // Store decomposition
  const storeDecomposition = salesCompare && customersCompare ? (() => {
    const baseSales = salesCompare.base;
    const compareSales = salesCompare.compare;
    const baseCustomers = customersCompare.base;
    const compareCustomers = customersCompare.compare;

    if (baseCustomers === 0 || compareCustomers === 0) return null;

    const baseUnitPrice = baseSales / baseCustomers;
    const compareUnitPrice = compareSales / compareCustomers;
    const salesDiff = baseSales - compareSales;
    const customersContrib = (baseCustomers - compareCustomers) * compareUnitPrice;
    const unitPriceContrib = (baseUnitPrice - compareUnitPrice) * baseCustomers;

    return {
      salesDiff,
      customersContrib,
      unitPriceContrib,
      baseUnitPrice,
      compareUnitPrice,
      baseCustomers,
      compareCustomers,
    };
  })() : null;

  return (
    <div className="space-y-6">
      {/* Store Info */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <div className={`w-3 h-3 rounded-full ${
            store.status === 'active' ? 'bg-green-500' : 'bg-gray-300'
          }`} />
          <div>
            <div className="font-medium">{store.name}</div>
            <div className="text-sm text-gray-500">
              {store.address} / {store.phone || '電話番号なし'}
            </div>
          </div>
          <div className="ml-auto">
            <span className={`px-2 py-1 text-xs rounded ${
              store.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
            }`}>
              {store.status === 'active' ? '稼働中' : '休止中'}
            </span>
          </div>
        </div>
      </div>

      {activeTab === 'overview' && (
        <>
          <div className="grid grid-cols-3 gap-6">
            <KpiCard metric="sales" summary={salesSummary} />
            <KpiCard metric="customers" summary={customersSummary} />
            <KpiCard metric="incidents_open" summary={incidentsSummary} />
          </div>

          <div className="grid grid-cols-1 gap-6">
            <TimeSeriesChart data={salesData} metric="sales" />
            <TimeSeriesChart data={customersData} metric="customers" />
          </div>
        </>
      )}

      {activeTab === 'compare' && (
        <>
          <PeriodPicker
            baseFrom={baseFrom}
            baseTo={baseTo}
            compareType={compareType}
            compareFrom={compareFrom}
            compareTo={compareTo}
            onBaseChange={onBaseChange}
            onCompareTypeChange={onCompareTypeChange}
            onCompareChange={onCompareChange}
          />

          <div className="grid grid-cols-2 gap-6">
            <CompareCard metric="sales" data={salesCompare} />
            <CompareCard metric="customers" data={customersCompare} />
          </div>
        </>
      )}

      {activeTab === 'decomposition' && (
        <>
          <PeriodPicker
            baseFrom={baseFrom}
            baseTo={baseTo}
            compareType={compareType}
            compareFrom={compareFrom}
            compareTo={compareTo}
            onBaseChange={onBaseChange}
            onCompareTypeChange={onCompareTypeChange}
            onCompareChange={onCompareChange}
          />

          {storeDecomposition ? (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">
                売上要因分解（売上 = 客数 × 単価）
              </h3>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-xs text-blue-600">基準期間売上</div>
                  <div className="text-xl font-bold text-blue-700">
                    {formatMetricValue(salesCompare?.base || 0, 'sales')}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-xs text-gray-600">比較期間売上</div>
                  <div className="text-xl font-bold text-gray-700">
                    {formatMetricValue(salesCompare?.compare || 0, 'sales')}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="text-xs text-gray-500 mb-1">売上差分</div>
                <div className={`text-2xl font-bold ${
                  storeDecomposition.salesDiff >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {storeDecomposition.salesDiff >= 0 ? '+' : ''}
                  {formatMetricValue(storeDecomposition.salesDiff, 'sales')}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="text-xs font-medium text-gray-500 mb-3">要因分解</div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">客数寄与</span>
                      <span className={storeDecomposition.customersContrib >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {storeDecomposition.customersContrib >= 0 ? '+' : ''}
                        {formatMetricValue(storeDecomposition.customersContrib, 'sales')}
                      </span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          storeDecomposition.customersContrib >= 0 ? 'bg-green-400' : 'bg-red-400'
                        }`}
                        style={{
                          width: `${Math.min(
                            Math.abs(storeDecomposition.customersContrib) /
                              Math.max(
                                Math.abs(storeDecomposition.customersContrib),
                                Math.abs(storeDecomposition.unitPriceContrib),
                                1
                              ) *
                              100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">単価寄与</span>
                      <span className={storeDecomposition.unitPriceContrib >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {storeDecomposition.unitPriceContrib >= 0 ? '+' : ''}
                        {formatMetricValue(storeDecomposition.unitPriceContrib, 'sales')}
                      </span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          storeDecomposition.unitPriceContrib >= 0 ? 'bg-green-400' : 'bg-red-400'
                        }`}
                        style={{
                          width: `${Math.min(
                            Math.abs(storeDecomposition.unitPriceContrib) /
                              Math.max(
                                Math.abs(storeDecomposition.customersContrib),
                                Math.abs(storeDecomposition.unitPriceContrib),
                                1
                              ) *
                              100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">基準客数:</span>{' '}
                    <span className="font-medium">{storeDecomposition.baseCustomers.toLocaleString()}人</span>
                  </div>
                  <div>
                    <span className="text-gray-500">比較客数:</span>{' '}
                    <span className="font-medium">{storeDecomposition.compareCustomers.toLocaleString()}人</span>
                  </div>
                  <div>
                    <span className="text-gray-500">基準単価:</span>{' '}
                    <span className="font-medium">{formatMetricValue(storeDecomposition.baseUnitPrice, 'sales')}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">比較単価:</span>{' '}
                    <span className="font-medium">{formatMetricValue(storeDecomposition.compareUnitPrice, 'sales')}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center text-gray-500">
              データを読み込み中...
            </div>
          )}
        </>
      )}
    </div>
  );
}
