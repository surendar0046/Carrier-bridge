'use client';

import { useState } from 'react';
import { ResumeFormData, ResumeTemplateId } from './useResumeStore';
import { TEMPLATES, ResumeTemplateRenderer } from './templates';

interface Props {
  data: ResumeFormData;
  onClose: () => void;
  onTemplateChange?: (templateId: ResumeTemplateId) => void;
}

export default function PreviewModal({ data, onClose, onTemplateChange }: Props) {
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplateId>(
    data.template || 'canva-minimalist'
  );
  const [zoom, setZoom] = useState<number>(100);

  const handleSelectTemplate = (id: ResumeTemplateId) => {
    setSelectedTemplate(id);
    if (onTemplateChange) {
      onTemplateChange(id);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-between p-2 md:p-6 overflow-hidden animate-fade-in">
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          /* Hide all UI except the resume content */
          body * {
            visibility: hidden !important;
          }
          #resume-print-content,
          #resume-print-content * {
            visibility: visible !important;
          }
          #resume-print-content {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            background: white !important;
          }
          @page {
            size: A4 portrait;
            margin: 12mm;
          }
        }
      `}</style>

      {/* ── Top Floating Toolbar ── */}
      <div className="w-full max-w-5xl bg-slate-900/95 border border-white/10 text-white px-4 md:px-6 py-3 rounded-2xl shadow-2xl flex flex-wrap items-center justify-between gap-3 shrink-0 mb-3 z-10">
        {/* Left: Title & Role */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-sm shadow-md">
            📄
          </div>
          <div>
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              Resume Preview
              <span className="text-[10px] font-black uppercase tracking-wider bg-white/10 text-slate-300 px-2 py-0.5 rounded-full">
                {data.targetRole || 'Professional'}
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Template: <strong className="text-white">{TEMPLATES.find(t => t.id === selectedTemplate)?.name}</strong>
            </p>
          </div>
        </div>

        {/* Center: Template Switcher Pills */}
        <div className="flex items-center gap-1.5 bg-slate-800/90 p-1 rounded-xl border border-white/5 overflow-x-auto max-w-full">
          {TEMPLATES.map(t => {
            const active = selectedTemplate === t.id;
            return (
              <button
                key={t.id}
                onClick={() => handleSelectTemplate(t.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  active
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
                title={t.description}
              >
                <span>{t.icon}</span>
                <span>{t.name}</span>
                {t.badge && (
                  <span
                    className={`text-[8px] font-black uppercase px-1.5 py-0.2 rounded-full ${
                      t.id === 'canva-minimalist'
                        ? 'bg-amber-400 text-slate-950 font-black'
                        : 'bg-white/20 text-white'
                    }`}
                  >
                    {t.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right: Zoom + Actions */}
        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-xl text-xs text-slate-300">
            <button
              onClick={() => setZoom(z => Math.max(70, z - 10))}
              className="p-1 hover:text-white hover:bg-white/5 rounded"
              title="Zoom Out"
            >
              −
            </button>
            <span className="w-10 text-center font-mono text-[11px]">{zoom}%</span>
            <button
              onClick={() => setZoom(z => Math.min(130, z + 10))}
              className="p-1 hover:text-white hover:bg-white/5 rounded"
              title="Zoom In"
            >
              +
            </button>
            {zoom !== 100 && (
              <button
                onClick={() => setZoom(100)}
                className="text-[10px] text-blue-400 hover:text-blue-300 ml-1 underline"
              >
                reset
              </button>
            )}
          </div>

          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-1.5 transition-all active:scale-95"
          >
            🖨️ Print / Save PDF
          </button>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center font-bold text-sm transition-colors"
            title="Close Preview (Esc)"
          >
            ✕
          </button>
        </div>
      </div>

      {/* ── Document Viewport ── */}
      <div className="flex-1 w-full overflow-y-auto flex justify-center items-start p-2 md:p-6 pb-16">
        <div
          id="resume-print-content"
          className="w-full max-w-[800px] shadow-2xl rounded-sm transition-transform duration-200 origin-top bg-white"
          style={{
            transform: zoom === 100 ? 'none' : `scale(${zoom / 100})`,
            transformOrigin: 'top center',
          }}
        >
          <ResumeTemplateRenderer data={data} templateId={selectedTemplate} />
        </div>
      </div>
    </div>
  );
}
