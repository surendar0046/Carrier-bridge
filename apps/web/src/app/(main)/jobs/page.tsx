'use client';
import { useEffect, useState, useCallback } from 'react';
import { useJobsStore } from '@career-bridge/store';
import { Job, JobType } from '@career-bridge/types';
import Link from 'next/link';

export default function JobsPage() {
  const { 
    jobs, 
    realTimeJobs, 
    isLoading, 
    error, 
    fetchJobs, 
    searchRealTimeJobs, 
    filters, 
    setFilters 
  } = useJobsStore();
  
  const [keyword, setKeyword] = useState('');
  const [mode, setMode] = useState<'matched' | 'realtime'>('matched');

  // Memoized search handler to avoid dependency cycles
  const handleSearch = useCallback(() => {
    if (mode === 'matched') {
      fetchJobs({ keyword });
    } else {
      searchRealTimeJobs(keyword || 'Software Engineer');
    }
  }, [mode, keyword, fetchJobs, searchRealTimeJobs]);

  // Initial fetch and mode-switch fetch
  useEffect(() => { 
    if (mode === 'matched') {
      fetchJobs({ keyword }); 
    } else {
      // Automatically fetch some real-time jobs if list is empty
      if (realTimeJobs.length === 0) {
        searchRealTimeJobs(keyword || 'Software Engineer');
      }
    }
  }, [mode, fetchJobs, searchRealTimeJobs]); // Added dependencies for reliability

  const toggleFilter = (filterName: 'Remote' | 'Full Time' | 'Internship' | 'Contract') => {
    const newFilters = { ...filters };
    if (filterName === 'Remote') {
      newFilters.isRemote = filters.isRemote ? undefined : true;
    } else {
      let typeEnum: JobType;
      if (filterName === 'Full Time') typeEnum = JobType.FULL_TIME;
      else if (filterName === 'Internship') typeEnum = JobType.INTERNSHIP;
      else typeEnum = JobType.CONTRACT;

      const currentTypes = filters.type || [];
      if (currentTypes.includes(typeEnum)) {
        newFilters.type = currentTypes.filter(t => t !== typeEnum);
        if (newFilters.type.length === 0) newFilters.type = undefined;
      } else {
        newFilters.type = [...currentTypes, typeEnum];
      }
    }
    setFilters(newFilters);
    if (mode === 'matched') {
      fetchJobs(newFilters);
    }
  };

  let displayedJobs = mode === 'matched' ? jobs : realTimeJobs;

  if (filters.isRemote) {
    displayedJobs = displayedJobs.filter(j => j.isRemote);
  }
  if (filters.type && filters.type.length > 0) {
    displayedJobs = displayedJobs.filter(j => (filters.type as any)?.includes(j.type));
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-black">Job <span className="text-gradient">Board</span> 💼</h1>
              {isLoading && (
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
                </div>
              )}
            </div>
            <p className="text-slate-400 font-medium">Find your next career milestone with AI-powered matching.</p>
          </div>
          <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-white/5 backdrop-blur-xl">
            <button 
              onClick={() => setMode('matched')}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${mode === 'matched' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 scale-105' : 'text-slate-500 hover:text-slate-300'}`}
            >
              AI Matched
            </button>
            <button 
              onClick={() => setMode('realtime')}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${mode === 'realtime' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 scale-105' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Real-time
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-4 text-red-400">
            <span className="text-xl">⚠️</span>
            <div className="flex-1 text-sm font-bold">
              {error}. <button onClick={handleSearch} className="underline hover:text-red-300 ml-2">Try again</button>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <div className="flex-1 relative group">
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder={mode === 'matched' ? "Search by role, company, or skills..." : "Search live jobs across the web..."}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 transition-all group-hover:border-white/20"
            />
            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-blue-400 transition-colors">🔍</span>
          </div>
          <button 
            onClick={handleSearch} 
            disabled={isLoading}
            className="px-10 py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20 active:scale-95"
          >
            {isLoading ? 'Searching...' : 'Search Jobs'}
          </button>
        </div>

        {/* Filters for Matched & Real-time Search Modes */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
          {['Remote', 'Full Time', 'Internship', 'Contract'].map((f) => {
            const isActive = f === 'Remote'
              ? !!filters.isRemote
              : filters.type?.includes(
                  f === 'Full Time' ? JobType.FULL_TIME :
                  f === 'Internship' ? JobType.INTERNSHIP :
                  JobType.CONTRACT
                );
            return (
              <button
                key={f}
                onClick={() => toggleFilter(f as any)}
                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                  isActive 
                    ? 'bg-blue-500/10 border-blue-500 text-blue-400' 
                    : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-white/20 hover:text-slate-300'
                }`}
              >
                {f}
              </button>
            );
          })}
        </div>

        {/* Jobs List */}
        <div className="space-y-6">
          {isLoading ? (
            [1,2,3].map(i => (
              <div key={i} className="glass-card p-8 animate-pulse border-white/5">
                <div className="flex gap-6">
                  <div className="w-16 h-16 bg-slate-800/50 rounded-2xl" />
                  <div className="flex-1 space-y-4">
                    <div className="h-6 bg-slate-800/50 rounded-lg w-1/3" />
                    <div className="h-4 bg-slate-800/50 rounded-lg w-1/4" />
                    <div className="h-20 bg-slate-800/50 rounded-2xl w-full" />
                  </div>
                </div>
              </div>
            ))
          ) : displayedJobs.length > 0 ? (
            displayedJobs.map((job: Job) => (
              <div key={job.id} className="glass-card p-8 hover:border-blue-500/40 hover:shadow-2xl hover:shadow-blue-500/5 transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl -mr-24 -mt-24 group-hover:bg-blue-500/10 transition-all duration-700" />
                <div className="flex flex-col sm:flex-row items-start gap-6 relative z-10">
                  <img src={job.companyLogo} alt={job.company} className="w-16 h-16 rounded-2xl bg-white shadow-xl object-contain p-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0 w-full">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-4">
                      <div>
                        <h2 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors leading-tight">{job.title}</h2>
                        <p className="text-slate-400 font-bold mt-1">{job.company} <span className="text-slate-600 mx-2">|</span> {job.location}</p>
                      </div>
                      <div className="text-left lg:text-right flex-shrink-0">
                        {job.salary && (
                          <div className="text-lg font-black text-emerald-400 mb-1">
                            {job.salary.min > 0 ? `₹${(job.salary.min/1000).toFixed(0)}k–${(job.salary.max/1000).toFixed(0)}k/mo` : 'Salary Disclosed on Interview'}
                          </div>
                        )}
                        {job.matchScore && (
                          <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20 inline-flex items-center gap-2">
                             <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                             {job.matchScore}% AI Match Score
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-slate-500 text-sm line-clamp-3 leading-relaxed font-medium mb-6">{job.description}</p>
                    <div className="flex flex-wrap gap-2 mb-8">
                      {job.skills?.slice(0, 5).map((skill) => (
                        <span key={skill} className="text-[10px] font-bold bg-white/5 text-slate-400 px-3 py-1.5 rounded-xl border border-white/5">{skill}</span>
                      ))}
                      {job.type && <span className="text-[10px] font-black uppercase tracking-widest bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded-xl border border-blue-500/20">{String(job.type).replace('_', ' ')}</span>}
                      {job.isRemote && <span className="text-[10px] font-black uppercase tracking-widest bg-indigo-500/10 text-indigo-400 px-3 py-1.5 rounded-xl border border-indigo-500/20">🌐 Remote</span>}
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        {mode === 'matched' ? `${job.applicants || 0} active applicants · ` : ''}
                        Posted on {new Date(job.postedAt || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      {mode === 'matched' ? (
                        <Link href={`/jobs/${job.id}`} className="btn-primary py-3 px-8 text-[11px] w-full sm:w-auto text-center">Apply with Niral AI →</Link>
                      ) : (
                        <a href={job.applyUrl} target="_blank" rel="noopener noreferrer" className="btn-primary py-3 px-8 text-[11px] w-full sm:w-auto text-center bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20">Apply on Original Site ↗</a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-32 glass-card border-dashed border-white/10 backdrop-blur-sm">
              <div className="text-7xl mb-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500 cursor-default">🕵️‍♂️</div>
              <h3 className="text-2xl font-black text-white mb-3">No Opportunities Found</h3>
              <p className="text-slate-500 font-medium max-w-md mx-auto mb-8">
                We couldn't find any jobs matching "{keyword || 'your preferences'}". 
                Try expanding your search or switching to Real-time mode.
              </p>
              <button 
                onClick={() => { setKeyword(''); handleSearch(); }}
                className="text-blue-400 hover:text-blue-300 font-black text-xs uppercase tracking-widest transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
