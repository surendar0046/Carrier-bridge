'use client';
import React from 'react';
import { Job } from '@career-bridge/types';

interface JobDetailsProps {
  job: Job;
  onApply: () => void;
}

export const JobDetails: React.FC<JobDetailsProps> = ({ job, onApply }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-8 text-slate-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-6">
        <div>
          <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-bold rounded-full mb-3 inline-block">
            {job.type || 'Full-Time'}
          </span>
          <h1 className="text-3xl font-extrabold text-white">{job.title}</h1>
          <p className="text-sm text-slate-400 mt-1 font-medium">{job.company} • {job.location}</p>
        </div>
        <button
          onClick={onApply}
          className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-2xl shadow-xl shadow-blue-500/25 transition"
        >
          Apply Now
        </button>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white">About the Role</h3>
        <p className="text-sm text-slate-300 leading-relaxed">{job.description}</p>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-bold text-white">Required Skills</h3>
        <div className="flex flex-wrap gap-2">
          {job.skills?.map((skill, idx) => (
            <span key={idx} className="px-3 py-1.5 bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium rounded-xl">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
