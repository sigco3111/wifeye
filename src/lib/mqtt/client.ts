import mqtt, { type MqttClient as MqttClientInstance } from 'mqtt';

type ConnectionStatus = 'connected' | 'disconnected' | 'reconnecting';

interface MQTTConfig {
  url: string;
  autoReconnect?: boolean;
  reconnectInterval?: number;
}

type StatusChangeCallback = (status: ConnectionStatus) => void;
type MessageCallback = (topic: string, payload: string) => void;

const DEFAULT_CONFIG: Required<MQTTConfig> = {
  url: process.env.NEXT_PUBLIC_MQTT_URL || 'ws://localhost:9001',
  autoReconnect: true,
  reconnectInterval: 1000,
};

class MQTTClient {
  private config: Required<MQTTConfig>;
  private client: MqttClientInstance | null = null;
  private status: ConnectionStatus = 'disconnected';
  private statusListeners = new Set<StatusChangeCallback>();
  private subscriptions = new Map<string, Set<MessageCallback>>();
  private reconnectAttempts = 0;
  private maxReconnectDelay = 30_000;

  constructor(config?: Partial<MQTTConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  connect(): Promise<void> {
    return new Promise((resolve) => {
      if (this.client?.connected) {
        resolve();
        return;
      }

      this.setStatus('disconnected');

      try {
        this.client = mqtt.connect(this.config.url, {
          reconnectPeriod: this.config.autoReconnect
            ? this.config.reconnectInterval
            : 0,
        });

        this.client.on('connect', () => {
          this.reconnectAttempts = 0;
          this.setStatus('connected');
          this.resubscribeAll();
          resolve();
        });

        this.client.on('message', (topic: string, message: Buffer) => {
          const payload = message.toString();
          this.dispatchMessage(topic, payload);
        });

        this.client.on('error', (err: Error) => {
          console.error('[MQTT] Connection error:', err.message);
        });

        this.client.on('reconnect', () => {
          this.reconnectAttempts++;
          this.setStatus('reconnecting');
        });

        this.client.on('close', () => {
          this.setStatus('disconnected');
        });

        this.client.on('offline', () => {
          this.setStatus('disconnected');
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error('[MQTT] Failed to create connection:', message);
        this.setStatus('disconnected');
        resolve();
      }
    });
  }

  disconnect(): void {
    if (this.client) {
      this.client.end(true);
      this.client = null;
    }
    this.subscriptions.clear();
    this.setStatus('disconnected');
  }

  subscribe(topic: string, callback: MessageCallback): void {
    if (!this.subscriptions.has(topic)) {
      this.subscriptions.set(topic, new Set());
    }
    this.subscriptions.get(topic)!.add(callback);

    if (this.client?.connected) {
      this.client.subscribe(topic, (err) => {
        if (err) {
          console.error(`[MQTT] Subscribe error for ${topic}:`, err.message);
        }
      });
    }
  }

  unsubscribe(topic: string): void {
    this.subscriptions.delete(topic);

    if (this.client?.connected) {
      this.client.unsubscribe(topic, (err) => {
        if (err) {
          console.error(`[MQTT] Unsubscribe error for ${topic}:`, err.message);
        }
      });
    }
  }

  publish(topic: string, payload: string): void {
    if (!this.client?.connected) {
      console.warn(`[MQTT] Cannot publish to ${topic}: not connected`);
      return;
    }

    this.client.publish(topic, payload, (err) => {
      if (err) {
        console.error(`[MQTT] Publish error for ${topic}:`, err.message);
      }
    });
  }

  getStatus(): ConnectionStatus {
    return this.status;
  }

  onStatusChange(callback: StatusChangeCallback): () => void {
    this.statusListeners.add(callback);
    return () => {
      this.statusListeners.delete(callback);
    };
  }

  private setStatus(status: ConnectionStatus): void {
    if (this.status === status) return;
    this.status = status;
    this.statusListeners.forEach((cb) => {
      try {
        cb(status);
      } catch (err) {
        console.error('[MQTT] Status listener error:', err);
      }
    });
  }

  private resubscribeAll(): void {
    if (!this.client?.connected) return;

    for (const topic of this.subscriptions.keys()) {
      this.client.subscribe(topic, (err) => {
        if (err) {
          console.error(`[MQTT] Resubscribe error for ${topic}:`, err.message);
        }
      });
    }
  }

  private dispatchMessage(topic: string, payload: string): void {
    for (const [subTopic, callbacks] of this.subscriptions.entries()) {
      if (topicMatches(subTopic, topic)) {
        callbacks.forEach((cb) => {
          try {
            cb(topic, payload);
          } catch (err) {
            console.error(`[MQTT] Message handler error for ${topic}:`, err);
          }
        });
      }
    }
  }
}

function topicMatches(subscription: string, actual: string): boolean {
  if (subscription === actual) return true;
  const subParts = subscription.split('/');
  const actParts = actual.split('/');
  for (let i = 0; i < subParts.length; i++) {
    const sub = subParts[i];
    const act = actParts[i];
    if (sub === '#') return true;
    if (sub === '+') continue;
    if (sub !== act) return false;
  }
  return subParts.length === actParts.length;
}

let instance: MQTTClient | null = null;

export function createMQTTClient(config?: Partial<MQTTConfig>): MQTTClient {
  if (!instance) {
    instance = new MQTTClient(config);
  }
  return instance;
}

export { MQTTClient };
export type { MQTTConfig, ConnectionStatus };
