'use client';

import { useState, useCallback } from 'react';
import { useDashboardStore } from '@/lib/store';

interface SearchFilterProps {
  minTs: Date | null;
  maxTs: Date | null;
  onDateRangeChange?: (from: Date, to: Date) => void;
}

export function SearchFilter({ minTs, maxTs, onDateRangeChange }: SearchFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    selectedTimestamp,
    setSelectedTimestamp,
    filterPrefecture,
    setFilterPrefecture,
    filterStatus,
    setFilterStatus,
  } = useDashboardStore();

  // 表示期間のローカル状態
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);

  const formatDateForInput = (date: Date | null) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDateTimeForInput = (date: Date | null) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleDateFromChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value ? new Date(e.target.value) : null;
    setDateFrom(newDate);
    if (newDate && dateTo) {
      onDateRangeChange?.(newDate, dateTo);
    }
  }, [dateTo, onDateRangeChange]);

  const handleDateToChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value ? new Date(e.target.value) : null;
    setDateTo(newDate);
    if (dateFrom && newDate) {
      onDateRangeChange?.(dateFrom, newDate);
    }
  }, [dateFrom, onDateRangeChange]);

  const handleTimestampChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value ? new Date(e.target.value) : null;
    if (newDate) {
      setSelectedTimestamp(newDate);
    }
  }, [setSelectedTimestamp]);

  const handlePreset = useCallback((preset: 'today' | 'yesterday' | 'thisWeek' | 'lastWeek' | 'thisMonth' | 'lastMonth') => {
    const now = new Date();
    let from: Date;
    let to: Date;

    switch (preset) {
      case 'today':
        from = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        to = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        break;
      case 'yesterday':
        from = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 0, 0, 0);
        to = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 23, 59, 59);
        break;
      case 'thisWeek':
        const dayOfWeek = now.getDay();
        const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // 月曜を週の開始とする
        from = new Date(now.getFullYear(), now.getMonth(), now.getDate() - diff, 0, 0, 0);
        to = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        break;
      case 'lastWeek':
        const lastWeekDay = now.getDay();
        const lastWeekDiff = lastWeekDay === 0 ? 6 : lastWeekDay - 1;
        from = new Date(now.getFullYear(), now.getMonth(), now.getDate() - lastWeekDiff - 7, 0, 0, 0);
        to = new Date(now.getFullYear(), now.getMonth(), now.getDate() - lastWeekDiff - 1, 23, 59, 59);
        break;
      case 'thisMonth':
        from = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
        to = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
        break;
      case 'lastMonth':
        from = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0);
        to = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
        break;
    }

    setDateFrom(from);
    setDateTo(to);
    // 選択した期間の最後に移動
    setSelectedTimestamp(to);
    onDateRangeChange?.(from, to);
  }, [setSelectedTimestamp, onDateRangeChange]);

  const handleReset = useCallback(() => {
    setDateFrom(null);
    setDateTo(null);
    setFilterPrefecture('');
    setFilterStatus('');
    if (maxTs) {
      setSelectedTimestamp(maxTs);
    }
  }, [maxTs, setSelectedTimestamp, setFilterPrefecture, setFilterStatus]);

  const hasActiveFilters = dateFrom || dateTo || filterPrefecture || filterStatus;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Header - 常に表示 */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors rounded-lg"
      >
        <div className="flex items-center gap-3">
          <svg
            className="w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          <span className="font-medium text-gray-700">検索フィルター</span>
          {hasActiveFilters && (
            <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
              適用中
            </span>
          )}
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expandable Content */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pb-4 space-y-4 border-t border-gray-100">
          {/* 表示期間 */}
          <div className="pt-4">
            <label className="block text-xs font-medium text-gray-500 mb-2">表示期間</label>
            <div className="flex items-center gap-2 mb-3">
              <input
                type="datetime-local"
                value={formatDateTimeForInput(dateFrom)}
                onChange={handleDateFromChange}
                min={minTs ? formatDateTimeForInput(minTs) : undefined}
                max={maxTs ? formatDateTimeForInput(maxTs) : undefined}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="text-gray-400 text-sm">〜</span>
              <input
                type="datetime-local"
                value={formatDateTimeForInput(dateTo)}
                onChange={handleDateToChange}
                min={minTs ? formatDateTimeForInput(minTs) : undefined}
                max={maxTs ? formatDateTimeForInput(maxTs) : undefined}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* プリセットボタン */}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handlePreset('today')}
                className="px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
              >
                今日
              </button>
              <button
                type="button"
                onClick={() => handlePreset('yesterday')}
                className="px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
              >
                昨日
              </button>
              <button
                type="button"
                onClick={() => handlePreset('thisWeek')}
                className="px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
              >
                今週
              </button>
              <button
                type="button"
                onClick={() => handlePreset('lastWeek')}
                className="px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
              >
                先週
              </button>
              <button
                type="button"
                onClick={() => handlePreset('thisMonth')}
                className="px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
              >
                今月
              </button>
              <button
                type="button"
                onClick={() => handlePreset('lastMonth')}
                className="px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
              >
                先月
              </button>
            </div>
          </div>

          {/* 表示時刻（ピンポイント） */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-2">表示時刻</label>
            <input
              type="datetime-local"
              value={formatDateTimeForInput(selectedTimestamp)}
              onChange={handleTimestampChange}
              min={dateFrom ? formatDateTimeForInput(dateFrom) : (minTs ? formatDateTimeForInput(minTs) : undefined)}
              max={dateTo ? formatDateTimeForInput(dateTo) : (maxTs ? formatDateTimeForInput(maxTs) : undefined)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* 都道府県フィルター */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-2">都道府県</label>
            <select
              value={filterPrefecture}
              onChange={(e) => setFilterPrefecture(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="">すべて</option>
              <option value="北海道">北海道</option>
              <option value="青森県">青森県</option>
              <option value="岩手県">岩手県</option>
              <option value="宮城県">宮城県</option>
              <option value="秋田県">秋田県</option>
              <option value="山形県">山形県</option>
              <option value="福島県">福島県</option>
              <option value="茨城県">茨城県</option>
              <option value="栃木県">栃木県</option>
              <option value="群馬県">群馬県</option>
              <option value="埼玉県">埼玉県</option>
              <option value="千葉県">千葉県</option>
              <option value="東京都">東京都</option>
              <option value="神奈川県">神奈川県</option>
              <option value="新潟県">新潟県</option>
              <option value="富山県">富山県</option>
              <option value="石川県">石川県</option>
              <option value="福井県">福井県</option>
              <option value="山梨県">山梨県</option>
              <option value="長野県">長野県</option>
              <option value="岐阜県">岐阜県</option>
              <option value="静岡県">静岡県</option>
              <option value="愛知県">愛知県</option>
              <option value="三重県">三重県</option>
              <option value="滋賀県">滋賀県</option>
              <option value="京都府">京都府</option>
              <option value="大阪府">大阪府</option>
              <option value="兵庫県">兵庫県</option>
              <option value="奈良県">奈良県</option>
              <option value="和歌山県">和歌山県</option>
              <option value="鳥取県">鳥取県</option>
              <option value="島根県">島根県</option>
              <option value="岡山県">岡山県</option>
              <option value="広島県">広島県</option>
              <option value="山口県">山口県</option>
              <option value="徳島県">徳島県</option>
              <option value="香川県">香川県</option>
              <option value="愛媛県">愛媛県</option>
              <option value="高知県">高知県</option>
              <option value="福岡県">福岡県</option>
              <option value="佐賀県">佐賀県</option>
              <option value="長崎県">長崎県</option>
              <option value="熊本県">熊本県</option>
              <option value="大分県">大分県</option>
              <option value="宮崎県">宮崎県</option>
              <option value="鹿児島県">鹿児島県</option>
              <option value="沖縄県">沖縄県</option>
            </select>
          </div>

          {/* ステータスフィルター */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-2">店舗ステータス</label>
            <div className="flex gap-2">
              {[
                { value: '', label: 'すべて' },
                { value: 'active', label: '営業中' },
                { value: 'inactive', label: '休業中' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFilterStatus(option.value)}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    filterStatus === option.value
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* アクションボタン */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleReset}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              リセット
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
