'use client';
import React from 'react';

interface XPProgressProps {
  currentXP: number;
  nextLevelXP: number;
  level: number;
}

export const XPProgress: React.FC<XPProgressProps> = ({ currentXP, nextLevelXP, level }) => {
  const percent = Math.min(100, Math.round((currentXP / Math.max(1, nextLevelXP)) * 100));

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-white">Level {level} Architect</span>
        <span className="font-extrabold text-amber-400">{currentXP} / {nextLevelXP} XP</span>
      </div>
      <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
        <div
          className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500 rounded-full"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};
