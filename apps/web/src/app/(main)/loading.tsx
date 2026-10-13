import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-full p-6 sm:p-8 space-y-6 animate-pulse">
      {/* Top Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/60">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-slate-200/80 rounded-2xl" />
          <div className="h-4 w-96 max-w-full bg-slate-200/50 rounded-xl" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-28 bg-slate-200/70 rounded-xl" />
          <div className="h-10 w-10 bg-slate-200/60 rounded-xl" />
        </div>
      </div>

      {/* KPI Stats / Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-32 bg-white/70 border border-slate-200/70 rounded-3xl p-5 flex flex-col justify-between shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 bg-slate-200/80 rounded-2xl" />
              <div className="w-12 h-4 bg-slate-200/50 rounded-lg" />
            </div>
            <div className="space-y-1.5">
              <div className="h-6 w-20 bg-slate-200/80 rounded-lg" />
              <div className="h-3 w-28 bg-slate-200/50 rounded-md" />
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Skeleton Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        <div className="lg:col-span-2 space-y-5">
          <div className="h-72 bg-white/70 border border-slate-200/70 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
            <div className="h-5 w-40 bg-slate-200/80 rounded-lg" />
            <div className="space-y-3">
              <div className="h-4 w-full bg-slate-200/60 rounded-lg" />
              <div className="h-4 w-5/6 bg-slate-200/50 rounded-lg" />
              <div className="h-4 w-3/4 bg-slate-200/40 rounded-lg" />
            </div>
            <div className="h-10 w-36 bg-slate-200/70 rounded-xl" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-44 bg-white/70 border border-slate-200/70 rounded-3xl p-5 shadow-sm space-y-3">
                <div className="h-5 w-32 bg-slate-200/80 rounded-lg" />
                <div className="h-3 w-48 bg-slate-200/50 rounded-md" />
                <div className="h-8 w-full bg-slate-200/40 rounded-xl mt-4" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar Widget Skeleton */}
        <div className="space-y-5">
          <div className="h-96 bg-white/70 border border-slate-200/70 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="h-5 w-32 bg-slate-200/80 rounded-lg mb-4" />
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-200/70 rounded-xl flex-shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-3.5 w-3/4 bg-slate-200/70 rounded" />
                  <div className="h-2.5 w-1/2 bg-slate-200/40 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
