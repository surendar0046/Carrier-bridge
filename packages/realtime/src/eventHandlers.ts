import { getWebSocketManager } from './WebSocketManager';

export const eventHandlers = {
  onNewMessage: (callback: (data: unknown) => void) => {
    const ws = getWebSocketManager();
    ws.on('new_message', callback);
    return () => ws.off('new_message', callback);
  },
  onJobUpdate: (callback: (data: unknown) => void) => {
    const ws = getWebSocketManager();
    ws.on('job_update', callback);
    return () => ws.off('job_update', callback);
  },
  onNotification: (callback: (data: unknown) => void) => {
    const ws = getWebSocketManager();
    ws.on('notification', callback);
    return () => ws.off('notification', callback);
  },
};
