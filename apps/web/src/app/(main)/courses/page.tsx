'use client';
import { useEffect, useState } from 'react';
import { courseService } from '@career-bridge/services';
import { Course } from '@career-bridge/types';
import Link from 'next/link';

const LEVEL_COLOR: Record<string, string> = {
  BEGINNER: 'bg-emerald-500/20 text-emerald-400',
  INTERMEDIATE: 'bg-blue-500/20 text-blue-400',
  ADVANCED: 'bg-violet-500/20 text-violet-400',
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'all' | 'free' | 'enrolled'>('all');

  useEffect(() => {
    courseService.getCourses().then((r) => { setCourses(r.items); setLoading(false); });
  }, []);

  const filtered = courses.filter((c) => tab === 'free' ? c.isFree : true);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Learning Hub</h1>
        <p className="text-slate-400 mb-6">Courses curated by AI based on your career goals</p>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-slate-800 pb-0">
          {(['all', 'free', 'enrolled'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-sm font-medium capitalize border-b-2 transition-colors -mb-px ${tab === t ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
            >{t === 'all' ? 'All Courses' : t === 'free' ? 'Free Courses' : 'My Courses'}</button>
          ))}
        </div>

        {/* Roadmap CTA */}
        <Link href="/courses/roadmap" className="block bg-gradient-to-r from-blue-600 to-violet-600 rounded-2xl p-5 mb-6 hover:opacity-90 transition-opacity">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">🗺️ View Your Skill Roadmap</h3>
              <p className="text-blue-100 text-sm mt-1">AI-personalized path to your target role</p>
            </div>
            <span className="text-2xl">→</span>
          </div>
        </Link>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1,2,3].map(i => <div key={i} className="bg-slate-900 rounded-2xl h-64 animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((course) => (
              <Link key={course.id} href={`/courses/${course.id}`} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-blue-500/50 hover:shadow-blue-500/10 hover:shadow-lg transition-all duration-300 group flex flex-col">
                <div className="w-full h-36 bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center text-5xl">
                  {course.category === 'Web Development' ? '⚛️' : course.category === 'Data Science' ? '📊' : '🏗️'}
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs px-2.5 py-1 rounded-full ${LEVEL_COLOR[course.level as any] || 'bg-slate-700 text-slate-300'}`}>{course.level}</span>
                    {course.isFree && <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400">FREE</span>}
                    {course.isCertified && <span className="text-xs px-2.5 py-1 rounded-full bg-yellow-500/20 text-yellow-400">Certified</span>}
                  </div>
                  <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors mb-1 line-clamp-2">{course.title}</h3>
                  <p className="text-slate-500 text-xs mb-3">{course.instructor || course.provider} · {typeof course.duration === 'number' ? Math.round(course.duration / 60) : course.duration || 'N/A'} · {course.lessonsCount || 10} lessons</p>
                  <div className="flex items-center gap-1 text-sm mt-auto">
                    <span className="text-yellow-400">★</span>
                    <span className="text-white font-medium">{course.rating || 4.8}</span>
                    <span className="text-slate-500">({(course.reviewCount || 42).toLocaleString()})</span>
                    <span className="ml-auto font-bold text-white">{course.isFree ? '🆓 Free' : `$${course.price || 49}`}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
