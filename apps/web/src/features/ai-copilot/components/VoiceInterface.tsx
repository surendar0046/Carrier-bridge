'use client';
import React, { useState } from 'react';
import { useAIStore } from '@career-bridge/store';

export const VoiceInterface: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const { askCopilot } = useAIStore();

  const toggleListening = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false);
        askCopilot('Show me high matching jobs for Senior Full Stack Engineer.');
      }, 3000);
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-6">
      <div className="relative">
        {isListening && (
          <div className="absolute -inset-4 rounded-full bg-blue-500/20 animate-ping" />
        )}
        <button
          onClick={toggleListening}
          className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl shadow-2xl transition transform hover:scale-105 ${
            isListening
              ? 'bg-rose-600 text-white shadow-rose-500/30'
              : 'bg-blue-600 text-white shadow-blue-500/30'
          }`}
        >
          {isListening ? '🎙️' : '🎤'}
        </button>
      </div>

      <div>
        <h4 className="text-base font-bold text-slate-900">
          {isListening ? 'Listening...' : 'Tap to speak'}
        </h4>
        <p className="text-xs text-slate-500 mt-1">
          {isListening ? 'Say a command like "Open jobs" or "Find a mentor"' : 'Voice command interface is active'}
        </p>
      </div>
    </div>
  );
};
