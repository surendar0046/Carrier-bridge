export const useWebSocketRealtime = (url: string = 'ws://localhost:4000') => {
  return { isConnected: true, lastMessage: null, url };
};
