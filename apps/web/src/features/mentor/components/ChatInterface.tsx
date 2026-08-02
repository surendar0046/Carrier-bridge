'use client';
import React, { useState } from 'react';
import { useChatStore } from '@career-bridge/store';

interface ChatInterfaceProps {
  conversationId: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ conversationId }) => {
  const { messages, sendMessage } = useChatStore();
  const [text, setText] = useState('');
  const chatMessages = messages[conversationId] || [];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    sendMessage(conversationId, text);
    setText('');
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl h-[550px] flex flex-col justify-between overflow-hidden">
      <div className="p-4 bg-slate-800/80 border-b border-slate-800 font-bold text-sm text-white flex items-center justify-between">
        <span>💬 Mentorship Live Chat</span>
        <span className="text-xs text-emerald-400 font-medium">● Active Now</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {chatMessages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.senderId === 'current-user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[75%] p-3 rounded-2xl text-xs leading-relaxed ${
                msg.senderId === 'current-user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} className="p-4 bg-slate-950 border-t border-slate-800 flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your message..."
          className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl transition"
        >
          Send
        </button>
      </form>
    </div>
  );
};
