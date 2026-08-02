import { create } from 'zustand';
import { ChatMessage, ChatConversation } from '@career-bridge/types';

interface ChatState {
  conversations: ChatConversation[];
  activeConversationId: string | null;
  messages: Record<string, ChatMessage[]>;
  unreadCount: number;
  isLoading: boolean;
  error: string | null;

  setActiveConversation: (id: string | null) => void;
  sendMessage: (conversationId: string, text: string) => Promise<void>;
  addIncomingMessage: (msg: ChatMessage) => void;
  fetchConversations: () => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
  markAsRead: (conversationId: string) => void;
}

export const useChatStore = create<ChatState>()((set, get) => ({
  conversations: [],
  activeConversationId: null,
  messages: {},
  unreadCount: 0,
  isLoading: false,
  error: null,

  setActiveConversation: (id) => set({ activeConversationId: id }),

  sendMessage: async (conversationId, text) => {
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: 'current-user',
      senderName: 'You',
      text,
      timestamp: new Date().toISOString(),
      status: 'sent',
    };

    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: [...(state.messages[conversationId] || []), newMessage],
      },
    }));
  },

  addIncomingMessage: (msg) => {
    set((state) => {
      const convId = msg.conversationId || msg.roomId || 'default';
      const currentMsgs = state.messages[convId] || [];
      const updatedUnread = state.activeConversationId === convId ? state.unreadCount : state.unreadCount + 1;
      return {
        messages: {
          ...state.messages,
          [convId]: [...currentMsgs, msg],
        },
        unreadCount: updatedUnread,
      };
    });
  },

  fetchConversations: async () => {
    set({ isLoading: true, error: null });
    try {
      const mockConversations: ChatConversation[] = [
        {
          id: 'conv-1',
          participantName: 'Arjun Mehta',
          participantRole: 'Senior Mentor',
          participantAvatar: 'https://ui-avatars.com/api/?name=Arjun+Mehta',
          lastMessage: 'Let\'s connect for our mock interview session tomorrow!',
          lastMessageTime: '10:30 AM',
          unreadCount: 1,
        },
        {
          id: 'conv-2',
          participantName: 'TechCorp Hiring Team',
          participantRole: 'Recruiter',
          participantAvatar: 'https://ui-avatars.com/api/?name=TechCorp',
          lastMessage: 'Your application for Frontend Engineer has been shortlisted.',
          lastMessageTime: 'Yesterday',
          unreadCount: 0,
        },
      ];
      set({ conversations: mockConversations, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  fetchMessages: async (conversationId) => {
    set({ isLoading: true });
    try {
      const initialMsgs: ChatMessage[] = [
        {
          id: 'm1',
          conversationId,
          senderId: 'peer',
          senderName: 'Arjun Mehta',
          text: 'Hello! Excited to help with your career journey.',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          status: 'delivered',
        },
      ];
      set((state) => ({
        messages: {
          ...state.messages,
          [conversationId]: state.messages[conversationId] || initialMsgs,
        },
        isLoading: false,
      }));
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  markAsRead: (conversationId) => {
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId ? { ...c, unreadCount: 0 } : c
      ),
    }));
  },
}));
