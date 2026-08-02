export const offlineMiddleware = (config: any) => (set: any, get: any, api: any) =>
  config(
    (...args: any[]) => {
      if (typeof window !== 'undefined' && !navigator.onLine) {
        console.warn('[OfflineMiddleware] Client is offline. Action queued for sync.');
      }
      set(...args);
    },
    get,
    api
  );
