'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Target, 
  Briefcase, 
  GraduationCap, 
  ArrowRight,
  CheckCircle2,
  BrainCircuit,
  Zap,
  TrendingUp,
  AlertCircle,
  Code2,
  Compass,
  Check
} from 'lucide-react';
import { useAuthStore, useUserStore } from '@career-bridge/store';
import { cn } from '@career-bridge/utils';
import { 
  FIRST_YEAR_QUESTIONS, 
  FRESHER_QUESTIONS, 
  PROFESSIONAL_QUESTIONS, 
  Question 
} from '@/data/assessmentQuestions';
import { careerEngine } from '@career-bridge/ai';
const { getCareerRecommendation } = careerEngine;
import type { CareerRecommendation } from '@career-bridge/types';
type Recommendation = CareerRecommendation;

type StudentTrack = 'first_year' | 'fresher' | 'professional';

export default function QuizPage() {
  const [mounted, setMounted] = useState(false);
  const [track, setTrack] = useState<StudentTrack | null>(null);
  const [step, setStep] = useState(-1); // -1: Track Selection, 0-19: Questions, 20: Generating, 21: Result
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedOptionTemp, setSelectedOptionTemp] = useState<string | null>(null);
  const [direction, setDirection] = useState(1);

  const { isAuthenticated, isInitialized } = useAuthStore();
  const { profile, fetchProfile, updateProfile, updateActiveRole } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    if (isInitialized && !isAuthenticated) {
      router.replace('/login');
    } else if (isAuthenticated && !profile) {
      fetchProfile();
    }
  }, [isAuthenticated, isInitialized, profile, fetchProfile, router]);

  // Read saved student track preference if already stored during signup or login
  useEffect(() => {
    if (typeof window !== 'undefined' && profile?.email && !track && step === -1) {
      const emailKey = profile.email.toLowerCase().trim();
      const savedTrack = localStorage.getItem(`cb_student_track_${emailKey}`) as StudentTrack | null;
      if (savedTrack && (savedTrack === 'first_year' || savedTrack === 'fresher' || savedTrack === 'professional')) {
        handleTrackSelect(savedTrack);
      }
    }
  }, [profile, track, step]);

  if (!mounted || !isInitialized) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <div className="min-h-screen bg-[#020617]" />;
  }

  // Select questions based on chosen student track
  const questions: Question[] = 
    track === 'first_year' 
      ? FIRST_YEAR_QUESTIONS 
      : track === 'fresher' 
      ? FRESHER_QUESTIONS 
      : track === 'professional'
      ? PROFESSIONAL_QUESTIONS
      : FIRST_YEAR_QUESTIONS;

  const handleTrackSelect = (selectedTrack: StudentTrack) => {
    setTrack(selectedTrack);
    if (typeof window !== 'undefined' && profile?.email) {
      const emailKey = profile.email.toLowerCase().trim();
      localStorage.setItem(`cb_student_track_${emailKey}`, selectedTrack);
    }
    setStep(0);
    setDirection(1);
  };

  const handleAnswer = (option: string) => {
    setSelectedOptionTemp(option);
    const newAnswers = { ...answers, [questions[step].id]: option };
    setAnswers(newAnswers);
    setDirection(1);
    
    // Instant 40ms micro-flash for tactile response then immediately next question
    setTimeout(() => {
      setSelectedOptionTemp(null);
      if (step < questions.length - 1) {
        setStep(step + 1);
      } else {
        setStep(questions.length);
        generateRecommendation(newAnswers);
      }
    }, 40);
  };

  const handleSelectRole = (roleName: string) => {
    setSelectedRole(roleName);
    if (typeof window !== 'undefined') {
      const emailKey = profile?.email ? profile.email.toLowerCase().trim() : '';
      if (emailKey) {
        try {
          const stored = localStorage.getItem(`cb_prefs_${emailKey}`);
          const prefs = stored ? JSON.parse(stored) : {};
          prefs.activeRole = roleName;
          localStorage.setItem(`cb_prefs_${emailKey}`, JSON.stringify(prefs));
        } catch {}
      }
      try {
        const guestStored = localStorage.getItem('cb_guest_prefs');
        const prefs = guestStored ? JSON.parse(guestStored) : {};
        prefs.activeRole = roleName;
        localStorage.setItem('cb_guest_prefs', JSON.stringify(prefs));
      } catch {}
      window.dispatchEvent(new CustomEvent('cb-active-role-changed', { detail: roleName }));
    }
  };

  const generateRecommendation = (currentAnswers = answers) => {
    setTimeout(() => {
      const rec = getCareerRecommendation(track || 'first_year', currentAnswers);
      setRecommendation(rec);
      setSelectedRole(rec.role);
      setStep(questions.length + 1);

      if (typeof window !== 'undefined') {
        const emailKey = profile?.email ? profile.email.toLowerCase().trim() : '';
        const prefs = {
          hasCompletedTest: true,
          studentTrack: track,
          recommendation: rec,
          activeRole: rec.role,
        };
        if (emailKey) {
          localStorage.setItem(`cb_prefs_${emailKey}`, JSON.stringify(prefs));
          localStorage.setItem(`cb_test_completed_${emailKey}`, 'true');
        }
        localStorage.setItem('cb_guest_prefs', JSON.stringify(prefs));
        localStorage.setItem('cb_recommendation', JSON.stringify(rec));
        window.dispatchEvent(new CustomEvent('cb-active-role-changed', { detail: rec.role }));
      }
    }, 300);
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
      setDirection(-1);
    } else {
      setStep(-1);
      setTrack(null);
      setDirection(-1);
    }
  };

  // Permanent completion marker so test NEVER repeats for this user
  const markTestCompleted = (finalRole?: string) => {
    if (typeof window === 'undefined') return;
    const roleChosen = finalRole || selectedRole || recommendation?.role || 'Full-Stack Developer';
    const emailKey = profile?.email ? profile.email.toLowerCase().trim() : '';
    const prefs = {
      hasCompletedTest: true,
      studentTrack: track,
      recommendation: recommendation,
      activeRole: roleChosen,
    };
    if (emailKey) {
      localStorage.setItem(`cb_test_completed_${emailKey}`, 'true');
      localStorage.setItem(`cb_prefs_${emailKey}`, JSON.stringify(prefs));
    }
    localStorage.setItem('cb_guest_prefs', JSON.stringify(prefs));
    if (recommendation) {
      localStorage.setItem('cb_recommendation', JSON.stringify({ ...recommendation, role: roleChosen }));
    }
    window.dispatchEvent(new CustomEvent('cb-active-role-changed', { detail: roleChosen }));
    if (updateProfile) {
      updateProfile({ hasCompletedAssessment: true } as any).catch(() => {});
    }
  };

  const handleFinish = async () => {
    const activeRoleToSet = selectedRole || recommendation?.role || 'Full-Stack Developer';
    markTestCompleted(activeRoleToSet);
    
    if (recommendation) {
      const customizedRec = { ...recommendation, role: activeRoleToSet };
      if (profile?.email && updateActiveRole) {
        updateActiveRole(activeRoleToSet);
      }
      localStorage.setItem('cb_recommendation', JSON.stringify(customizedRec));
      router.push('/roadmap');
    } else {
      const roleLower = String(profile?.role || '').toLowerCase();
      const isPro = roleLower === 'professional' || roleLower === 'mentor';
      router.push(isPro ? '/professional' : '/dashboard');
    }
  };

  // Skip handler: marks test completed immediately and takes student to dashboard
  const handleSkip = () => {
    markTestCompleted();
    const roleLower = String(profile?.role || '').toLowerCase();
    const isPro = roleLower === 'professional' || roleLower === 'mentor';
    router.push(isPro ? '/professional' : '/dashboard');
  };

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 80 : -80,
      opacity: 0
    })
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex flex-col items-center justify-center p-4 md:p-6 relative overflow-x-hidden">
      {/* Background Glow */}
      <div className="fixed top-[-10%] left-[-10%] w-[45%] h-[45%] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-violet-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="w-full max-w-3xl relative z-10 py-8">
        
        {/* Header / Progress Bar during quiz */}
        {step >= 0 && step < questions.length && (
          <div className="mb-8 space-y-4">
            <div className="flex items-center justify-between">
              <button 
                onClick={handleBack}
                className="p-2 hover:bg-white/5 rounded-xl transition-colors text-slate-400 hover:text-white flex items-center gap-1.5 text-xs font-semibold"
              >
                <ChevronLeft size={18} />
                <span>Back</span>
              </button>

              <div className="flex flex-col items-center">
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-400">
                  {track === 'first_year' ? '🎓 1st Year Assessment' : track === 'fresher' ? '🚀 Fresher Technical Assessment' : '💼 Professional Assessment'}
                </span>
                <span className="text-xs font-bold text-slate-400">
                  Question <span className="text-white font-extrabold">{step + 1}</span> of {questions.length}
                </span>
              </div>

              {/* Direct Skip button available at every question */}
              <button 
                onClick={handleSkip}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-colors border border-white/10"
              >
                Skip Test →
              </button>
            </div>

            <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden p-0.5">
              <motion.div 
                className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                initial={{ width: 0 }}
                animate={{ width: `${((step + 1) / questions.length) * 100}%` }}
                transition={{ type: 'spring', stiffness: 50, damping: 20 }}
              />
            </div>
          </div>
        )}

        <AnimatePresence mode="wait" custom={direction}>
          {/* ─────────────────────────────────────────────────────────────
              STEP -1: TRACK SELECTION
             ───────────────────────────────────────────────────────────── */}
          {step === -1 && (
            <motion.div
              key="track-selection"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="space-y-8 text-center"
            >
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-bold uppercase tracking-wider">
                  <Sparkles size={14} />
                  <span>Choose Your Student Assessment Track</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                  Select Your Current <br /> 
                  <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-indigo-300 bg-clip-text text-transparent">
                    Academic Level
                  </span>
                </h1>
                <p className="text-slate-400 text-sm md:text-base max-w-lg mx-auto">
                  We'll adapt the 20 MCQs to analyze your thinking style, assess your tech inclinations, and suggest your Top 1 + Closest 2 career roles with a dynamic roadmap.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-5 mt-6 text-left">
                {/* 1st Year Student Card */}
                <button
                  onClick={() => handleTrackSelect('first_year')}
                  className="group relative p-7 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/60 hover:bg-slate-900/90 transition-all duration-300 shadow-xl flex flex-col justify-between overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                    <GraduationCap size={100} className="text-blue-400" />
                  </div>
                  <div>
                    <div className="w-14 h-14 bg-blue-500/15 border border-blue-500/30 rounded-2xl flex items-center justify-center text-blue-400 mb-5 group-hover:scale-105 transition-transform">
                      <GraduationCap size={28} />
                    </div>
                    <div className="inline-block px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-300 text-[10px] font-black uppercase tracking-wider mb-2">
                      After 12th Completed
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                      1st Year Student
                    </h3>
                    <p className="text-slate-400 text-xs leading-relaxed mb-4">
                      Completed 12th standard or starting 1st year college. 20 MCQs evaluating your thinking style, problem-solving mindset, and innate interest across 35 tech careers.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-400 mt-2">
                    <span>Start 1st Year Assessment</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                {/* College Freshers (2nd, 3rd, 4th Year) Card */}
                <button
                  onClick={() => handleTrackSelect('fresher')}
                  className="group relative p-7 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-violet-500/60 hover:bg-slate-900/90 transition-all duration-300 shadow-xl flex flex-col justify-between overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Code2 size={100} className="text-violet-400" />
                  </div>
                  <div>
                    <div className="w-14 h-14 bg-violet-500/15 border border-violet-500/30 rounded-2xl flex items-center justify-center text-violet-400 mb-5 group-hover:scale-105 transition-transform">
                      <Code2 size={28} />
                    </div>
                    <div className="inline-block px-2.5 py-0.5 rounded-full bg-violet-500/15 text-violet-300 text-[10px] font-black uppercase tracking-wider mb-2">
                      2nd, 3rd, 4th Year / Freshers
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-violet-400 transition-colors">
                      College Student (Fresher)
                    </h3>
                    <p className="text-slate-400 text-xs leading-relaxed mb-4">
                      Pursuing engineering or degree. 20 technical MCQs including 2 Code Debugging, 2 Beginner Code, 2 UI/UX Design, and 2 Real-world Scenarios to pinpoint your best engineering role.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-violet-400 mt-2">
                    <span>Start Fresher Assessment</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              </div>

              {/* Bottom Quick Skip & Professional Toggle */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 border-t border-slate-800/80 mt-8">
                <button
                  onClick={() => handleTrackSelect('professional')}
                  className="hover:text-slate-300 transition-colors flex items-center gap-1.5"
                >
                  <Briefcase size={14} />
                  <span>Looking for Working Professional Track? Click here</span>
                </button>
                <button
                  onClick={handleSkip}
                  className="hover:text-blue-400 transition-colors font-semibold"
                >
                  Skip test directly and go to Dashboard →
                </button>
              </div>
            </motion.div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              STEP 0 - 19: 20 MCQs QUESTIONS
             ───────────────────────────────────────────────────────────── */}
          {step >= 0 && step < questions.length && (
            <motion.div
              key={`question-${step}`}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="space-y-6"
            >
              {/* Question Category Badge */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold">
                  <Compass size={13} />
                  {questions[step].category}
                </span>
                <span className="text-[11px] font-semibold text-slate-500">
                  Select the answer that best reflects you
                </span>
              </div>

              {/* Question Text */}
              <h2 className="text-xl md:text-2xl font-bold text-white leading-snug">
                {questions[step].text}
              </h2>

              {/* Optional Code Snippet (e.g. for Debugging, Code Logic) */}
              {questions[step].codeSnippet && (
                <div className="rounded-2xl bg-[#090d16] border border-slate-800 p-4 shadow-inner overflow-x-auto">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[11px] font-mono text-slate-500">
                    <span>💻 Code Snippet</span>
                    <span>Review carefully</span>
                  </div>
                  <pre className="font-mono text-xs md:text-sm text-emerald-400 leading-relaxed overflow-x-auto">
                    <code>{questions[step].codeSnippet}</code>
                  </pre>
                </div>
              )}

              {/* 4 MCQ Options */}
              <div className="grid gap-3 pt-2">
                {questions[step].options.map((option, idx) => (
                  <button
                    key={option}
                    onClick={() => handleAnswer(option)}
                    className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-850 text-left flex items-center justify-between transition-all duration-200 group shadow-md"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-300 font-bold text-sm group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-500 transition-all shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span className="text-sm md:text-base font-medium text-slate-300 group-hover:text-white transition-colors leading-relaxed">
                        {option}
                      </span>
                    </div>
                    <ChevronRight size={18} className="text-slate-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all shrink-0 ml-3" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              GENERATING SCREEN
             ───────────────────────────────────────────────────────────── */}
          {step === questions.length && (
            <motion.div
              key="generating"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-8 py-14"
            >
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-blue-600/20 rounded-full flex items-center justify-center animate-pulse">
                  <BrainCircuit size={48} className="text-blue-400" />
                </div>
                <motion.div 
                  className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
                />
              </div>

              <div className="space-y-3">
                <h2 className="text-3xl md:text-4xl font-extrabold text-white">Analyzing Your Mindset & Responses</h2>
                <p className="text-slate-400 text-sm md:text-base max-w-md mx-auto">
                  Our AI is evaluating your logic against 35 industry job roles and ranking your Top 1 + Closest 2 pathways...
                </p>
              </div>

              <div className="max-w-xs mx-auto space-y-3 text-left">
                {[
                  "Evaluating problem-solving & thinking style...",
                  "Scoring across 5 tech categories & 35 roles...",
                  "Identifying your #1 Best Fit role + 2 closest roles...",
                  "Synthesizing customized 4-phase roadmap..."
                ].map((text, i) => (
                  <motion.div 
                    key={text}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.6 }}
                    className="flex items-center gap-3 text-xs text-slate-400"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                    <span>{text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              RESULT SCREEN: TOP 1 ROLE (%) + 2 CLOSEST MATCHING ROLES (%)
             ───────────────────────────────────────────────────────────── */}
          {step === questions.length + 1 && recommendation && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Header Badge */}
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-bold">
                  <CheckCircle2 size={14} />
                  <span>Assessment Analysis Complete</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-white">
                  Your AI Career Recommendations
                </h2>
                <p className="text-slate-400 text-xs md:text-sm">
                  Track: <span className="text-blue-400 font-bold">{track === 'first_year' ? '1st Year Student' : 'College Fresher'}</span> — Here is your highest matching role and the two closest alternative roles.
                </p>
              </div>

              {/* PRIMARY BEST FIT HERO CARD */}
              <div className={cn(
                "p-7 md:p-8 rounded-3xl bg-slate-900/90 border-2 transition-all shadow-2xl space-y-6 relative overflow-hidden",
                selectedRole === recommendation.role ? "border-blue-500/90 shadow-blue-500/10" : "border-slate-800"
              )}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-black uppercase tracking-wider">
                      🌟 Top 1 Best Fit Role
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">
                      Primary Recommendation
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-sm font-black flex items-center gap-1.5">
                      <Sparkles size={14} />
                      <span>{recommendation.confidence}% Match</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                    {recommendation.role}
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed italic max-w-2xl">
                    "{recommendation.reasoning}"
                  </p>
                </div>

                {/* Role Highlights */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5">
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Match Confidence</div>
                    <div className="text-2xl font-black text-blue-400">{recommendation.confidence}%</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5">
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Typical Salary</div>
                    <div className="text-xl font-black text-violet-400">{recommendation.salaryRange.split(' ')[0]}</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 col-span-2 md:col-span-1">
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Market Demand</div>
                    <div className="text-2xl font-black text-emerald-400">{recommendation.demandScore}/100</div>
                  </div>
                </div>

                {/* Key Strengths & Future Scope */}
                <div className="grid md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                    <h4 className="flex items-center gap-2 text-emerald-400 font-bold mb-2.5 text-xs">
                      <Zap size={14} /> Key Inherent Strengths
                    </h4>
                    <ul className="space-y-1.5">
                      {recommendation.strengths.slice(0, 3).map(s => (
                        <li key={s} className="text-slate-300 text-xs flex items-center gap-2">
                          <Check size={13} className="text-emerald-400 shrink-0" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                    <h4 className="flex items-center gap-2 text-blue-400 font-bold mb-2 text-xs">
                      <Target size={14} /> Future Career Scope
                    </h4>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      {recommendation.futureScope}
                    </p>
                  </div>
                </div>

                {/* Select button */}
                <button
                  onClick={() => handleSelectRole(recommendation.role)}
                  className={cn(
                    "w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2",
                    selectedRole === recommendation.role
                      ? "bg-blue-600/30 border border-blue-500 text-blue-300"
                      : "bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
                  )}
                >
                  {selectedRole === recommendation.role ? '✓ Selected for your personalized roadmap' : 'Select this role'}
                </button>
              </div>

              {/* ─────────────────────────────────────────────────────────────
                  2 CLOSEST MATCHING ROLES SECTION
                 ───────────────────────────────────────────────────────────── */}
              {recommendation.closeRoles && recommendation.closeRoles.length > 0 && (
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <TrendingUp size={20} className="text-violet-400" />
                        <span>Top 2 Closest Matching Career Roles</span>
                      </h3>
                      <p className="text-xs text-slate-400">
                        Based on your answers, your skills also bridge strongly to these 2 high-demand roles:
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {recommendation.closeRoles.map((closeRole, idx) => {
                      const isSelected = selectedRole === closeRole.role;
                      return (
                        <div
                          key={closeRole.role}
                          onClick={() => handleSelectRole(closeRole.role)}
                          className={cn(
                            "p-5 rounded-2xl bg-slate-900/80 border transition-all cursor-pointer space-y-3 relative group",
                            isSelected
                              ? "border-violet-500 bg-slate-900 shadow-lg shadow-violet-500/10"
                              : "border-slate-800 hover:border-slate-700 hover:bg-slate-850"
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-violet-500/15 text-violet-300">
                              Alternative #{idx + 1}
                            </span>
                            <span className="text-sm font-black text-violet-400 bg-violet-500/10 px-2.5 py-0.5 rounded-full border border-violet-500/20">
                              {closeRole.confidence}% Match
                            </span>
                          </div>

                          <div>
                            <h4 className="text-lg font-bold text-white group-hover:text-violet-300 transition-colors">
                              {closeRole.role}
                            </h4>
                            <span className="text-[11px] text-slate-500 font-semibold">
                              {closeRole.domain}
                            </span>
                          </div>

                          <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 italic">
                            "{closeRole.reasoning}"
                          </p>

                          <div className="pt-2 flex items-center justify-between text-xs">
                            <span className={cn(
                              "font-bold transition-colors",
                              isSelected ? "text-violet-400" : "text-slate-500 group-hover:text-slate-300"
                            )}>
                              {isSelected ? '✓ Selected for Roadmap' : 'Click to select this role'}
                            </span>
                            <ArrowRight size={14} className={cn("transition-transform", isSelected ? "text-violet-400 translate-x-1" : "text-slate-600")} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ACTION BUTTONS */}
              <div className="pt-4 space-y-3">
                <button
                  onClick={handleFinish}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-extrabold text-base shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 group transition-all"
                >
                  <span>Generate Dynamic Roadmap for {selectedRole || recommendation.role}</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={handleSkip}
                  className="w-full py-2.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer text-center"
                >
                  Skip — Go directly to Dashboard →
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
