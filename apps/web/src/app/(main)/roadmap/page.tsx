'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Recommendation } from '@career-bridge/ai';
import { ROLE_ROADMAPS, ACCENT_COLORS, getRoleRoadmap } from '@/data/roadmapData';
import { useUserStore } from '@career-bridge/store';

export default function RoadmapPage() {
  const [rec, setRec] = useState<Recommendation | null>(null);
  const [activePhase, setActivePhase] = useState(0);
  const { profile, activeRole, fetchProfile } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (!profile) {
      fetchProfile();
    }
  }, [profile, fetchProfile]);

  useEffect(() => {
    try {
      let currentRec = null;
      if (profile?.email) {
        const prefsStr = localStorage.getItem(`cb_prefs_${profile.email}`);
        if (prefsStr) {
           const prefs = JSON.parse(prefsStr);
           if (prefs.recommendation) {
               currentRec = prefs.recommendation;
           }
        }
      }
      
      if (!currentRec) {
        const stored = localStorage.getItem('cb_recommendation');
        if (stored) currentRec = JSON.parse(stored);
      }
      
      if (currentRec && activeRole) {
          currentRec = { ...currentRec, role: activeRole };
      }
      
      if (currentRec) setRec(currentRec);
    } catch { /* ignore */ }
  }, [profile, activeRole]);

  if (!rec) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center gap-6 text-center p-8">
        <div className="text-6xl">🗺️</div>
        <h2 className="text-2xl font-bold text-white">No roadmap found</h2>
        <p className="text-slate-400 max-w-sm">Complete the career assessment quiz first to generate your personalized roadmap.</p>
        <Link href="/quiz" className="btn-primary px-8 py-3 rounded-2xl">Take the Quiz →</Link>
      </div>
    );
  }

  const roadmap = getRoleRoadmap(rec.role);
  const phase = roadmap.phases[activePhase];
  const accent = ACCENT_COLORS[phase.accent];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/8 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-violet-600/8 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-10 space-y-10">

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{roadmap.emoji}</span>
              <div>
                <p className="text-[11px] font-bold text-blue-400 uppercase tracking-[0.25em]">Your Dynamic Roadmap</p>
                <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">{rec.role}</h1>
              </div>
            </div>
            <p className="text-slate-400 text-sm max-w-lg italic">"{rec.reasoning}"</p>
          </div>

          {/* Stats */}
          <div className="flex gap-6 shrink-0">
            {[
              { label: 'Confidence', value: `${rec.confidence}%`, color: 'text-blue-400' },
              { label: 'Market Demand', value: `${rec.demandScore}/100`, color: 'text-emerald-400' },
              { label: 'Salary Range', value: roadmap.salary, color: 'text-violet-400' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className={`text-xl font-extrabold ${s.color}`}>{s.value}</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Phase Tabs ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {roadmap.phases.map((p, i) => {
            const ac = ACCENT_COLORS[p.accent];
            const isActive = i === activePhase;
            return (
              <button key={p.id} onClick={() => setActivePhase(i)}
                className="p-4 rounded-2xl text-left transition-all duration-300 border"
                style={isActive
                  ? { background: ac.bg, borderColor: ac.border }
                  : { background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.07)' }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: isActive ? ac.text : '#475569' }}>Phase {p.id}</span>
                </div>
                <div className="font-bold text-sm" style={{ color: isActive ? '#f1f5f9' : '#64748b' }}>{p.title}</div>
                <div className="text-[11px] mt-1" style={{ color: isActive ? ac.text : '#334155' }}>{p.duration}</div>
              </button>
            );
          })}
        </div>

        {/* ── Phase Detail ── */}
        <div className="grid md:grid-cols-3 gap-6">

          {/* Skills */}
          <div className="md:col-span-1 glass-card p-6 space-y-4" style={{ borderColor: accent.border }}>
            <h3 className="font-bold text-sm uppercase tracking-widest" style={{ color: accent.text }}>🎓 Skills to Learn</h3>
            <ul className="space-y-2">
              {phase.skills.map(s => (
                <li key={s} className="flex items-center gap-3 text-sm text-slate-300">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: accent.text }} />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Projects */}
          <div className="glass-card p-6 space-y-4" style={{ borderColor: accent.border }}>
            <h3 className="font-bold text-sm uppercase tracking-widest" style={{ color: accent.text }}>🛠️ Projects to Build</h3>
            <ul className="space-y-3">
              {phase.projects.map((p, i) => (
                <li key={p} className="flex items-start gap-3 text-sm text-slate-300">
                  <span className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0"
                    style={{ background: accent.bg, color: accent.text, border: `1px solid ${accent.border}` }}>
                    {i + 1}
                  </span>
                  {p}
                </li>
              ))}
            </ul>

            <div className="pt-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
              <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">🔧 Tools</h4>
              <div className="flex flex-wrap gap-2">
                {phase.tools.map(t => (
                  <span key={t} className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${accent.badge}`}>{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Milestone + strengths */}
          <div className="space-y-4">
            <div className="glass-card p-6 space-y-3" style={{ borderColor: accent.border, background: accent.bg }}>
              <h3 className="font-bold text-sm uppercase tracking-widest" style={{ color: accent.text }}>🏆 Phase Milestone</h3>
              <p className="text-white font-semibold text-base leading-snug">"{phase.milestone}"</p>
            </div>

            <div className="glass-card p-6 space-y-3">
              <h3 className="font-bold text-sm uppercase tracking-widest text-slate-400">💪 Your Strengths</h3>
              <ul className="space-y-2">
                {rec.strengths.map(s => (
                  <li key={s} className="text-sm text-slate-300 flex items-center gap-2">
                    <span className="text-emerald-400">✓</span> {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-card p-6 space-y-2">
              <h3 className="font-bold text-sm uppercase tracking-widest text-slate-400">📈 Future Scope</h3>
              <p className="text-sm text-slate-300">{rec.futureScope}</p>
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase">AI Resilience</span>
                <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full"
                    style={{ width: `${100 - rec.aiImpact}%` }} />
                </div>
                <span className="text-[10px] text-emerald-400 font-bold">{100 - rec.aiImpact}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Phase Navigator ── */}
        <div className="flex items-center justify-between pt-2">
          <button onClick={() => setActivePhase(Math.max(0, activePhase - 1))}
            disabled={activePhase === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-slate-400 hover:text-white transition-colors disabled:opacity-30"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            ← Previous Phase
          </button>

          <div className="flex gap-2">
            {roadmap.phases.map((_, i) => (
              <button key={i} onClick={() => setActivePhase(i)}
                className="w-2.5 h-2.5 rounded-full transition-all"
                style={{ background: i === activePhase ? accent.text : 'rgba(255,255,255,0.15)' }} />
            ))}
          </div>

          {activePhase < roadmap.phases.length - 1 ? (
            <button onClick={() => setActivePhase(activePhase + 1)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
              style={{ background: `linear-gradient(135deg, #2563eb, #7c3aed)`, boxShadow: '0 4px 15px rgba(99,102,241,0.3)' }}>
              Next Phase →
            </button>
          ) : (
            <button onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
              style={{ background: 'linear-gradient(135deg, #10b981, #3b82f6)', boxShadow: '0 4px 15px rgba(16,185,129,0.3)' }}>
              Go to Dashboard 🚀
            </button>
          )}
        </div>

        {/* ── All Phases Overview ── */}
        <div className="glass-card p-6 space-y-4">
          <h3 className="font-bold text-base text-white">Full Roadmap Overview</h3>
          <div className="flex flex-col gap-0">
            {roadmap.phases.map((p, i) => {
              const ac = ACCENT_COLORS[p.accent];
              return (
                <div key={p.id} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <button onClick={() => setActivePhase(i)}
                      className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-extrabold border-2 transition-all"
                      style={i === activePhase
                        ? { background: ac.bg, borderColor: ac.text, color: ac.text }
                        : { background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)', color: '#475569' }}>
                      {p.id}
                    </button>
                    {i < roadmap.phases.length - 1 && (
                      <div className="w-px h-8 mt-1" style={{ background: 'rgba(255,255,255,0.08)' }} />
                    )}
                  </div>
                  <div className="pb-6 pt-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-200 text-sm">{p.title}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border" style={{ color: ac.text, borderColor: ac.border, background: ac.bg }}>{p.duration}</span>
                    </div>
                    <p className="text-[12px] text-slate-500 mt-0.5">{p.skills.slice(0, 2).join(' · ')} · ···</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
