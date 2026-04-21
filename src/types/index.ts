export type ActivityState = "sitting" | "walking" | "sleeping" | "standing" | "fallen";

export interface Room {
  id: string;
  name: string;
  sensorId: string | null;
  registeredOccupancy: number;
  monitoringEnabled: boolean;
  inactivityThresholdMinutes: number;
}

export interface RoomState {
  roomId: string;
  roomName: string;
  presence: boolean;
  occupancy: number;
  breathingRate: number;
  heartRate: number;
  activity: ActivityState;
  lastActivityTime: Date;
  lastUpdate: Date;
}

export interface VitalSigns {
  breathingRate: number;
  heartRate: number;
  timestamp: Date;
}

export interface VitalsHistoryPoint {
  time: string;
  breathingRate: number;
  heartRate: number;
}

export type SleepStage = "deep" | "light" | "rem" | "awake";

export interface SleepSession {
  roomId: string;
  startTime: Date;
  endTime: Date | null;
  stages: SleepStagePoint[];
  score: number;
  totalDuration: number;
}

export interface SleepStagePoint {
  stage: SleepStage;
  startTime: Date;
  duration: number;
}

export type EventType =
  | "movement"
  | "presence_change"
  | "vitals_warning"
  | "fall_detected"
  | "intrusion_detected"
  | "anomaly_detected"
  | "inactivity_detected"
  | "entry_exit";

export type AlertSeverity = "info" | "warning" | "critical";

export interface TimelineEvent {
  id: string;
  roomId: string;
  roomName: string;
  type: EventType;
  message: string;
  severity: AlertSeverity;
  timestamp: Date;
}

export interface Alert {
  id: string;
  roomId: string;
  roomName: string;
  type: EventType;
  severity: AlertSeverity;
  message: string;
  timestamp: Date;
  acknowledged: boolean;
}

export interface DetectionResult {
  type: EventType;
  severity: AlertSeverity;
  confidence: number;
  message: string;
  timestamp: Date;
  roomId: string;
}

export type SystemStatus = "normal" | "warning" | "critical";
export type ConnectionStatus = "connected" | "disconnected" | "reconnecting";

export interface SystemInfo {
  status: SystemStatus;
  message: string;
  simulationMode: boolean;
  mqttStatus: ConnectionStatus;
  totalSensors: number;
  monitoredRooms: number;
  todayAlerts: number;
  lastUpdate: Date;
}

export interface MQTTConfig {
  url: string;
  clientId: string;
  autoReconnect: boolean;
  reconnectInterval: number;
}
