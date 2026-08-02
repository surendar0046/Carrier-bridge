export const analyticsMiddleware = (config: any) => (set: any, get: any, api: any) =>
  config(
    (...args: any[]) => {
      const result = set(...args);
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'state_change', { timestamp: Date.now() });
      }
      return result;
    },
    get,
    api
  );
