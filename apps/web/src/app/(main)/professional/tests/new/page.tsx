'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

type QuestionType = 'mcq' | 'true-false' | 'short-answer';

interface Question {
  id: number;
  type: QuestionType;
  text: string;
  options: string[];
  answer: string;
  points: number;
}

const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];
const TOPICS = ['DSA', 'System Design', 'JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'Machine Learning', 'OS Concepts', 'Networking', 'Career Prep'];

const blankQ = (id: number): Question => ({
  id,
  type: 'mcq',
  text: '',
  options: ['', '', '', ''],
  answer: '',
  points: 5,
});

export default function NewTestPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [topic, setTopic] = useState('DSA');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [duration, setDuration] = useState(30);
  const [questions, setQuestions] = useState<Question[]>([blankQ(1)]);
  const [publishing, setPublishing] = useState(false);
  const [done, setDone] = useState(false);
  const [expandedQ, setExpandedQ] = useState<number>(1);

  const addQuestion = () => {
    const newQ = blankQ(Date.now());
    setQuestions(prev => [...prev, newQ]);
    setExpandedQ(newQ.id);
  };

  const removeQuestion = (id: number) => {
    if (questions.length === 1) return;
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  const updateQ = (id: number, update: Partial<Question>) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, ...update } : q));
  };

  const updateOption = (qid: number, idx: number, val: string) => {
    setQuestions(prev => prev.map(q => {
      if (q.id !== qid) return q;
      const options = [...q.options];
      options[idx] = val;
      return { ...q, options };
    }));
  };

  const totalPoints = questions.reduce((s, q) => s + q.points, 0);

  const handlePublish = () => {
    setPublishing(true);
    setTimeout(() => {
      setPublishing(false);
      setDone(true);
      setTimeout(() => router.push('/professional'), 1500);
    }, 1400);
  };

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-black text-slate-800">Test Published!</h2>
          <p className="text-slate-500 mt-2">Students can now take your practice test</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">📝 Create Practice Test</h1>
          <p className="text-slate-500 mt-1 font-medium">Build assessments to help students prepare for placements</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-blue-50 border border-blue-200 rounded-2xl">
          <span className="text-xs font-bold text-blue-700">{questions.length} Questions</span>
          <span className="w-1 h-1 rounded-full bg-blue-300" />
          <span className="text-xs font-bold text-blue-700">{totalPoints} Points</span>
          <span className="w-1 h-1 rounded-full bg-blue-300" />
          <span className="text-xs font-bold text-blue-700">{duration} min</span>
        </div>
      </div>

      {/* Test Metadata */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 space-y-5">
        <h3 className="font-black text-slate-800">Test Details</h3>
        <div className="space-y-4">
          <div>
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Test Title *</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. DSA Fundamentals — Arrays & Strings"
              className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>
          <div>
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={2}
              placeholder="Brief description of what this test covers…"
              className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none transition-all"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Topic</label>
              <select value={topic} onChange={e => setTopic(e.target.value)}
                className="w-full border border-slate-200 rounded-2xl px-3 py-3 text-sm outline-none focus:border-blue-400 bg-white font-semibold">
                {TOPICS.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Difficulty</label>
              <select value={difficulty} onChange={e => setDifficulty(e.target.value)}
                className="w-full border border-slate-200 rounded-2xl px-3 py-3 text-sm outline-none focus:border-blue-400 bg-white font-semibold">
                {DIFFICULTIES.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Duration (min)</label>
              <input type="number" value={duration} onChange={e => setDuration(Number(e.target.value))} min={5} max={180}
                className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-blue-400 font-semibold" />
            </div>
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-slate-800 text-lg">Questions</h3>
          <button onClick={addQuestion}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-all hover:scale-105">
            ✚ Add Question
          </button>
        </div>

        {questions.map((q, idx) => (
          <div key={q.id} className="bg-white border border-slate-100 rounded-3xl overflow-hidden">
            {/* Question Header (collapse bar) */}
            <button className="w-full flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-all text-left"
              onClick={() => setExpandedQ(expandedQ === q.id ? -1 : q.id)}>
              <span className="w-7 h-7 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xs font-black flex-shrink-0">
                {idx + 1}
              </span>
              <span className="flex-1 text-sm font-semibold text-slate-700 truncate">
                {q.text || `Question ${idx + 1} — click to edit`}
              </span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">{q.points} pts</span>
              <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg capitalize">{q.type}</span>
              <span className="text-slate-400">{expandedQ === q.id ? '▲' : '▼'}</span>
            </button>

            {/* Question Body */}
            {expandedQ === q.id && (
              <div className="px-6 pb-6 space-y-4 border-t border-slate-100">
                <div className="grid grid-cols-2 gap-4 pt-4">
                  {/* Question type */}
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Type</label>
                    <select value={q.type} onChange={e => updateQ(q.id, { type: e.target.value as QuestionType })}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold outline-none focus:border-blue-400 bg-white">
                      <option value="mcq">Multiple Choice</option>
                      <option value="true-false">True / False</option>
                      <option value="short-answer">Short Answer</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Points</label>
                    <input type="number" value={q.points} onChange={e => updateQ(q.id, { points: Number(e.target.value) })} min={1} max={25}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold outline-none focus:border-blue-400" />
                  </div>
                </div>

                {/* Question Text */}
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Question Text *</label>
                  <textarea value={q.text} onChange={e => updateQ(q.id, { text: e.target.value })} rows={2}
                    placeholder="Enter your question here…"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 resize-none transition-all" />
                </div>

                {/* MCQ Options */}
                {q.type === 'mcq' && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Options & Correct Answer</label>
                    {q.options.map((opt, oi) => (
                      <div key={oi} className="flex items-center gap-3">
                        <button onClick={() => updateQ(q.id, { answer: String(oi) })}
                          className={`w-5 h-5 rounded-full border-2 flex-shrink-0 transition-all ${q.answer === String(oi) ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300 hover:border-emerald-400'}`}>
                          {q.answer === String(oi) && <span className="text-white text-[10px] flex items-center justify-center h-full">✓</span>}
                        </button>
                        <input value={opt} onChange={e => updateOption(q.id, oi, e.target.value)}
                          placeholder={`Option ${String.fromCharCode(65 + oi)}`}
                          className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-400 transition-all" />
                      </div>
                    ))}
                    <p className="text-[10px] text-slate-400">Click the circle to mark correct answer</p>
                  </div>
                )}

                {/* True/False */}
                {q.type === 'true-false' && (
                  <div className="flex gap-3">
                    {['True', 'False'].map(v => (
                      <button key={v} onClick={() => updateQ(q.id, { answer: v })}
                        className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all border-2 ${q.answer === v ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                        {v === 'True' ? '✅' : '❌'} {v}
                      </button>
                    ))}
                  </div>
                )}

                {/* Short Answer */}
                {q.type === 'short-answer' && (
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Expected Answer (for reference)</label>
                    <input value={q.answer} onChange={e => updateQ(q.id, { answer: e.target.value })}
                      placeholder="Model answer…"
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 transition-all" />
                  </div>
                )}

                {/* Remove Question */}
                {questions.length > 1 && (
                  <div className="pt-2">
                    <button onClick={() => removeQuestion(q.id)}
                      className="text-xs font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-xl transition-all">
                      🗑 Remove Question
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Publish Bar */}
      <div className="flex items-center justify-between bg-white border border-slate-100 rounded-3xl p-6 sticky bottom-4 shadow-xl shadow-slate-200/80">
        <div className="flex gap-6">
          <div className="text-center">
            <div className="text-xl font-black text-slate-900">{questions.length}</div>
            <div className="text-[10px] text-slate-400 font-semibold">Questions</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-black text-slate-900">{totalPoints}</div>
            <div className="text-[10px] text-slate-400 font-semibold">Total Points</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-black text-slate-900">{duration}m</div>
            <div className="text-[10px] text-slate-400 font-semibold">Duration</div>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => router.back()} className="px-5 py-3 rounded-2xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
            Cancel
          </button>
          <button onClick={handlePublish} disabled={!title.trim() || publishing}
            className="px-7 py-3 rounded-2xl text-sm font-bold text-white disabled:opacity-50 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/30"
            style={{ background: 'linear-gradient(135deg,#2563eb,#4f46e5)' }}>
            {publishing ? '⏳ Publishing…' : '🚀 Publish Test'}
          </button>
        </div>
      </div>
    </div>
  );
}
