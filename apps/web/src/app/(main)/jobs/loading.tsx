import React from 'react';

export default function JobsLoading() {
  return (
    <div className="min-h-full p-6 sm:p-8 animate-pulse">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-slate-200/80 rounded-2xl" />
          <div className="h-4 w-72 bg-slate-200/50 rounded-xl" />
        </div>
        <div className="h-10 w-36 bg-slate-200/70 rounded-xl" />
      </div>

      {/* Filters row */}
      <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-9 w-24 flex-shrink-0 bg-slate-200/60 rounded-xl" />
        ))}
      </div>

      {/* Job cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-slate-200/80 rounded-2xl flex-shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-slate-200/80 rounded w-3/4" />
                <div className="h-3 bg-slate-200/50 rounded w-1/2" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-slate-200/50 rounded w-full" />
              <div className="h-3 bg-slate-200/40 rounded w-4/5" />
            </div>
            <div className="flex gap-2">
              <div className="h-6 w-16 bg-slate-200/60 rounded-lg" />
              <div className="h-6 w-20 bg-slate-200/60 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
