export interface CopilotIntent {
  type: 'ACTION_NAVIGATE' | 'ACTION_MATCH_JOBS' | 'ACTION_ANALYSIS' | 'GENERAL_CHAT';
  targetRoute?: string;
  payload?: any;
}

export class ActionOrchestrator {
  async detectIntent(prompt: string, context: any): Promise<CopilotIntent> {
    const p = prompt.toLowerCase();
    if (p.includes('job') || p.includes('apply') || p.includes('hiring')) {
      return { type: 'ACTION_MATCH_JOBS' };
    }
    if (p.includes('go to') || p.includes('open') || p.includes('navigate')) {
      return { type: 'ACTION_NAVIGATE', targetRoute: '/jobs' };
    }
    if (p.includes('resume') || p.includes('score') || p.includes('ats') || p.includes('skill')) {
      return { type: 'ACTION_ANALYSIS' };
    }
    return { type: 'GENERAL_CHAT' };
  }
}
