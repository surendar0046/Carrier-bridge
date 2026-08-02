'use client';
import React from 'react';
import { Job } from '@career-bridge/types';
import Link from 'next/link';

interface JobCardProps {
  job: Job;
  onApply?: (jobId: string) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onApply }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 hover:border-blue-500/40 rounded-3xl p-6 transition duration-200 shadow-lg flex flex-col justify-between group">
      <div>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-700 flex items-center justify-center font-bold text-white text-lg border border-slate-700">
              {job.company?.[0] || '🏢'}
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white group-hover:text-blue-400 transition">{job.title}</h3>
              <p className="text-xs text-slate-400 font-medium">{job.company} • {job.location}</p>
            </div>
          </div>
          {job.matchPercentage && (
            <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full">
              {job.matchPercentage}% Match
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {job.skills?.slice(0, 4).map((skill, i) => (
            <span key={i} className="px-2.5 py-1 bg-slate-800 border border-slate-700/60 text-slate-300 text-[11px] font-medium rounded-lg">
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
        <span className="text-xs font-bold text-slate-300">{job.salaryRange || 'Competitive'}</span>
        <div className="flex items-center gap-2">
          <Link
            href={`/jobs/${job.id}`}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition"
          >
            View Details
          </Link>
          {onApply && (
            <button
              onClick={() => onApply(job.id)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition shadow-md shadow-blue-500/20"
            >
              Apply
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
