'use client';
import React from 'react';
import { Job } from '@career-bridge/types';
import { JobCard } from './JobCard';

interface JobListProps {
  jobs: Job[];
  isLoading?: boolean;
  onApply?: (jobId: string) => void;
}

export const JobList: React.FC<JobListProps> = ({ jobs, isLoading, onApply }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-48 bg-slate-900 border border-slate-800 rounded-3xl animate-pulse p-6" />
        ))}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl text-slate-400">
        <p className="font-semibold text-lg">No jobs found matching your criteria</p>
        <p className="text-xs text-slate-500 mt-1">Try adjusting your filters or search prompt.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {jobs.map(job => (
        <JobCard key={job.id} job={job} onApply={onApply} />
      ))}
    </div>
  );
};
