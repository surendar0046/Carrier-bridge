import { useAIStore } from '@career-bridge/store';

export const useAICopilot = () => {
  const store = useAIStore();
  return {
    messages: store.messages,
    isGenerating: store.isGenerating,
    askCopilot: store.askCopilot,
    clearMessages: store.clearMessages,
  };
};
