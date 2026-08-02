import { httpClient } from '../client/httpClient';
import { ChatRoom, Message, MessageType } from '@career-bridge/types';
import { ApiResponse } from '@career-bridge/types';
import { env } from '@career-bridge/config';

const MOCK_ROOMS: ChatRoom[] = [
  {
    id: 'room-001',
    participants: ['user-001', 'mentor-001'],
    lastMessage: {
      id: 'msg-010',
      roomId: 'room-001',
      senderId: 'mentor-001',
      senderName: 'Priya Sharma',
      type: MessageType.TEXT,
      content: 'Great progress! See you in our session tomorrow.',
      isRead: false,
      createdAt: new Date(Date.now() - 600000).toISOString(),
    },
    unreadCount: 2,
    createdAt: '2026-04-01T00:00:00Z',
    updatedAt: new Date().toISOString(),
  },
];

const MOCK_MESSAGES: Message[] = [
  { id: 'msg-001', roomId: 'room-001', senderId: 'user-001', senderName: 'Rahul Kumar', type: MessageType.TEXT, content: 'Hi Priya! I wanted to ask about system design prep.', isRead: true, createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: 'msg-002', roomId: 'room-001', senderId: 'mentor-001', senderName: 'Priya Sharma', senderAvatar: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=3b82f6&color=fff', type: MessageType.TEXT, content: 'Hello Rahul! Great topic. Start with Grokking the System Design course I shared earlier.', isRead: true, createdAt: new Date(Date.now() - 3500000).toISOString() },
  { id: 'msg-003', roomId: 'room-001', senderId: 'user-001', senderName: 'Rahul Kumar', type: MessageType.TEXT, content: 'Okay! I also have questions about HLD vs LLD.', isRead: true, createdAt: new Date(Date.now() - 3400000).toISOString() },
  { id: 'msg-004', roomId: 'room-001', senderId: 'mentor-001', senderName: 'Priya Sharma', senderAvatar: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=3b82f6&color=fff', type: MessageType.TEXT, content: "Great progress! See you in our session tomorrow.", isRead: false, createdAt: new Date(Date.now() - 600000).toISOString() },
];

const USE_MOCK = env.useMock;

export const chatService = {
  async getRooms(): Promise<ChatRoom[]> {
    if (USE_MOCK) return MOCK_ROOMS;
    const res = await httpClient.get<ApiResponse<ChatRoom[]>>('/chat/rooms');
    return res.data.data;
  },

  async getMessages(roomId: string): Promise<Message[]> {
    if (USE_MOCK) return MOCK_MESSAGES.filter((m) => m.roomId === roomId);
    const res = await httpClient.get<ApiResponse<Message[]>>(`/chat/rooms/${roomId}/messages`);
    return res.data.data;
  },

  async sendMessage(roomId: string, content: string): Promise<Message> {
    if (USE_MOCK) {
      return {
        id: `msg-${Date.now()}`,
        roomId,
        senderId: 'user-001',
        senderName: 'Rahul Kumar',
        type: MessageType.TEXT,
        content,
        isRead: false,
        createdAt: new Date().toISOString(),
      };
    }
    const res = await httpClient.post<ApiResponse<Message>>(`/chat/rooms/${roomId}/messages`, { content });
    return res.data.data;
  },
};
