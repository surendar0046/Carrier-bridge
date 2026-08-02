import { httpClient } from '../client/httpClient';
import { ApiResponse } from '@career-bridge/types';

export const paymentService = {
  async createOrder(amount: number, currency = 'INR'): Promise<{ orderId: string; amount: number }> {
    const res = await httpClient.post<ApiResponse<{ orderId: string; amount: number }>>('/payments/order', { amount, currency });
    return res.data.data;
  },
  async verifyPayment(orderId: string, paymentId: string): Promise<boolean> {
    const res = await httpClient.post<ApiResponse<{ verified: boolean }>>('/payments/verify', { orderId, paymentId });
    return res.data.data.verified;
  },
};
