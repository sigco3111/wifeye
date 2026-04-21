import type { DetectionInput, DetectionOutput } from './types';

function isNightTime(date: Date): boolean {
  const hour = date.getHours();
  return hour >= 22 || hour < 6;
}

export function analyzeIntrusion(input: DetectionInput): DetectionOutput | null {
  const { occupancy, registeredOccupancy, presence } = input.currentState;

  if (occupancy > registeredOccupancy && presence) {
    const night = isNightTime(input.currentTime);

    return {
      detected: true,
      type: 'intrusion_detected',
      severity: night ? 'critical' : 'warning',
      confidence: night ? 0.85 : 0.6,
      message: `${input.roomName}에서 미등록 인원이 감지되었습니다`,
      roomId: input.roomId,
    };
  }

  return null;
}
