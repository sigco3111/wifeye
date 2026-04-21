import type { EventType, AlertSeverity, ActivityState } from '@/types';

export interface InactivityInput {
  roomId: string;
  roomName: string;
  lastActivityTime: Date;
  currentTime: Date;
  activity: ActivityState;
  thresholdMinutes: number;
}

export interface InactivityOutput {
  type: EventType;
  severity: AlertSeverity;
  confidence: number;
  message: string;
  timestamp: Date;
  roomId: string;
  roomName: string;
}

export function analyzeInactivity(input: InactivityInput): InactivityOutput | null {
  if (input.activity === 'sleeping') {
    return null;
  }

  const diffMs = input.currentTime.getTime() - input.lastActivityTime.getTime();
  const minutes = diffMs / (1000 * 60);

  if (minutes < input.thresholdMinutes * 0.5) {
    return null;
  }

  const minutesRounded = Math.round(minutes);

  if (minutes >= input.thresholdMinutes) {
    const confidence = Math.min(0.99, 0.85 + (minutes / input.thresholdMinutes) * 0.1);
    return {
      type: 'inactivity_detected',
      severity: 'critical',
      confidence,
      message: `${input.roomName}에서 ${minutesRounded}분간 활동이 없습니다. 즉시 확인이 필요합니다`,
      timestamp: input.currentTime,
      roomId: input.roomId,
      roomName: input.roomName,
    };
  }

  const confidence = Math.min(0.9, 0.6 + (minutes / input.thresholdMinutes) * 0.3);
  return {
    type: 'inactivity_detected',
    severity: 'warning',
    confidence,
    message: `${input.roomName}에서 ${minutesRounded}분간 활동이 감지되지 않았습니다`,
    timestamp: input.currentTime,
    roomId: input.roomId,
    roomName: input.roomName,
  };
}
