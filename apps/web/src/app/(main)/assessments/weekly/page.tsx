'use client';

import React, { useState } from 'react';
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
  Calendar
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@career-bridge/utils';

const modules = [
  { id: 'apt', title: 'Quantitative Aptitude', questions: 15, duration: '20 min', icon: Brain, color: 'blue' },
  { id: 'verb', title: 'Verbal Ability', questions: 15, duration: '15 min', icon: Brain, color: 'emerald' },
  { id: 'coding', title: 'Data Structures & Algo', questions: 3, duration: '45 min', icon: Code2, color: 'violet' },
  { id: 'debug', title: 'System Debugging', questions: 5, duration: '20 min', icon: Code2, color: 'rose' },
];

export default function WeeklyAssessmentPage() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);

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
          Test your skills across all domains. This assessment is used for the global leaderboard 
          and your personalized growth recommendations.
        </p>
      </div>

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
          <h3 className="text-xl font-bold text-slate-900">Important Instructions:</h3>
          <ul className="space-y-3 text-slate-500 text-sm">
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5" />
              Ensure you have a stable internet connection.
            </li>
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5" />
              The assessment cannot be paused once started.
            </li>
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5" />
              Tab switching or closing the browser will terminate the session.
            </li>
          </ul>
        </div>

        <label className="flex items-center gap-3 cursor-pointer group">
          <input 
            type="checkbox" 
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="w-5 h-5 rounded border-slate-300 bg-white text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-slate-500 group-hover:text-slate-700 transition-colors">
            I understand the rules and I'm ready to begin the assessment.
          </span>
        </label>

        <button
          onClick={() => router.push('/practice/aptitude?mode=assessment')}
          disabled={!agreed}
          className={cn(
            "btn-primary w-full py-5 text-xl font-bold flex items-center justify-center gap-3 group",
            !agreed && "opacity-50 cursor-not-allowed grayscale"
          )}
        >
          Start Weekly Assessment
          <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
