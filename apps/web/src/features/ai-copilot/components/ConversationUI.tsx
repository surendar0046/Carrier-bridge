'use client';
import React, { useState } from 'react';
import { useAIStore } from '@career-bridge/store';

export const ConversationUI: React.FC = () => {
  const { messages, askCopilot, isGenerating } = useAIStore();
  const [input, setInput] = useState('');

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isGenerating) return;
    const text = input;
    setInput('');
    await askCopilot(text);
  };

  return (
    <div className="h-full flex flex-col justify-between p-4 space-y-4">
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {messages.length === 0 ? (
          <div className="text-center text-slate-500 py-12 text-xs">
            <div className="text-3xl mb-2">🤖</div>
            <p className="font-semibold text-slate-400">How can I assist your career today?</p>
            <p className="text-[11px] text-slate-500 mt-1">Try asking about job recommendations, ATS scores, or skill roadmaps.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none font-medium'
                    : 'bg-slate-800 text-slate-200 border border-slate-700/60 rounded-bl-none'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
        {isGenerating && (
          <div className="flex justify-start">
            <div className="bg-slate-800 border border-slate-700/60 px-4 py-2.5 rounded-2xl text-xs text-slate-400 animate-pulse">
              AI is analyzing...
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything..."
          className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          disabled={!input.trim() || isGenerating}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs rounded-xl transition"
        >
          Send
        </button>
      </form>
    </div>
  );
};
