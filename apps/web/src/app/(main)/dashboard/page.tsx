'use client';
import React, { useEffect, useState } from 'react';
import { useJobsStore, useUserStore, useGamificationStore, useAuthStore, useMentorStore } from '@career-bridge/store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { fetchFeaturedJobs, featuredJobs, applications, fetchApplications } = useJobsStore();
  const { profile, activeRole, updateActiveRole, fetchProfile } = useUserStore();
  const { profile: gamProfile, fetchProfile: fetchGam } = useGamificationStore();
  const { sessions, fetchMySessions } = useMentorStore();
  const { isAuthenticated } = useAuthStore();
  const [loaded, setLoaded] = useState(false);
  const [isEditingRole, setIsEditingRole] = useState(false);
  const [newRole, setNewRole] = useState('');
  
  const router = useRouter();
  const fetchedRef = React.useRef(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }
    
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    
    // Phase 1: Critical data — show UI immediately once these resolve
    Promise.allSettled([
      fetchProfile(),
      fetchFeaturedJobs(),
    ]).then(() => {
      setLoaded(true);
    });

    // Phase 2: Secondary data — load in background, no UI block
    Promise.allSettled([
      fetchGam(),
      fetchApplications(),
      fetchMySessions(),
    ]).catch(() => {/* non-critical, fail silently */});
  }, [isAuthenticated, router, fetchProfile, fetchFeaturedJobs, fetchGam, fetchApplications, fetchMySessions]);


  const stats = [
    { 
      label: 'Applications', 
      value: applications?.length || 0, 
      icon: '💼', 
      color: 'from-blue-500 to-indigo-600', 
      shadow: 'shadow-blue-500/20' 
    },
    { 
      label: 'Interviews', 
      value: sessions?.filter((s: any) => s.status === 'scheduled')?.length || 0, 
      icon: '🎯', 
      color: 'from-emerald-500 to-teal-600', 
      shadow: 'shadow-emerald-500/20' 
    },
    { 
      label: 'XP Points', 
      value: gamProfile?.xp?.toLocaleString() || 0, 
      icon: '⚡', 
      color: 'from-orange-500 to-amber-600', 
      shadow: 'shadow-orange-500/20' 
    },
    { 
      label: 'Streak', 
      value: `${gamProfile?.streak || 0} Days`, 
      icon: '🔥', 
      color: 'from-rose-500 to-pink-600', 
      shadow: 'shadow-rose-500/20' 
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-800 p-8 relative overflow-hidden">
       {/* Background Decoration */}
       <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
       
       <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
                Welcome back, <span className="text-gradient">{profile?.name?.split(' ')[0] || 'User'}</span> ✨
              </h1>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Live</span>
              </div>
            </div>
            <p className="text-slate-500 font-medium">Your career trajectory is looking promising today.</p>
          </div>
          <div className="flex items-center gap-4">
             <Link href="/ai-copilot" className="btn-primary flex items-center gap-2 py-2.5">
               <span className="text-lg">🤖</span> Ask AI
             </Link>
          </div>
        </div>

        {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {stats.map((stat, idx) => (
                <div key={stat.label} className={`bg-gradient-to-br ${stat.color} rounded-[2rem] p-6 text-white ${stat.shadow} shadow-2xl transition-transform hover:scale-[1.03] duration-300 animate-float`} style={{ animationDelay: `${idx * 0.5}s` }}>
                  <div className="text-4xl mb-4 bg-white/20 w-14 h-14 rounded-2xl flex items-center justify-center backdrop-blur-md">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-black mb-1">{stat.value}</div>
                  <div className="text-sm font-bold opacity-80 uppercase tracking-widest">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content Column */}
              <div className="lg:col-span-2 space-y-8">
                {/* XP & Level Section */}
                <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm premium-glow-card">
                  <div className="flex justify-between items-end mb-6">
                    <div>
                      <div className="text-xs font-bold text-blue-600 uppercase tracking-[0.2em] mb-2">Current Career Path</div>
                      {isEditingRole ? (
                        <div className="flex items-center gap-2 mt-1">
                           <input 
                             type="text" 
                             value={newRole} 
                             onChange={e => setNewRole(e.target.value)} 
                             className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm font-bold text-slate-900 outline-none focus:border-blue-500" 
                             placeholder="e.g. Data Scientist" 
                             autoFocus
                           />
                           <button 
                             onClick={() => { 
                               if (newRole.trim()) { 
                                 updateActiveRole(newRole.trim()); 
                               } 
                               setIsEditingRole(false); 
                             }} 
                             className="bg-blue-600 hover:bg-blue-700 transition-colors text-white text-xs px-3 py-2 rounded-lg font-bold"
                           >
                             Save
                           </button>
                           <button 
                             onClick={() => setIsEditingRole(false)} 
                             className="text-slate-500 hover:text-slate-700 text-xs px-2 font-bold"
                           >
                             Cancel
                           </button>
                        </div>
                      ) : (
                        <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                           {activeRole || 'Not Selected'}
                           <button 
                             onClick={() => { 
                               setNewRole(activeRole || ''); 
                               setIsEditingRole(true); 
                             }} 
                             className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 transition-colors px-2 py-1 rounded-md border border-blue-200"
                           >
                             ✎ Edit Role
                           </button>
                        </h3>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-slate-800">{gamProfile?.xp || 0}</span>
                      <span className="text-slate-400 font-bold"> / {gamProfile?.nextLevelXp || 1000} XP</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-4 p-1 mb-6 border border-slate-200">
                    <div 
                      className="bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 h-2 rounded-full transition-all duration-1000 shadow-sm"
                      style={{ width: `${Math.min(((gamProfile?.xp || 0) / (gamProfile?.nextLevelXp || 1000)) * 100, 100)}%` }}
                    />
                  </div>
                  <div className="flex flex-wrap gap-4">
                    {gamProfile?.badges?.map((badge) => (
                      <div key={badge.id} className="group relative">
                        <div className="w-14 h-14 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center text-2xl hover:scale-110 hover:rotate-6 transition-all duration-300 cursor-pointer hover:border-blue-500/50 shadow-md">
                          {badge.icon}
                        </div>
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-slate-700 font-bold uppercase tracking-widest">
                          {badge.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Featured Jobs */}
                <div>
                  <div className="flex justify-between items-center mb-6 px-2">
                    <h3 className="text-2xl font-bold text-slate-900">AI Matched <span className="text-gradient">Opportunities</span></h3>
                    <Link href="/jobs" className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-widest">Explore All →</Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {featuredJobs.slice(0, 4).map((job) => (
                      <Link href={`/jobs/${job.id}`} key={job.id} className="bg-white border border-slate-200 rounded-[2rem] p-6 hover:border-blue-500/50 hover:bg-slate-50/50 transition-all duration-300 group overflow-hidden relative shadow-sm">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-all" />
                        <div className="flex items-start gap-4 relative z-10">
                          <img src={job.companyLogo} alt={job.company} className="w-14 h-14 rounded-2xl shadow-md border border-slate-100" />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-lg text-slate-900 truncate group-hover:text-blue-600 transition-colors">{job.title}</h4>
                            <p className="text-slate-500 text-sm font-medium">{job.company} · {job.location}</p>
                            <div className="flex items-center gap-3 mt-4">
                              <span className="text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 px-3 py-1 rounded-lg border border-blue-100">{job.type}</span>
                              <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg border border-emerald-100">{job.matchScore}% Match</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Side Column */}
              <div className="space-y-8">
                {/* Niral AI Teaser */}
                <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2.5rem] p-8 shadow-2xl shadow-indigo-500/20 relative overflow-hidden group">
                   <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                   <div className="relative z-10">
                     <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-3xl mb-6 backdrop-blur-xl">✨</div>
                     <h3 className="text-2xl font-black text-white mb-3">Niral AI</h3>
                     <p className="text-indigo-100 text-sm font-medium mb-6 leading-relaxed">
                       Get personalized advice on your resume, interview techniques, and skill development paths.
                     </p>
                     <Link href="/ai-copilot" className="w-full bg-white/20 backdrop-blur-md text-white border border-white/30 font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:bg-white/30 transition-all shadow-xl shadow-black/10">
                       Chat with Niral AI →
                     </Link>
                   </div>
                </div>

                {/* Quick Actions List */}
                <div className="bg-white border border-slate-200 rounded-[2rem] p-6 space-y-2 shadow-sm premium-glow-card">
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-2">Quick Access</h3>
                  {[
                    { label: 'Resume Builder', icon: '📄', href: '/resume' },
                    { label: 'Mentor Matching', icon: '🤝', href: '/mentor' },
                    { label: 'Skill Roadmap', icon: '🗺️', href: '/courses/roadmap' },
                    { label: 'Learning Center', icon: '🎓', href: '/courses' },
                  ].map((item) => (
                    <Link key={item.label} href={item.href} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all group border border-transparent hover:border-slate-200">
                      <div className="flex items-center gap-4">
                        <span className="text-xl grayscale group-hover:grayscale-0 transition-all">{item.icon}</span>
                        <span className="font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{item.label}</span>
                      </div>
                      <span className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all">→</span>
                    </Link>
                  ))}
                </div>
            </div>
          </div>
      </div>
    </div>
  );
}
