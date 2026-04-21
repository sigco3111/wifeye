export { SimulationEngine } from "./engine";
export {
  generateBreathingRate,
  generateHeartRate,
  generateSleepStage,
  generateVitalsPoint,
  getInitialBreathingRate,
  getInitialHeartRate,
} from "./vitals-generator";
export {
  normalDaily,
  fallScenario,
  intrusionScenario,
  sleepScenario,
  inactivityScenario,
  ALL_SCENARIOS,
} from "./scenarios";
export type { ScenarioPreset } from "./scenarios";
