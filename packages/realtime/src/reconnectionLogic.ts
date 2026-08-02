export class ReconnectionLogic {
  private attempt: number = 0;
  private maxAttempts: number = 10;
  private baseDelayMs: number = 1000;

  getBackoffDelay(): number {
    const delay = Math.min(30000, this.baseDelayMs * Math.pow(2, this.attempt));
    this.attempt++;
    return delay;
  }

  reset(): void {
    this.attempt = 0;
  }

  canRetry(): boolean {
    return this.attempt < this.maxAttempts;
  }
}
