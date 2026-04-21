import type { DetectionInput, DetectionOutput } from './types';

function isNightTime(date: Date): boolean {
  const hour = date.getHours();
  return hour >= 22 || hour < 6;
}

export function analyzeAnomaly(input: DetectionInput): DetectionOutput | null {
  const { activity } = input.currentState;
  const { activityHistory } = input;
  const currentTime = input.currentTime;

  // Check unusual restlessness: count unique activity changes in last 30 minutes
  const thirtyMinutesAgo = new Date(currentTime.getTime() - 30 * 60 * 1000);
  const recentActivities = activityHistory.filter(
    (entry) => entry.timestamp >= thirtyMinutesAgo
  );

  // Count activity transitions (changes from one activity to another)
  let transitionCount = 0;
  for (let i = 1; i < recentActivities.length; i++) {
    if (recentActivities[i].activity !== recentActivities[i - 1].activity) {
      transitionCount++;
    }
  }

  if (transitionCount > 8) {
    const deviation = (transitionCount - 8) / transitionCount;
    const confidence = Math.min(0.5 + deviation * 0.2, 0.7);

    return {
      detected: true,
      type: 'anomaly_detected',
      severity: 'warning',
      confidence,
      message: `${input.roomName}에서 비정상적으로 잦은 활동 변화가 감지되었습니다 (30분 내 ${transitionCount}회 변화)`,
      roomId: input.roomId,
    };
  }

  // Check night anomaly: unusual activity during night hours
  if (isNightTime(currentTime) && (activity === 'walking' || activity === 'standing')) {
    return {
      detected: true,
      type: 'anomaly_detected',
      severity: 'warning',
      confidence: 0.6,
      message: `${input.roomName}에서 야간 시간대 비정상 활동이 감지되었습니다 (현재: ${activity})`,
      roomId: input.roomId,
    };
  }

  return null;
}
