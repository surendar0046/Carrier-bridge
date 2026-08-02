import { ConversationManager } from './conversationManager';
import { ContextEngine } from './contextEngine';
import { ActionOrchestrator } from './actionOrchestrator';

export class AICopilot {
  private conversationManager: ConversationManager;
  private contextEngine: ContextEngine;
  private actionOrchestrator: ActionOrchestrator;

  constructor() {
    this.conversationManager = new ConversationManager();
    this.contextEngine = new ContextEngine();
    this.actionOrchestrator = new ActionOrchestrator();
  }

  async processUserPrompt(prompt: string, currentRoute?: string, pageContext?: any) {
    const context = await this.contextEngine.buildContext(currentRoute, pageContext);
    this.conversationManager.addMessage('user', prompt);

    const intent = await this.actionOrchestrator.detectIntent(prompt, context);
    let reply = '';

    if (intent.type === 'ACTION_NAVIGATE') {
      reply = `I will navigate you to ${intent.targetRoute || 'your requested page'}.`;
    } else if (intent.type === 'ACTION_MATCH_JOBS') {
      reply = `Based on your profile, I found 3 high-matching roles: Senior Full Stack Engineer at TechCorp (96% Match), AI Engineer at Niral Systems (94% Match), and Cloud Architect (91% Match).`;
    } else {
      reply = `I've analyzed your career path. To reach your next milestone, I recommend strengthening TypeScript & System Design skills.`;
    }

    this.conversationManager.addMessage('assistant', reply);
    return {
      reply,
      intent,
      history: this.conversationManager.getHistory(),
    };
  }
}

export const aiCopilotInstance = new AICopilot();
