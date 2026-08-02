'use client';
import React from 'react';
import { Mentor } from '@career-bridge/types';
import Link from 'next/link';

interface MentorCardProps {
  mentor: Mentor;
  onBook?: (mentorId: string) => void;
}

export const MentorCard: React.FC<MentorCardProps> = ({ mentor, onBook }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 hover:border-blue-500/40 rounded-3xl p-6 transition duration-200 shadow-lg flex flex-col justify-between group">
      <div>
        <div className="flex items-center gap-4 mb-4">
          <img
            src={mentor.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(mentor.name)}`}
            alt={mentor.name}
            className="w-14 h-14 rounded-2xl object-cover border border-slate-700"
          />
          <div>
            <h3 className="font-extrabold text-base text-white group-hover:text-blue-400 transition">{mentor.name}</h3>
            <p className="text-xs text-slate-400 font-medium">{mentor.title} at {mentor.company}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-bold text-amber-400">⭐ {mentor.rating || 4.9}</span>
              <span className="text-[11px] text-slate-500">({mentor.reviewCount || 42} reviews)</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {mentor.expertise?.slice(0, 3).map((exp, i) => (
            <span key={i} className="px-2.5 py-1 bg-slate-800 border border-slate-700/60 text-slate-300 text-[11px] font-medium rounded-lg">
              {exp}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
        <span className="text-xs font-bold text-slate-300">${mentor.hourlyRate || 80}/hr</span>
        <div className="flex items-center gap-2">
          <Link
            href={`/mentor/${mentor.id}`}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition"
          >
            Profile
          </Link>
          {onBook && (
            <button
              onClick={() => onBook(mentor.id)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition shadow-md shadow-blue-500/20"
            >
              Book Session
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
