'use client';
import React, { useState } from 'react';
import { ConversationUI } from './ConversationUI';
import { SuggestionPanel } from './SuggestionPanel';
import { VoiceInterface } from './VoiceInterface';

export const CopilotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'voice' | 'suggestions'>('chat');

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="w-[420px] h-[600px] bg-white border border-slate-200 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-800 animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-blue-500/20">
                ✨
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">Niral AI Copilot</h3>
                <p className="text-[11px] text-blue-600 font-medium">Real-time Career Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition"
            >
              ✕
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-2.5 text-center transition ${activeTab === 'chat' ? 'text-blue-600 border-b-2 border-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'}`}
            >
              💬 Chat
            </button>
            <button
              onClick={() => setActiveTab('voice')}
              className={`flex-1 py-2.5 text-center transition ${activeTab === 'voice' ? 'text-blue-600 border-b-2 border-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'}`}
            >
              🎙️ Voice
            </button>
            <button
              onClick={() => setActiveTab('suggestions')}
              className={`flex-1 py-2.5 text-center transition ${activeTab === 'suggestions' ? 'text-blue-600 border-b-2 border-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'}`}
            >
              💡 Suggestions
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'chat' && <ConversationUI />}
            {activeTab === 'voice' && <VoiceInterface />}
            {activeTab === 'suggestions' && <SuggestionPanel />}
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="px-5 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-full font-bold shadow-xl shadow-blue-500/25 flex items-center gap-3 transition transform hover:scale-105"
        >
          <span className="text-xl">✨</span>
          <span className="text-sm">Ask AI Copilot</span>
        </button>
      )}
    </div>
  );
};
