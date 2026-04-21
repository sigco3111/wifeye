import type { ActivityState } from "@/types";
import { useSensorStore } from "@/stores/sensor-store";
import { SimulationEngine } from "./engine";
import { getInitialBreathingRate, getInitialHeartRate } from "./vitals-generator";

export interface ScenarioPreset {
  id: string;
  name: string;
  description: string;
  setup: (engine: SimulationEngine) => void;
}

export const normalDaily: ScenarioPreset = {
  id: "normal-daily",
  name: "일상 루틴",
  description: "거실에 거주자가 앉아 있고, 모든 방이 정상적으로 모니터링되는 기본 시나리오",
  setup: (engine) => {
    const store = useSensorStore.getState();
    store.reset();
    const activity: ActivityState = "sitting";
    store.updateRoom("living-room", {
      roomName: "거실",
      breathingRate: getInitialBreathingRate(activity),
      heartRate: getInitialHeartRate(activity),
      activity,
      presence: true,
      occupancy: 1,
      lastActivityTime: new Date(),
      lastUpdate: new Date(),
    });
    store.updateRoom("bedroom", {
      roomName: "침실",
      breathingRate: getInitialBreathingRate("sleeping"),
      heartRate: getInitialHeartRate("sleeping"),
      activity: "sleeping",
      presence: false,
      occupancy: 0,
      lastActivityTime: new Date(),
      lastUpdate: new Date(),
    });
    store.updateRoom("kitchen", {
      roomName: "주방",
      breathingRate: getInitialBreathingRate("standing"),
      heartRate: getInitialHeartRate("standing"),
      activity: "standing",
      presence: false,
      occupancy: 0,
      lastActivityTime: new Date(),
      lastUpdate: new Date(),
    });
    engine.start();
  },
};

export const fallScenario: ScenarioPreset = {
  id: "fall-scenario",
  name: "낙상 감지",
  description: "30 틱 후 거실에서 낙상 이벤트가 발생하는 시나리오",
  setup: (engine) => {
    const store = useSensorStore.getState();
    store.reset();
    const activity: ActivityState = "walking";
    store.updateRoom("living-room", {
      roomName: "거실",
      breathingRate: getInitialBreathingRate(activity),
      heartRate: getInitialHeartRate(activity),
      activity,
      presence: true,
      occupancy: 1,
      lastActivityTime: new Date(),
      lastUpdate: new Date(),
    });

    const originalTick = engine.tick.bind(engine);
    let fallTriggered = false;

    engine.tick = function (this: SimulationEngine) {
      originalTick();
      if (!fallTriggered && engine.getTickCount() >= 30) {
        fallTriggered = true;
        const s = useSensorStore.getState();
        const livingRoom = s.rooms.get("living-room");
        if (livingRoom) {
          s.updateRoom("living-room", {
            activity: "fallen",
            breathingRate: getInitialBreathingRate("fallen"),
            heartRate: getInitialHeartRate("fallen"),
          });
          s.addEvent({
            id: `evt-fall-${Date.now()}`,
            roomId: "living-room",
            roomName: "거실",
            type: "fall_detected",
            message: "거실에서 낙상이 감지되었습니다!",
            severity: "critical",
            timestamp: new Date(),
          });
        }
      }
    };

    engine.start();
  },
};

export const intrusionScenario: ScenarioPreset = {
  id: "intrusion-scenario",
  name: "침입 감지",
  description: "야간에 등록되지 않은 사람의 접근이 감지되는 시나리오",
  setup: (engine) => {
    const store = useSensorStore.getState();
    store.reset();
    store.updateRoom("living-room", {
      roomName: "거실",
      breathingRate: getInitialBreathingRate("sleeping"),
      heartRate: getInitialHeartRate("sleeping"),
      activity: "sleeping",
      presence: false,
      occupancy: 0,
      lastActivityTime: new Date(),
      lastUpdate: new Date(),
    });

    const originalTick = engine.tick.bind(engine);
    let intrusionTriggered = false;

    engine.tick = function (this: SimulationEngine) {
      originalTick();
      if (!intrusionTriggered && engine.getTickCount() >= 15) {
        intrusionTriggered = true;
        const s = useSensorStore.getState();
        s.updateRoom("living-room", {
          presence: true,
          occupancy: 1,
          activity: "walking",
          breathingRate: getInitialBreathingRate("walking"),
          heartRate: getInitialHeartRate("walking"),
        });
        s.addEvent({
          id: `evt-intrusion-${Date.now()}`,
          roomId: "living-room",
          roomName: "거실",
          type: "intrusion_detected",
          message: "야간에 거실에서 미확인 움직임이 감지되었습니다!",
          severity: "critical",
          timestamp: new Date(),
        });
      }
    };

    engine.start();
  },
};

export const sleepScenario: ScenarioPreset = {
  id: "sleep-scenario",
  name: "수면 모니터링",
  description: "침실에서 수면 상태로 진입하고 생체신호가 감소하는 시나리오",
  setup: (engine) => {
    const store = useSensorStore.getState();
    store.reset();
    store.updateRoom("bedroom", {
      roomName: "침실",
      breathingRate: getInitialBreathingRate("sleeping"),
      heartRate: getInitialHeartRate("sleeping"),
      activity: "sleeping",
      presence: true,
      occupancy: 1,
      lastActivityTime: new Date(),
      lastUpdate: new Date(),
    });
    store.updateRoom("living-room", {
      roomName: "거실",
      breathingRate: getInitialBreathingRate("sitting"),
      heartRate: getInitialHeartRate("sitting"),
      activity: "sitting",
      presence: false,
      occupancy: 0,
      lastActivityTime: new Date(),
      lastUpdate: new Date(),
    });
    engine.start();
  },
};

export const inactivityScenario: ScenarioPreset = {
  id: "inactivity-scenario",
  name: "미이동 감지",
  description: "거실에서 장시간 활동이 감지되지 않는 시나리오",
  setup: (engine) => {
    const store = useSensorStore.getState();
    store.reset();
    const activity: ActivityState = "sitting";
    store.updateRoom("living-room", {
      roomName: "거실",
      breathingRate: getInitialBreathingRate(activity),
      heartRate: getInitialHeartRate(activity),
      activity,
      presence: true,
      occupancy: 1,
      lastActivityTime: new Date(Date.now() - 120 * 60 * 1000),
      lastUpdate: new Date(Date.now() - 120 * 60 * 1000),
    });

    const originalTick = engine.tick.bind(engine);
    let inactivityAlerted = false;

    engine.tick = function (this: SimulationEngine) {
      originalTick();
      if (!inactivityAlerted && engine.getTickCount() >= 20) {
        inactivityAlerted = true;
        const s = useSensorStore.getState();
        s.addEvent({
          id: `evt-inactivity-${Date.now()}`,
          roomId: "living-room",
          roomName: "거실",
          type: "inactivity_detected",
          message: "거실에서 2시간 이상 미활동 상태가 감지되었습니다.",
          severity: "warning",
          timestamp: new Date(),
        });
      }
    };

    engine.start();
  },
};

export const ALL_SCENARIOS: ScenarioPreset[] = [
  normalDaily,
  fallScenario,
  intrusionScenario,
  sleepScenario,
  inactivityScenario,
];
