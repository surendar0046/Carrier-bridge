'use client';

export interface AnalysisResult {
  overallScore: number; scoreLabel: string; tagline: string;
  dimensions: { content: number; relevance: number; impact: number; structure: number; keywords: number };
  strengths: string[]; improvements: string[]; criticalIssues: string[];
  foundKeywords: string[]; missingKeywords: string[]; quickWin: string;
}

function Ring({ score }: { score: number }) {
  const r = 54; const c = 2 * Math.PI * r;
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';
  const dash = (score / 100) * c;
  return (
    <svg width="140" height="140" viewBox="0 0 140 140">
      <circle cx="70" cy="70" r={r} fill="none" stroke="#e2e8f0" strokeWidth="12" />
      <circle cx="70" cy="70" r={r} fill="none" stroke={color} strokeWidth="12"
        strokeDasharray={`${dash} ${c}`} strokeDashoffset={c * 0.25}
        strokeLinecap="round" style={{ transition: 'stroke-dasharray 1s ease' }} />
      <text x="70" y="65" textAnchor="middle" fill="#0f172a" fontSize="26" fontWeight="bold">{score}</text>
      <text x="70" y="85" textAnchor="middle" fill="#64748b" fontSize="11">/100</text>
    </svg>
  );
}

function DimBar({ label, val, color }: { label: string; val: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-500 font-medium capitalize">{label}</span>
        <span className="text-slate-900 font-bold">{val}</span>
      </div>
      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${val}%`, transition: 'width 1s ease' }} />
      </div>
    </div>
  );
}

export default function AnalysisPanel({ result, loading }: { result: AnalysisResult | null; loading: boolean }) {
  if (loading) return (
    <div className="flex flex-col items-center justify-center h-96 gap-4">
      <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      <p className="text-slate-500 font-medium animate-pulse">Analyzing your resume with AI…</p>
    </div>
  );

  if (!result) return (
    <div className="flex flex-col items-center justify-center h-96 text-center gap-4 px-8">
      <div className="text-6xl">🎯</div>
      <h3 className="text-xl font-bold text-slate-900">Ready to Analyze</h3>
      <p className="text-slate-500 text-sm">Fill in your resume details and hit <span className="text-blue-500 font-bold">Analyze with AI</span> to get your score, keyword gaps, and actionable tips.</p>
    </div>
  );

  const dimColors: Record<string, string> = {
    content: 'bg-blue-500', relevance: 'bg-violet-500',
    impact: 'bg-emerald-500', structure: 'bg-orange-500', keywords: 'bg-pink-500',
  };

  return (
    <div className="space-y-6">
      {/* Score Ring */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col items-center text-center shadow-sm">
        <Ring score={result.overallScore} />
        <div className="mt-3">
          <span className={`text-lg font-black ${result.overallScore >= 80 ? 'text-emerald-500' : result.overallScore >= 60 ? 'text-yellow-500' : 'text-red-500'}`}>
            {result.scoreLabel}
          </span>
          <p className="text-slate-500 text-sm mt-1">{result.tagline}</p>
        </div>
      </div>

      {/* 5-Dimension Breakdown */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-3">📊 Score Breakdown</h3>
        {Object.entries(result.dimensions).map(([k, v]) => (
          <DimBar key={k} label={k} val={v} color={dimColors[k] || 'bg-blue-500'} />
        ))}
      </div>

      {/* Strengths */}
      {result.strengths.length > 0 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
          <h3 className="text-sm font-bold text-emerald-600 mb-3">✅ Strengths</h3>
          <ul className="space-y-2">
            {result.strengths.map((s, i) => (
              <li key={i} className="flex gap-2 text-sm text-slate-600"><span className="text-emerald-500 mt-0.5">→</span>{s}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Improvements */}
      {result.improvements.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <h3 className="text-sm font-bold text-amber-600 mb-3">💡 Improvements</h3>
          <ul className="space-y-2">
            {result.improvements.map((s, i) => (
              <li key={i} className="flex gap-2 text-sm text-slate-600"><span className="text-amber-500 mt-0.5">→</span>{s}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Critical Issues */}
      {result.criticalIssues.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
          <h3 className="text-sm font-bold text-red-600 mb-3">🚨 Critical Issues</h3>
          <ul className="space-y-2">
            {result.criticalIssues.map((s, i) => (
              <li key={i} className="flex gap-2 text-sm text-slate-600"><span className="text-red-500 mt-0.5">!</span>{s}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Keywords */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-3">🔑 Keyword Match</h3>
        <div className="flex flex-wrap gap-2">
          {result.foundKeywords.map(k => (
            <span key={k} className="text-xs bg-emerald-50 border border-emerald-200 text-emerald-600 px-2.5 py-1 rounded-lg">✓ {k}</span>
          ))}
          {result.missingKeywords.map(k => (
            <span key={k} className="text-xs bg-red-50 border border-red-200 text-red-600 px-2.5 py-1 rounded-lg">✗ {k}</span>
          ))}
        </div>
      </div>

      {/* Quick Win */}
      <div className="bg-gradient-to-r from-blue-50 to-violet-50 border border-blue-200 rounded-2xl p-5">
        <h3 className="text-sm font-bold text-blue-600 mb-2">⚡ Quick Win</h3>
        <p className="text-sm text-slate-600">{result.quickWin}</p>
      </div>
    </div>
  );
}
