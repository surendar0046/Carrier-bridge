'use client';
import React from 'react';
import { Mentor } from '@career-bridge/types';

interface MentorProfileProps {
  mentor: Mentor;
  onBook: () => void;
}

export const MentorProfile: React.FC<MentorProfileProps> = ({ mentor, onBook }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-8 text-slate-200">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-6">
          <img
            src={mentor.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(mentor.name)}`}
            alt={mentor.name}
            className="w-24 h-24 rounded-3xl object-cover border-2 border-slate-700 shadow-xl"
          />
          <div>
            <h1 className="text-3xl font-extrabold text-white">{mentor.name}</h1>
            <p className="text-sm text-slate-400 font-medium">{mentor.title} at <span className="text-white font-semibold">{mentor.company}</span></p>
            <div className="flex items-center gap-3 mt-2">
              <span className="px-3 py-1 bg-amber-500/10 text-amber-400 text-xs font-bold rounded-full">
                ⭐ {mentor.rating || 4.9} Rating
              </span>
              <span className="text-xs text-slate-400">120+ Sessions Conducted</span>
            </div>
          </div>
        </div>

        <button
          onClick={onBook}
          className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-2xl shadow-xl shadow-blue-500/25 transition"
        >
          Book 1-on-1 Session (${mentor.hourlyRate || 80}/hr)
        </button>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-bold text-white">About Mentor</h3>
        <p className="text-sm text-slate-300 leading-relaxed">
          {mentor.bio || 'Senior Tech Leader specialized in scaling distributed services, career coaching, system design interviews, and resume optimization.'}
        </p>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-bold text-white">Expertise & Topics</h3>
        <div className="flex flex-wrap gap-2">
          {mentor.expertise?.map((exp, idx) => (
            <span key={idx} className="px-3 py-1.5 bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium rounded-xl">
              {exp}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
