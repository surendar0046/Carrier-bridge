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
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <span className="px-3 py-1 bg-amber-500/10 text-amber-400 text-xs font-bold rounded-full">
                ⭐ {mentor.rating || 4.9} Rating
              </span>
              <span className="text-xs text-slate-400">{mentor.totalSessions || 120}+ Sessions Conducted</span>
            </div>

            {mentor.phone && mentor.email && (
              <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
                <a
                  href={`https://wa.me/${(mentor.phone || '').replace(/\D/g, '').startsWith('91') ? (mentor.phone || '').replace(/\D/g, '') : `91${(mentor.phone || '').replace(/\D/g, '')}`}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium hover:bg-emerald-500/20 transition flex items-center gap-1.5"
                >
                  <span>💬</span> WhatsApp: +91 {mentor.phone}
                </a>
                <a
                  href={`mailto:${mentor.email}`}
                  className="px-3 py-1 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium hover:bg-blue-500/20 transition flex items-center gap-1.5"
                >
                  <span>✉️</span> Gmail: {mentor.email}
                </a>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={onBook}
          className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-2xl shadow-xl shadow-blue-500/25 transition shrink-0"
        >
          Book 1-on-1 Session (₹{mentor.hourlyRate || 1500}/hr)
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
