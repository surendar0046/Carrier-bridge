'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  Clock, 
  Brain, 
  Code2, 
  ShieldCheck, 
  Trophy,
  ArrowRight,
  Info,
  Calendar,
  CheckCircle2,
  Sparkles,
  History,
  RotateCcw
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@career-bridge/utils';
import { practiceProgressService, StudentPracticeProgress } from '@career-bridge/services';

const modules = [
  { id: 'apt', title: 'Quantitative Aptitude', questions: 15, duration: '20 min', icon: Brain, color: 'blue' },
  { id: 'verb', title: 'Verbal Ability', questions: 15, duration: '15 min', icon: Brain, color: 'emerald' },
  { id: 'coding', title: 'Data Structures & Algo', questions: 3, duration: '45 min', icon: Code2, color: 'violet' },
  { id: 'debug', title: 'System Debugging', questions: 5, duration: '20 min', icon: Code2, color: 'rose' },
];

export default function WeeklyAssessmentPage() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [progress, setProgress] = useState<StudentPracticeProgress | null>(null);

  useEffect(() => {
    setProgress(practiceProgressService.getProgress());

    const handleProgressUpdate = (e: any) => {
      setProgress(e.detail || practiceProgressService.getProgress());
    };

    window.addEventListener('cb-practice-progress-updated', handleProgressUpdate);
    return () => window.removeEventListener('cb-practice-progress-updated', handleProgressUpdate);
  }, []);

  const weekly = progress?.weeklyAssessment;
  const isCompleted = Boolean(weekly?.completed || (weekly?.totalAttempts || 0) > 0);

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      {/* Hero */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-full text-violet-600 text-sm font-bold">
          <Calendar size={16} />
          <span>Week 4: Skill Assessment</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-tight">
          Ready for the <span className="text-gradient">Weekly Challenge?</span>
        </h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          Test your skills across all domains. This assessment is automatically recorded to your student profile, 
          overall practice accuracy, and global leaderboard ranking.
        </p>
      </div>

      {/* Recorded Performance Banner if Student Has Attempted */}
      {isCompleted && weekly && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-violet-900 via-indigo-900 to-slate-900 text-white rounded-[2.5rem] p-8 md:p-10 shadow-xl border border-violet-500/30 space-y-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-yellow-400/20 rounded-2xl flex items-center justify-center border border-yellow-400/40">
                <Trophy size={30} className="text-yellow-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-black">Assessment Progress Recorded</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 size={12} /> Logged
                  </span>
                </div>
                <p className="text-slate-300 text-xs mt-1">
                  Last completed on {weekly.lastCompletedAt ? new Date(weekly.lastCompletedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recently'}
                </p>
              </div>
            </div>

            <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 text-xs font-bold text-slate-200">
              {weekly.totalAttempts} Attempt{weekly.totalAttempts > 1 ? 's' : ''} Recorded
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
              <div className="text-2xl font-black text-white">{weekly.latestScore} / {weekly.latestTotal}</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Latest Score</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
              <div className="text-2xl font-black text-emerald-400">{weekly.latestAccuracy}%</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Accuracy</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
              <div className="text-2xl font-black text-yellow-400">+{weekly.totalXpEarned} XP</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">XP Earned</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
              <div className="text-2xl font-black text-violet-300">{weekly.bestScore} / {weekly.latestTotal}</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Best Score</div>
            </div>
          </div>

          {weekly.history && weekly.history.length > 0 && (
            <div className="space-y-3 pt-2 border-t border-white/10">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                <History size={14} />
                <span>Recorded Assessment Attempts:</span>
              </div>
              <div className="space-y-2">
                {weekly.history.slice(0, 3).map((item, idx) => (
                  <div key={item.id || idx} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-300">Attempt #{weekly.history.length - idx}</span>
                      <span className="text-slate-400 text-[11px]">
                        {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold">{item.score} / {item.totalQuestions} ({item.accuracy}%)</span>
                      <span className="text-emerald-400 font-bold">+{item.xpEarned} XP</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Questions', value: '38', icon: Info, color: 'blue' },
          { label: 'Time Limit', value: '100m', icon: Clock, color: 'emerald' },
          { label: 'Difficulty', value: 'Mixed', icon: Target, color: 'violet' },
          { label: 'XP Reward', value: '500+', icon: Trophy, color: 'yellow' },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-[2rem] p-6 text-center space-y-2 shadow-sm">
            <stat.icon size={20} className={cn(
              stat.color === 'blue' && "text-blue-600",
              stat.color === 'emerald' && "text-emerald-600",
              stat.color === 'violet' && "text-violet-600",
              stat.color === 'yellow' && "text-yellow-600",
              "mx-auto"
            )} />
            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Modules */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <ShieldCheck size={24} className="text-blue-600" />
          Assessment Blueprint
        </h2>
        <div className="grid gap-4">
          {modules.map((module, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-6 hover:bg-slate-50 transition-all shadow-sm">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center",
                  module.color === 'blue' && "bg-blue-500/10 text-blue-600",
                  module.color === 'emerald' && "bg-emerald-500/10 text-emerald-600",
                  module.color === 'violet' && "bg-violet-500/10 text-violet-600",
                  module.color === 'rose' && "bg-rose-500/10 text-rose-600"
                )}>
                  <module.icon size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">{module.title}</h4>
                  <p className="text-sm text-slate-500">{module.questions} Questions • {module.duration}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-3 py-1 rounded-full bg-slate-50 text-[10px] font-black uppercase text-slate-500 border border-slate-200">
                  Weight: {i === 2 ? '40%' : '20%'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rules & Start */}
      <div className="bg-white border border-slate-200 rounded-[2rem] p-8 md:p-12 space-y-8 shadow-sm">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-violet-700 font-bold text-base">
            <ShieldCheck size={20} />
            <span>AI Proctoring & Exam Security Protocols:</span>
          </div>
          <ul className="space-y-3 text-slate-600 text-sm">
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
              <span><strong>Camera Monitoring Active:</strong> Live webcam video is captured and monitored throughout the test. Ensure your face is in frame.</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
              <span><strong>Microphone Monitoring:</strong> Ambient audio decibel levels are monitored in real time.</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 flex-shrink-0" />
              <span><strong>Anti-Tab Switch Lock:</strong> Switching tabs or minimizing the window registers a strike. Reaching <strong>3 strikes</strong> automatically submits and locks your test.</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-2 flex-shrink-0" />
              <span><strong>All 4 Domains Covered:</strong> 5 Quantitative Aptitude, 5 Verbal Ability, 1 Coding, and 1 System Debugging question (All distinct from daily practice).</span>
            </li>
          </ul>
        </div>

        <label className="flex items-center gap-3 cursor-pointer group">
          <input 
            type="checkbox" 
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="w-5 h-5 rounded border-slate-300 bg-white text-violet-600 focus:ring-violet-500"
          />
          <span className="text-sm text-slate-600 group-hover:text-slate-800 transition-colors font-medium">
            I agree to enable camera/mic proctoring and understand that tab switching is strictly prohibited.
          </span>
        </label>

        <button
          onClick={() => router.push('/assessments/weekly/exam')}
          disabled={!agreed}
          className={cn(
            "btn-primary w-full py-5 text-xl font-bold flex items-center justify-center gap-3 group bg-violet-600 hover:bg-violet-700 text-white rounded-2xl shadow-xl shadow-violet-600/25 transition",
            !agreed && "opacity-50 cursor-not-allowed grayscale"
          )}
        >
          {isCompleted ? (
            <>
              <RotateCcw size={22} />
              Retake Proctored Weekly Assessment
            </>
          ) : (
            <>
              Start Proctored Weekly Assessment
              <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
