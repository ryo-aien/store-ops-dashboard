'use client';

import { useEffect, useRef, useCallback, useState, useMemo } from 'react';
import { useDashboardStore } from '@/lib/store';

interface TimeSliderProps {
  minTs: Date | null;
  maxTs: Date | null;
}

export function TimeSlider({ minTs, maxTs }: TimeSliderProps) {
  const {
    selectedTimestamp,
    setSelectedTimestamp,
    isPlaying,
    setIsPlaying,
    playSpeed,
    setPlaySpeed,
  } = useDashboardStore();

  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const sliderRef = useRef<HTMLInputElement>(null);
  const [displayValue, setDisplayValue] = useState(100);
  const [isDragging, setIsDragging] = useState(false);

  const STEP_MS = 6 * 60 * 60 * 1000;
  // 1ステップを何ミリ秒で進めるか（基本速度: 1秒で1ステップ）
  const BASE_STEP_DURATION = 1000;

  const totalSteps = minTs && maxTs
    ? Math.floor((maxTs.getTime() - minTs.getTime()) / STEP_MS)
    : 0;

  const currentStep = selectedTimestamp && minTs
    ? (selectedTimestamp.getTime() - minTs.getTime()) / STEP_MS
    : totalSteps;

  // スライダーの進捗率を計算
  const progressPercent = useMemo(() => {
    if (totalSteps === 0) return 100;
    return (displayValue / totalSteps) * 100;
  }, [displayValue, totalSteps]);

  // 再生中でないとき、外部からのタイムスタンプ変更を反映
  useEffect(() => {
    if (!isDragging && !isPlaying) {
      setDisplayValue(currentStep);
    }
  }, [currentStep, isDragging, isPlaying]);

  // スライダーの背景グラデーションを更新
  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.style.setProperty('--slider-progress', `${progressPercent}%`);
    }
  }, [progressPercent]);

  const handleSliderChange = useCallback(
    (value: number) => {
      if (!minTs) return;
      setDisplayValue(value);

      // デバウンスで状態更新を遅延（滑らかな操作感のため）
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        const newTs = new Date(minTs.getTime() + value * STEP_MS);
        setSelectedTimestamp(newTs);
      }, 16);
    },
    [minTs, setSelectedTimestamp, STEP_MS]
  );

  const handleSliderStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleSliderEnd = useCallback(() => {
    setIsDragging(false);
    if (minTs && debounceRef.current) {
      clearTimeout(debounceRef.current);
      const newTs = new Date(minTs.getTime() + displayValue * STEP_MS);
      setSelectedTimestamp(newTs);
    }
  }, [minTs, displayValue, setSelectedTimestamp, STEP_MS]);

  const handleNowClick = useCallback(() => {
    if (maxTs) {
      setSelectedTimestamp(maxTs);
      setDisplayValue(totalSteps);
    }
  }, [maxTs, setSelectedTimestamp, totalSteps]);

  // requestAnimationFrameを使用したスムーズなアニメーション
  useEffect(() => {
    if (isPlaying && minTs && maxTs) {
      lastTimeRef.current = null;

      const animate = (timestamp: number) => {
        if (lastTimeRef.current === null) {
          lastTimeRef.current = timestamp;
        }

        const deltaTime = timestamp - lastTimeRef.current;
        lastTimeRef.current = timestamp;

        // 経過時間に基づいてスライダー値を更新
        const stepDuration = BASE_STEP_DURATION / playSpeed;
        const stepIncrement = deltaTime / stepDuration;

        setDisplayValue((prev) => {
          const newValue = prev + stepIncrement;

          if (newValue >= totalSteps) {
            setIsPlaying(false);
            setSelectedTimestamp(maxTs);
            return totalSteps;
          }

          // タイムスタンプを更新（キャッシュ済みデータから表示するのでAPIは呼ばれない）
          const newTs = new Date(minTs.getTime() + Math.floor(newValue) * STEP_MS);
          setSelectedTimestamp(newTs);

          return newValue;
        });

        animationRef.current = requestAnimationFrame(animate);
      };

      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      lastTimeRef.current = null;
    };
  }, [isPlaying, playSpeed, minTs, maxTs, totalSteps, setSelectedTimestamp, setIsPlaying, STEP_MS]);

  const togglePlay = () => {
    if (selectedTimestamp && maxTs && selectedTimestamp >= maxTs) {
      if (minTs) setSelectedTimestamp(minTs);
    }
    setIsPlaying(!isPlaying);
  };

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0.1 && value <= 10) {
      setPlaySpeed(value);
    }
  };

  if (!minTs || !maxTs) {
    return (
      <div className="text-sm text-gray-500">
        時系列データがありません
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      {/* Play Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={togglePlay}
          className={`p-2 rounded-lg transition-colors ${
            isPlaying
              ? 'bg-amber-500 hover:bg-amber-600 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
          title={isPlaying ? '一時停止' : '再生'}
        >
          {isPlaying ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-2 py-1">
          <input
            type="number"
            min={0.1}
            max={10}
            step={0.1}
            value={playSpeed}
            onChange={handleSpeedChange}
            className="w-12 text-xs font-mono font-medium text-center text-gray-700 bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <span className="text-xs font-medium text-gray-500">x</span>
        </div>
      </div>

      {/* Slider */}
      <div className="flex-1 flex items-center gap-3">
        <span className="text-xs font-mono text-gray-500 whitespace-nowrap">
          {minTs.toLocaleString('ja-JP', {
            timeZone: 'Asia/Tokyo',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>

        <input
          ref={sliderRef}
          type="range"
          min={0}
          max={totalSteps}
          step="any"
          value={displayValue}
          onChange={(e) => handleSliderChange(parseFloat(e.target.value))}
          onMouseDown={handleSliderStart}
          onMouseUp={handleSliderEnd}
          onTouchStart={handleSliderStart}
          onTouchEnd={handleSliderEnd}
          className="flex-1 custom-slider"
        />

        <span className="text-xs font-mono text-gray-500 whitespace-nowrap">
          {maxTs.toLocaleString('ja-JP', {
            timeZone: 'Asia/Tokyo',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>

      {/* Now Button */}
      <button
        onClick={handleNowClick}
        className="px-3 py-1.5 text-sm font-medium rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors flex items-center gap-1.5"
      >
        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
        最新
      </button>
    </div>
  );
}
