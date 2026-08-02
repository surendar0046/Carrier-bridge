import { AxiosInstance } from 'axios';

export const applyRetryLogic = (client: AxiosInstance, maxRetries = 3): void => {
  client.interceptors.response.use(undefined, async (error) => {
    const config = error.config as any;
    if (!config) return Promise.reject(error);
    config._retryCount = config._retryCount || 0;
    const isRetryable =
      !error.response || [429, 500, 502, 503, 504].includes(error.response.status);
    if (config._retryCount >= maxRetries || !isRetryable) {
      return Promise.reject(error);
    }
    config._retryCount += 1;
    const delay = Math.pow(2, config._retryCount) * 500;
    await new Promise((res) => setTimeout(res, delay));
    return client(config);
  });
};
