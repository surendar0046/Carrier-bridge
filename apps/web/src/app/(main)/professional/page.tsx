'use client';
import React, { useState, useEffect } from 'react';
import { useUserStore, useAuthStore } from '@career-bridge/store';
import Link from 'next/link';

const STATS = [
  { label: 'Reputation Points', value: '2,840', icon: '⭐', color: '#f59e0b', bg: '#fef3c7', trend: '+120 this week' },
  { label: 'Answers Given', value: '156', icon: '💬', color: '#3b82f6', bg: '#dbeafe', trend: '+12 this week' },
  { label: 'Resources Shared', value: '43', icon: '📚', color: '#10b981', bg: '#d1fae5', trend: '+5 this week' },
  { label: 'Students Guided', value: '89', icon: '🎓', color: '#8b5cf6', bg: '#ede9fe', trend: '+8 this week' },
];

const RECENT_QUESTIONS = [
  { id: 1, title: 'How to prepare for system design interviews at FAANG?', author: 'Ravi Kumar', avatar: 'https://ui-avatars.com/api/?name=Ravi+Kumar&background=3b82f6&color=fff', time: '2h ago', tags: ['System Design', 'FAANG'], answers: 3, views: 245 },
  { id: 2, title: 'What are the best resources for learning DSA from scratch?', author: 'Priya Sharma', avatar: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=8b5cf6&color=fff', time: '4h ago', tags: ['DSA', 'Beginners'], answers: 7, views: 412 },
  { id: 3, title: 'How to negotiate salary as a fresher?', author: 'Amit Patel', avatar: 'https://ui-avatars.com/api/?name=Amit+Patel&background=10b981&color=fff', time: '6h ago', tags: ['Career', 'Salary'], answers: 5, views: 318 },
  { id: 4, title: 'React vs Vue in 2026 — which one for a beginner?', author: 'Sneha Reddy', avatar: 'https://ui-avatars.com/api/?name=Sneha+Reddy&background=f59e0b&color=fff', time: '1d ago', tags: ['React', 'Frontend'], answers: 11, views: 589 },
];

const BADGES = [
  { name: 'Top Mentor', icon: '🏆', color: '#f59e0b', earned: true },
  { name: 'Answer Guru', icon: '💡', color: '#3b82f6', earned: true },
  { name: 'Resource Hero', icon: '📚', color: '#10b981', earned: true },
  { name: 'Community Star', icon: '⭐', color: '#8b5cf6', earned: false },
  { name: '100 Answers', icon: '💬', color: '#ef4444', earned: true },
  { name: 'Gold Badge', icon: '🥇', color: '#f59e0b', earned: false },
];

const LEADERBOARD = [
  { rank: 1, name: 'Dr. Meera Iyer', points: 5420, avatar: 'https://ui-avatars.com/api/?name=Meera+Iyer&background=f59e0b&color=fff', badge: '🏆' },
  { rank: 2, name: 'Arjun Mehta', points: 4180, avatar: 'https://ui-avatars.com/api/?name=Arjun+Mehta&background=3b82f6&color=fff', badge: '🥈' },
  { rank: 3, name: 'Kavya Nair', points: 3750, avatar: 'https://ui-avatars.com/api/?name=Kavya+Nair&background=8b5cf6&color=fff', badge: '🥉' },
  { rank: 4, name: 'You', points: 2840, avatar: 'https://ui-avatars.com/api/?name=You&background=10b981&color=fff', badge: '4️⃣', isCurrentUser: true },
  { rank: 5, name: 'Vikram Singh', points: 2310, avatar: 'https://ui-avatars.com/api/?name=Vikram+Singh&background=ef4444&color=fff', badge: '5️⃣' },
];

export default function ProfessionalDashboard() {
  const { profile } = useUserStore();
  const { isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'questions' | 'leaderboard'>('overview');
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{profile?.name?.split(' ')[0] || 'Pro'}</span> 👋
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Your professional impact dashboard — guide, share, and inspire.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/professional/forum" className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:scale-105 active:scale-95" style={{ background: 'linear-gradient(135deg,#2563eb,#4f46e5)' }}>
            💬 Answer Questions
          </Link>
          <Link href="/professional/resources/new" className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold text-slate-700 border border-slate-200 bg-white hover:bg-slate-50 transition-all hover:scale-105">
            📤 Share Resource
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s) => (
          <div key={s.label} className="bg-white border border-slate-100 rounded-3xl p-5 hover:shadow-lg hover:shadow-slate-100 transition-all group hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl" style={{ background: s.bg }}>
                {s.icon}
              </div>
              <span className="text-[10px] font-bold px-2 py-1 rounded-full" style={{ color: s.color, background: s.bg }}>{s.trend}</span>
            </div>
            <div className="text-2xl font-black text-slate-900">{s.value}</div>
            <div className="text-xs text-slate-500 font-semibold mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 rounded-2xl w-fit" style={{ background: '#f1f5f9', border: '1px solid #e2e8f0' }}>
        {(['overview', 'questions', 'leaderboard'] as const).map((t) => (
          <button key={t} onClick={() => setActiveTab(t)}
            className="px-5 py-2.5 rounded-xl text-xs font-bold capitalize transition-all duration-300"
            style={activeTab === t ? { background: 'linear-gradient(135deg,#2563eb,#4f46e5)', color: 'white', boxShadow: '0 4px 15px rgba(79,70,229,0.3)' } : { color: '#64748b' }}>
            {t === 'overview' ? '📊 Overview' : t === 'questions' ? '❓ Student Questions' : '🏆 Leaderboard'}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Action Cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { title: 'Create Practice Test', desc: 'Build assessments for students', icon: '📝', href: '/professional/tests/new', color: 'from-blue-500 to-cyan-500' },
                { title: 'Post Career Tip', desc: 'Share your industry insights', icon: '💡', href: '/professional/resources/new', color: 'from-violet-500 to-purple-500' },
                { title: 'View Student Analytics', desc: 'Track learner performance', icon: '📈', href: '/professional/analytics', color: 'from-emerald-500 to-teal-500' },
                { title: 'Forum Discussion', desc: 'Answer unanswered questions', icon: '🗣️', href: '/professional/forum', color: 'from-orange-500 to-amber-500' },
              ].map((a) => (
                <Link key={a.title} href={a.href}
                  className="bg-white border border-slate-100 rounded-3xl p-5 hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl text-white mb-3 bg-gradient-to-br ${a.color} shadow-lg`}>
                    {a.icon}
                  </div>
                  <div className="font-bold text-slate-800 text-sm">{a.title}</div>
                  <div className="text-xs text-slate-500 mt-1">{a.desc}</div>
                  <div className="mt-3 text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform inline-block">Go →</div>
                </Link>
              ))}
            </div>

            {/* Recent Student Questions */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-black text-slate-800">Recent Student Questions</h3>
                <Link href="/professional/forum" className="text-xs font-bold text-blue-600 hover:text-blue-700">View all →</Link>
              </div>
              <div className="space-y-3">
                {RECENT_QUESTIONS.slice(0, 3).map((q) => (
                  <Link href={`/professional/forum/${q.id}`} key={q.id}
                    className="flex items-start gap-4 p-4 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all group">
                    <img src={q.avatar} alt={q.author} className="w-9 h-9 rounded-xl flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-700 transition-colors line-clamp-1">{q.title}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] text-slate-500">{q.author} · {q.time}</span>
                        <span className="text-[10px] text-blue-600 font-bold">{q.answers} answers</span>
                      </div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      {q.tags.slice(0, 1).map(t => (
                        <span key={t} className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">{t}</span>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel: Badges + Level */}
          <div className="space-y-6">
            {/* Reputation Level */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white">
              <div className="text-xs font-bold uppercase tracking-widest opacity-70 mb-2">Your Reputation Level</div>
              <div className="text-4xl font-black mb-1">2,840</div>
              <div className="text-sm opacity-80 mb-4">Senior Mentor · Level 7</div>
              <div className="bg-white/20 rounded-full h-2 mb-2">
                <div className="bg-white rounded-full h-2 transition-all" style={{ width: '68%' }} />
              </div>
              <div className="text-[10px] opacity-70">1,160 pts to Level 8</div>
            </div>

            {/* Badges */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6">
              <h3 className="font-black text-slate-800 mb-4">Your Badges</h3>
              <div className="grid grid-cols-3 gap-3">
                {BADGES.map((b) => (
                  <div key={b.name}
                    className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-all ${b.earned ? 'opacity-100' : 'opacity-30 grayscale'}`}
                    style={{ background: b.earned ? `${b.color}15` : '#f1f5f9', border: `1px solid ${b.earned ? b.color + '30' : '#e2e8f0'}` }}>
                    <span className="text-2xl">{b.icon}</span>
                    <span className="text-[9px] font-bold text-slate-600 text-center leading-tight">{b.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'questions' && (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <input className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm pl-10 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" placeholder="Search questions…" />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
            </div>
            <select className="border border-slate-200 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-600 outline-none focus:border-blue-400 bg-white">
              <option>All Tags</option>
              <option>System Design</option>
              <option>DSA</option>
              <option>Career</option>
              <option>Frontend</option>
            </select>
          </div>
          <div className="space-y-3">
            {RECENT_QUESTIONS.map((q) => (
              <Link href={`/professional/forum/${q.id}`} key={q.id}
                className="flex items-start gap-4 bg-white border border-slate-100 rounded-3xl p-5 hover:shadow-lg hover:-translate-y-0.5 hover:border-blue-200 transition-all group">
                <img src={q.avatar} alt={q.author} className="w-10 h-10 rounded-xl flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 group-hover:text-blue-700 transition-colors">{q.title}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs text-slate-500">{q.author} · {q.time}</span>
                    <span className="text-xs text-blue-600 font-bold">💬 {q.answers} answers</span>
                    <span className="text-xs text-slate-400 font-semibold">👁️ {q.views} views</span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    {q.tags.map(t => (
                      <span key={t} className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">{t}</span>
                    ))}
                  </div>
                </div>
                <button className="flex-shrink-0 px-4 py-2 text-xs font-bold text-white rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 shadow-md hover:shadow-lg transition-all hover:scale-105">
                  Answer
                </button>
              </Link>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'leaderboard' && (
        <div className="bg-white border border-slate-100 rounded-3xl p-6 max-w-2xl">
          <h3 className="font-black text-slate-800 mb-6 text-lg">🏆 Top Contributors Leaderboard</h3>
          <div className="space-y-3">
            {LEADERBOARD.map((l) => (
              <div key={l.rank}
                className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${l.isCurrentUser ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200' : 'border border-slate-100 hover:border-slate-200 hover:bg-slate-50'}`}>
                <span className="text-2xl w-8 text-center">{l.badge}</span>
                <img src={l.avatar} alt={l.name} className="w-10 h-10 rounded-xl" />
                <div className="flex-1">
                  <div className={`font-bold text-sm ${l.isCurrentUser ? 'text-blue-700' : 'text-slate-800'}`}>
                    {l.name} {l.isCurrentUser && <span className="text-[10px] font-black text-blue-500 ml-1">(YOU)</span>}
                  </div>
                  <div className="text-xs text-slate-500">{l.points.toLocaleString()} points</div>
                </div>
                <div className="text-right">
                  <div className="w-24 bg-slate-100 rounded-full h-1.5">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-1.5 rounded-full" style={{ width: `${(l.points / 5420) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
