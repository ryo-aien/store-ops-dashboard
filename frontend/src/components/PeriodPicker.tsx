'use client';

import { useCallback } from 'react';
import type { CompareType } from '@/types';

interface PeriodPickerProps {
  baseFrom: Date;
  baseTo: Date;
  compareType: CompareType;
  compareFrom: Date;
  compareTo: Date;
  onBaseChange: (from: Date, to: Date) => void;
  onCompareTypeChange: (type: CompareType) => void;
  onCompareChange: (from: Date, to: Date) => void;
}

export function PeriodPicker({
  baseFrom,
  baseTo,
  compareType,
  compareFrom,
  compareTo,
  onBaseChange,
  onCompareTypeChange,
  onCompareChange,
}: PeriodPickerProps) {
  const formatDateForInput = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleBaseFromChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newFrom = new Date(e.target.value);
      onBaseChange(newFrom, baseTo);
    },
    [baseTo, onBaseChange]
  );

  const handleBaseToChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newTo = new Date(e.target.value);
      onBaseChange(baseFrom, newTo);
    },
    [baseFrom, onBaseChange]
  );

  const handleCompareTypeChange = useCallback(
    (type: CompareType) => {
      onCompareTypeChange(type);
      if (type === 'yoy') {
        const newFrom = new Date(baseFrom);
        newFrom.setFullYear(newFrom.getFullYear() - 1);
        const newTo = new Date(baseTo);
        newTo.setFullYear(newTo.getFullYear() - 1);
        onCompareChange(newFrom, newTo);
      } else if (type === 'mom') {
        const newFrom = new Date(baseFrom);
        newFrom.setMonth(newFrom.getMonth() - 1);
        const newTo = new Date(baseTo);
        newTo.setMonth(newTo.getMonth() - 1);
        onCompareChange(newFrom, newTo);
      }
    },
    [baseFrom, baseTo, onCompareTypeChange, onCompareChange]
  );

  const handlePreset = useCallback(
    (preset: 'thisMonth' | 'lastMonth' | 'lastYearSameMonth') => {
      const now = new Date();
      let from: Date;
      let to: Date;

      if (preset === 'thisMonth') {
        from = new Date(now.getFullYear(), now.getMonth(), 1);
        to = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      } else if (preset === 'lastMonth') {
        from = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        to = new Date(now.getFullYear(), now.getMonth(), 0);
      } else {
        // 前年同月
        from = new Date(now.getFullYear() - 1, now.getMonth(), 1);
        to = new Date(now.getFullYear() - 1, now.getMonth() + 1, 0);
      }

      onBaseChange(from, to);
    },
    [onBaseChange]
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">期間設定</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">基準期間</label>
          <div className="flex items-center gap-2 mb-2">
            <input
              type="date"
              value={formatDateForInput(baseFrom)}
              onChange={handleBaseFromChange}
              className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-gray-400">〜</span>
            <input
              type="date"
              value={formatDateForInput(baseTo)}
              onChange={handleBaseToChange}
              className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handlePreset('thisMonth')}
              className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
            >
              今月
            </button>
            <button
              type="button"
              onClick={() => handlePreset('lastMonth')}
              className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
            >
              前月
            </button>
            <button
              type="button"
              onClick={() => handlePreset('lastYearSameMonth')}
              className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
            >
              前年同月
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">比較タイプ</label>
          <div className="flex gap-2">
            {[
              { value: 'yoy' as CompareType, label: '前年同期' },
              { value: 'mom' as CompareType, label: '前月同期' },
              { value: 'custom' as CompareType, label: 'カスタム' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => handleCompareTypeChange(option.value)}
                className={`flex-1 px-3 py-1.5 text-sm rounded-md transition-colors ${
                  compareType === option.value
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {compareType === 'custom' && (
          <div>
            <label className="block text-xs text-gray-500 mb-1">比較期間</label>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={formatDateForInput(compareFrom)}
                onChange={(e) => onCompareChange(new Date(e.target.value), compareTo)}
                className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-400">〜</span>
              <input
                type="date"
                value={formatDateForInput(compareTo)}
                onChange={(e) => onCompareChange(compareFrom, new Date(e.target.value))}
                className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {compareType !== 'custom' && (
          <div className="text-xs text-gray-500">
            比較期間: {formatDateForInput(compareFrom)} 〜 {formatDateForInput(compareTo)}
          </div>
        )}
      </div>
    </div>
  );
}
