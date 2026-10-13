'use client';
import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useUserStore, useAuthStore } from '@career-bridge/store';
import { useRouter, usePathname } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';

const getRouteLabel = (path: string): string => {
  if (!path || path === '/' || path === '/dashboard') return 'Dashboard';
  if (path === '/professional') return 'Pro Dashboard';
  if (path.startsWith('/practice')) {
    if (path.includes('/aptitude')) return 'Aptitude Practice';
    if (path.includes('/verbal')) return 'Verbal Practice';
    if (path.includes('/coding')) return 'Coding Practice';
    if (path.includes('/debugging')) return 'Debugging Practice';
    return 'Practice';
  }
  if (path.startsWith('/jobs')) return 'Job Board';
  if (path.startsWith('/courses')) return 'Learning';
  if (path.startsWith('/resume')) {
    if (path.includes('/ats-score')) return 'ATS Optimizer';
    if (path.includes('/builder')) return 'Resume Builder';
    return 'Resume AI';
  }
  if (path.startsWith('/mentor')) {
    if (path.includes('/sessions')) return 'Mentoring Sessions';
    return 'Mentorship';
  }
  if (path.startsWith('/ai-copilot')) return 'Niral AI';
  if (path.startsWith('/profile')) return 'Profile';
  if (path.startsWith('/professional/forum')) return 'Discussion Forum';
  if (path.startsWith('/professional/mock-interview')) return 'Mock Interview';
  if (path.startsWith('/professional/resources')) return 'Resources';
  if (path.startsWith('/professional/analytics')) return 'Analytics';
  if (path.startsWith('/professional/reputation')) return 'Reputation';
  return path.replace(/^\//, '').split('/')[0].replace('-', ' ');
};

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { profile, fetchProfile } = useUserStore();
  const { logout, isAuthenticated, isInitialized } = useAuthStore();
  const [showLogout, setShowLogout] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Track whether we've already fetched for this auth session to avoid looping
  const fetchedForSession = useRef(false);

  useEffect(() => {
    if (!isInitialized) return;
    if (!isAuthenticated) {
      // Reset so the next user who logs in triggers a fresh fetch
      fetchedForSession.current = false;
      router.replace('/login');
      return;
    }
    if (!fetchedForSession.current || !profile) {
      fetchedForSession.current = true;
      fetchProfile();
    }
  }, [isInitialized, isAuthenticated, profile, fetchProfile, router]);

  const [isNavigating, setIsNavigating] = useState(false);

  // Close mobile drawer and reset navigation progress on route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setIsNavigating(false);
  }, [pathname]);

  useEffect(() => {
    const handleStart = () => setIsNavigating(true);
    window.addEventListener('cb-nav-start', handleStart);
    return () => window.removeEventListener('cb-nav-start', handleStart);
  }, []);

  // Close mobile drawer on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const [mounted, setMounted] = useState(false);
  // Navigation history tracking for Back Button
  const [historyStack, setHistoryStack] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setHistoryStack((prev) => {
      if (prev.length > 0 && prev[prev.length - 1] === pathname) return prev;
      return [...prev, pathname];
    });
  }, [pathname]);

  // Check if we have an active local session
  const hasLocalSession = typeof window !== 'undefined' &&
    Boolean(localStorage.getItem('career_bridge_token') || localStorage.getItem('career-bridge-user'));

  // Always render skeleton during SSR and first client hydration pass to guarantee 100% DOM match
  if (!mounted || (!isInitialized && !hasLocalSession)) {
    return (
      <div className="flex h-screen bg-white overflow-hidden text-slate-800 animate-pulse">
        {/* Sidebar skeleton */}
        <aside className="hidden lg:flex w-72 bg-white border-r border-slate-200 flex-col flex-shrink-0">
          <div className="p-8 flex items-center gap-4">
            <div className="w-11 h-11 bg-slate-200 rounded-2xl" />
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-slate-200 rounded w-3/4" />
              <div className="h-3 bg-slate-200 rounded w-1/2" />
            </div>
          </div>
          <div className="flex-1 px-4 space-y-2 pt-2">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-3 rounded-2xl">
                <div className="w-5 h-5 bg-slate-200 rounded" />
                <div className="h-3 bg-slate-200 rounded flex-1" />
              </div>
            ))}
          </div>
          <div className="p-6">
            <div className="h-16 bg-slate-200 rounded-2xl" />
          </div>
        </aside>
        {/* Content skeleton */}
        <div className="flex-1 flex flex-col">
          <div className="h-16 lg:hidden bg-white border-b border-slate-200 flex-shrink-0" />
          <main className="flex-1 p-6 space-y-4">
            <div className="h-8 bg-slate-200 rounded w-1/3" />
            <div className="h-4 bg-slate-200 rounded w-1/2" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-slate-200 rounded-2xl" />
              ))}
            </div>
            <div className="h-64 bg-slate-200 rounded-2xl mt-4" />
          </main>
        </div>
      </div>
    );
  }


  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const roleLower = String(profile?.role || '').toLowerCase();
  const isProfessional =
    roleLower === 'professional' ||
    roleLower === 'mentor' ||
    (profile?.email || '').toLowerCase().includes('rajaprabhu') ||
    (profile?.name || '').toLowerCase().includes('rajaprabhu') ||
    (profile?.email || '').toLowerCase().includes('shriraam') ||
    (profile?.name || '').toLowerCase().includes('shriraam') ||
    (profile?.email || '').toLowerCase().includes('shriram') ||
    (profile?.name || '').toLowerCase().includes('shriram');

  const isHome = pathname === '/dashboard' || pathname === '/professional';
  const canGoBack = historyStack.length > 1 || !isHome;
  const previousPath = historyStack.length > 1 ? historyStack[historyStack.length - 2] : null;
  const previousLabel = previousPath ? getRouteLabel(previousPath) : 'Dashboard';
  const currentLabel = getRouteLabel(pathname);

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push(isProfessional ? '/professional' : '/dashboard');
    }
  };

  const UserCard = () => {
    if (!profile) {
      return (
        <div className="p-6">
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-center gap-4 animate-pulse">
            <div className="w-10 h-10 rounded-xl bg-slate-200" />
            <div className="flex-1 min-w-0 space-y-1.5">
              <div className="h-3.5 bg-slate-200 rounded w-24" />
              <div className="h-2.5 bg-slate-200 rounded w-16" />
            </div>
          </div>
        </div>
      );
    }

    const activeUser = profile;
    const avatarSrc =
      activeUser.avatar ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(activeUser.name || 'User')}&background=2563eb&color=fff`;

    return (
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
          <div 
            className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-center gap-4 hover:border-slate-300 transition-all group cursor-pointer" 
            onClick={() => setShowLogout(!showLogout)}
          >
            <div className="relative">
              <img src={avatarSrc} alt={activeUser.name} className="w-10 h-10 rounded-xl object-cover" />
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-black text-slate-800 truncate">{activeUser.name}</div>
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                {isProfessional ? 'PROFESSIONAL' : (activeUser.role || 'STUDENT')}
              </div>
            </div>
            <button className="text-slate-400 group-hover:text-slate-700 transition-colors">
              ⚙️
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden text-slate-800 relative">
      {/* ── Top Navigation Loading Glow Bar ──────────────────────────────── */}
      {isNavigating && (
        <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 animate-pulse shadow-sm shadow-blue-500/50 pointer-events-none" />
      )}
      {/* ── Desktop Sidebar (Permanent for lg: >= 1024px) ────────────────── */}
      <aside className="hidden lg:flex w-72 bg-white border-r border-slate-200 flex-col flex-shrink-0 z-30">
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

        {/* Navigation */}
        <Sidebar />

        {/* Desktop User Card */}
        <UserCard />
      </aside>

      {/* ── Mobile & Tablet Slide-Over Drawer (< 1024px) ─────────────────── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setMobileMenuOpen(false)} 
          />

          {/* Sliding container */}
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-white shadow-2xl flex flex-col z-50 animate-slide-in">
            {/* Drawer Header with Close Button */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center font-black text-white text-base shadow-md">
                  CB
                </div>
                <div>
                  <div className="font-black text-slate-900 text-base tracking-tight leading-tight">Career Bridge</div>
                  <div className="text-[9px] text-blue-600 font-bold uppercase tracking-wider">Career OS</div>
                </div>
              </Link>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-lg transition-colors"
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            {/* Drawer Navigation */}
            <Sidebar onNavigate={() => setMobileMenuOpen(false)} />

            {/* Drawer User Card */}
            <UserCard />
          </div>
        </div>
      )}

      {/* ── Main Content Area with Navigation Header ────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Sticky Top Header with Back Navigation (Visible Across All Viewports) */}
        <header className="sticky top-0 z-40 flex items-center justify-between px-4 lg:px-8 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 flex-shrink-0 shadow-sm">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile/Tablet Drawer Toggle (< 1024px) */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-lg font-bold transition-all"
              aria-label="Open menu"
            >
              ☰
            </button>

            {/* Back Arrow Button */}
            <button
              type="button"
              onClick={handleBack}
              disabled={!canGoBack}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                canGoBack
                  ? 'bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-slate-700 hover:text-blue-600 shadow-sm active:scale-95 cursor-pointer group'
                  : 'bg-slate-50 border border-slate-200/40 text-slate-300 cursor-not-allowed opacity-50'
              }`}
              title={canGoBack ? (previousPath ? `Go back to ${previousLabel}` : 'Go back to previous page') : 'Currently on Home'}
              aria-label="Go back to previous navbar"
            >
              <svg 
                className={`w-4 h-4 stroke-[2.5] transition-transform ${canGoBack ? 'group-hover:-translate-x-1 text-blue-600' : 'text-slate-300'}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="hidden sm:inline">
                {canGoBack && previousPath ? `Back to ${previousLabel}` : 'Back'}
              </span>
              <span className="sm:hidden text-[11px]">Back</span>
            </button>

            {/* Current Section Indicator */}
            <div className="hidden sm:flex items-center gap-2 pl-2">
              <span className="text-slate-300 font-bold">/</span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200/60">
                {currentLabel}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${isProfessional ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'bg-blue-50 text-blue-700 border border-blue-100'}`}>
              <span>{isProfessional ? '💼 Pro' : '🎓 Student'}</span>
            </div>
            {profile && (
              <Link href="/profile" className="relative group">
                <img src={profile.avatar} alt={profile.name} className="w-8 h-8 rounded-xl object-cover ring-2 ring-blue-500/20 group-hover:ring-blue-500 transition-all" />
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border border-white rounded-full" />
              </Link>
            )}
          </div>
        </header>

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto relative bg-white">
          {/* Subtle top gradient */}
          <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />
          <div className="relative z-10 min-h-full">
            {children}
          </div>
        </main>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slide-in {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in { animation: slide-in 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}} />
    </div>
  );
}
