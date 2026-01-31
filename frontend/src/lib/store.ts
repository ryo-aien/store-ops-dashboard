import { create } from 'zustand';
import type { Store, MetricType, DisplayMode, ScaleMode } from '@/types';

interface DashboardState {
  selectedMetric: MetricType;
  setSelectedMetric: (metric: MetricType) => void;

  displayMode: DisplayMode;
  setDisplayMode: (mode: DisplayMode) => void;

  scaleMode: ScaleMode;
  setScaleMode: (mode: ScaleMode) => void;

  fixedScaleMin: number;
  fixedScaleMax: number;
  setFixedScale: (min: number, max: number) => void;

  // 表示用タイムスタンプ（スライダー表示・ヘッダー表示用）
  selectedTimestamp: Date | null;
  setSelectedTimestamp: (ts: Date | null | ((prev: Date | null) => Date | null)) => void;

  // データ取得用タイムスタンプ（API呼び出し用、再生中はスロットリングされる）
  dataTimestamp: Date | null;
  setDataTimestamp: (ts: Date | null) => void;

  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;

  playSpeed: number;
  setPlaySpeed: (speed: number) => void;

  selectedStore: Store | null;
  setSelectedStore: (store: Store | null) => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;

  filterPrefecture: string;
  setFilterPrefecture: (prefecture: string) => void;

  filterStatus: string;
  setFilterStatus: (status: string) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  selectedMetric: 'sales',
  setSelectedMetric: (metric) => set({ selectedMetric: metric }),

  displayMode: 'both',
  setDisplayMode: (mode) => set({ displayMode: mode }),

  scaleMode: 'auto',
  setScaleMode: (mode) => set({ scaleMode: mode }),

  fixedScaleMin: 0,
  fixedScaleMax: 5000000,
  setFixedScale: (min, max) => set({ fixedScaleMin: min, fixedScaleMax: max }),

  selectedTimestamp: null,
  setSelectedTimestamp: (ts) => set((state) => ({
    selectedTimestamp: typeof ts === 'function' ? ts(state.selectedTimestamp) : ts
  })),

  dataTimestamp: null,
  setDataTimestamp: (ts) => set({ dataTimestamp: ts }),

  isPlaying: false,
  setIsPlaying: (playing) => set({ isPlaying: playing }),

  playSpeed: 1,
  setPlaySpeed: (speed) => set({ playSpeed: speed }),

  selectedStore: null,
  setSelectedStore: (store) => set({ selectedStore: store }),

  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),

  filterPrefecture: '',
  setFilterPrefecture: (prefecture) => set({ filterPrefecture: prefecture }),

  filterStatus: '',
  setFilterStatus: (status) => set({ filterStatus: status }),
}));
