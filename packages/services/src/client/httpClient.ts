import axios, { AxiosInstance } from 'axios';
import { env } from '@career-bridge/config';

const API_BASE_URL = env.apiUrl;

export const createHttpClient = (baseURL: string = API_BASE_URL): AxiosInstance => {
  const client = axios.create({
    baseURL,
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  // Request Interceptor to add Auth Token
  client.interceptors.request.use(
    (config) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('career_bridge_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response Interceptor to handle unauthorized errors
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('career_bridge_token');
        }
      }
      return Promise.reject(error);
    }
  );

  return client;
};

export const httpClient = createHttpClient();
export default httpClient;
