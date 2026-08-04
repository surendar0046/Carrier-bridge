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
  AlertCircle
} from 'lucide-react';
import { useAuthStore, useUserStore } from '@career-bridge/store';
import { cn } from '@career-bridge/utils';
import { STUDENT_QUESTIONS, PROFESSIONAL_QUESTIONS, Question } from '@/data/assessmentQuestions';
import { careerEngine } from '@career-bridge/ai';
const { getCareerRecommendation } = careerEngine;
import type { CareerRecommendation } from '@career-bridge/types';
type Recommendation = CareerRecommendation;

export default function QuizPage() {
  const [mounted, setMounted] = useState(false);
  const [roleType, setRoleType] = useState<'student' | 'professional' | null>(null);
  const [step, setStep] = useState(-1); // -1: Role Selection, 0-14: Questions, 15: Generating, 16: Result
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [direction, setDirection] = useState(1); // For slide animations

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

  // Show spinner while app is still mounting or Firebase auth is initializing
  if (!mounted || !isInitialized) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  // Not logged in — useEffect will redirect; return blank dark screen briefly
  if (!isAuthenticated) {
    return <div className="min-h-screen bg-[#020617]" />;
  }

  const questions = roleType === 'professional' ? PROFESSIONAL_QUESTIONS : STUDENT_QUESTIONS;

  const handleRoleSelect = (role: 'student' | 'professional') => {
    setRoleType(role);
    setStep(0);
    setDirection(1);
  };

  const handleAnswer = (option: string) => {
    setAnswers({ ...answers, [questions[step].id]: option });
    setDirection(1);
    
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      // Transition to Generating
      setStep(questions.length);
      generateRecommendation();
    }
  };

  const generateRecommendation = () => {
    setTimeout(() => {
      const rec = getCareerRecommendation(roleType!, answers);
      setRecommendation(rec);
      setStep(questions.length + 1);
    }, 3000); // 3 seconds for "AI Analysis" effect
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
      setDirection(-1);
    } else {
      setStep(-1);
      setRoleType(null);
      setDirection(-1);
    }
  };

  const handleFinish = async () => {
    if (recommendation) {
      if (profile?.email) {
        const prefsStr = localStorage.getItem(`cb_prefs_${profile.email}`);
        const prefs = prefsStr ? JSON.parse(prefsStr) : {};
        prefs.recommendation = recommendation;
        prefs.activeRole = recommendation.role;
        localStorage.setItem(`cb_prefs_${profile.email}`, JSON.stringify(prefs));
        if (updateActiveRole) {
          updateActiveRole(recommendation.role);
        }
      }
      // Persist to localStorage so the roadmap page can read it (fallback)
      localStorage.setItem('cb_recommendation', JSON.stringify(recommendation));
      router.push('/roadmap');
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0
    })
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex flex-col items-center justify-center p-4 md:p-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-2xl relative z-10">
        
        {/* Header / Progress */}
        {step >= 0 && step < questions.length && (
          <div className="mb-12 space-y-6">
            <div className="flex items-center justify-between">
              <button 
                onClick={handleBack}
                className="p-2 hover:bg-white/5 rounded-xl transition-colors text-slate-400 hover:text-white"
              >
                <ChevronLeft size={24} />
              </button>
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.3em]">Assessment</span>
                <span className="text-sm font-medium text-slate-500">{step + 1} of {questions.length}</span>
              </div>
              <button 
                onClick={() => { setStep(questions.length); generateRecommendation(); }}
                className="text-xs font-bold text-slate-500 hover:text-white transition-colors"
              >
                Skip
              </button>
            </div>
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-blue-600 to-violet-600 shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                initial={{ width: 0 }}
                animate={{ width: `${((step + 1) / questions.length) * 100}%` }}
                transition={{ type: 'spring', stiffness: 50, damping: 20 }}
              />
            </div>
          </div>
        )}

        <AnimatePresence mode="wait" custom={direction}>
          {step === -1 && (
            <motion.div
              key="role-selection"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="space-y-8 text-center"
            >
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-bold">
                  <Sparkles size={16} />
                  <span>Personalize Your Journey</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.1]">
                  Where are you <br /> 
                  <span className="text-gradient">currently?</span>
                </h1>
                <p className="text-slate-400 text-lg max-w-md mx-auto">
                  We'll tailor your roadmap and recommendations based on your experience level.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-12">
                <button
                  onClick={() => handleRoleSelect('student')}
                  className="glass-card group p-8 text-left hover:border-blue-500/50 transition-all duration-500 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <GraduationCap size={80} />
                  </div>
                  <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                    <GraduationCap size={28} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Student / Fresher</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    I'm exploring my options or looking for my first big break in tech.
                  </p>
                </button>

                <button
                  onClick={() => handleRoleSelect('professional')}
                  className="glass-card group p-8 text-left hover:border-violet-500/50 transition-all duration-500 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Briefcase size={80} />
                  </div>
                  <div className="w-14 h-14 bg-violet-500/20 rounded-2xl flex items-center justify-center text-violet-400 mb-6 group-hover:scale-110 transition-transform">
                    <Briefcase size={28} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Professional</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    I'm looking to pivot, upskill, or reach leadership roles in my field.
                  </p>
                </button>
              </div>
            </motion.div>
          )}

          {step >= 0 && step < questions.length && (
            <motion.div
              key={`question-${step}`}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="space-y-10"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight text-center">
                {questions[step].text}
              </h2>

              <div className="grid gap-3">
                {questions[step].options.map((option, idx) => (
                  <button
                    key={option}
                    onClick={() => handleAnswer(option)}
                    className="glass-card group p-6 text-left flex items-center justify-between hover:bg-white/5 hover:border-blue-500/30 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-500 font-bold group-hover:bg-blue-500 group-hover:text-white transition-all">
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span className="font-semibold text-slate-300 group-hover:text-white transition-colors">{option}</span>
                    </div>
                    <ChevronRight size={20} className="text-slate-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === questions.length && (
            <motion.div
              key="generating"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-8 py-12"
            >
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-blue-600/20 rounded-full flex items-center justify-center animate-pulse">
                  <BrainCircuit size={48} className="text-blue-500" />
                </div>
                <motion.div 
                  className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                />
              </div>
              <div className="space-y-3">
                <h2 className="text-4xl font-bold text-white">Analyzing Your Profile</h2>
                <p className="text-slate-400 text-lg">Our AI is mapping your answers to 500+ career paths...</p>
              </div>
              <div className="max-w-xs mx-auto space-y-4">
                {[
                  "Matching skill intelligence...",
                  "Calculating weighted scores...",
                  "Generating personalized roadmap..."
                ].map((text, i) => (
                  <motion.div 
                    key={text}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.8 }}
                    className="flex items-center gap-3 text-sm text-slate-500"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    {text}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {step === questions.length + 1 && recommendation && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="glass-card p-10 text-center space-y-6 border-t-4 border-t-blue-500">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-xs font-bold mb-2">
                  <CheckCircle2 size={14} />
                  <span>Analysis Complete</span>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-slate-400 font-medium">Your Recommended Path:</h3>
                  <h2 className="text-5xl md:text-6xl font-black text-white tracking-tight">{recommendation.role}</h2>
                </div>

                <div className="flex flex-wrap justify-center gap-8 py-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400">{recommendation.confidence}%</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Confidence</div>
                  </div>
                  <div className="text-center border-x border-white/5 px-8">
                    <div className="text-3xl font-bold text-violet-400">{recommendation.salaryRange.split(' ')[0]}</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Start Salary</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald-400">{recommendation.demandScore}/100</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Market Demand</div>
                  </div>
                </div>

                <p className="text-slate-400 text-lg leading-relaxed max-w-lg mx-auto italic">
                  "{recommendation.reasoning}"
                </p>

                <div className="grid md:grid-cols-2 gap-4 text-left pt-6">
                  <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                    <h4 className="flex items-center gap-2 text-emerald-400 font-bold mb-4 text-sm">
                      <Zap size={16} /> Key Strengths
                    </h4>
                    <ul className="space-y-2">
                      {recommendation.strengths.map(s => (
                        <li key={s} className="text-slate-300 text-sm flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-slate-600" /> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                    <h4 className="flex items-center gap-2 text-blue-400 font-bold mb-4 text-sm">
                      <Target size={16} /> Future Scope
                    </h4>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {recommendation.futureScope}
                    </p>
                    <div className="mt-4 flex items-center gap-2">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">AI Impact:</span>
                      <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: `${100 - recommendation.aiImpact}%` }} />
                      </div>
                      <span className="text-[10px] text-blue-400 font-bold">{100 - recommendation.aiImpact}% Secure</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleFinish}
                  className="btn-primary w-full py-5 text-lg flex items-center justify-center gap-3 group"
                >
                  Generate My Dynamic Roadmap
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="w-full py-3 text-sm text-slate-500 hover:text-slate-300 transition-colors"
                >
                  Skip — go to dashboard →
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Branding footer */}
      <div className="absolute bottom-8 flex items-center gap-3 opacity-20">
        <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white text-xs">CB</div>
        <span className="text-xs font-black uppercase tracking-[0.3em] text-white">Career Bridge Intelligence</span>
      </div>
    </div>
  );
}
