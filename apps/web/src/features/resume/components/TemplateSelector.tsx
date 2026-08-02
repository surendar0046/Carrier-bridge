'use client';
import React from 'react';

export const TemplateSelector: React.FC = () => {
  const templates = [
    { name: 'Silicon Valley Executive', isPopular: true },
    { name: 'Minimalist Engineering', isPopular: false },
    { name: 'Modern AI & Tech Lead', isPopular: false },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
      <h3 className="text-base font-bold text-white">ATS Template Layouts</h3>
      <div className="grid grid-cols-3 gap-3">
        {templates.map((t, idx) => (
          <div key={idx} className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl cursor-pointer transition text-center">
            <span className="text-xs font-bold text-slate-200 block">{t.name}</span>
            {t.isPopular && <span className="text-[10px] text-blue-400 font-semibold">★ Popular</span>}
          </div>
        ))}
      </div>
    </div>
  );
};
