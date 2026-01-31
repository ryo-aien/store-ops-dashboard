// Rain radar style color gradient (blue -> green -> yellow -> orange -> red)
export const HEAT_GRADIENT = {
  0.0: '#3288bd',  // blue
  0.2: '#66c2a5',  // teal
  0.4: '#abdda4',  // light green
  0.5: '#e6f598',  // yellow-green
  0.6: '#fee08b',  // yellow
  0.7: '#fdae61',  // orange
  0.8: '#f46d43',  // red-orange
  1.0: '#d53e4f',  // red
};

export const HEAT_COLORS = [
  { value: 0.0, color: '#3288bd', label: '低' },
  { value: 0.2, color: '#66c2a5', label: '' },
  { value: 0.4, color: '#abdda4', label: '' },
  { value: 0.5, color: '#e6f598', label: '中' },
  { value: 0.6, color: '#fee08b', label: '' },
  { value: 0.7, color: '#fdae61', label: '' },
  { value: 0.8, color: '#f46d43', label: '' },
  { value: 1.0, color: '#d53e4f', label: '高' },
];

export function getColorForValue(value: number, min: number, max: number): string {
  const ratio = max === min ? 0.5 : (value - min) / (max - min);
  const clampedRatio = Math.max(0, Math.min(1, ratio));

  const colors = Object.entries(HEAT_GRADIENT).map(([k, v]) => ({
    stop: parseFloat(k),
    color: v,
  })).sort((a, b) => a.stop - b.stop);

  let lowerColor = colors[0];
  let upperColor = colors[colors.length - 1];

  for (let i = 0; i < colors.length - 1; i++) {
    if (clampedRatio >= colors[i].stop && clampedRatio <= colors[i + 1].stop) {
      lowerColor = colors[i];
      upperColor = colors[i + 1];
      break;
    }
  }

  const range = upperColor.stop - lowerColor.stop;
  const t = range === 0 ? 0 : (clampedRatio - lowerColor.stop) / range;

  return interpolateColor(lowerColor.color, upperColor.color, t);
}

function interpolateColor(color1: string, color2: string, t: number): string {
  const r1 = parseInt(color1.slice(1, 3), 16);
  const g1 = parseInt(color1.slice(3, 5), 16);
  const b1 = parseInt(color1.slice(5, 7), 16);

  const r2 = parseInt(color2.slice(1, 3), 16);
  const g2 = parseInt(color2.slice(3, 5), 16);
  const b2 = parseInt(color2.slice(5, 7), 16);

  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export function formatMetricValue(value: number | null, metric: string): string {
  if (value === null) return '-';

  if (metric === 'sales') {
    if (value >= 1000000) {
      return `¥${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `¥${(value / 1000).toFixed(0)}K`;
    }
    return `¥${value.toFixed(0)}`;
  }

  if (metric === 'customers') {
    return `${value.toLocaleString()}人`;
  }

  if (metric === 'incidents_open') {
    return `${value}件`;
  }

  return value.toString();
}

export const METRIC_LABELS: Record<string, string> = {
  sales: '売上',
  customers: '来客数',
  incidents_open: 'インシデント数',
};

// KPIの良し悪し判定: 'positive' = 増加が良い, 'negative' = 減少が良い
export const METRIC_POLARITY: Record<string, 'positive' | 'negative'> = {
  sales: 'positive',
  customers: 'positive',
  incidents_open: 'negative',
};

// 変化が良い変化かどうかを判定
export function isGoodChange(metric: string, change: number): boolean | null {
  if (change === 0) return null;
  const polarity = METRIC_POLARITY[metric] || 'positive';
  if (polarity === 'positive') {
    return change > 0;
  } else {
    return change < 0;
  }
}
