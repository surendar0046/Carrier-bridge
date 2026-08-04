'use client';
import React, { useState } from 'react';

const STUDENTS = [
  { id: 1, name: 'Ravi Kumar', avatar: 'https://ui-avatars.com/api/?name=Ravi+Kumar&background=3b82f6&color=fff', course: 'B.Tech CSE', college: 'IIT Delhi', score: 88, tests: 12, forum: 5, resources: 8, streak: 14, trend: 'up', skills: ['DSA', 'React', 'Python'] },
  { id: 2, name: 'Priya Sharma', avatar: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=8b5cf6&color=fff', course: 'MCA', college: 'NIT Trichy', score: 74, tests: 8, forum: 12, resources: 15, streak: 7, trend: 'up', skills: ['ML', 'Python', 'SQL'] },
  { id: 3, name: 'Amit Patel', avatar: 'https://ui-avatars.com/api/?name=Amit+Patel&background=10b981&color=fff', course: 'B.Tech IT', college: 'VIT Vellore', score: 62, tests: 5, forum: 2, resources: 3, streak: 3, trend: 'down', skills: ['JavaScript', 'Node.js'] },
  { id: 4, name: 'Sneha Reddy', avatar: 'https://ui-avatars.com/api/?name=Sneha+Reddy&background=f59e0b&color=fff', course: 'B.E. CSE', college: 'BITS Pilani', score: 91, tests: 18, forum: 20, resources: 22, streak: 21, trend: 'up', skills: ['System Design', 'Java', 'DSA'] },
  { id: 5, name: 'Karan Joshi', avatar: 'https://ui-avatars.com/api/?name=Karan+Joshi&background=ef4444&color=fff', course: 'B.Tech CSE', college: 'DTU', score: 55, tests: 3, forum: 1, resources: 2, streak: 1, trend: 'down', skills: ['C++', 'DSA'] },
];

const METRICS_INFO = [
  { key: 'score', label: 'Avg Score', icon: '📊', color: '#3b82f6', suffix: '%' },
  { key: 'tests', label: 'Tests Taken', icon: '📝', color: '#10b981', suffix: '' },
  { key: 'forum', label: 'Forum Posts', icon: '💬', color: '#8b5cf6', suffix: '' },
  { key: 'streak', label: 'Day Streak', icon: '🔥', color: '#f59e0b', suffix: 'd' },
];

function ScoreBar({ value, max = 100, color }: { value: number; max?: number; color: string }) {
  return (
    <div className="w-full bg-slate-100 rounded-full h-1.5">
      <div className="h-1.5 rounded-full transition-all duration-700" style={{ width: `${(value / max) * 100}%`, background: color }} />
    </div>
  );
}

export default function AnalyticsPage() {
  const [selected, setSelected] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'score' | 'streak' | 'tests'>('score');

  const filtered = STUDENTS
    .filter(s => !search || s.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => b[sortBy] - a[sortBy]);

  const selectedStudent = STUDENTS.find(s => s.id === selected);

  const avgScore = Math.round(STUDENTS.reduce((s, u) => s + u.score, 0) / STUDENTS.length);
  const topStreak = Math.max(...STUDENTS.map(s => s.streak));
  const totalTests = STUDENTS.reduce((s, u) => s + u.tests, 0);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">📈 Student Performance Insights</h1>
        <p className="text-slate-500 mt-1 font-medium">Track and guide students based on their progress and engagement</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Students', value: STUDENTS.length, icon: '🎓', color: '#3b82f6', bg: '#dbeafe' },
          { label: 'Avg Test Score', value: `${avgScore}%`, icon: '📊', color: '#10b981', bg: '#d1fae5' },
          { label: 'Top Streak', value: `${topStreak}d`, icon: '🔥', color: '#f59e0b', bg: '#fef3c7' },
          { label: 'Tests Taken', value: totalTests, icon: '📝', color: '#8b5cf6', bg: '#ede9fe' },
        ].map(stat => (
          <div key={stat.label} className="bg-white border border-slate-100 rounded-3xl p-5 hover:shadow-lg transition-all">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl mb-3" style={{ background: stat.bg }}>
              {stat.icon}
            </div>
            <div className="text-2xl font-black text-slate-900">{stat.value}</div>
            <div className="text-xs text-slate-500 font-semibold mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search + Sort */}
          <div className="flex gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[180px]">
              <input value={search} onChange={e => setSearch(e.target.value)}
                className="w-full border border-slate-200 rounded-2xl px-4 py-2.5 text-sm pl-9 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-white transition-all"
                placeholder="Search students…" />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🔍</span>
            </div>
            <select value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)}
              className="border border-slate-200 rounded-2xl px-4 py-2.5 text-sm font-bold text-slate-600 outline-none focus:border-blue-400 bg-white">
              <option value="score">Sort: Score</option>
              <option value="streak">Sort: Streak</option>
              <option value="tests">Sort: Tests</option>
            </select>
          </div>

          {/* Student Cards */}
          <div className="space-y-3">
            {filtered.map(s => (
              <div key={s.id} onClick={() => setSelected(s.id === selected ? null : s.id)}
                className={`bg-white border rounded-3xl p-5 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5 ${selected === s.id ? 'border-blue-300 shadow-lg shadow-blue-50' : 'border-slate-100'}`}>
                <div className="flex items-center gap-4">
                  <img src={s.avatar} alt={s.name} className="w-11 h-11 rounded-2xl flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-slate-800">{s.name}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                        {s.trend === 'up' ? '↑ Improving' : '↓ Declining'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{s.course} · {s.college}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-lg font-black" style={{ color: s.score >= 80 ? '#10b981' : s.score >= 60 ? '#f59e0b' : '#ef4444' }}>
                      {s.score}%
                    </div>
                    <div className="text-[10px] text-slate-400">avg score</div>
                  </div>
                </div>

                {/* Score Bar */}
                <div className="mt-3">
                  <ScoreBar value={s.score} color={s.score >= 80 ? '#10b981' : s.score >= 60 ? '#f59e0b' : '#ef4444'} />
                </div>

                {/* Metrics Row */}
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {METRICS_INFO.map(m => (
                    <div key={m.key} className="text-center">
                      <div className="text-sm font-black" style={{ color: m.color }}>
                        {(s as Record<string, unknown>)[m.key] as number}{m.suffix}
                      </div>
                      <div className="text-[9px] text-slate-400 font-semibold">{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Student Detail Panel */}
        <div className="space-y-4">
          {selectedStudent ? (
            <>
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white">
                <img src={selectedStudent.avatar} alt={selectedStudent.name} className="w-16 h-16 rounded-2xl mb-4 ring-4 ring-white/20" />
                <h3 className="text-xl font-black">{selectedStudent.name}</h3>
                <p className="text-blue-200 text-xs mt-1">{selectedStudent.course} · {selectedStudent.college}</p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="bg-white/10 rounded-2xl p-3">
                    <div className="text-2xl font-black">{selectedStudent.score}%</div>
                    <div className="text-[10px] text-blue-200">Avg Score</div>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-3">
                    <div className="text-2xl font-black">{selectedStudent.streak}d</div>
                    <div className="text-[10px] text-blue-200">Streak</div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-100 rounded-3xl p-5">
                <h4 className="font-black text-slate-800 mb-3">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedStudent.skills.map(sk => (
                    <span key={sk} className="text-xs font-bold px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700">{sk}</span>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-slate-100 rounded-3xl p-5">
                <h4 className="font-black text-slate-800 mb-3">Activity</h4>
                <div className="space-y-3">
                  {[
                    { label: 'Tests Completed', value: selectedStudent.tests, max: 20, color: '#3b82f6' },
                    { label: 'Forum Engagement', value: selectedStudent.forum, max: 25, color: '#8b5cf6' },
                    { label: 'Resources Used', value: selectedStudent.resources, max: 25, color: '#10b981' },
                  ].map(item => (
                    <div key={item.label}>
                      <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                        <span>{item.label}</span>
                        <span style={{ color: item.color }}>{item.value}</span>
                      </div>
                      <ScoreBar value={item.value} max={item.max} color={item.color} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-slate-100 rounded-3xl p-5">
                <h4 className="font-black text-slate-800 mb-3">Guidance Note</h4>
                <textarea rows={3}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-blue-400 resize-none transition-all"
                  placeholder={`Add a private note to guide ${selectedStudent.name}…`}
                />
                <button className="mt-2 w-full py-2.5 rounded-xl text-xs font-bold text-white transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg,#2563eb,#4f46e5)' }}>
                  💾 Save Note
                </button>
              </div>
            </>
          ) : (
            <div className="bg-white border border-slate-100 rounded-3xl p-8 text-center">
              <div className="text-5xl mb-4">👆</div>
              <p className="font-bold text-slate-600">Click a student to view their detailed insights and add guidance notes</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
