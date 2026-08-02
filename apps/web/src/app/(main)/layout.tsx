'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useUserStore, useAuthStore } from '@career-bridge/store';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { profile, fetchProfile } = useUserStore();
  const { logout, isAuthenticated, isInitialized } = useAuthStore();
  const [showLogout, setShowLogout] = React.useState(false);

  useEffect(() => {
    if (!isInitialized) return;
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }
    if (!profile) {
      fetchProfile();
    }
  }, [isInitialized, isAuthenticated, profile, fetchProfile, router]);

  // Show full-screen spinner while Firebase auth is resolving
  if (!isInitialized || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-800">
      {/* Aesthetic Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col flex-shrink-0 z-50">
        {/* Logo */}
        <div className="p-8">
          <Link href="/dashboard" className="flex items-center gap-4 group">
            <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center font-black text-white text-lg shadow-xl shadow-blue-500/20 group-hover:scale-110 transition-transform">
              CB
            </div>
            <div>
              <div className="font-black text-slate-900 text-lg tracking-tight">Career Bridge</div>
              <div className="text-[10px] text-blue-600 font-bold uppercase tracking-[0.2em]">Career OS</div>
            </div>
          </Link>
        </div>

        {/* Navigation - Extracted for safety */}
        <Sidebar />

        {/* User Card */}
        <div className="p-6">
          <div className="relative">
            {showLogout && (
              <div className="absolute bottom-full left-0 w-full mb-2 animate-float">
                <button 
                  onClick={handleLogout}
                  className="w-full bg-white border border-slate-200 shadow-lg p-4 rounded-2xl text-sm font-bold text-red-600 hover:bg-red-50 transition-all flex items-center gap-3"
                >
                  <span>🚪</span> Logout
                </button>
              </div>
            )}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-center gap-4 hover:border-slate-300 transition-all group cursor-pointer" onClick={() => setShowLogout(!showLogout)}>
              {profile ? (
                <>
                  <div className="relative">
                    <img src={profile.avatar} alt={profile.name} className="w-10 h-10 rounded-xl object-cover" />
                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-black text-slate-800 truncate">{profile.name}</div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{profile.role}</div>
                  </div>
                  <button className="text-slate-400 group-hover:text-slate-700 transition-colors">
                    ⚙️
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-3 w-full">
                  <div className="w-10 h-10 bg-slate-200 rounded-xl animate-pulse" />
                  <div className="flex-1 space-y-2"><div className="h-2.5 bg-slate-200 rounded w-full animate-pulse" /><div className="h-2 bg-slate-200 rounded w-1/2 animate-pulse" /></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative bg-slate-50">
        {/* Subtle top gradient */}
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />
        <div className="relative z-10 min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
