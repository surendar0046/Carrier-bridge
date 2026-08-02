import { AxiosInstance, AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

export const applyInterceptors = (client: AxiosInstance): void => {
  // Request interceptor — attach JWT
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token =
        typeof window !== 'undefined' ? localStorage.getItem('career_bridge_token') : null;
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor — normalize errors
  client.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      if (error.response?.status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('career_bridge_token');
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }
  );
};
