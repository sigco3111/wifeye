import { SleepSession, SleepStagePoint, SleepStage } from '@/types';

interface SleepCycleConfig {
  deepMin: number;
  deepMax: number;
  lightMin: number;
  lightMax: number;
  remMin: number;
  remMax: number;
  awakeMin: number;
  awakeMax: number;
}

interface CycleStage {
  stage: SleepStage;
  duration: number;
}

function generateCycle(config: SleepCycleConfig, cycleIndex: number, totalCycles: number): CycleStage[] {
  const cycleProgress = cycleIndex / totalCycles;
  
  // As night progresses, increase REM and decrease deep sleep
  const deepDuration = Math.floor(config.deepMin + (config.deepMax - config.deepMin) * (1 - cycleProgress * 0.5));
  const remDuration = Math.floor(config.remMin + (config.remMax - config.remMin) * cycleProgress);
  const lightDuration = Math.floor(config.lightMin + (config.lightMax - config.lightMin) * (0.5 + cycleProgress * 0.3));
  const awakeDuration = Math.floor(config.awakeMin + (config.awakeMax - config.awakeMin) * (1 - cycleProgress));
  
  return [
    { stage: 'awake', duration: awakeDuration },
    { stage: 'light', duration: lightDuration },
    { stage: 'deep', duration: deepDuration },
    { stage: 'light', duration: lightDuration },
    { stage: 'rem', duration: remDuration }
  ];
}

function calculateSleepScore(stages: SleepStagePoint[]): number {
  const totalDuration = stages.reduce((sum, stage) => sum + stage.duration, 0);
  const deepSleepDuration = stages.filter(s => s.stage === 'deep').reduce((sum, stage) => sum + stage.duration, 0);
  const awakeCount = stages.filter(s => s.stage === 'awake').length;
  
  const deepSleepRatio = deepSleepDuration / totalDuration;
  const score = 70 + (deepSleepRatio * 30) - (awakeCount * 5);
  return Math.max(0, Math.min(100, Math.round(score)));
}

export function generateSleepSession(roomId: string, date: Date): SleepSession {
  // Sleep typically starts between 22:00-23:00 and ends between 06:00-07:30
  const startHour = 22 + Math.floor(Math.random() * 2);
  const startMinute = Math.floor(Math.random() * 60);
  const startTime = new Date(date);
  startTime.setHours(startHour, startMinute, 0, 0);
  
  // Generate 4-6 sleep cycles (each ~90 minutes)
  const cycleCount = 4 + Math.floor(Math.random() * 3);
  const baseConfig: SleepCycleConfig = {
    deepMin: 20, deepMax: 40,
    lightMin: 15, lightMax: 30,
    remMin: 10, remMax: 25,
    awakeMin: 1, awakeMax: 5
  };
  
  const stages: SleepStagePoint[] = [];
  let currentTime = startTime;
  
  for (let i = 0; i < cycleCount; i++) {
    const cycleStages = generateCycle(baseConfig, i, cycleCount);
    for (const stage of cycleStages) {
      stages.push({
        stage: stage.stage,
        startTime: new Date(currentTime),
        duration: stage.duration * 60 * 1000 // Convert to milliseconds
      });
      currentTime = new Date(currentTime.getTime() + stage.duration * 60 * 1000);
    }
  }
  
  // Wake up time (typically 6:00-7:30)
  const wakeHour = 6 + Math.floor(Math.random() * 2);
  const wakeMinute = Math.floor(Math.random() * 60);
  const endTime = new Date(date);
  endTime.setHours(wakeHour, wakeMinute, 0, 0);
  
  const totalDuration = endTime.getTime() - startTime.getTime();
  
  return {
    roomId,
    startTime,
    endTime,
    stages,
    score: calculateSleepScore(stages),
    totalDuration
  };
}

export function generateRecentSleepHistory(roomId: string, days: number): SleepSession[] {
  const sessions: SleepSession[] = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    sessions.push(generateSleepSession(roomId, date));
  }
  
  return sessions;
}