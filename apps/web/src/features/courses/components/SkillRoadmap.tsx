'use client';
import React from 'react';

export const SkillRoadmap: React.FC = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
      <h3 className="text-lg font-bold text-white">Interactive Skill Roadmap Graph</h3>
      <div className="p-8 bg-slate-950 rounded-2xl border border-slate-800 text-center space-y-2">
        <div className="text-4xl">🗺️</div>
        <p className="text-xs text-slate-300 font-semibold">Skill Nodes Connected via AI Context Mesh</p>
        <p className="text-[11px] text-slate-500">TypeScript ➔ Next.js App Router ➔ Microservices ➔ LLM Integration</p>
      </div>
    </div>
  );
};
