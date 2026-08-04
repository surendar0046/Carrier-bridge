'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const RESOURCE_TYPES = [
  { value: 'article', label: 'Article', icon: '📝', desc: 'Long-form write-up with detailed insights' },
  { value: 'tip', label: 'Career Tip', icon: '💡', desc: 'Quick actionable advice for students' },
  { value: 'resource', label: 'Resource List', icon: '📚', desc: 'Curated list of links and materials' },
  { value: 'guide', label: 'Step-by-Step Guide', icon: '🗺️', desc: 'Detailed walkthrough guide' },
];

const TAGS = ['Interview Prep', 'DSA', 'System Design', 'FAANG', 'Career', 'Salary', 'Negotiation', 'Frontend', 'Backend', 'Resume', 'LinkedIn', 'Placement', 'Beginners'];

export default function NewResourcePage() {
  const router = useRouter();
  const [type, setType] = useState('article');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [published, setPublished] = useState(false);

  const toggleTag = (t: string) => {
    setSelectedTags(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t]);
  };

  const handlePublish = () => {
    if (!title.trim() || !content.trim()) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setPublished(true);
      setTimeout(() => router.push('/professional/resources'), 1500);
    }, 1200);
  };

  if (published) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-bounce-once">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-black text-slate-800">Resource Published!</h2>
          <p className="text-slate-500 mt-2">Redirecting to resources…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">📤 Share a Resource</h1>
        <p className="text-slate-500 mt-1 font-medium">Share your knowledge with students — earn reputation for every like and save</p>
      </div>

      {/* Resource Type */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6">
        <h3 className="font-black text-slate-800 mb-4">Content Type</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {RESOURCE_TYPES.map(t => (
            <button key={t.value} onClick={() => setType(t.value)}
              className={`p-4 rounded-2xl border-2 text-left transition-all ${type === t.value ? 'border-blue-500 bg-blue-50' : 'border-slate-100 hover:border-slate-200 bg-slate-50'}`}>
              <div className="text-2xl mb-2">{t.icon}</div>
              <div className={`text-xs font-black ${type === t.value ? 'text-blue-700' : 'text-slate-700'}`}>{t.label}</div>
              <div className="text-[10px] text-slate-400 mt-1 leading-tight">{t.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6">
        <h3 className="font-black text-slate-800 mb-3">Title *</h3>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Write a clear, compelling title…"
          className="w-full border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-semibold text-slate-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all placeholder-slate-400"
        />
        <div className="text-right text-[10px] text-slate-400 mt-1">{title.length}/120</div>
      </div>

      {/* Content */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-black text-slate-800">Content *</h3>
          <span className="text-[10px] text-slate-400 font-semibold bg-slate-100 px-2 py-1 rounded-lg">Markdown supported</span>
        </div>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={14}
          placeholder={`Write your content here...\n\nTips for great content:\n• Be specific and actionable\n• Share your personal experience\n• Include examples and links\n• Use headings to structure long content`}
          className="w-full border border-slate-200 rounded-2xl px-5 py-4 text-sm text-slate-700 leading-relaxed outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none transition-all placeholder-slate-400 font-mono"
        />
        <div className="text-right text-[10px] text-slate-400 mt-1">{content.length} characters</div>
      </div>

      {/* Tags */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6">
        <h3 className="font-black text-slate-800 mb-1">Tags</h3>
        <p className="text-xs text-slate-400 mb-4">Select up to 5 relevant tags</p>
        <div className="flex flex-wrap gap-2">
          {TAGS.map(t => (
            <button key={t} onClick={() => selectedTags.length < 5 || selectedTags.includes(t) ? toggleTag(t) : null}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedTags.includes(t)
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              } ${selectedTags.length >= 5 && !selectedTags.includes(t) ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}>
              {t}
            </button>
          ))}
        </div>
        {selectedTags.length > 0 && (
          <div className="mt-3 text-xs text-slate-500">{selectedTags.length}/5 tags selected</div>
        )}
      </div>

      {/* Publish */}
      <div className="flex items-center justify-between bg-white border border-slate-100 rounded-3xl p-6">
        <div>
          <p className="text-sm font-bold text-slate-700">Ready to publish?</p>
          <p className="text-xs text-slate-400 mt-0.5">Your resource will be visible to all students immediately</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => router.back()} className="px-5 py-3 rounded-2xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
            Cancel
          </button>
          <button
            onClick={handlePublish}
            disabled={!title.trim() || !content.trim() || submitting}
            className="px-7 py-3 rounded-2xl text-sm font-bold text-white disabled:opacity-50 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/30"
            style={{ background: 'linear-gradient(135deg,#2563eb,#4f46e5)' }}>
            {submitting ? '⏳ Publishing…' : '🚀 Publish Resource'}
          </button>
        </div>
      </div>
    </div>
  );
}
