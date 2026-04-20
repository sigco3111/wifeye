"use client";

import { useState, useEffect } from "react";

interface AlertBannerProps {
  status: "normal" | "warning" | "critical";
  message: string;
}

const statusConfig = {
  normal: {
    bg: "bg-green-500/10 border-green-500/20",
    text: "text-green-400",
    dot: "bg-green-500",
    icon: "✅",
  },
  warning: {
    bg: "bg-amber-500/10 border-amber-500/20",
    text: "text-amber-400",
    dot: "bg-amber-500",
    icon: "⚠️",
  },
  critical: {
    bg: "bg-red-500/10 border-red-500/20",
    text: "text-red-400",
    dot: "bg-red-500",
    icon: "🚨",
  },
};

const rotatingMessages = [
  { status: "normal" as const, message: "모든 센서 정상 작동 중" },
  { status: "normal" as const, message: "WiFi 신호 안정적 — CSI 데이터 수집 중" },
  { status: "normal" as const, message: "ESP32-S3 펌웨어 최신 버전" },
  { status: "normal" as const, message: "로컬 데이터 처리 활성화 — 프라이버시 보호 중" },
  { status: "normal" as const, message: "실시간 모니터링 활성" },
];

export default function AlertBanner({ status, message }: AlertBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // If the status is warning/critical, show the actual alert. Otherwise cycle info messages.
  const isAlert = status !== "normal";
  const displayConfig = statusConfig[isAlert ? status : "normal"];
  const displayMessage = isAlert ? message : rotatingMessages[currentIndex].message;

  useEffect(() => {
    if (!isAlert) {
      const interval = setInterval(() => {
        setIsVisible(false);
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % rotatingMessages.length);
          setIsVisible(true);
        }, 300);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isAlert]);

  return (
    <div
      className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl border ${displayConfig.bg} ${
        isAlert ? "animate-glow" : ""
      }`}
    >
      <span className="text-lg">{displayConfig.icon}</span>
      <span className="relative flex h-2.5 w-2.5">
        {isAlert && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full ${displayConfig.dot} opacity-75`}
          />
        )}
        <span
          className={`relative inline-flex rounded-full h-2.5 w-2.5 ${displayConfig.dot}`}
        />
      </span>
      <p
        className={`text-sm font-medium ${displayConfig.text} transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        {displayMessage}
      </p>
      {isAlert && (
        <span className="ml-auto text-xs text-gray-500">
          {new Date().toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      )}
    </div>
  );
}
