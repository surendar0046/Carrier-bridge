'use client';
import React, { useState } from 'react';
import Link from 'next/link';

const RESOURCES = [
  {
    id: 1,
    type: 'article',
    title: 'How I cracked Google L5 in 3 months — Full Roadmap',
    excerpt: 'A detailed breakdown of my preparation strategy, resources I used, mock interviews, and the mindset that helped me crack Google at L5 level.',
    author: 'Dr. Meera Iyer',
    avatar: 'https://ui-avatars.com/api/?name=Meera+Iyer&background=f59e0b&color=fff',
    role: 'Staff Engineer, Google',
    time: '2 days ago',
    tags: ['Interview Prep', 'FAANG', 'Career'],
    likes: 342,
    saves: 89,
    comments: 24,
    readTime: '8 min read',
    color: 'from-amber-500 to-orange-500',
  },
  {
    id: 2,
    type: 'tip',
    title: '5 salary negotiation scripts that actually work for freshers',
    excerpt: 'Exact phrases and scripts I coach my mentees to use when negotiating their first offer. These have helped 60+ freshers increase their package by 15-30%.',
    author: 'Arjun Mehta',
    avatar: 'https://ui-avatars.com/api/?name=Arjun+Mehta&background=3b82f6&color=fff',
    role: 'Senior SWE, Microsoft',
    time: '4 days ago',
    tags: ['Salary', 'Negotiation', 'Career Tips'],
    likes: 218,
    saves: 156,
    comments: 31,
    readTime: '5 min read',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 3,
    type: 'resource',
    title: 'Ultimate DSA Revision Sheet — 150 must-know problems',
    excerpt: 'A curated list of 150 problems across 15 topics that cover 90% of what gets asked in product company interviews. With difficulty levels and solution links.',
    author: 'Kavya Nair',
    avatar: 'https://ui-avatars.com/api/?name=Kavya+Nair&background=8b5cf6&color=fff',
    role: 'Full Stack Lead, Flipkart',
    time: '1 week ago',
    tags: ['DSA', 'Placement', 'Resources'],
    likes: 891,
    saves: 423,
    comments: 67,
    readTime: '12 min read',
    color: 'from-violet-500 to-purple-500',
  },
  {
    id: 4,
    type: 'guide',
    title: 'The complete guide to building your LinkedIn profile as a CS student',
    excerpt: 'Step-by-step guide to optimizing your LinkedIn: headline formula, about section template, how to showcase projects, and how to get recruiter attention.',
    author: 'Vikram Singh',
    avatar: 'https://ui-avatars.com/api/?name=Vikram+Singh&background=10b981&color=fff',
    role: 'Data Scientist, Google',
    time: '2 weeks ago',
    tags: ['LinkedIn', 'Career', 'Personal Brand'],
    likes: 445,
    saves: 201,
    comments: 38,
    readTime: '7 min read',
    color: 'from-emerald-500 to-teal-500',
  },
];

const TYPE_ICONS: Record<string, string> = {
  article: '📝',
  tip: '💡',
  resource: '📚',
  guide: '🗺️',
};

export default function ResourcesPage() {
  const [liked, setLiked] = useState<number[]>([]);
  const [saved, setSaved] = useState<number[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filters = ['all', 'article', 'tip', 'resource', 'guide'];
  const filtered = RESOURCES.filter(r =>
    (activeFilter === 'all' || r.type === activeFilter) &&
    (!search || r.title.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            📚 Learning Resources
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Career guidance, interview tips, and curated resources shared by professionals</p>
        </div>
        <Link href="/professional/resources/new"
          className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:scale-105 active:scale-95"
          style={{ background: 'linear-gradient(135deg,#2563eb,#4f46e5)' }}>
          ✚ Share Resource
        </Link>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm pl-10 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
            placeholder="Search resources…"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {filters.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold capitalize transition-all ${
                activeFilter === f
                  ? 'text-white shadow-md'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
              style={activeFilter === f ? { background: 'linear-gradient(135deg,#2563eb,#4f46e5)' } : {}}>
              {f === 'all' ? '🌐 All' : `${TYPE_ICONS[f]} ${f.charAt(0).toUpperCase() + f.slice(1)}`}
            </button>
          ))}
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filtered.map(r => (
          <div key={r.id} className="bg-white border border-slate-100 rounded-3xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all group">
            {/* Card Top Accent */}
            <div className={`h-1.5 bg-gradient-to-r ${r.color}`} />
            <div className="p-6">
              {/* Type + Read Time */}
              <div className="flex items-center gap-3 mb-3">
                <span className={`text-[10px] font-black px-3 py-1.5 rounded-full text-white bg-gradient-to-r ${r.color}`}>
                  {TYPE_ICONS[r.type]} {r.type.toUpperCase()}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">⏱ {r.readTime}</span>
              </div>

              {/* Title & Excerpt */}
              <h3 className="font-black text-slate-800 text-base leading-snug group-hover:text-blue-700 transition-colors mb-2">
                {r.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{r.excerpt}</p>

              {/* Tags */}
              <div className="flex gap-2 mt-3 flex-wrap">
                {r.tags.map(t => (
                  <span key={t} className="text-[9px] font-bold px-2 py-1 rounded-full bg-slate-100 text-slate-600">{t}</span>
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-100">
                <img src={r.avatar} alt={r.author} className="w-8 h-8 rounded-lg" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-800 truncate">{r.author}</div>
                  <div className="text-[10px] text-slate-400 truncate">{r.role} · {r.time}</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={() => setLiked(p => p.includes(r.id) ? p.filter(x => x !== r.id) : [...p, r.id])}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    liked.includes(r.id) ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600'
                  }`}>
                  {liked.includes(r.id) ? '❤️' : '🤍'} {r.likes + (liked.includes(r.id) ? 1 : 0)}
                </button>
                <button
                  onClick={() => setSaved(p => p.includes(r.id) ? p.filter(x => x !== r.id) : [...p, r.id])}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    saved.includes(r.id) ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600'
                  }`}>
                  {saved.includes(r.id) ? '🔖' : '📌'} {r.saves + (saved.includes(r.id) ? 1 : 0)}
                </button>
                <span className="text-xs text-slate-400 font-semibold">💬 {r.comments}</span>
                <button className="ml-auto px-4 py-2 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-all">
                  Read →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <div className="text-5xl mb-4">🔍</div>
          <div className="font-bold text-lg">No resources found</div>
          <p className="text-sm mt-2">Try a different search or filter</p>
        </div>
      )}
    </div>
  );
}
