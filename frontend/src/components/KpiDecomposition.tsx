'use client';

import { useQuery } from '@tanstack/react-query';
import { getDecomposition } from '@/lib/api';
import type { DecompositionResult } from '@/types';

interface KpiDecompositionProps {
  baseFrom: Date;
  baseTo: Date;
  compareFrom: Date;
  compareTo: Date;
  groupBy?: 'prefecture' | 'store';
}

const formatCurrency = (value: number | null) => {
  if (value === null) return '-';
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    maximumFractionDigits: 0,
  }).format(value);
};

const formatNumber = (value: number | null) => {
  if (value === null) return '-';
  return new Intl.NumberFormat('ja-JP').format(Math.round(value));
};

export function KpiDecomposition({
  baseFrom,
  baseTo,
  compareFrom,
  compareTo,
  groupBy,
}: KpiDecompositionProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['decomposition', baseFrom, baseTo, compareFrom, compareTo, groupBy],
    queryFn: () =>
      getDecomposition({
        base_from: baseFrom.toISOString(),
        base_to: baseTo.toISOString(),
        compare_from: compareFrom.toISOString(),
        compare_to: compareTo.toISOString(),
        group_by: groupBy,
      }),
    enabled: !!baseFrom && !!baseTo && !!compareFrom && !!compareTo,
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
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

  const ContribBar = ({ value, maxValue, label }: { value: number | null; maxValue: number; label: string }) => {
    if (value === null) return null;

    const percentage = maxValue > 0 ? Math.abs(value) / maxValue * 100 : 0;
    const isPositive = value >= 0;

    return (
      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-600">{label}</span>
          <span className={isPositive ? 'text-green-600' : 'text-red-600'}>
            {isPositive ? '+' : ''}{formatCurrency(value)}
          </span>
        </div>
        <div className="h-4 bg-gray-100 rounded-full overflow-hidden relative">
          <div className="absolute inset-y-0 left-1/2 w-px bg-gray-300" />
          {isPositive ? (
            <div
              className="absolute inset-y-0 left-1/2 bg-green-400 rounded-r"
              style={{ width: `${Math.min(percentage / 2, 50)}%` }}
            />
          ) : (
            <div
              className="absolute inset-y-0 right-1/2 bg-red-400 rounded-l"
              style={{ width: `${Math.min(percentage / 2, 50)}%` }}
            />
          )}
        </div>
      </div>
    );
  };

  const DecompositionCard = ({ result, title }: { result: DecompositionResult; title?: string }) => {
    const maxContrib = Math.max(
      Math.abs(result.customers_contrib || 0),
      Math.abs(result.unit_price_contrib || 0),
      1
    );

    return (
      <div className="bg-gray-50 rounded-lg p-3">
        {title && <div className="text-sm font-medium text-gray-700 mb-3">{title}</div>}

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-xs text-gray-500">基準期間売上</div>
            <div className="text-lg font-bold text-gray-900">{formatCurrency(result.base_sales)}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">比較期間売上</div>
            <div className="text-lg font-bold text-gray-500">{formatCurrency(result.compare_sales)}</div>
          </div>
        </div>

        <div className="mb-4">
          <div className="text-xs text-gray-500 mb-1">売上差分</div>
          <div className={`text-xl font-bold ${(result.sales_diff || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {(result.sales_diff || 0) >= 0 ? '+' : ''}{formatCurrency(result.sales_diff)}
          </div>
        </div>

        <div className="border-t pt-3">
          <div className="text-xs font-medium text-gray-500 mb-2">要因分解</div>
          <ContribBar value={result.customers_contrib} maxValue={maxContrib} label="客数寄与" />
          <ContribBar value={result.unit_price_contrib} maxValue={maxContrib} label="単価寄与" />
        </div>

        <div className="mt-3 pt-3 border-t grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-gray-500">基準客数:</span>{' '}
            <span className="font-medium">{formatNumber(result.base_customers)}人</span>
          </div>
          <div>
            <span className="text-gray-500">比較客数:</span>{' '}
            <span className="font-medium">{formatNumber(result.compare_customers)}人</span>
          </div>
          <div>
            <span className="text-gray-500">基準単価:</span>{' '}
            <span className="font-medium">{formatCurrency(result.base_unit_price)}</span>
          </div>
          <div>
            <span className="text-gray-500">比較単価:</span>{' '}
            <span className="font-medium">{formatCurrency(result.compare_unit_price)}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">
        売上要因分解（売上 = 客数 × 単価）
      </h3>

      <DecompositionCard result={data.total} title="全体" />

      {data.groups && data.groups.length > 0 && (
        <div className="mt-4 border-t pt-4">
          <h4 className="text-xs font-medium text-gray-500 mb-3">
            {data.group_by === 'prefecture' ? '都道府県別' : '店舗別'}上位5件
          </h4>
          <div className="space-y-3">
            {data.groups
              .filter((g) => g.sales_diff !== null)
              .sort((a, b) => Math.abs(b.sales_diff || 0) - Math.abs(a.sales_diff || 0))
              .slice(0, 5)
              .map((group) => (
                <DecompositionCard
                  key={group.group_key}
                  result={group}
                  title={group.group_key || undefined}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
