import type { ActivityState, RoomState, SleepStage, VitalsHistoryPoint } from "@/types";

interface RangeConfig {
  min: number;
  max: number;
  step: number;
}

const BREATHING_RANGES: Record<ActivityState, RangeConfig> = {
  sitting: { min: 12, max: 20, step: 0.3 },
  walking: { min: 16, max: 24, step: 0.5 },
  sleeping: { min: 10, max: 14, step: 0.2 },
  standing: { min: 12, max: 18, step: 0.3 },
  fallen: { min: 10, max: 25, step: 1.0 },
};

const HEART_RATE_RANGES: Record<ActivityState, RangeConfig> = {
  sitting: { min: 60, max: 80, step: 1 },
  walking: { min: 80, max: 110, step: 2 },
  sleeping: { min: 50, max: 65, step: 0.5 },
  standing: { min: 65, max: 90, step: 1 },
  fallen: { min: 50, max: 120, step: 3 },
};

function randomWalk(current: number, config: RangeConfig): number {
  const delta = (Math.random() - 0.5) * 2 * config.step;
  return Math.min(config.max, Math.max(config.min, current + delta));
}

export function generateBreathingRate(
  current: number,
  activity: ActivityState,
): number {
  const config = BREATHING_RANGES[activity];
  return randomWalk(current, config);
}

export function generateHeartRate(
  current: number,
  activity: ActivityState,
): number {
  const config = HEART_RATE_RANGES[activity];
  return randomWalk(current, config);
}

export function generateSleepStage(elapsedMinutes: number): SleepStage {
  const cyclePosition = elapsedMinutes % 90;

  // Add random variation of +/- 3 minutes
  const variation = (Math.random() - 0.5) * 6;
  const adjusted = Math.max(0, Math.min(89, cyclePosition + variation));

  if (adjusted < 10) return "light";
  if (adjusted < 30) return "deep";
  if (adjusted < 50) return "rem";
  if (adjusted < 70) return "light";
  return "deep";
}

export function generateVitalsPoint(
  roomId: string,
  currentState: RoomState,
): VitalsHistoryPoint {
  const now = new Date();
  const time = now.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return {
    time,
    breathingRate: generateBreathingRate(
      currentState.breathingRate,
      currentState.activity,
    ),
    heartRate: generateHeartRate(
      currentState.heartRate,
      currentState.activity,
    ),
  };
}

export function getInitialBreathingRate(activity: ActivityState): number {
  const config = BREATHING_RANGES[activity];
  const mid = (config.min + config.max) / 2;
  return mid + (Math.random() - 0.5) * (config.max - config.min) * 0.3;
}

export function getInitialHeartRate(activity: ActivityState): number {
  const config = HEART_RATE_RANGES[activity];
  const mid = (config.min + config.max) / 2;
  return mid + (Math.random() - 0.5) * (config.max - config.min) * 0.3;
}
