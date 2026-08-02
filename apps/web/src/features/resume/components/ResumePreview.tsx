'use client';
import React from 'react';

export const ResumePreview: React.FC = () => {
  return (
    <div className="bg-white text-slate-900 rounded-2xl p-8 space-y-6 shadow-2xl min-h-[600px] border border-slate-200">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900">Alex Morgan</h1>
        <p className="text-xs font-semibold text-blue-600">Senior Full Stack Engineer & Cloud Architect</p>
        <p className="text-[11px] text-slate-500 mt-1">alex.morgan@careerbridge.io • github.com/alexmorgan • San Francisco, CA</p>
      </div>

      <div className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-1">Professional Summary</h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          Product-focused Full Stack Architect with 6+ years experience building microservices, React & Next.js applications, distributed data caching pipelines, and integrating real-time AI copilot agents.
        </p>
      </div>
    </div>
  );
};
