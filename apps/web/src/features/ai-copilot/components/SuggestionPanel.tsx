'use client';
import React from 'react';
import { useAIStore } from '@career-bridge/store';

export const SuggestionPanel: React.FC = () => {
  const { askCopilot } = useAIStore();

  const suggestions = [
    { title: '🎯 Analyze my ATS Score', prompt: 'Analyze my current resume for ATS score and suggest improvements.' },
    { title: '💼 Top Job Matches for Me', prompt: 'Find the top 3 job matches based on my profile skills.' },
    { title: '🗺️ Recommend a Learning Roadmap', prompt: 'Create a 3-month learning roadmap for a Full Stack Lead role.' },
    { title: '👨‍🏫 Match Me with a Mentor', prompt: 'Recommend a senior mentor for System Design mock interviews.' },
  ];

  return (
    <div className="p-4 space-y-3 bg-white">
      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Quick Actions</h4>
      <div className="space-y-2">
        {suggestions.map((item, idx) => (
          <button
            key={idx}
            onClick={() => askCopilot(item.prompt)}
            className="w-full text-left p-3.5 bg-white hover:bg-blue-50/50 border border-slate-200 hover:border-blue-400 rounded-2xl transition shadow-sm group"
          >
            <span className="text-sm font-semibold text-slate-800 group-hover:text-blue-600">{item.title}</span>
            <p className="text-xs text-slate-500 mt-1 line-clamp-1">{item.prompt}</p>
          </button>
        ))}
      </div>
    </div>
  );
};
