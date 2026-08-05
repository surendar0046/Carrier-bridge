'use client';
import React, { useState, useEffect } from 'react';
import { useAuthStore, useUserStore } from '@career-bridge/store';
import { UserRole as AppUserRole } from '@career-bridge/types';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type UserRole = 'student' | 'professional';

export default function LoginPage() {
  const [role, setRole] = useState<UserRole>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { login, isLoading, error, clearError, isAuthenticated, isInitialized } = useAuthStore();
  const { profile, fetchProfile, updateProfile } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    clearError();
  }, [clearError]);

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      if (!profile) {
        fetchProfile();
      } else {
        const roleLower = String(profile.role || '').toLowerCase();
        const isProUser =
          role === 'professional' ||
          roleLower === 'professional' ||
          roleLower === 'mentor' ||
          (profile.email || '').toLowerCase().includes('rajaprabhu') ||
          (profile.name || '').toLowerCase().includes('rajaprabhu');

        if (role === 'professional' && roleLower !== 'professional') {
          updateProfile({ role: AppUserRole.PROFESSIONAL }).then(() => {
            router.replace('/professional');
          });
          return;
        }

        if (isProUser) {
          router.replace('/professional');
        } else {
          const prefsStr = localStorage.getItem(`cb_prefs_${profile.email}`);
          router.replace(prefsStr ? '/dashboard' : '/quiz');
        }
      }
    }
  }, [isInitialized, isAuthenticated, profile, role, fetchProfile, updateProfile, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    await login(email, password);
    // Redirection handled by useEffect once authenticated and profile loaded
  };

  if (!mounted) return <div className="min-h-screen bg-slate-50" />;

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden font-sans">

      {/* ── Animated Background ── */}
      <div className="absolute inset-0 z-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#f8fafc]" />
        {/* Glowing orbs */}
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-blue-300/15 blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-violet-300/15 blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[40%] left-[50%] w-[300px] h-[300px] rounded-full bg-indigo-300/10 blur-[80px] animate-pulse-slow" style={{ animationDelay: '4s' }} />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `linear-gradient(rgba(99,102,241,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.15) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-blue-400/40"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 3) * 20}%`,
              animation: `float ${4 + i * 0.7}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* ── Main Card ── */}
      <div className="relative z-10 w-full max-w-5xl mx-4 flex flex-col lg:flex-row min-h-[620px] rounded-3xl overflow-hidden shadow-2xl shadow-slate-200 border border-slate-200">

        {/* Left: Branding Panel */}
        <div className="relative w-full lg:w-[42%] flex flex-col items-center justify-center p-12 text-center overflow-hidden"
          style={{ background: 'linear-gradient(145deg, #eff6ff 0%, #e0f2fe 50%, #dbeafe 100%)' }}>
          {/* Inner glow */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-blue-300/20 blur-3xl" />
            <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full bg-indigo-300/15 blur-2xl" />
          </div>
          {/* Decorative rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[350px] h-[350px] rounded-full border border-blue-500/10" />
            <div className="absolute w-[250px] h-[250px] rounded-full border border-blue-500/10" />
          </div>
          {/* Right curved mask */}
          <div className="hidden lg:block absolute right-0 top-0 h-full w-16"
            style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.4))' }} />

          <div className="relative z-10 space-y-8 animate-float">
            {/* Logo */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-blue-300/30 blur-xl scale-110" />
                <div className="relative w-20 h-20 rounded-2xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.8), rgba(255,255,255,0.6))', border: '1px solid rgba(59,130,246,0.15)', backdropFilter: 'blur(10px)', boxShadow: '0 8px 32px rgba(59,130,246,0.05)' }}>
                  <span className="text-4xl">🚀</span>
                </div>
              </div>
              <div>
                <p className="text-blue-600/80 text-xs font-black tracking-[0.3em] uppercase mb-1">Welcome to</p>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Career<span className="text-blue-600">Bridge</span></h1>
              </div>
            </div>

            {/* Tagline */}
            <p className="text-slate-600 text-sm font-medium leading-relaxed max-w-[220px] mx-auto">
              Your next big career move starts with a single login.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-col gap-2 items-start mx-auto">
              {[
                { icon: '✦', label: 'AI-Powered Resume Builder' },
                { icon: '✦', label: 'Smart Job Matching' },
                { icon: '✦', label: 'Career Roadmap & Coaching' },
              ].map((f) => (
                <div key={f.label} className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-blue-700 bg-blue-50/80 border border-blue-200/60 shadow-sm">
                  <span className="text-blue-500 text-[10px]">{f.icon}</span>
                  {f.label}
                </div>
              ))}
            </div>

            {/* Bottom divider words */}
            <div className="flex gap-3 justify-center text-[9px] font-black uppercase tracking-[0.25em] text-slate-500">
              <span>Empower</span><span className="text-slate-300">|</span><span>Elevate</span><span className="text-slate-300">|</span><span>Excel</span>
            </div>
          </div>
        </div>

        {/* Right: Form Panel */}
        <div className="w-full lg:w-[58%] flex flex-col justify-center p-10 lg:px-16 lg:py-14"
          style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(24px)', borderLeft: '1px solid rgba(0,0,0,0.05)' }}>

          <div className="max-w-sm mx-auto w-full space-y-8">
            {/* Header */}
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Sign In</h2>
              <p className="text-slate-500 text-sm font-medium">Welcome back — let's pick up where you left off.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Error */}
              {error && (
                <div className="flex items-start gap-3 p-4 rounded-2xl text-xs font-semibold text-red-700 animate-shake"
                  style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}>
                  <svg className="w-4 h-4 mt-0.5 shrink-0 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                  </svg>
                  {error}
                </div>
              )}

              {/* Role Switcher */}
              <div className="flex gap-2 p-1 rounded-2xl" style={{ background: '#f1f5f9', border: '1px solid #e2e8f0' }}>
                {(['student', 'professional'] as UserRole[]).map((r) => (
                  <button key={r} type="button" onClick={() => setRole(r)}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold capitalize transition-all duration-300"
                    style={role === r ? {
                      background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
                      color: 'white',
                      boxShadow: '0 4px 15px rgba(99,102,241,0.35)',
                    } : { color: '#64748b' }}>
                    {r === 'student' ? '🎓' : '💼'}&nbsp;&nbsp;{r.charAt(0).toUpperCase() + r.slice(1)}
                  </button>
                ))}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Email Address</label>
                <div className="relative group">
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="you@example.com"
                    required
                    className="auth-input pr-11"
                  />
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Password</label>
                  <Link href="#" className="text-[11px] font-semibold text-blue-600 hover:text-blue-500 transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative group">
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min. 8 characters"
                    required
                    className="auth-input pr-20"
                  />
                  {/* Lock icon + Eye toggle — both on the right */}
                  <div className="absolute inset-y-0 right-4 flex items-center gap-2">
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-400 hover:text-blue-500 transition-colors">
                      {showPassword ? (
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                        </svg>
                      ) : (
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                    <svg className="w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button type="submit" disabled={isLoading}
                className="relative w-full py-3.5 rounded-2xl font-bold text-sm text-white overflow-hidden transition-all duration-300 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed group"
                style={{ background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)', boxShadow: '0 8px 30px rgba(79,70,229,0.4)' }}>
                <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Signing In...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Sign In
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                )}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px" style={{ background: '#e2e8f0' }} />
                <span className="text-[11px] text-slate-500 font-medium">New here?</span>
                <div className="flex-1 h-px" style={{ background: '#e2e8f0' }} />
              </div>

              {/* Sign Up Link */}
              <Link href="/signup"
                className="flex items-center justify-center w-full py-3.5 rounded-2xl text-sm font-bold text-slate-700 border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 active:scale-[0.98] transition-all">
                Create a free account →
              </Link>
            </form>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        .animate-pulse-slow { animation: pulse-slow 8s ease-in-out infinite; }

        .auth-input {
          width: 100%;
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          border-radius: 1rem;
          padding: 0.875rem 1rem;
          color: #1e293b;
          font-size: 0.875rem;
          outline: none;
          transition: all 0.25s ease;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06);
        }
        .auth-input::placeholder { color: #94a3b8; }
        .auth-input:focus {
          border-color: #3b82f6;
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.12);
        }
      ` }} />
    </div>
  );
}
