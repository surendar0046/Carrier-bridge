'use client';
import React from 'react';

interface JobFiltersProps {
  onSearchChange: (search: string) => void;
  onTypeChange: (type: string) => void;
}

export const JobFilters: React.FC<JobFiltersProps> = ({ onSearchChange, onTypeChange }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
      <div className="w-full md:w-1/2 relative">
        <input
          type="text"
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search job title, skill (e.g. Next.js, AI Engine)..."
          className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />
        <span className="absolute left-3.5 top-3 text-slate-500">🔍</span>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        <select
          onChange={(e) => onTypeChange(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-300 focus:outline-none focus:border-blue-500"
        >
          <option value="">All Job Types</option>
          <option value="FULL_TIME">Full Time</option>
          <option value="REMOTE">Remote</option>
          <option value="HYBRID">Hybrid</option>
          <option value="CONTRACT">Contract</option>
        </select>
      </div>
    </div>
  );
};
