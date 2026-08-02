export interface WebSocketMessage {
  type: string;
  payload: unknown;
  timestamp: string;
  roomId?: string;
  senderId?: string;
}

export interface WebSocketRoom {
  id: string;
  participants: string[];
  type: 'chat' | 'notification' | 'job_update';
}

export type ConnectionStatus = 'connected' | 'disconnected' | 'reconnecting' | 'error';
