export interface RealtimeChatMessage {
  id: string;
  conversationId: string;
  text: string;
  timestamp: string;
}

export const useChatRealtime = (conversationId: string) => {
  let messages: RealtimeChatMessage[] = [];

  const sendMessage = (text: string) => {
    const msg: RealtimeChatMessage = { id: `m-${Date.now()}`, conversationId, text, timestamp: new Date().toISOString() };
    messages.push(msg);
  };

  return { messages, sendMessage };
};
