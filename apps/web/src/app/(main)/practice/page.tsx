'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Code2, 
  MessageSquare, 
  Bug, 
  Calendar, 
  Trophy, 
  ArrowRight,
  Zap,
  Target,
  Clock
} from 'lucide-react';
import { cn } from '@career-bridge/utils';
import { useGamificationStore } from '@career-bridge/store';

const practiceModes = [
  {
    id: 'aptitude',
    title: 'Aptitude',
    description: 'Master quantitative and logical reasoning.',
    icon: Brain,
    color: 'blue',
    stats: '2.4k+ Questions'
  },
  {
    id: 'verbal',
    title: 'Verbal Ability',
    description: 'Enhance your communication and English skills.',
    icon: MessageSquare,
    color: 'emerald',
    stats: '1.8k+ Questions'
  },
  {
    id: 'coding',
    title: 'Coding',
    description: 'Solve algorithmic challenges in multiple languages.',
    icon: Code2,
    color: 'violet',
    stats: '500+ Problems'
  },
  {
    id: 'debugging',
    title: 'Debugging',
    description: 'Find and fix bugs in complex code snippets.',
    icon: Bug,
    color: 'rose',
    stats: '300+ Tasks'
  }
];

export default function PracticePage() {
  const router = useRouter();
  const { profile: gamProfile, leaderboard, fetchProfile: fetchGam, fetchLeaderboard } = useGamificationStore();

  useEffect(() => {
    fetchGam();
    fetchLeaderboard();
  }, [fetchGam, fetchLeaderboard]);

  const streakDays = gamProfile?.streak || 0;

  return (
    <div className="space-y-12 pb-20 p-8">
      {/* Hero Section */}
      <div className="relative rounded-[2.5rem] overflow-hidden bg-white border border-slate-200 p-8 md:p-16 shadow-sm">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-500/5 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-600 text-sm font-bold">
            <Zap size={16} />
            <span>AI-Powered Skill Development</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight">
            Elevate Your <span className="text-gradient">Technical Prowess</span>
          </h1>
          <p className="text-slate-500 text-lg leading-relaxed">
            Personalized practice sessions designed to help you ace your next big interview. 
            Track your progress and climb the leaderboard.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <button 
              onClick={() => document.getElementById('daily-streak-card')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center gap-2 text-slate-600 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors"
            >
              <Calendar size={18} className="text-blue-600" />
              <span className="text-sm font-medium">Daily Streaks: {streakDays} Days</span>
            </button>
            <button 
              onClick={() => document.getElementById('weekly-leaderboard-card')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center gap-2 text-slate-600 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors"
            >
              <Trophy size={18} className="text-yellow-600" />
              <span className="text-sm font-medium">Weekly Leaderboards</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Practice Modes */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">Choose Your Path</h2>
            <Link href="/practice/all" className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">
              View All Topics
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {practiceModes.map((mode, idx) => (
              <motion.div
                key={mode.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link 
                  href={`/practice/${mode.id}`}
                  className="bg-white border border-slate-200 rounded-[2rem] p-8 block hover:border-slate-300 hover:shadow-md transition-all duration-300 h-full group"
                >
                  <div className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500",
                    mode.color === 'blue' && "bg-blue-500/10 text-blue-600",
                    mode.color === 'emerald' && "bg-emerald-500/10 text-emerald-600",
                    mode.color === 'violet' && "bg-violet-500/10 text-violet-600",
                    mode.color === 'rose' && "bg-rose-500/10 text-rose-600"
                  )}>
                    <mode.icon size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">{mode.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6">
                    {mode.description}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">{mode.stats}</span>
                    <ArrowRight size={20} className="text-slate-400 group-hover:text-slate-800 group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sidebar / Assessments */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-slate-900">Assessments</h2>
          <div className="space-y-6">
            <Link href="/assessments/weekly" className="block">
              <div className="bg-white border border-slate-200 rounded-[2rem] p-6 border-l-4 border-l-violet-500 hover:bg-slate-50 transition-all shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-violet-500/10 rounded-xl text-violet-600">
                    <Target size={24} />
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black uppercase tracking-widest text-violet-600">Live Now</span>
                    <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                      <Clock size={12} />
                      <span>Ends in 2d 14h</span>
                    </div>
                  </div>
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-1">Weekly Skill Challenge</h4>
                <p className="text-sm text-slate-500 mb-4">Complete this to rank up in the global leaderboard.</p>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200" />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">+1.2k joined</span>
                </div>
              </div>
            </Link>

            {/* Daily Streak Card */}
            <div id="daily-streak-card" className="bg-white border border-slate-200 rounded-[2rem] p-8 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center text-yellow-600 mx-auto">
                <Trophy size={32} />
              </div>
              <h4 className="text-xl font-bold text-slate-900">Daily Streak</h4>
              <p className="text-sm text-slate-500">
                You&apos;re on a <span className="font-extrabold text-blue-600">{streakDays}-day</span> streak! Practice today to keep it going.
              </p>
              <div className="flex justify-center gap-2">
                {[1,2,3,4,5,6,7].map(i => (
                  <div 
                    key={i} 
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs border transition-all",
                      i <= streakDays 
                        ? "bg-yellow-500 border-yellow-500 text-slate-900" 
                        : "bg-slate-50 text-slate-400 border-slate-200"
                    )}
                  >
                    {i}
                  </div>
                ))}
              </div>
              <button 
                onClick={() => router.push('/practice/coding')}
                className="btn-primary w-full py-3 text-sm mt-4"
              >
                Start Daily Practice
              </button>
            </div>

            {/* Weekly Leaderboard Card */}
            <div id="weekly-leaderboard-card" className="bg-white border border-slate-200 rounded-[2rem] p-6 space-y-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center text-yellow-600">
                  <Trophy size={20} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">Weekly Leaderboard</h4>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Global Standings</p>
                </div>
              </div>
              
              <div className="space-y-2 pt-2">
                {leaderboard.length > 0 ? (
                  leaderboard.slice(0, 5).map((entry) => (
                    <div 
                      key={entry.userId} 
                      className={cn(
                        "flex items-center justify-between p-3 rounded-xl border border-transparent transition-all",
                        entry.userId === 'user-001' 
                          ? "bg-blue-50 border-blue-100" 
                          : "hover:bg-slate-50"
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className={cn(
                          "w-5 font-black text-xs text-center flex-shrink-0",
                          entry.rank === 1 && "text-yellow-600",
                          entry.rank === 2 && "text-slate-400",
                          entry.rank === 3 && "text-amber-600",
                          entry.rank > 3 && "text-slate-400"
                        )}>
                          #{entry.rank}
                        </span>
                        <img src={entry.avatar} alt={entry.name} className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-700 truncate">{entry.name}</div>
                          <div className="text-[9px] text-slate-400 font-bold uppercase">Lvl {entry.level}</div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-xs font-black text-blue-600">{entry.xp.toLocaleString()} XP</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-xs text-slate-400">No standings available</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
