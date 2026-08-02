'use client';
import React from 'react';

interface ContextualHelpProps {
  topic: string;
  tip: string;
}

export const ContextualHelp: React.FC<ContextualHelpProps> = ({ topic, tip }) => {
  return (
    <div className="p-4 bg-blue-950/40 border border-blue-800/40 rounded-2xl flex items-start gap-3">
      <div className="text-xl">💡</div>
      <div>
        <h5 className="text-xs font-bold text-blue-400">{topic} Context Tip</h5>
        <p className="text-xs text-slate-300 mt-0.5">{tip}</p>
      </div>
    </div>
  );
};
