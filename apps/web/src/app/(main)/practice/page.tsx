'use client';

import React, { useEffect, useState } from 'react';
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
  Clock, 
  CheckCircle2, 
  Sparkles, 
  History, 
  Award,
  ChevronRight
} from 'lucide-react';
import { cn } from '@career-bridge/utils';
import { useGamificationStore } from '@career-bridge/store';
import { 
  practiceProgressService, 
  StudentPracticeProgress, 
  PracticeSessionRecord, 
  CategoryProgress 
} from '@career-bridge/services';

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
  const [progress, setProgress] = useState<StudentPracticeProgress | null>(null);

  useEffect(() => {
    fetchGam();
    fetchLeaderboard();

    // Load practice progress
    setProgress(practiceProgressService.getProgress());

    const handleProgressUpdate = (e: any) => {
      setProgress(e.detail || practiceProgressService.getProgress());
    };

    window.addEventListener('cb-practice-progress-updated', handleProgressUpdate);
    return () => window.removeEventListener('cb-practice-progress-updated', handleProgressUpdate);
  }, [fetchGam, fetchLeaderboard]);

  const streakDays = progress?.streakDays || gamProfile?.streak || 1;

  // Aggregate recent sessions across all practice categories + weekly assessments
  const recentSessions: PracticeSessionRecord[] = progress ? [
    ...(progress.aptitude?.history || []),
    ...(progress.verbal?.history || []),
    ...(progress.coding?.history || []),
    ...(progress.debugging?.history || []),
    ...(progress.weeklyAssessment?.history || []),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5) : [];

  const weeklyInfo = progress?.weeklyAssessment;

  return (
    <div className="space-y-12 pb-20 p-8">
      {/* Hero Section */}
      <div className="relative rounded-[2.5rem] overflow-hidden bg-white border border-slate-200 p-8 md:p-14 shadow-sm">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-500/5 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-600 text-sm font-bold">
            <Zap size={16} />
            <span>AI-Powered Skill Development & Real-Time Tracking</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight">
            Elevate Your <span className="text-gradient">Technical Prowess</span>
          </h1>
          <p className="text-slate-500 text-lg leading-relaxed">
            Practice Aptitude, Verbal, Coding, and Debugging with automated performance tracking, 
            accuracy analysis, and weekly assessments.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <button 
              onClick={() => document.getElementById('daily-streak-card')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center gap-2 text-slate-600 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors"
            >
              <Calendar size={18} className="text-blue-600" />
              <span className="text-sm font-medium">Daily Streak: {streakDays} Days</span>
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

      {/* Student Overall Progress Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Questions</span>
            <Target size={18} className="text-blue-500" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            {progress?.totalQuestionsCompleted || 0}
          </div>
          <div className="text-xs text-slate-400 mt-1">Across all 4 practice tracks</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Overall Accuracy</span>
            <CheckCircle2 size={18} className="text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            {progress?.overallAccuracy || 0}%
          </div>
          <div className="text-xs text-slate-400 mt-1">Weighted across all submissions</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Practice XP</span>
            <Sparkles size={18} className="text-yellow-500" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            +{progress?.totalXpEarned || 0}
          </div>
          <div className="text-xs text-slate-400 mt-1">Points credited to profile</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Weekly Status</span>
            <Award size={18} className="text-violet-500" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            {weeklyInfo?.completed ? `${weeklyInfo.latestScore}/${weeklyInfo.latestTotal}` : 'Pending'}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            {weeklyInfo?.completed ? `${weeklyInfo.latestAccuracy}% accuracy recorded` : 'Challenge ready to attempt'}
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Practice Modes */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Choose Your Path</h2>
              <p className="text-xs text-slate-500 mt-0.5">Your progress and accuracy are saved automatically for each domain.</p>
            </div>
            <Link href="/practice/all" className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">
              View All Topics
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {practiceModes.map((mode, idx) => {
              const catData: CategoryProgress | undefined = progress ? progress[mode.id as 'aptitude' | 'verbal' | 'coding' | 'debugging'] : undefined;
              const hasAttempts = (catData?.totalAttempts || 0) > 0;

              return (
                <motion.div
                  key={mode.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Link 
                    href={`/practice/${mode.id}`}
                    className="bg-white border border-slate-200 rounded-[2rem] p-8 block hover:border-slate-300 hover:shadow-md transition-all duration-300 h-full group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div className={cn(
                          "w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500",
                          mode.color === 'blue' && "bg-blue-500/10 text-blue-600",
                          mode.color === 'emerald' && "bg-emerald-500/10 text-emerald-600",
                          mode.color === 'violet' && "bg-violet-500/10 text-violet-600",
                          mode.color === 'rose' && "bg-rose-500/10 text-rose-600"
                        )}>
                          <mode.icon size={32} />
                        </div>
                        {hasAttempts && (
                          <div className="flex flex-col items-end">
                            <span className="text-xs font-black px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                              {catData?.accuracy}% Acc
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                              +{catData?.xpEarned} XP
                            </span>
                          </div>
                        )}
                      </div>

                      <h3 className="text-2xl font-bold text-slate-900 mb-2">{mode.title}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed mb-6">
                        {mode.description}
                      </p>

                      {/* Live Progress Bar */}
                      <div className="space-y-1.5 mb-6">
                        <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                          <span>Progress: {catData?.completedQuestions || 0} Solved</span>
                          <span>{hasAttempts ? `${catData?.correctAnswers} Correct` : 'Not Started'}</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div 
                            className={cn(
                              "h-full rounded-full transition-all duration-500",
                              mode.color === 'blue' && "bg-blue-600",
                              mode.color === 'emerald' && "bg-emerald-600",
                              mode.color === 'violet' && "bg-violet-600",
                              mode.color === 'rose' && "bg-rose-600"
                            )}
                            style={{ 
                              width: `${Math.min(100, Math.max((catData?.completedQuestions || 0) > 0 ? 12 : 0, ((catData?.completedQuestions || 0) / 20) * 100))}%` 
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                      <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                        {hasAttempts ? `${catData?.totalAttempts} Attempt${(catData?.totalAttempts || 0) > 1 ? 's' : ''}` : mode.stats}
                      </span>
                      <div className="flex items-center gap-1 text-sm font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
                        <span>{hasAttempts ? 'Continue' : 'Start'}</span>
                        <ArrowRight size={16} />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Recent Practice History */}
          <div className="bg-white border border-slate-200 rounded-[2rem] p-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                  <History size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Recent Practice & Assessments</h3>
                  <p className="text-xs text-slate-400">Your recent test runs, scores, and XP recorded.</p>
                </div>
              </div>
            </div>

            {recentSessions.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {recentSessions.map((session) => (
                  <div key={session.id} className="py-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs uppercase",
                        session.category === 'aptitude' && "bg-blue-50 text-blue-600 border border-blue-200",
                        session.category === 'verbal' && "bg-emerald-50 text-emerald-600 border border-emerald-200",
                        session.category === 'coding' && "bg-violet-50 text-violet-600 border border-violet-200",
                        session.category === 'debugging' && "bg-rose-50 text-rose-600 border border-rose-200",
                        session.category === 'weekly' && "bg-amber-50 text-amber-600 border border-amber-200"
                      )}>
                        {session.category === 'weekly' ? 'WA' : session.category.slice(0, 3)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900 capitalize">
                            {session.category === 'weekly' ? 'Weekly Skill Assessment' : `${session.category} Practice`}
                          </span>
                          {session.language && (
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                              {session.language}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-400">
                          {new Date(session.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="text-sm font-bold text-slate-800">
                          {session.score} / {session.totalQuestions} ({session.accuracy}%)
                        </div>
                        <div className="text-[10px] font-black uppercase text-slate-400">Score & Accuracy</div>
                      </div>
                      <div className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full font-bold text-xs">
                        +{session.xpEarned} XP
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center space-y-3">
                <p className="text-sm text-slate-500">No practice sessions recorded yet. Start any track above or take the weekly challenge!</p>
                <button 
                  onClick={() => router.push('/practice/aptitude')}
                  className="btn-primary px-6 py-2.5 text-xs inline-flex items-center gap-2"
                >
                  Start First Practice Session
                  <ChevronRight size={14} />
                </button>
              </div>
            )}
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
                    {weeklyInfo?.completed ? (
                      <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                        Completed
                      </span>
                    ) : (
                      <span className="text-[10px] font-black uppercase tracking-widest text-violet-600">
                        Live Now
                      </span>
                    )}
                    <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                      <Clock size={12} />
                      <span>Ends in 2d 14h</span>
                    </div>
                  </div>
                </div>
                
                <h4 className="text-lg font-bold text-slate-900 mb-1">Weekly Skill Challenge</h4>
                <p className="text-sm text-slate-500 mb-4">
                  {weeklyInfo?.completed 
                    ? `Latest score: ${weeklyInfo.latestScore}/${weeklyInfo.latestTotal} (${weeklyInfo.latestAccuracy}%). Retake anytime to improve.`
                    : 'Complete this to rank up in the global leaderboard and record weekly evaluation.'
                  }
                </p>

                {weeklyInfo?.completed ? (
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div className="text-xs font-bold text-emerald-600">
                      Best Score: {weeklyInfo.bestScore}/{weeklyInfo.latestTotal}
                    </div>
                    <span className="text-xs font-bold text-blue-600 flex items-center gap-1">
                      View Challenge <ChevronRight size={14} />
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {[1,2,3].map(i => (
                        <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200" />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">+1.2k joined</span>
                  </div>
                )}
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
