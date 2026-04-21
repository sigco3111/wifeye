import { create } from "zustand";
import type {
  Room,
  RoomState,
  VitalsHistoryPoint,
  TimelineEvent,
  SystemInfo,
} from "@/types";

const initialSystem: SystemInfo = {
  status: "normal",
  message: "시스템 정상",
  simulationMode: true,
  mqttStatus: "disconnected",
  totalSensors: 0,
  monitoredRooms: 0,
  todayAlerts: 0,
  lastUpdate: new Date(),
};

interface SensorState {
  rooms: Map<string, RoomState>;
  vitalsHistory: Map<string, VitalsHistoryPoint[]>;
  events: TimelineEvent[];
  system: SystemInfo;

  updateRoom: (id: string, data: Partial<RoomState>) => void;
  addEvent: (event: TimelineEvent) => void;
  updateSystem: (info: Partial<SystemInfo>) => void;
  appendVitals: (roomId: string, point: VitalsHistoryPoint) => void;
  setSimulationMode: (enabled: boolean) => void;
  reset: () => void;
  addRoom: (room: Room) => void;
  removeRoom: (roomId: string) => void;
  updateRoomConfig: (id: string, config: Partial<Room>) => void;
}

const MAX_VITALS_POINTS = 60;

export const useSensorStore = create<SensorState>()((set) => ({
  rooms: new Map<string, RoomState>(),
  vitalsHistory: new Map<string, VitalsHistoryPoint[]>(),
  events: [],
  system: { ...initialSystem },

  updateRoom: (id, data) =>
    set((state) => {
      const next = new Map(state.rooms);
      const existing = next.get(id);
      next.set(id, existing ? { ...existing, ...data } : ({ roomId: id, ...data } as RoomState));
      return { rooms: next };
    }),

  addEvent: (event) =>
    set((state) => ({ events: [...state.events, event] })),

  updateSystem: (info) =>
    set((state) => ({
      system: { ...state.system, ...info },
    })),

  appendVitals: (roomId, point) =>
    set((state) => {
      const next = new Map(state.vitalsHistory);
      const current = next.get(roomId) ?? [];
      const updated = [...current, point];
      next.set(roomId, updated.length > MAX_VITALS_POINTS ? updated.slice(-MAX_VITALS_POINTS) : updated);
      return { vitalsHistory: next };
    }),

  setSimulationMode: (enabled) =>
    set((state) => ({
      system: { ...state.system, simulationMode: enabled },
    })),

  reset: () =>
    set({
      rooms: new Map<string, RoomState>(),
      vitalsHistory: new Map<string, VitalsHistoryPoint[]>(),
      events: [],
      system: { ...initialSystem, lastUpdate: new Date() },
    }),

  addRoom: (room) =>
    set((state) => {
      const next = new Map(state.rooms);
      next.set(room.id, {
        roomId: room.id,
        roomName: room.name,
        presence: false,
        occupancy: 0,
        breathingRate: 0,
        heartRate: 0,
        activity: "standing",
        lastActivityTime: new Date(),
        lastUpdate: new Date(),
      });
      return { rooms: next };
    }),

  removeRoom: (roomId) =>
    set((state) => {
      const next = new Map(state.rooms);
      next.delete(roomId);
      return { rooms: next };
    }),

  updateRoomConfig: (id, config) =>
    set((state) => {
      const next = new Map(state.rooms);
      const existing = next.get(id);
      if (existing) {
        next.set(id, {
          ...existing,
          roomName: config.name ?? existing.roomName,
        });
      }
      return { rooms: next };
    }),
}));
