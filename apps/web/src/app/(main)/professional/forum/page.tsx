'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const QUESTIONS = [
  {
    id: 1,
    title: 'How to prepare for system design interviews at FAANG?',
    body: "I'm a final year student targeting product companies. I have basic knowledge of DSA but system design feels overwhelming. Where should I start? What books/resources helped you the most in cracking system design rounds?",
    author: 'Ravi Kumar',
    avatar: 'https://ui-avatars.com/api/?name=Ravi+Kumar&background=3b82f6&color=fff',
    time: '2h ago',
    tags: ['System Design', 'FAANG', 'Interview Prep'],
    views: 245,
    answers: [
      {
        id: 1,
        author: 'Dr. Meera Iyer',
        avatar: 'https://ui-avatars.com/api/?name=Meera+Iyer&background=f59e0b&color=fff',
        role: 'Staff Engineer at Google',
        body: "Great question! Start with 'Designing Data-Intensive Applications' by Martin Kleppmann — it's the bible for system design. Then practice on resources like:\n\n1. **System Design Primer** (GitHub) — free and comprehensive\n2. **Grokking System Design** on Educative\n3. **ByteByteGo** newsletter and YouTube\n\nMost importantly, practice drawing diagrams and explaining trade-offs out loud. Interviewers care more about your thought process than the perfect answer.",
        time: '1h ago',
        votes: 34,
        isAccepted: true,
      },
      {
        id: 2,
        author: 'Arjun Mehta',
        avatar: 'https://ui-avatars.com/api/?name=Arjun+Mehta&background=8b5cf6&color=fff',
        role: 'Senior SWE at Microsoft',
        body: "Adding to what Meera said — practice designing systems you use daily: design Twitter, Netflix, Google Docs. Think about scalability (millions of users), reliability (99.9% uptime), and latency. Also study CAP theorem and eventual consistency — they come up frequently.",
        time: '45min ago',
        votes: 18,
        isAccepted: false,
      },
    ],
  },
  {
    id: 2,
    title: 'What are the best resources for learning DSA from scratch?',
    body: "I'm a CS student with no prior coding experience. I want to learn DSA systematically for placements. Which roadmap/resources should I follow?",
    author: 'Priya Sharma',
    avatar: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=8b5cf6&color=fff',
    time: '4h ago',
    tags: ['DSA', 'Beginners', 'Placement'],
    views: 412,
    answers: [],
  },
  {
    id: 3,
    title: 'How to negotiate salary as a fresher?',
    body: "I have received an offer but it's lower than expected. Is it appropriate to negotiate as a fresher? How should I go about it without losing the offer?",
    author: 'Amit Patel',
    avatar: 'https://ui-avatars.com/api/?name=Amit+Patel&background=10b981&color=fff',
    time: '6h ago',
    tags: ['Career', 'Salary', 'Negotiation'],
    views: 318,
    answers: [],
  },
  {
    id: 4,
    title: 'React vs Vue in 2026 — which one for a beginner?',
    body: "I want to learn frontend development. Both React and Vue seem popular. Which one has better job prospects? Which is easier to learn first?",
    author: 'Sneha Reddy',
    avatar: 'https://ui-avatars.com/api/?name=Sneha+Reddy&background=f59e0b&color=fff',
    time: '1d ago',
    tags: ['React', 'Frontend', 'Beginners'],
    views: 589,
    answers: [],
  },
];

function QuestionDetail({ question }: { question: (typeof QUESTIONS)[0] }) {
  const [answer, setAnswer] = useState('');
  const [answers, setAnswers] = useState(question.answers);
  const [voted, setVoted] = useState<number[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!answer.trim()) return;
    setSubmitting(true);
    setTimeout(() => {
      setAnswers(prev => [{
        id: Date.now(),
        author: 'You',
        avatar: 'https://ui-avatars.com/api/?name=You&background=10b981&color=fff',
        role: 'Industry Professional',
        body: answer,
        time: 'Just now',
        votes: 0,
        isAccepted: false,
      }, ...prev]);
      setAnswer('');
      setSubmitting(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Question */}
      <div className="bg-white border border-slate-100 rounded-3xl p-7">
        <div className="flex gap-3 mb-4">
          {question.tags.map(t => (
            <span key={t} className="text-[10px] font-bold px-3 py-1.5 rounded-full bg-blue-50 text-blue-700">{t}</span>
          ))}
        </div>
        <h1 className="text-xl font-black text-slate-900 mb-4">{question.title}</h1>
        <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{question.body}</p>
        <div className="flex items-center gap-3 mt-5 pt-4 border-t border-slate-100">
          <img src={question.avatar} alt={question.author} className="w-8 h-8 rounded-lg" />
          <span className="text-xs text-slate-500 font-semibold">Asked by <span className="text-slate-800">{question.author}</span> · {question.time}</span>
          <span className="text-xs text-slate-400">👁️ {question.views} views</span>
        </div>
      </div>

      {/* Answers */}
      <div className="space-y-4">
        <h2 className="font-black text-slate-800 text-lg">{answers.length} Answer{answers.length !== 1 ? 's' : ''}</h2>
        {answers.map(a => (
          <div key={a.id} className={`bg-white rounded-3xl p-6 border transition-all ${a.isAccepted ? 'border-emerald-300 shadow-lg shadow-emerald-50' : 'border-slate-100'}`}>
            {a.isAccepted && (
              <div className="flex items-center gap-2 mb-3 text-emerald-600 text-xs font-black">
                <span className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[10px]">✓</span>
                Accepted Answer
              </div>
            )}
            <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">{a.body}</p>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <img src={a.avatar} alt={a.author} className="w-8 h-8 rounded-lg" />
                <div>
                  <div className="text-xs font-bold text-slate-800">{a.author}</div>
                  <div className="text-[10px] text-slate-400">{a.role}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400">{a.time}</span>
                <button
                  onClick={() => setVoted(p => voted.includes(a.id) ? p.filter(x => x !== a.id) : [...p, a.id])}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${voted.includes(a.id) ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600'}`}>
                  ▲ {a.votes + (voted.includes(a.id) ? 1 : 0)}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Answer Box */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6">
        <h3 className="font-black text-slate-800 mb-4">✍️ Your Answer</h3>
        <textarea
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          rows={6}
          className="w-full border border-slate-200 rounded-2xl p-4 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none transition-all placeholder-slate-400"
          placeholder="Share your expertise — explain clearly and concisely. Markdown is supported."
        />
        <div className="flex justify-between items-center mt-4">
          <span className="text-xs text-slate-400">💡 Your answer earns reputation points when upvoted or accepted</span>
          <button
            onClick={handleSubmit}
            disabled={!answer.trim() || submitting}
            className="px-6 py-2.5 text-sm font-bold text-white rounded-2xl disabled:opacity-50 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/30"
            style={{ background: 'linear-gradient(135deg,#2563eb,#4f46e5)' }}>
            {submitting ? '⏳ Posting…' : '🚀 Post Answer'}
          </button>
        </div>
      </div>
    </div>
  );
}

function QuestionList({ search, tag, onSelect }: { search: string; tag: string; onSelect: (id: number) => void }) {
  const filtered = QUESTIONS.filter(q =>
    (!search || q.title.toLowerCase().includes(search.toLowerCase())) &&
    (!tag || q.tags.includes(tag))
  );

  return (
    <div className="space-y-3">
      {filtered.length === 0 && (
        <div className="text-center py-12 text-slate-400 font-semibold">No questions match your filter.</div>
      )}
      {filtered.map(q => (
        <div key={q.id} onClick={() => onSelect(q.id)}
          className="flex items-start gap-4 bg-white border border-slate-100 rounded-3xl p-5 hover:shadow-lg hover:-translate-y-0.5 hover:border-blue-200 transition-all group cursor-pointer">
          <img src={q.avatar} alt={q.author} className="w-10 h-10 rounded-xl flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-slate-800 group-hover:text-blue-700 transition-colors">{q.title}</p>
            <p className="text-xs text-slate-500 mt-1 line-clamp-1">{q.body}</p>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-xs text-slate-400">{q.author} · {q.time}</span>
              <span className="text-xs text-blue-600 font-bold">💬 {q.answers.length} answers</span>
              <span className="text-xs text-slate-400 font-semibold">👁️ {q.views} views</span>
            </div>
            <div className="flex gap-2 mt-2">
              {q.tags.map(t => (
                <span key={t} className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">{t}</span>
              ))}
            </div>
          </div>
          <span className="flex-shrink-0 text-xs font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">Answer →</span>
        </div>
      ))}
    </div>
  );
}

export default function ForumPage() {
  const params = useParams();
  const questionId = params?.questionId ? Number(params.questionId) : null;
  const [search, setSearch] = useState('');
  const [tag, setTag] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(questionId);

  const selectedQuestion = selectedId ? QUESTIONS.find(q => q.id === selectedId) : null;
  const allTags = [...new Set(QUESTIONS.flatMap(q => q.tags))];

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            💬 Discussion Forum
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Answer student questions and earn reputation points</p>
        </div>
        {selectedQuestion && (
          <button onClick={() => setSelectedId(null)} className="flex items-center gap-2 px-5 py-2.5 rounded-2xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all">
            ← All Questions
          </button>
        )}
      </div>

      {!selectedQuestion && (
        <>
          {/* Filters */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm pl-10 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                placeholder="Search questions…"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => setTag('')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${!tag ? 'bg-blue-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                All
              </button>
              {allTags.map(t => (
                <button key={t} onClick={() => setTag(t === tag ? '' : t)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${tag === t ? 'bg-blue-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <QuestionList search={search} tag={tag} onSelect={setSelectedId} />
        </>
      )}

      {selectedQuestion && <QuestionDetail question={selectedQuestion} />}
    </div>
  );
}
