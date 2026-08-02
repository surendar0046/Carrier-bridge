import { AxiosError } from 'axios';

export interface AppError {
  code: string;
  message: string;
  status: number;
  details?: Record<string, string[]>;
}

export const handleError = (error: AxiosError): AppError => {
  if (error.response) {
    const data = error.response.data as any;
    return {
      code:    data?.error?.code || 'API_ERROR',
      message: data?.error?.message || data?.message || 'An error occurred',
      status:  error.response.status,
      details: data?.error?.details,
    };
  }
  if (error.request) {
    return { code: 'NETWORK_ERROR', message: 'Network error — please check your connection', status: 0 };
  }
  return { code: 'UNKNOWN_ERROR', message: error.message || 'Unknown error', status: 0 };
};
