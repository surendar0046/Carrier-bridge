export interface ServiceHealthStatus {
  status: 'ok' | 'degraded' | 'down';
  service: string;
  uptime: number;
  timestamp: string;
}

export interface StitchGatewayResponse<T = any> {
  result: T;
  orchestrationLatencyMs: number;
  sources: string[];
}
