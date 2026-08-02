'use client';
import { useEffect, useState } from 'react';
import { mentorService, MOCK_MENTORS } from '@career-bridge/services';
import { Mentor } from '@career-bridge/types';
import Link from 'next/link';

export default function MentorPage() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    mentorService.getMentors().then((r) => { setMentors(r.items); setLoading(false); });
  }, []);

  const filtered = mentors.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.expertise.some((e) => e.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Find a Mentor</h1>
        <p className="text-slate-400 mb-6">Connect with verified industry experts who can guide your career</p>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, skill, or expertise..."
          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors mb-6"
        />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-900 rounded-2xl p-6 animate-pulse space-y-3">
                <div className="flex gap-4"><div className="w-16 h-16 bg-slate-800 rounded-full" /><div className="flex-1 space-y-2"><div className="h-5 bg-slate-800 rounded w-2/3" /><div className="h-4 bg-slate-800 rounded w-1/2" /></div></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filtered.map((mentor) => (
              <div key={mentor.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/50 hover:shadow-blue-500/10 hover:shadow-lg transition-all duration-300 group">
                <div className="flex gap-4 mb-4">
                  <img src={mentor.avatar} alt={mentor.name} className="w-16 h-16 rounded-full flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="font-bold text-white group-hover:text-blue-400 transition-colors">{mentor.name}</h2>
                      {mentor.isVerified && <span className="text-blue-400 text-xs">✓ Verified</span>}
                    </div>
                    <p className="text-slate-400 text-sm">{mentor.title} @ {mentor.company}</p>
                    <div className="flex items-center gap-3 mt-1 text-sm">
                      <span className="text-yellow-400">★ {mentor.rating}</span>
                      <span className="text-slate-500">({mentor.reviewCount} reviews)</span>
                      <span className="text-slate-500">·</span>
                      <span className="text-slate-400">{mentor.totalSessions} sessions</span>
                    </div>
                  </div>
                </div>
                <p className="text-slate-400 text-sm mb-4 line-clamp-2">{mentor.bio}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {mentor.expertise.slice(0, 4).map((e) => (
                    <span key={e} className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg">{e}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-emerald-400 font-semibold">₹{mentor.hourlyRate.toLocaleString()}/hr</span>
                    <span className="text-slate-500 text-xs ml-2">· Responds {mentor.responseTime}</span>
                  </div>
                  <Link href={`/mentor/${mentor.id}`} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-medium transition-colors">Book Session</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
