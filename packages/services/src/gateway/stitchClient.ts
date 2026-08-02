import { httpClient } from '../client/httpClient';

export class StitchClient {
  private baseUrl: string;

  constructor(baseUrl: string = process.env.NEXT_PUBLIC_GATEWAY_URL || 'http://localhost:4000') {
    this.baseUrl = baseUrl;
  }

  async executeStitch<T = any>(endpoint: string, payload?: any): Promise<T> {
    const response = await httpClient.post<T>(`${this.baseUrl}/api/stitch/${endpoint}`, payload);
    return response.data;
  }
}

export const stitchClient = new StitchClient();
