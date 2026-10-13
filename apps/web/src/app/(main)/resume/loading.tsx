import React from 'react';

export default function ResumeLoading() {
  return (
    <div className="min-h-full p-6 sm:p-8 animate-pulse">
      {/* Header */}
      <div className="mb-8 space-y-2">
        <div className="h-8 w-52 bg-slate-200/80 rounded-2xl" />
        <div className="h-4 w-80 bg-slate-200/50 rounded-xl" />
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-5">
            <div className="w-14 h-14 bg-slate-200/80 rounded-2xl" />
            <div className="space-y-2">
              <div className="h-6 w-40 bg-slate-200/80 rounded-lg" />
              <div className="h-4 w-full bg-slate-200/50 rounded" />
              <div className="h-4 w-5/6 bg-slate-200/40 rounded" />
            </div>
            <div className="h-10 w-36 bg-slate-200/60 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}
