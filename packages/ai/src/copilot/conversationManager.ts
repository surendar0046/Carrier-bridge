export interface CopilotMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export class ConversationManager {
  private history: CopilotMessage[] = [];

  addMessage(role: 'user' | 'assistant' | 'system', content: string): CopilotMessage {
    const msg: CopilotMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      role,
      content,
      timestamp: new Date().toISOString(),
    };
    this.history.push(msg);
    return msg;
  }

  getHistory(): CopilotMessage[] {
    return [...this.history];
  }

  clearHistory(): void {
    this.history = [];
  }
}
