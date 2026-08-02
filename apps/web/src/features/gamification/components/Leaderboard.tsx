'use client';
import React from 'react';

export const Leaderboard: React.FC = () => {
  const users = [
    { rank: 1, name: 'Arjun Mehta', xp: '14,250 XP', avatar: 'https://ui-avatars.com/api/?name=Arjun+Mehta' },
    { rank: 2, name: 'Alex Morgan (You)', xp: '12,480 XP', avatar: 'https://ui-avatars.com/api/?name=Alex+Morgan' },
    { rank: 3, name: 'Sneha Reddy', xp: '11,900 XP', avatar: 'https://ui-avatars.com/api/?name=Sneha+Reddy' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
      <h3 className="text-base font-bold text-white">Global Career Leaderboard</h3>
      <div className="space-y-2">
        {users.map((u) => (
          <div key={u.rank} className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-2xl">
            <div className="flex items-center gap-3">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${u.rank === 1 ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}>
                {u.rank}
              </span>
              <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full border border-slate-700" />
              <span className="text-xs font-bold text-white">{u.name}</span>
            </div>
            <span className="text-xs font-extrabold text-blue-400">{u.xp}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
