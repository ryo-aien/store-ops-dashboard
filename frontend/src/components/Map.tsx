'use client';

import { useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
import 'leaflet.heat';

import type { Store, MetricPoint } from '@/types';
import { useDashboardStore } from '@/lib/store';
import { getColorForValue, HEAT_GRADIENT } from '@/lib/colors';

interface MapContentProps {
  stores: Store[];
  metrics: MetricPoint[];
}

function MapContent({ stores, metrics }: MapContentProps) {
  const map = useMap();
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null);
  const heatLayerRef = useRef<L.HeatLayer | null>(null);

  const {
    displayMode,
    scaleMode,
    fixedScaleMin,
    fixedScaleMax,
    setSelectedStore,
  } = useDashboardStore();

  const getMinMax = useCallback(() => {
    if (!metrics || metrics.length === 0) {
      return { minValue: 0, maxValue: 1 };
    }
    const values = metrics
      .map((p) => p.value)
      .filter((v): v is number => v !== null);
    if (values.length === 0) return { minValue: 0, maxValue: 1 };
    return {
      minValue: scaleMode === 'fixed' ? fixedScaleMin : Math.min(...values),
      maxValue: scaleMode === 'fixed' ? fixedScaleMax : Math.max(...values),
    };
  }, [metrics, scaleMode, fixedScaleMin, fixedScaleMax]);

  useEffect(() => {
    if (clusterRef.current) {
      map.removeLayer(clusterRef.current);
      clusterRef.current = null;
    }
    if (heatLayerRef.current) {
      map.removeLayer(heatLayerRef.current);
      heatLayerRef.current = null;
    }

    const { minValue, maxValue } = getMinMax();

    const metricMap = new Map<string, MetricPoint>();
    if (metrics && metrics.length > 0) {
      metrics.forEach((p) => metricMap.set(p.store_id, p));
    }

    if ((displayMode === 'pins' || displayMode === 'both') && stores && stores.length > 0) {
      const cluster = L.markerClusterGroup({
        maxClusterRadius: 50,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        disableClusteringAtZoom: 15,
      });

      stores.forEach((store) => {
        const metricPoint = metricMap.get(store.id);
        const value = metricPoint?.value ?? null;
        const color =
          value !== null
            ? getColorForValue(value, minValue, maxValue)
            : '#9ca3af';

        const icon = L.divIcon({
          className: 'store-marker-wrapper',
          html: `
            <div class="store-marker" style="background: ${color};">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
                <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const marker = L.marker([store.lat, store.lng], { icon });
        marker.bindTooltip(
          `<div style="font-weight: 600;">${store.name}</div>
           <div style="font-size: 11px; color: #6b7280;">${store.prefecture} | ${store.store_code}</div>`,
          {
            direction: 'top',
            offset: [0, -14],
          }
        );
        marker.on('click', () => {
          setSelectedStore({ ...store });
        });

        cluster.addLayer(marker);
      });

      map.addLayer(cluster);
      clusterRef.current = cluster;
    }

    if ((displayMode === 'heat' || displayMode === 'both') && metrics && metrics.length > 0) {
      const heatData: [number, number, number][] = metrics
        .filter((p) => p.value !== null)
        .map((p) => {
          const intensity =
            maxValue === minValue
              ? 0.5
              : (p.value! - minValue) / (maxValue - minValue);
          return [p.lat, p.lng, Math.max(0.1, intensity)];
        });

      if (heatData.length > 0) {
        const heatLayer = (L as any).heatLayer(heatData, {
          radius: 35,
          blur: 25,
          maxZoom: 10,
          max: 1.0,
          gradient: HEAT_GRADIENT,
        });

        map.addLayer(heatLayer);
        heatLayerRef.current = heatLayer;
      }
    }

    return () => {
      if (clusterRef.current) {
        map.removeLayer(clusterRef.current);
        clusterRef.current = null;
      }
      if (heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current);
        heatLayerRef.current = null;
      }
    };
  }, [stores, metrics, displayMode, getMinMax, map, setSelectedStore]);

  return null;
}

// Leafletアイコン設定を一度だけ実行
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  });
}

interface MapProps {
  stores?: Store[];
  metrics?: MetricPoint[];
}

function MapWrapper({ stores = [], metrics = [] }: MapProps) {
  const defaultCenter: [number, number] = [36.5, 138.0];
  const defaultZoom = 6;

  return (
    <MapContainer
      center={defaultCenter}
      zoom={defaultZoom}
      className="w-full h-full"
      style={{ background: '#f1f5f9' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapContent stores={stores} metrics={metrics} />
    </MapContainer>
  );
}

export default MapWrapper;
