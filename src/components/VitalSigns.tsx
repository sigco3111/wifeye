"use client";

import { useState, useEffect, useMemo } from "react";

interface VitalSignsProps {
  breathingRate: number;
  heartRate: number;
}

function getStatus(
  value: number,
  min: number,
  max: number
): "normal" | "warning" | "critical" {
  if (value >= min && value <= max) return "normal";
  const margin = (max - min) * 0.3;
  if (value >= min - margin && value <= max + margin) return "warning";
  return "critical";
}

function getStatusInfo(status: "normal" | "warning" | "critical") {
  switch (status) {
    case "normal":
      return { label: "정상", color: "text-green-400", bg: "bg-green-500" };
    case "warning":
      return { label: "주의", color: "text-amber-400", bg: "bg-amber-500" };
    case "critical":
      return { label: "위험", color: "text-red-400", bg: "bg-red-500" };
  }
}

function GaugeBar({
  value,
  min,
  max,
  label,
  unit,
}: {
  value: number;
  min: number;
  max: number;
  label: string;
  unit: string;
}) {
  const status = getStatus(value, min, max);
  const statusInfo = getStatusInfo(status);
  const percentage = Math.min(
    100,
    Math.max(0, ((value - (min - 5)) / (max - min + 10)) * 100)
  );

  // Generate mock history data
  const history = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => {
      const variation = (Math.random() - 0.5) * 4;
      return Math.min(max + 5, Math.max(min - 5, value + variation));
    });
  }, [value, min, max]);

  const maxHistory = Math.max(...history);
  const minHistory = Math.min(...history);
  const range = maxHistory - minHistory || 1;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-white">
            {value.toFixed(1)}
          </span>
          <span className="text-xs text-gray-600">{unit}</span>
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded ${statusInfo.color} bg-white/5`}
          >
            {statusInfo.label}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
        {/* Normal range indicator */}
        <div
          className="absolute h-full bg-green-500/10 rounded-full"
          style={{
            left: `${(((min - (min - 5)) / (max - min + 10)) * 100)}%`,
            width: `${(((max - min) / (max - min + 10)) * 100)}%`,
          }}
        />
        <div
          className={`absolute h-full rounded-full transition-all duration-700 ${statusInfo.bg}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Mini chart */}
      <div className="flex items-end gap-[2px] h-10">
        {history.map((v, i) => {
          const h = ((v - minHistory) / range) * 100;
          const s = getStatus(v, min, max);
          const color =
            s === "normal"
              ? "bg-green-500/40"
              : s === "warning"
                ? "bg-amber-500/40"
                : "bg-red-500/40";
          return (
            <div
              key={i}
              className={`flex-1 rounded-t-sm ${color} animate-chart-bar`}
              style={{
                height: `${Math.max(5, h)}%`,
                animationDelay: `${i * 40}ms`,
              }}
            />
          );
        })}
      </div>

      {/* Range labels */}
      <div className="flex justify-between text-[10px] text-gray-600">
        <span>{min} {unit}</span>
        <span className="text-green-500/50">정상 범위</span>
        <span>{max} {unit}</span>
      </div>
    </div>
  );
}

export default function VitalSigns({ breathingRate, heartRate }: VitalSignsProps) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-card p-6">
      <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
        </span>
        생체신호
        <span className="text-[10px] text-gray-600 font-normal ml-auto">
          실시간
        </span>
      </h2>

      <div className="space-y-6">
        {/* Breathing Rate */}
        <GaugeBar
          value={breathingRate}
          min={12}
          max={20}
          label="😊 호흡수"
          unit="bpm"
        />

        <div className="border-t border-white/5" />

        {/* Heart Rate */}
        <GaugeBar
          value={heartRate}
          min={60}
          max={100}
          label="❤️ 심박수"
          unit="bpm"
        />
      </div>

      <p className="text-[10px] text-gray-600 mt-4">
        * 시뮬레이션 데이터입니다. 실제 ESP32-S3 센서 연결 시 정확한 데이터가 표시됩니다.
      </p>
    </div>
  );
}
