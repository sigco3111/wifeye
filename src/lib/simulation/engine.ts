import type { ActivityState, EventType } from "@/types";
import { useSensorStore } from "@/stores/sensor-store";
import {
  generateVitalsPoint,
  getInitialBreathingRate,
  getInitialHeartRate,
} from "./vitals-generator";

const DEFAULT_ROOMS: Array<{ id: string; name: string }> = [
  { id: "living-room", name: "거실" },
  { id: "bedroom", name: "침실" },
  { id: "kitchen", name: "주방" },
  { id: "bathroom", name: "화장실" },
];

const ACTIVITIES: ActivityState[] = [
  "sitting",
  "walking",
  "sleeping",
  "standing",
];

const EVENT_TYPES: EventType[] = [
  "movement",
  "presence_change",
  "entry_exit",
];

export class SimulationEngine {
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private tickCount = 0;

  start(intervalMs = 2000): void {
    if (this.intervalId !== null) return;
    this.ensureDefaultRooms();
    this.intervalId = setInterval(() => this.tick(), intervalMs);
  }

  stop(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  isRunning(): boolean {
    return this.intervalId !== null;
  }

  getTickCount(): number {
    return this.tickCount;
  }

  tick(): void {
    this.tickCount += 1;
    const store = useSensorStore.getState();
    const rooms = store.rooms;

    if (rooms.size === 0) {
      this.ensureDefaultRooms();
      return;
    }

    rooms.forEach((roomState, roomId) => {
      const updatedActivity = this.maybeChangeActivity(roomState.activity);
      const updatedPresence = this.maybeTogglePresence(roomState.presence);
      const updatedOccupancy = updatedPresence
        ? Math.max(1, roomState.occupancy)
        : 0;

      const vitals = generateVitalsPoint(roomId, {
        ...roomState,
        activity: updatedActivity,
      });

      store.updateRoom(roomId, {
        breathingRate: vitals.breathingRate,
        heartRate: vitals.heartRate,
        activity: updatedActivity,
        presence: updatedPresence,
        occupancy: updatedOccupancy,
        lastActivityTime: new Date(),
        lastUpdate: new Date(),
      });

      store.appendVitals(roomId, vitals);

      this.maybeGenerateEvent(roomId, roomState.roomName, store);
    });

    store.updateSystem({
      lastUpdate: new Date(),
      totalSensors: rooms.size,
      monitoredRooms: rooms.size,
    });
  }

  private maybeChangeActivity(current: ActivityState): ActivityState {
    if (Math.random() < 0.02) {
      const candidates = ACTIVITIES.filter((a) => a !== current);
      return candidates[Math.floor(Math.random() * candidates.length)];
    }
    return current;
  }

  private maybeTogglePresence(current: boolean): boolean {
    if (Math.random() < 0.005) {
      return !current;
    }
    return current;
  }

  private maybeGenerateEvent(
    roomId: string,
    roomName: string,
    store: ReturnType<typeof useSensorStore.getState>,
  ): void {
    if (Math.random() > 0.01) return;

    const eventType = EVENT_TYPES[Math.floor(Math.random() * EVENT_TYPES.length)];
    store.addEvent({
      id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      roomId,
      roomName,
      type: eventType,
      message: this.buildEventMessage(eventType, roomName),
      severity: "info",
      timestamp: new Date(),
    });
  }

  private buildEventMessage(type: EventType, roomName: string): string {
    switch (type) {
      case "movement":
        return `${roomName}에서 움직임 감지`;
      case "presence_change":
        return `${roomName} 출입 상태 변화`;
      case "entry_exit":
        return `${roomName} 출입 감지`;
      default:
        return `${roomName} 이벤트`;
    }
  }

  private ensureDefaultRooms(): void {
    const store = useSensorStore.getState();
    if (store.rooms.size > 0) return;

    DEFAULT_ROOMS.forEach(({ id, name }) => {
      const activity: ActivityState = "sitting";
      store.updateRoom(id, {
        roomName: name,
        breathingRate: getInitialBreathingRate(activity),
        heartRate: getInitialHeartRate(activity),
        activity,
        presence: true,
        occupancy: 1,
        lastActivityTime: new Date(),
        lastUpdate: new Date(),
      });
    });
  }
}
