import { useChatStore } from '@career-bridge/store';

export const useChat = () => {
  const store = useChatStore();
  return {
    conversations: store.conversations,
    messages: store.messages,
    sendMessage: store.sendMessage,
    fetchConversations: store.fetchConversations,
  };
};
