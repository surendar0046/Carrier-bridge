'use client';
import React from 'react';

interface ProgressTrackerProps {
  progressPercentage: number;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({ progressPercentage }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-white">Course Completion Progress</span>
        <span className="font-extrabold text-blue-400">{progressPercentage}%</span>
      </div>
      <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
        <div
          className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-500 rounded-full"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
};
