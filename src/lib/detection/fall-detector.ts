import type { DetectionInput, DetectionOutput } from './types';

export function analyzeFall(input: DetectionInput): DetectionOutput | null {
  if (input.currentState.activity === 'fallen') {
    return {
      detected: true,
      type: 'fall_detected',
      severity: 'critical',
      confidence: 0.9,
      message: `${input.roomName}에서 낙상이 감지되었습니다!`,
      roomId: input.roomId,
    };
  }

  return null;
}
