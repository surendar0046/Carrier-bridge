'use client';
import React from 'react';

export const BadgeCollection: React.FC = () => {
  const badges = [
    { name: 'ATS Optimizer', icon: '📄', unlocked: true },
    { name: 'System Architect', icon: '🏛️', unlocked: true },
    { name: 'Mock Master', icon: '🎯', unlocked: true },
    { name: 'Streak 7-Day', icon: '🔥', unlocked: true },
    { name: 'AI Copilot Pioneer', icon: '🤖', unlocked: false },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
      <h3 className="text-base font-bold text-white">Earned Badges & Medals</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {badges.map((b, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-2xl border text-center transition ${
              b.unlocked
                ? 'bg-slate-950 border-blue-500/30 text-white'
                : 'bg-slate-950/40 border-slate-800 text-slate-600 opacity-50'
            }`}
          >
            <div className="text-3xl mb-1">{b.icon}</div>
            <span className="text-xs font-bold block">{b.name}</span>
            <span className="text-[10px] text-slate-400">{b.unlocked ? 'Unlocked' : 'Locked'}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
