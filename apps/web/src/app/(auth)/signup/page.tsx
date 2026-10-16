'use client';
import React, { useState } from 'react';
import { useAuthStore } from '@career-bridge/store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type UserRole = 'student' | 'professional';

export default function SignupPage() {
  const [mounted, setMounted] = useState(false);
  const [role, setRole] = useState<UserRole>('student');
  const [studentStage, setStudentStage] = useState<'school' | 'early' | 'final'>('school');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { signup, isLoading, error, clearError, isAuthenticated, isInitialized } = useAuthStore();
  const router = useRouter();

  React.useEffect(() => {
    setMounted(true);
    clearError();
  }, [clearError]);

  // Immediate redirect as soon as user is authenticated
  React.useEffect(() => {
    if (!mounted) return;
    if (isInitialized && isAuthenticated) {
      const emailKey = (email || '').toLowerCase().trim();
      const stageRoute = studentStage === 'school' ? '/onboarding/school' : studentStage === 'early' ? '/onboarding/early' : '/onboarding/final';
      if (typeof window !== 'undefined' && emailKey) {
        if (role === 'student') {
          localStorage.setItem(`cb_onboarding_stage_${emailKey}`, studentStage);
          localStorage.setItem(`cb_role_${emailKey}`, 'student');
        } else {
          localStorage.setItem(`cb_role_${emailKey}`, 'professional');
        }
        const hasCompletedOnboarding = localStorage.getItem(`cb_onboarding_completed_${emailKey}`) === 'true';
        const targetRoute = role === 'professional' 
          ? '/professional' 
          : (hasCompletedOnboarding ? '/dashboard' : stageRoute);
        router.replace(targetRoute);
        return;
      }
      router.replace(role === 'professional' ? '/professional' : stageRoute);
    }
  }, [mounted, isInitialized, isAuthenticated, email, role, studentStage, router]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    const stageRoute = studentStage === 'school' ? '/onboarding/school' : studentStage === 'early' ? '/onboarding/early' : '/onboarding/final';
    if (typeof window !== 'undefined' && email) {
      const emailKey = email.toLowerCase().trim();
      if (role === 'student') {
        localStorage.setItem(`cb_onboarding_stage_${emailKey}`, studentStage);
        localStorage.setItem(`cb_role_${emailKey}`, 'student');
        localStorage.setItem('cb_active_mode', 'student');
      } else {
        localStorage.setItem(`cb_role_${emailKey}`, 'professional');
        localStorage.setItem('cb_active_mode', 'professional');
      }
    }
    const ok = await signup(name, email, password, role);
    if (ok) {
      router.replace(role === 'professional' ? '/professional' : stageRoute);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden font-sans py-8 bg-white">

      {/* ── Animated Background ── */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50/40 to-white" />
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-violet-300/15 blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-blue-300/15 blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[30%] left-[40%] w-[300px] h-[300px] rounded-full bg-indigo-300/10 blur-[80px] animate-pulse-slow" style={{ animationDelay: '3s' }} />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `linear-gradient(rgba(139,92,246,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.15) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-violet-400/40"
            style={{
              right: `${10 + i * 12}%`,
              top: `${15 + (i % 4) * 18}%`,
              animation: `float ${4 + i * 0.6}s ease-in-out infinite`,
              animationDelay: `${i * 0.4}s`,
            }}
          />
        ))}
      </div>

      {/* ── Main Card ── */}
      <div className="relative z-10 w-full max-w-5xl mx-4 flex flex-col lg:flex-row rounded-3xl overflow-hidden shadow-2xl shadow-slate-200 border border-slate-200">

        {/* Left: Branding Panel */}
        <div className="relative w-full lg:w-[42%] flex flex-col items-center justify-center p-12 text-center overflow-hidden"
          style={{ background: 'linear-gradient(145deg, #f5f3ff 0%, #ede9fe 50%, #ddd6fe 100%)' }}>
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-violet-300/20 blur-3xl" />
            <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full bg-indigo-300/15 blur-2xl" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[350px] h-[350px] rounded-full border border-violet-500/10" />
            <div className="absolute w-[250px] h-[250px] rounded-full border border-violet-500/10" />
          </div>
          <div className="hidden lg:block absolute right-0 top-0 h-full w-16"
            style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.4))' }} />

          <div className="relative z-10 space-y-8 animate-float">
            {/* Logo */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-violet-300/30 blur-xl scale-110" />
                <div className="relative w-20 h-20 rounded-2xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.8), rgba(255,255,255,0.6))', border: '1px solid rgba(124,58,237,0.15)', backdropFilter: 'blur(10px)', boxShadow: '0 8px 32px rgba(124,58,237,0.05)' }}>
                  <span className="text-4xl">🌟</span>
                </div>
              </div>
              <div>
                <p className="text-violet-600/80 text-xs font-black tracking-[0.3em] uppercase mb-1">Join</p>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Career<span className="text-violet-600">Bridge</span></h1>
              </div>
            </div>

            {/* Tagline */}
            <p className="text-slate-600 text-sm font-medium leading-relaxed max-w-[220px] mx-auto">
              Build your professional future with the most intelligent career platform.
            </p>

            {/* Steps */}
            <div className="flex flex-col gap-3 items-start mx-auto text-left">
              {[
                { step: '01', label: 'Create your free account' },
                { step: '02', label: 'Set up your career profile' },
                { step: '03', label: 'Unlock AI-powered tools' },
              ].map((s) => (
                <div key={s.step} className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg text-[10px] font-black text-violet-700 bg-violet-100/80 border border-violet-200/60 flex items-center justify-center shrink-0 shadow-sm">
                    {s.step}
                  </span>
                  <span className="text-xs text-slate-600 font-semibold">{s.label}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-3 justify-center text-[9px] font-black uppercase tracking-[0.25em] text-slate-500">
              <span>Free</span><span className="text-slate-300">|</span><span>Powerful</span><span className="text-slate-300">|</span><span>Private</span>
            </div>
          </div>
        </div>

        {/* Right: Form Panel */}
        <div className="w-full lg:w-[58%] flex flex-col justify-center p-10 lg:px-16 lg:py-12"
          style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(24px)', borderLeft: '1px solid rgba(0,0,0,0.05)' }}>

          <div className="max-w-sm mx-auto w-full space-y-7">
            {/* Header */}
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create Account</h2>
              <p className="text-slate-500 text-sm font-medium">Join thousands building their careers with AI.</p>
            </div>

            <form onSubmit={handleSignup} className="space-y-5">
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
                      background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                      color: 'white',
                      boxShadow: '0 4px 15px rgba(124,58,237,0.35)',
                    } : { color: '#64748b' }}>
                    {r === 'student' ? '🎓' : '💼'}&nbsp;&nbsp;{r.charAt(0).toUpperCase() + r.slice(1)}
                  </button>
                ))}
              </div>

              {/* Student Stage Sub-selector (3 Stages) */}
              {role === 'student' && (
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-violet-50/80 to-indigo-50/60 border border-violet-100 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-violet-800">Select Your Current Stage:</span>
                    <span className="text-[9px] font-bold text-violet-600 bg-violet-100/60 px-2 py-0.5 rounded-full">3 Stages</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setStudentStage('school')}
                      className={`p-2.5 rounded-xl text-left border transition-all ${
                        studentStage === 'school'
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20 ring-2 ring-emerald-500/20'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30'
                      }`}
                    >
                      <span className="block text-[11px] font-black">🎓 12th Standard</span>
                      <span className={`block text-[9px] font-medium leading-tight mt-0.5 ${studentStage === 'school' ? 'text-emerald-100' : 'text-slate-400'}`}>
                        Branch Discovery
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setStudentStage('early')}
                      className={`p-2.5 rounded-xl text-left border transition-all ${
                        studentStage === 'early'
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20 ring-2 ring-blue-500/20'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50/30'
                      }`}
                    >
                      <span className="block text-[11px] font-black">🧭 1st & 2nd Year</span>
                      <span className={`block text-[9px] font-medium leading-tight mt-0.5 ${studentStage === 'early' ? 'text-blue-100' : 'text-slate-400'}`}>
                        Domain Roadmap
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setStudentStage('final')}
                      className={`p-2.5 rounded-xl text-left border transition-all ${
                        studentStage === 'final'
                          ? 'bg-violet-600 text-white border-violet-600 shadow-md shadow-violet-600/20 ring-2 ring-violet-500/20'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-violet-300 hover:bg-violet-50/30'
                      }`}
                    >
                      <span className="block text-[11px] font-black">🎯 3rd & 4th Year</span>
                      <span className={`block text-[9px] font-medium leading-tight mt-0.5 ${studentStage === 'final' ? 'text-violet-100' : 'text-slate-400'}`}>
                        Placement Sprint
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* Name */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Full Name</label>
                <div className="relative group">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    required
                    className="auth-input-signup pr-11"
                  />
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-slate-400 group-focus-within:text-violet-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Email Address</label>
                <div className="relative group">
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="you@example.com"
                    required
                    className="auth-input-signup pr-11"
                  />
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-slate-400 group-focus-within:text-violet-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Password</label>
                <div className="relative group">
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min. 8 characters"
                    required
                    className="auth-input-signup pr-20"
                  />
                  {/* Eye toggle + Lock icon — both on the right */}
                  <div className="absolute inset-y-0 right-4 flex items-center gap-2">
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-400 hover:text-violet-500 transition-colors">
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
                    <svg className="w-4 h-4 text-slate-400 group-focus-within:text-violet-500 transition-colors pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-3 pt-1">
                <div className="relative mt-0.5">
                  <input type="checkbox" id="terms" defaultChecked required className="peer sr-only" />
                  <label htmlFor="terms"
                    className="w-4 h-4 rounded flex items-center justify-center cursor-pointer border border-slate-300 peer-checked:border-violet-500 peer-checked:bg-violet-500/10 transition-all"
                    style={{ display: 'flex', width: '16px', height: '16px', minWidth: '16px' }}>
                    <svg className="w-3 h-3 text-violet-600 hidden peer-checked:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </label>
                </div>
                <label htmlFor="terms" className="text-[11px] text-slate-500 font-semibold leading-relaxed cursor-pointer">
                  I agree to the{' '}
                  <Link href="#" className="text-violet-600 hover:text-violet-500 font-semibold transition-colors">Terms of Service</Link>
                  {' '}and{' '}
                  <Link href="#" className="text-violet-600 hover:text-violet-500 font-semibold transition-colors">Privacy Policy</Link>
                </label>
              </div>

              {/* Submit */}
              <button type="submit" disabled={isLoading}
                className="relative w-full py-3.5 rounded-2xl font-bold text-sm text-white overflow-hidden transition-all duration-300 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed group"
                style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)', boxShadow: '0 8px 30px rgba(124,58,237,0.4)' }}>
                <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Creating Account...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Create Free Account
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                )}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px" style={{ background: '#e2e8f0' }} />
                <span className="text-[11px] text-slate-500 font-medium">Already have an account?</span>
                <div className="flex-1 h-px" style={{ background: '#e2e8f0' }} />
              </div>

              {/* Sign In Link */}
              <Link href="/login"
                className="flex items-center justify-center w-full py-3.5 rounded-2xl text-sm font-bold text-slate-700 border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 active:scale-[0.98] transition-all">
                Sign In →
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

        .auth-input-signup {
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
        .auth-input-signup::placeholder { color: #94a3b8; }
        .auth-input-signup:focus {
          border-color: #7c3aed;
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.12);
        }
      ` }} />
    </div>
  );
}
