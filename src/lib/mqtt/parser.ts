import { TOPIC_PATTERNS } from './topics';

// Minimal local types until @/types are defined
interface CSIData {
  roomId: string;
  timestamp: number;
  amplitude: number[];
  phase: number[];
}

interface RoomStatePartial {
  roomId?: string;
  timestamp?: number;
  signalStrength?: number;
  occupancy?: number;
}

interface VitalsData {
  breathingRate: number;
  heartRate: number;
}

interface ActivityData {
  activity: string;
  occupancy: number;
  presence: boolean;
}

interface AlertData {
  type: string;
  severity: string;
  message: string;
}

function safeJsonParse(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function parseCSIData(raw: string): RoomStatePartial | null {
  const data = safeJsonParse(raw);
  if (data === null || typeof data !== 'object') {
    return null;
  }

  const obj = data as Record<string, unknown>;

  return {
    roomId: typeof obj.roomId === 'string' ? obj.roomId : undefined,
    timestamp: typeof obj.timestamp === 'number' ? obj.timestamp : undefined,
    signalStrength: typeof obj.amplitude === 'number' ? obj.amplitude : undefined,
    occupancy: typeof obj.occupancy === 'number' ? obj.occupancy : undefined,
  };
}

export function parseVitalsData(raw: string): VitalsData | null {
  const data = safeJsonParse(raw);
  if (data === null || typeof data !== 'object') {
    return null;
  }

  const obj = data as Record<string, unknown>;
  const { breathingRate, heartRate } = obj;

  if (typeof breathingRate !== 'number' || typeof heartRate !== 'number') {
    return null;
  }

  return { breathingRate, heartRate };
}

export function parseActivityData(raw: string): ActivityData | null {
  const data = safeJsonParse(raw);
  if (data === null || typeof data !== 'object') {
    return null;
  }

  const obj = data as Record<string, unknown>;
  const { activity, occupancy, presence } = obj;

  if (typeof activity !== 'string' || typeof occupancy !== 'number' || typeof presence !== 'boolean') {
    return null;
  }

  return { activity, occupancy, presence };
}

export function parseAlertData(raw: string): AlertData | null {
  const data = safeJsonParse(raw);
  if (data === null || typeof data !== 'object') {
    return null;
  }

  const obj = data as Record<string, unknown>;
  const { type, severity, message } = obj;

  if (typeof type !== 'string' || typeof severity !== 'string' || typeof message !== 'string') {
    return null;
  }

  return { type, severity, message };
}

export function extractRoomId(topic: string): string | null {
  for (const pattern of Object.values(TOPIC_PATTERNS)) {
    const match = topic.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
}

export type { RoomStatePartial, VitalsData, ActivityData, AlertData, CSIData };
