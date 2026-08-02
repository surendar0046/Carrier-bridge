'use client';
import React, { useEffect, useState } from 'react';

interface AchievementPopupProps {
  title: string;
  xpReward: number;
}

export const AchievementPopup: React.FC<AchievementPopupProps> = ({ title, xpReward }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-8 left-8 z-50 bg-slate-900 border border-amber-500/40 rounded-2xl p-4 shadow-2xl flex items-center gap-4 animate-in slide-in-from-left duration-300">
      <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-2xl font-bold border border-amber-500/30">
        🏆
      </div>
      <div>
        <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Achievement Unlocked</span>
        <h4 className="text-sm font-bold text-white">{title}</h4>
        <p className="text-xs text-amber-300 font-semibold mt-0.5">+{xpReward} XP Points Granted</p>
      </div>
    </div>
  );
};
