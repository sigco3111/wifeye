"use client";

import type { TimelineEvent } from "@/lib/sensor-simulator";

interface ActivityTimelineProps {
  events: TimelineEvent[];
}

function getEventIcon(type: string): string {
  switch (type) {
    case "movement":
      return "🚶";
    case "presence_change":
      return "👤";
    case "vitals_warning":
      return "⚠️";
    case "fall_detected":
      return "🆘";
    case "entry_exit":
      return "🚪";
    default:
      return "📌";
  }
}

function getSeverityColor(severity: string): {
  dot: string;
  border: string;
  bg: string;
} {
  switch (severity) {
    case "critical":
      return {
        dot: "bg-red-500",
        border: "border-red-500/20",
        bg: "bg-red-500/5",
      };
    case "warning":
      return {
        dot: "bg-amber-500",
        border: "border-amber-500/20",
        bg: "bg-amber-500/5",
      };
    default:
      return {
        dot: "bg-indigo-500",
        border: "border-white/5",
        bg: "bg-white/[0.02]",
      };
  }
}

function formatTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "방금 전";
  if (diffMin < 60) return `${diffMin}분 전`;

  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}시간 전`;

  return date.toLocaleDateString("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ActivityTimeline({ events }: ActivityTimelineProps) {
  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600 text-sm">
        아직 활동 기록이 없습니다
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {events.map((event, index) => {
        const severityStyle = getSeverityColor(event.severity);
        return (
          <div
            key={event.id}
            className={`flex items-start gap-4 p-3 rounded-xl border ${severityStyle.border} ${severityStyle.bg} animate-slide-in`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Icon + Timeline line */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-lg">{getEventIcon(event.type)}</span>
              {index < events.length - 1 && (
                <div className="w-px h-6 bg-white/5" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs font-medium text-gray-400">
                  {event.roomName}
                </span>
                <span
                  className={`w-1.5 h-1.5 rounded-full ${severityStyle.dot}`}
                />
              </div>
              <p className="text-sm text-gray-300">{event.message}</p>
            </div>

            {/* Time */}
            <span className="text-xs text-gray-600 whitespace-nowrap">
              {formatTime(event.timestamp)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
