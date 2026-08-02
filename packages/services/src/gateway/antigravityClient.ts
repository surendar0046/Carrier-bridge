import { httpClient } from '../client/httpClient';

export class AntigravityClient {
  private endpoint: string;

  constructor(endpoint: string = process.env.NEXT_PUBLIC_AI_ENDPOINT || '/api/niral-ai') {
    this.endpoint = endpoint;
  }

  async promptCopilot(prompt: string, context?: any) {
    const response = await httpClient.post(this.endpoint, { prompt, context });
    return response.data;
  }
}

export const antigravityClient = new AntigravityClient();
