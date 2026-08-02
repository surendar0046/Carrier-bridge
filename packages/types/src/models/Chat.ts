import { MessageType } from '../common/enums';

export interface ChatRoom {
  id: string;
  participantName?: string;
  participantRole?: string;
  participantAvatar?: string;
  lastMessage?: string | Message;
  lastMessageTime?: string;
  participants?: string[];
  unreadCount: number;
  createdAt?: string;
  updatedAt?: string;
}

export type ChatConversation = ChatRoom;

export interface Message {
  id: string;
  conversationId?: string;
  roomId?: string;
  senderId: string;
  senderName?: string;
  senderAvatar?: string;
  type?: MessageType | string;
  text?: string;
  content?: string;
  fileUrl?: string;
  isRead?: boolean;
  status?: 'sent' | 'delivered' | 'read' | string;
  timestamp?: string;
  createdAt?: string;
}

export type ChatMessage = Message;
