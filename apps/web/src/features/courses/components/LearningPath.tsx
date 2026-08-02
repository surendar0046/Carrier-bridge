'use client';
import React from 'react';

export const LearningPath: React.FC = () => {
  const steps = [
    { title: '1. Frontend Mastery', desc: 'React 19, Next.js App Router, Tailwind & State Management', done: true },
    { title: '2. Backend Microservices', desc: 'Node.js, Express, Gateway Stitching, REST & WebSockets', done: true },
    { title: '3. System Architecture', desc: 'Redis Caching, Database Sharding, OpenTelemetry Tracing', done: false },
    { title: '4. AI Copilot Integration', desc: 'LLM Orchestration, RAG Pipelines & Voice Assistants', done: false },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 text-slate-200">
      <h3 className="text-base font-bold text-white">Target Learning Path: Full-Stack AI Engineer</h3>
      <div className="space-y-3">
        {steps.map((s, idx) => (
          <div key={idx} className="flex items-start gap-4 p-4 bg-slate-950/60 border border-slate-800/80 rounded-2xl">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${s.done ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'}`}>
              {s.done ? '✓' : idx + 1}
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">{s.title}</h4>
              <p className="text-xs text-slate-400 mt-0.5">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
