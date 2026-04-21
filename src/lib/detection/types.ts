import type { EventType, AlertSeverity } from '@/types';

export interface DetectionInput {
  roomId: string;
  roomName: string;
  currentState: {
    presence: boolean;
    occupancy: number;
    activity: string;
    registeredOccupancy: number;
    lastActivityTime: Date;
  };
  currentTime: Date;
  recentEvents: Array<{ type: string; severity: string; timestamp: Date }>;
  activityHistory: Array<{ timestamp: Date; activity: string }>;
}

export interface DetectionOutput {
  detected: boolean;
  type: EventType;
  severity: AlertSeverity;
  confidence: number;
  message: string;
  roomId: string;
}
