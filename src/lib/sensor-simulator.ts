// ============================================================
// WifeEye Sensor Data Simulator
// Generates realistic mock data for demonstration purposes.
// ============================================================

export type ActivityState =
  | "sitting"
  | "walking"
  | "sleeping"
  | "standing"
  | "fallen";

export type EventType =
  | "movement"
  | "presence_change"
  | "vitals_warning"
  | "fall_detected"
  | "entry_exit";

export interface RoomState {
  id: string;
  name: string;
  presence: boolean;
  occupancy: number;
  breathingRate: number;
  heartRate: number;
  activity: ActivityState;
  lastUpdate: Date;
}

export interface TimelineEvent {
  id: string;
  roomId: string;
  roomName: string;
  type: EventType;
  message: string;
  severity: "info" | "warning" | "critical";
  timestamp: Date;
}

// Room definitions
const ROOMS = [
  { id: "living", name: "거실" },
  { id: "bedroom", name: "침실" },
  { id: "kitchen", name: "주방" },
  { id: "bathroom", name: "화장실" },
];

const ACTIVITIES: ActivityState[] = [
  "sitting",
  "walking",
  "sleeping",
  "standing",
  "fallen",
];

const EVENT_TEMPLATES: Record<
  EventType,
  { message: string; severity: "info" | "warning" | "critical" }
> = {
  movement: { message: "움직임이 감지되었습니다", severity: "info" },
  presence_change: { message: "사람이 {action}했습니다", severity: "info" },
  vitals_warning: {
    message: "생체신호 {type} 이상 감지",
    severity: "warning",
  },
  fall_detected: { message: "낙상이 감지되었습니다!", severity: "critical" },
  entry_exit: { message: "{action}이 감지되었습니다", severity: "info" },
};

// Persistent state
let roomStates: Map<string, RoomState> = new Map();
let eventHistory: TimelineEvent[] = [];
let eventIdCounter = 0;

// Initialize room states
function initRooms(): void {
  ROOMS.forEach((room) => {
    if (!roomStates.has(room.id)) {
      const isOccupied = room.id === "living" || room.id === "bedroom";
      roomStates.set(room.id, {
        id: room.id,
        name: room.name,
        presence: isOccupied,
        occupancy: isOccupied ? Math.floor(Math.random() * 2) + 1 : 0,
        breathingRate: isOccupied
          ? 14 + Math.random() * 6
          : 0,
        heartRate: isOccupied
          ? 65 + Math.random() * 30
          : 0,
        activity: isOccupied
          ? (["sitting", "sleeping"] as ActivityState[])[Math.floor(Math.random() * 2)]
          : ("standing" as ActivityState),
        lastUpdate: new Date(),
      });
    }
  });

  // Generate initial events if empty
  if (eventHistory.length === 0) {
    generateInitialEvents();
  }
}

function generateInitialEvents(): void {
  const now = new Date();
  const initialEvents: Array<{
    minutesAgo: number;
    roomId: string;
    type: EventType;
    message: string;
    severity: "info" | "warning" | "critical";
  }> = [
    { minutesAgo: 45, roomId: "living", type: "entry_exit", message: "거실에서 출입이 감지되었습니다", severity: "info" },
    { minutesAgo: 38, roomId: "bedroom", type: "movement", message: "침실에서 움직임이 감지되었습니다", severity: "info" },
    { minutesAgo: 30, roomId: "kitchen", type: "presence_change", message: "주방에 사람이 들어왔습니다", severity: "info" },
    { minutesAgo: 25, roomId: "living", type: "vitals_warning", message: "호흡수 정상 범위 복귀", severity: "info" },
    { minutesAgo: 20, roomId: "kitchen", type: "entry_exit", message: "주방에서 퇴실이 감지되었습니다", severity: "info" },
    { minutesAgo: 15, roomId: "bedroom", type: "movement", message: "침실에서 미세한 움직임이 감지되었습니다", severity: "info" },
    { minutesAgo: 10, roomId: "living", type: "vitals_warning", message: "심박수 약간 높음 감지 (92bpm)", severity: "warning" },
    { minutesAgo: 5, roomId: "bathroom", type: "presence_change", message: "화장실에 사람이 들어왔습니다", severity: "info" },
    { minutesAgo: 2, roomId: "living", type: "movement", message: "거실에서 걷기가 감지되었습니다", severity: "info" },
    { minutesAgo: 1, roomId: "bedroom", type: "movement", message: "침실에서 수면 중 미세호흡 감지", severity: "info" },
  ];

  initialEvents.forEach((e) => {
    const room = ROOMS.find((r) => r.id === e.roomId);
    eventHistory.push({
      id: `event-${eventIdCounter++}`,
      roomId: e.roomId,
      roomName: room?.name ?? e.roomId,
      type: e.type,
      message: e.message,
      severity: e.severity,
      timestamp: new Date(now.getTime() - e.minutesAgo * 60 * 1000),
    });
  });
}

// Smooth random walk for vital signs
function randomWalk(current: number, min: number, max: number, step: number): number {
  const delta = (Math.random() - 0.5) * 2 * step;
  return Math.min(max, Math.max(min, current + delta));
}

// Update all room states with small variations
export function updateSensorData(): void {
  initRooms();

  roomStates.forEach((state) => {
    if (state.presence) {
      // Update vitals with smooth random walk
      state.breathingRate = Math.round(
        randomWalk(state.breathingRate, 12, 20, 0.5) * 10
      ) / 10;
      state.heartRate = Math.round(
        randomWalk(state.heartRate, 60, 100, 1)
      );

      // Occasionally change activity
      if (Math.random() < 0.02) {
        const idx = Math.floor(Math.random() * ACTIVITIES.length);
        state.activity = ACTIVITIES[idx];
      }
    } else {
      state.breathingRate = 0;
      state.heartRate = 0;
      state.occupancy = 0;
    }

    // Occasionally toggle presence
    if (Math.random() < 0.005) {
      state.presence = !state.presence;
      if (state.presence) {
        state.occupancy = Math.floor(Math.random() * 2) + 1;
        state.breathingRate = 14 + Math.random() * 6;
        state.heartRate = 65 + Math.random() * 30;
        state.activity = "standing";
      } else {
        state.occupancy = 0;
        state.breathingRate = 0;
        state.heartRate = 0;
      }
    }

    state.lastUpdate = new Date();
  });
}

// Getters
export function getRoomStates(): RoomState[] {
  initRooms();
  return Array.from(roomStates.values());
}

export function getRoomState(roomId: string): RoomState | undefined {
  initRooms();
  return roomStates.get(roomId);
}

export function getRoomList(): Array<{ id: string; name: string }> {
  return ROOMS;
}

export function getRecentEvents(count: number = 10): TimelineEvent[] {
  initRooms();
  return eventHistory.slice(-count).reverse();
}

export function getAllEvents(): TimelineEvent[] {
  initRooms();
  return eventHistory;
}

export function getSystemStatus(): {
  status: "normal" | "warning" | "critical";
  message: string;
} {
  initRooms();
  const hasCritical = eventHistory.some(
    (e) =>
      e.severity === "critical" &&
      new Date().getTime() - e.timestamp.getTime() < 5 * 60 * 1000
  );
  const hasWarning = eventHistory.some(
    (e) =>
      e.severity === "warning" &&
      new Date().getTime() - e.timestamp.getTime() < 10 * 60 * 1000
  );

  if (hasCritical) {
    return { status: "critical", message: "⚠️ 주의: 낙상 감지 이벤트가 있습니다" };
  }
  if (hasWarning) {
    return { status: "warning", message: "생체신호 이상 경고가 있습니다" };
  }
  return { status: "normal", message: "✅ 모든 센서 정상 작동 중" };
}

export function getStats(): {
  totalSensors: number;
  monitoredRooms: number;
  todayAlerts: number;
  lastUpdate: Date;
} {
  initRooms();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  return {
    totalSensors: ROOMS.length,
    monitoredRooms: Array.from(roomStates.values()).filter(
      (r) => r.presence
    ).length,
    todayAlerts: eventHistory.filter(
      (e) => e.timestamp >= todayStart && e.severity !== "info"
    ).length,
    lastUpdate: new Date(),
  };
}
