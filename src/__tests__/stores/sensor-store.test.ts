import { describe, it, expect, beforeEach } from "vitest";
import { useSensorStore } from "@/stores/sensor-store";
import type { RoomState, TimelineEvent, VitalsHistoryPoint } from "@/types";

function makeRoomState(overrides: Partial<RoomState> = {}): RoomState {
  return {
    roomId: "room-1",
    roomName: "거실",
    presence: true,
    occupancy: 1,
    breathingRate: 16,
    heartRate: 72,
    activity: "sitting",
    lastActivityTime: new Date(),
    lastUpdate: new Date(),
    ...overrides,
  };
}

function makeEvent(overrides: Partial<TimelineEvent> = {}): TimelineEvent {
  return {
    id: "evt-1",
    roomId: "room-1",
    roomName: "거실",
    type: "movement",
    message: "움직임 감지",
    severity: "info",
    timestamp: new Date(),
    ...overrides,
  };
}

function makeVitalsPoint(index: number): VitalsHistoryPoint {
  return {
    time: `10:${String(index).padStart(2, "0")}`,
    breathingRate: 14 + (index % 5),
    heartRate: 68 + (index % 10),
  };
}

describe("useSensorStore", () => {
  beforeEach(() => {
    useSensorStore.getState().reset();
  });

  describe("updateRoom", () => {
    it("adds a new room to the map", () => {
      const store = useSensorStore.getState();
      store.updateRoom("room-1", makeRoomState());

      const rooms = useSensorStore.getState().rooms;
      expect(rooms.has("room-1")).toBe(true);
      expect(rooms.get("room-1")?.roomName).toBe("거실");
    });

    it("merges partial data into an existing room", () => {
      const store = useSensorStore.getState();
      store.updateRoom("room-1", makeRoomState());
      store.updateRoom("room-1", { occupancy: 3, activity: "walking" });

      const room = useSensorStore.getState().rooms.get("room-1")!;
      expect(room.occupancy).toBe(3);
      expect(room.activity).toBe("walking");
      expect(room.roomName).toBe("거실");
    });
  });

  describe("addEvent", () => {
    it("appends events to the events array", () => {
      const store = useSensorStore.getState();
      store.addEvent(makeEvent({ id: "evt-1" }));
      store.addEvent(makeEvent({ id: "evt-2" }));

      const { events } = useSensorStore.getState();
      expect(events).toHaveLength(2);
      expect(events[0].id).toBe("evt-1");
      expect(events[1].id).toBe("evt-2");
    });
  });

  describe("appendVitals", () => {
    it("adds vitals points to the correct room", () => {
      const store = useSensorStore.getState();
      store.appendVitals("room-1", makeVitalsPoint(0));
      store.appendVitals("room-1", makeVitalsPoint(1));

      const history = useSensorStore.getState().vitalsHistory.get("room-1");
      expect(history).toHaveLength(2);
    });

    it("caps vitals history at 60 points per room", () => {
      const store = useSensorStore.getState();

      for (let i = 0; i < 65; i++) {
        store.appendVitals("room-1", makeVitalsPoint(i));
      }

      const history = useSensorStore.getState().vitalsHistory.get("room-1")!;
      expect(history).toHaveLength(60);
      expect(history[0].time).toBe("10:05");
      expect(history[59].time).toBe("10:64");
    });

    it("keeps the latest 60 points after cap", () => {
      const store = useSensorStore.getState();

      for (let i = 0; i < 65; i++) {
        store.appendVitals("room-1", makeVitalsPoint(i));
      }

      const history = useSensorStore.getState().vitalsHistory.get("room-1")!;
      expect(history[0].breathingRate).toBe(14 + (5 % 5));
    });
  });

  describe("setSimulationMode", () => {
    it("updates simulationMode in system info", () => {
      const store = useSensorStore.getState();
      expect(store.system.simulationMode).toBe(true);

      store.setSimulationMode(false);
      expect(useSensorStore.getState().system.simulationMode).toBe(false);

      store.setSimulationMode(true);
      expect(useSensorStore.getState().system.simulationMode).toBe(true);
    });
  });

  describe("updateSystem", () => {
    it("merges partial system info", () => {
      const store = useSensorStore.getState();
      store.updateSystem({ status: "warning", message: "센서 연결 불안정" });

      const { system } = useSensorStore.getState();
      expect(system.status).toBe("warning");
      expect(system.message).toBe("센서 연결 불안정");
      expect(system.simulationMode).toBe(true);
    });
  });

  describe("reset", () => {
    it("clears all state back to initial values", () => {
      const store = useSensorStore.getState();
      store.updateRoom("room-1", makeRoomState());
      store.addEvent(makeEvent());
      store.appendVitals("room-1", makeVitalsPoint(0));
      store.updateSystem({ status: "critical" });

      store.reset();

      const state = useSensorStore.getState();
      expect(state.rooms.size).toBe(0);
      expect(state.events).toHaveLength(0);
      expect(state.vitalsHistory.size).toBe(0);
      expect(state.system.status).toBe("normal");
    });
  });
});
