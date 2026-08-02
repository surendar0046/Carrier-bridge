import EventEmitter from 'eventemitter3';

type EventMap = {
  'new_message': [data: unknown];
  'job_update':  [data: unknown];
  'notification':[data: unknown];
  'connected':   [];
  'disconnected':[];
  'error':       [err: Error];
};

class WebSocketManager extends EventEmitter<EventMap> {
  private socket: WebSocket | null = null;
  private url: string;
  private reconnectDelay = 2000;
  private maxReconnectDelay = 30000;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private shouldReconnect = true;

  constructor(url: string) {
    super();
    this.url = url;
  }

  connect(): void {
    if (this.socket?.readyState === WebSocket.OPEN) return;
    try {
      this.socket = new WebSocket(this.url);

      this.socket.onopen = () => {
        console.log('[WS] Connected to', this.url);
        this.reconnectDelay = 2000;
        this.emit('connected');
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data as string);
          if (data.type === 'new_message')  this.emit('new_message', data.payload);
          if (data.type === 'job_update')   this.emit('job_update',  data.payload);
          if (data.type === 'notification') this.emit('notification',data.payload);
        } catch {}
      };

      this.socket.onclose = () => {
        this.emit('disconnected');
        if (this.shouldReconnect) this.scheduleReconnect();
      };

      this.socket.onerror = (e) => {
        this.emit('error', new Error('WebSocket error'));
      };
    } catch (err) {
      console.warn('[WS] Could not connect:', err);
      if (this.shouldReconnect) this.scheduleReconnect();
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) return;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.reconnectDelay = Math.min(this.reconnectDelay * 2, this.maxReconnectDelay);
      this.connect();
    }, this.reconnectDelay);
  }

  send(type: string, payload: unknown): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type, payload }));
    }
  }

  joinRoom(roomId: string): void { this.send('join_room', roomId); }

  sendMessage(roomId: string, content: string): void {
    this.send('send_message', { roomId, content });
  }

  disconnect(): void {
    this.shouldReconnect = false;
    if (this.reconnectTimer) { clearTimeout(this.reconnectTimer); this.reconnectTimer = null; }
    this.socket?.close();
    this.socket = null;
  }

  get isConnected(): boolean { return this.socket?.readyState === WebSocket.OPEN; }
}

let instance: WebSocketManager | null = null;

export const getWebSocketManager = (): WebSocketManager => {
  if (!instance) {
    const url = typeof window !== 'undefined'
      ? (process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:4000')
      : 'ws://localhost:4000';
    instance = new WebSocketManager(url);
  }
  return instance;
};

export { WebSocketManager };
