export const TOPICS = {
  sensorCSI: (roomId: string) => `wifeye/sensor/${roomId}/csi`,
  sensorVitals: (roomId: string) => `wifeye/sensor/${roomId}/vitals`,
  sensorActivity: (roomId: string) => `wifeye/sensor/${roomId}/activity`,
  alertAll: 'wifeye/alert/+',
  alertRoom: (roomId: string) => `wifeye/alert/${roomId}`,
  statusRoom: (roomId: string) => `wifeye/status/${roomId}`,
  statusSystem: 'wifeye/status/system',
} as const;

export const TOPIC_PATTERNS = {
  sensorCSI: /^wifeye\/sensor\/([^/]+)\/csi$/,
  sensorVitals: /^wifeye\/sensor\/([^/]+)\/vitals$/,
  sensorActivity: /^wifeye\/sensor\/([^/]+)\/activity$/,
  alert: /^wifeye\/alert\/([^/]+)$/,
  status: /^wifeye\/status\/([^/]+)$/,
} as const;
