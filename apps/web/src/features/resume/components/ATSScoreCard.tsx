'use client';
import React from 'react';

interface ATSScoreCardProps {
  score: number;
}

export const ATSScoreCard: React.FC<ATSScoreCardProps> = ({ score }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 p-1 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center font-extrabold text-2xl text-emerald-400">
            {score}%
          </div>
        </div>
        <div>
          <h3 className="text-lg font-extrabold text-white">ATS Resume Optimization Score</h3>
          <p className="text-xs text-slate-400 mt-1">High compatibility with Fortune 500 applicant tracking parsers.</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold rounded-full">
          Ready for Submission
        </span>
      </div>
    </div>
  );
};
