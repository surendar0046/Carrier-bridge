'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PDF_COURSE_MAP, PdfCourse, PdfModule } from '../pdf-courses-data';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  BookOpen,
  Clock,
  FileText,
  Lock,
  Unlock,
  Award,
  Target,
  ExternalLink,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

const STORAGE_KEY = (id: string) => `cb_pdf_course_progress_${id}`;

interface ModuleProgress {
  [moduleId: string]: boolean;
}

function getProgress(courseId: string): ModuleProgress {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY(courseId)) || '{}');
  } catch { return {}; }
}

function saveProgress(courseId: string, progress: ModuleProgress) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY(courseId), JSON.stringify(progress));
}

export default function PdfCoursePage() {
  const { courseId } = useParams<{ courseId: string }>();
  const router = useRouter();
  const course: PdfCourse | undefined = PDF_COURSE_MAP[courseId];

  const [progress, setProgress] = useState<ModuleProgress>({});
  const [activeModule, setActiveModule] = useState<PdfModule | null>(null);
  const [showPdf, setShowPdf] = useState(false);
  const [pdfScale, setPdfScale] = useState(1);

  useEffect(() => {
    if (course) {
      setProgress(getProgress(course.id));
      setActiveModule(course.modules[0]);
    }
  }, [course]);

  const toggleModule = useCallback((mod: PdfModule) => {
    if (!course) return;
    const completed = !progress[mod.id];
    const next = { ...progress, [mod.id]: completed };
    setProgress(next);
    saveProgress(course.id, next);
  }, [course, progress]);

  const canAccessModule = useCallback((idx: number) => {
    if (!course) return false;
    if (idx === 0) return true;
    // Every previous module must be completed
    return course.modules.slice(0, idx).every(m => progress[m.id]);
  }, [course, progress]);

  if (!course) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4 text-white">
        <div className="text-6xl mb-2">📭</div>
        <h2 className="text-2xl font-bold">Course Not Found</h2>
        <p className="text-slate-400">No PDF course matches this ID.</p>
        <button
          onClick={() => router.push('/courses')}
          className="mt-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm transition-all"
        >
          ← Back to Learning Hub
        </button>
      </div>
    );
  }

  const completedCount = course.modules.filter(m => progress[m.id]).length;
  const overallPct = Math.round((completedCount / course.modules.length) * 100);
  const totalMinutes = course.modules.reduce((s, m) => s + m.estimatedMinutes, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">

      {/* ── Hero Header ── */}
      <div className={`relative bg-gradient-to-r ${course.gradient} border-b border-white/5`}>
        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" />
        <div className="relative max-w-6xl mx-auto px-6 py-10 space-y-5">
          <button
            onClick={() => router.push('/courses')}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-semibold"
          >
            <ChevronLeft size={16} /> Back to Learning Hub
          </button>

          <div className="flex flex-col lg:flex-row gap-8 lg:items-start justify-between">
            {/* Left: Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-5xl">{course.emoji}</span>
                <div>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${course.bgColor} ${course.accentColor} border ${course.borderColor}`}>
                    {course.category} · {course.level}
                  </span>
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">{course.title}</h1>
              <p className={`font-bold ${course.accentColor}`}>{course.subtitle}</p>
              <p className="text-slate-300 max-w-2xl leading-relaxed text-sm">{course.description}</p>

              {/* Meta row */}
              <div className="flex flex-wrap gap-5 text-sm text-slate-400">
                <span className="flex items-center gap-1.5"><BookOpen size={14} /> {course.modules.length} Modules</span>
                <span className="flex items-center gap-1.5"><Clock size={14} /> ~{Math.round(totalMinutes / 60)}h {totalMinutes % 60}m total</span>
                <span className="flex items-center gap-1.5"><FileText size={14} /> {course.totalPages} pages</span>
              </div>
            </div>

            {/* Right: Progress Card */}
            <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-6 w-full lg:w-72 space-y-5 shadow-2xl shrink-0">
              <div className="text-center space-y-1">
                <div className="text-4xl font-black text-white">{overallPct}%</div>
                <div className="text-xs text-slate-400 font-semibold">Course Progress</div>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div
                  className="h-2.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${overallPct}%`,
                    background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>{completedCount}/{course.modules.length} modules done</span>
                {overallPct === 100 && <span className="text-emerald-400 font-bold">✓ Completed!</span>}
              </div>

              <button
                onClick={() => setShowPdf(true)}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs rounded-xl uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-blue-500/20"
              >
                <FileText size={15} /> Open Full PDF
              </button>

              {/* Skills */}
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">Skills You'll Learn</p>
                <div className="flex flex-wrap gap-1.5">
                  {course.skills.map(s => (
                    <span key={s} className="text-[10px] font-semibold bg-white/5 text-slate-300 border border-white/5 px-2 py-0.5 rounded-lg">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-6xl mx-auto px-6 py-10 grid lg:grid-cols-3 gap-8">

        {/* Curriculum column */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Target size={20} className={course.accentColor} /> Course Modules
          </h2>
          <p className="text-slate-500 text-sm -mt-2">Complete each module in order — unlock the next one by finishing the current.</p>

          {course.modules.map((mod, idx) => {
            const done = !!progress[mod.id];
            const accessible = canAccessModule(idx);
            const isActive = activeModule?.id === mod.id;

            return (
              <div
                key={mod.id}
                className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
                  done
                    ? 'border-emerald-500/30 bg-emerald-500/5'
                    : accessible
                      ? isActive
                        ? 'border-blue-500/50 bg-blue-500/5 shadow-xl shadow-blue-500/10'
                        : 'border-white/10 bg-slate-900/50 hover:border-white/20'
                      : 'border-white/5 bg-slate-900/30 opacity-60'
                }`}
              >
                {/* Module Header */}
                <button
                  className="w-full text-left px-6 py-4 flex items-center gap-4"
                  onClick={() => accessible && setActiveModule(isActive && accessible ? null : mod)}
                  disabled={!accessible}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-black text-sm ${
                    done
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : accessible
                        ? `${course.bgColor} ${course.accentColor}`
                        : 'bg-slate-800 text-slate-600'
                  }`}>
                    {done ? <CheckCircle2 size={20} /> : accessible ? idx + 1 : <Lock size={15} />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                        Module {idx + 1}
                      </span>
                      {done && <span className="text-[9px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded-full uppercase tracking-wide">Completed</span>}
                      {!accessible && <span className="text-[9px] font-black bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded-full uppercase tracking-wide">Locked</span>}
                    </div>
                    <h3 className="font-bold text-white text-sm leading-snug">{mod.title}</h3>
                    <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1"><Clock size={11} /> {mod.estimatedMinutes} min</span>
                      <span className="flex items-center gap-1"><FileText size={11} /> Pages {mod.pages}</span>
                    </div>
                  </div>

                  {accessible && (
                    <ChevronRight
                      size={16}
                      className={`text-slate-500 transition-transform shrink-0 ${isActive ? 'rotate-90' : ''}`}
                    />
                  )}
                </button>

                {/* Module Detail Panel (expanded) */}
                {isActive && accessible && (
                  <div className="border-t border-white/5 px-6 pb-6 space-y-5">
                    <p className="text-slate-400 text-sm pt-4 leading-relaxed">{mod.description}</p>

                    {/* Topics */}
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">Topics Covered</p>
                      <div className="grid grid-cols-2 gap-1.5">
                        {mod.topics.map(t => (
                          <div key={t} className="flex items-center gap-2 text-xs text-slate-300">
                            <div className={`w-1.5 h-1.5 rounded-full ${course.bgColor} shrink-0`} style={{ backgroundColor: undefined }} />
                            <span className={`w-2 h-2 rounded-full bg-current ${course.accentColor} shrink-0`} />
                            {t}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => setShowPdf(true)}
                        className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 border ${course.bgColor} ${course.accentColor} ${course.borderColor} hover:brightness-110`}
                      >
                        <ExternalLink size={14} /> Read PDF (Pages {mod.pages})
                      </button>

                      <button
                        onClick={() => toggleModule(mod)}
                        className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 ${
                          done
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                            : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                        }`}
                      >
                        {done ? (
                          <><Circle size={14} /> Mark Incomplete</>
                        ) : (
                          <><CheckCircle2 size={14} /> Mark Complete</>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Completion card */}
          {overallPct === 100 && (
            <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/5 p-6 text-center space-y-3">
              <div className="text-5xl">🎉</div>
              <h3 className="text-xl font-black text-emerald-400">Course Completed!</h3>
              <p className="text-slate-400 text-sm">You've completed all modules of <strong className="text-white">{course.title}</strong>.</p>
              <button
                onClick={() => router.push('/courses')}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm transition-all"
              >
                Browse More Courses →
              </button>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-5">
          {/* Quick module list */}
          <div className="bg-slate-900/60 border border-white/8 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Award size={15} className={course.accentColor} /> All Modules
            </h3>
            {course.modules.map((mod, idx) => {
              const done = !!progress[mod.id];
              const accessible = canAccessModule(idx);
              return (
                <button
                  key={mod.id}
                  onClick={() => accessible && setActiveModule(mod)}
                  disabled={!accessible}
                  className={`w-full text-left flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                    done
                      ? 'text-emerald-400'
                      : accessible
                        ? 'text-slate-300 hover:bg-white/5'
                        : 'text-slate-600 cursor-not-allowed'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                    done ? 'bg-emerald-500/20 text-emerald-400' : accessible ? `${course.bgColor} ${course.accentColor}` : 'bg-slate-800 text-slate-600'
                  }`}>
                    {done ? '✓' : accessible ? idx + 1 : '🔒'}
                  </div>
                  <span className="text-xs font-semibold leading-tight">{mod.title}</span>
                </button>
              );
            })}
          </div>

          {/* PDF quick access */}
          <div className="bg-slate-900/60 border border-white/8 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <FileText size={15} className={course.accentColor} /> PDF Study Guide
            </h3>
            <p className="text-xs text-slate-500">Open the full PDF to study the material for each module.</p>
            <button
              onClick={() => setShowPdf(true)}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <ExternalLink size={13} /> Open PDF Viewer
            </button>
            <a
              href={`/course-pdfs/${course.pdfFile}`}
              download
              className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 border ${course.bgColor} ${course.accentColor} ${course.borderColor} hover:brightness-110 block text-center`}
            >
              ↓ Download PDF
            </a>
          </div>
        </div>
      </div>

      {/* ── PDF Viewer Modal ── */}
      {showPdf && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col">
          {/* Modal toolbar */}
          <div className="flex items-center justify-between px-6 py-3 bg-slate-900 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <span className="text-xl">{course.emoji}</span>
              <div>
                <p className="text-white font-bold text-sm">{course.title}</p>
                <p className="text-slate-500 text-xs">{course.pdfFile}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPdfScale(s => Math.max(0.5, s - 0.25))}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
              >
                <ZoomOut size={15} />
              </button>
              <span className="text-xs text-slate-400 font-bold w-10 text-center">{Math.round(pdfScale * 100)}%</span>
              <button
                onClick={() => setPdfScale(s => Math.min(2, s + 0.25))}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
              >
                <ZoomIn size={15} />
              </button>
              <a
                href={`/course-pdfs/${course.pdfFile}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
                title="Open in new tab"
              >
                <ExternalLink size={15} />
              </a>
              <button
                onClick={() => { setShowPdf(false); setPdfScale(1); }}
                className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-300 hover:text-red-400 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* PDF iframe */}
          <div className="flex-1 overflow-auto bg-slate-950" style={{ transform: `scale(${pdfScale})`, transformOrigin: 'top center' }}>
            <iframe
              src={`/course-pdfs/${course.pdfFile}#toolbar=1&navpanes=1`}
              className="w-full h-full min-h-screen"
              style={{ border: 'none', minHeight: '100vh' }}
              title={course.title}
            />
          </div>
        </div>
      )}
    </div>
  );
}
