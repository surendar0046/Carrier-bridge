'use client';
import React, { useState } from 'react';

export const ResumeBuilder: React.FC = () => {
  const [fullName, setFullName] = useState('Alex Morgan');
  const [targetRole, setTargetRole] = useState('Senior Full Stack Engineer');
  const [summary, setSummary] = useState('Product-focused Full Stack Architect with 6+ years experience in React, Node microservices, and AI integrations.');

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 text-slate-200">
      <h3 className="text-lg font-extrabold text-white">AI-Powered Resume Builder</h3>
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Full Name</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Target Professional Role</label>
        <input
          type="text"
          value={targetRole}
          onChange={(e) => setTargetRole(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Executive Summary</label>
        <textarea
          rows={3}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500"
        />
      </div>
    </div>
  );
};
