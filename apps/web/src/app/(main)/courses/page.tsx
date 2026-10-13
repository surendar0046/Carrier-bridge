'use client';

import { useEffect, useState } from 'react';
import { courseService, MOCK_COURSES } from '@career-bridge/services';
import { Course } from '@career-bridge/types';
import Link from 'next/link';
import { useStudentCareerMatch } from '@/hooks/useStudentCareerMatch';

const LEVEL_COLOR: Record<string, string> = {
  BEGINNER:     'bg-emerald-500/20 text-emerald-400',
  INTERMEDIATE: 'bg-blue-500/20 text-blue-400',
  ADVANCED:     'bg-violet-500/20 text-violet-400',
};

export default function CoursesPage() {
  const {
    hasCompletedQuiz,
    primaryRole,
    primaryConfidence,
    closeRoles,
    activeRole,
    setActiveRole,
  } = useStudentCareerMatch();

  const [courses, setCourses] = useState<Course[]>(() => MOCK_COURSES.filter((c) => c.isFree));
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<'certifications' | 'enrolled'>('certifications');

  useEffect(() => {
    courseService.getCourses().then((r) => { 
      setCourses(r.items); 
      setLoading(false); 
    });
  }, [tab]); // Refresh on tab switch to get latest progress

  // Only display courses with active progress (enrolled) under the 'enrolled' tab
  const enrolledCourses = courses.filter((c) => c.progress !== undefined);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black mb-2">Learning Hub</h1>
          <p className="text-slate-400 text-base">Free certifications, courses and AI-curated paths for your career</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-slate-900/50 border border-white/5 rounded-2xl p-1.5 w-fit">
          {([
            { key: 'certifications', label: '🏆 Free Certifications', badge: 'New' },
            { key: 'enrolled',       label: '📖 My Courses'          },
          ] as const).map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`relative px-5 py-2.5 text-sm font-bold rounded-xl transition-all ${
                tab === t.key
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {t.label}
              {'badge' in t && t.badge && (
                <span className="absolute -top-1.5 -right-1.5 text-[8px] font-black bg-emerald-500 text-white px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Free Certifications Tab ─────────────────────────────────────── */}
        {tab === 'certifications' && (
          <div className="space-y-8">
            {/* AI Matched Role Quick Navigation Card */}
            {hasCompletedQuiz && (primaryRole || activeRole) && (
              <div className="p-5 md:p-6 rounded-2xl bg-gradient-to-r from-blue-900/30 via-indigo-900/20 to-violet-900/30 border border-blue-500/30 shadow-xl backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-300 text-[11px] font-black uppercase tracking-wider">
                      🎯 Your Quiz Recommended Path
                    </span>
                    <span className="text-xs text-slate-400">
                      Active: <strong className="text-white">{activeRole || primaryRole}</strong>
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Certifications & Courses for {activeRole || primaryRole}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {primaryRole && (
                      <button
                        onClick={() => setActiveRole(primaryRole)}
                        className={`text-xs px-3 py-1 rounded-lg border font-semibold transition-all ${
                          activeRole === primaryRole
                            ? 'bg-blue-600 border-blue-400 text-white'
                            : 'bg-slate-900/70 border-slate-700 text-slate-300 hover:text-white'
                        }`}
                      >
                        🌟 {primaryRole} ({primaryConfidence}%)
                      </button>
                    )}
                    {closeRoles.map((cr, idx) => (
                      <button
                        key={cr.role}
                        onClick={() => setActiveRole(cr.role)}
                        className={`text-xs px-3 py-1 rounded-lg border font-semibold transition-all ${
                          activeRole === cr.role
                            ? 'bg-violet-600 border-violet-400 text-white'
                            : 'bg-slate-900/70 border-slate-700 text-slate-300 hover:text-white'
                        }`}
                      >
                        ⇄ #{idx + 2} {cr.role} ({cr.confidence}%)
                      </button>
                    ))}
                  </div>
                </div>

                <Link
                  href="/courses/certifications"
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-600/30 whitespace-nowrap self-start md:self-auto"
                >
                  View Certifications for {activeRole || primaryRole} →
                </Link>
              </div>
            )}
            {/* Hero CTA for certifications page */}
            <div className="relative bg-gradient-to-r from-violet-600/20 via-blue-600/20 to-emerald-600/20 border border-white/10 rounded-2xl p-8 overflow-hidden">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
              </div>
              <div className="relative z-10">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                    100% Free · No Credit Card Needed
                  </span>
                  <span className="bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                    🇮🇳 India Focused
                  </span>
                </div>
                <h2 className="text-3xl font-black text-white mb-3">
                  Free Certification Courses<br />
                  <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent">for Every Tech Role</span>
                </h2>
                <p className="text-slate-300 max-w-2xl mb-6 leading-relaxed">
                  40+ hand-picked free certifications from <strong>Google · Microsoft · AWS · IBM · Meta · Mindluster · freeCodeCamp · NPTEL · Cisco</strong> — helpful for students and professionals.
                </p>
                <Link
                  href="/courses/certifications"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl transition-all shadow-xl shadow-blue-500/20 active:scale-95"
                >
                  🎓 Browse All Free Certifications →
                </Link>
              </div>
            </div>

            {/* Platform Available Free Courses Section */}
            <div>
              <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
                📚 Platform Free Available Courses
              </h3>
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {[1,2,3].map(i => <div key={i} className="bg-slate-900 rounded-2xl h-64 animate-pulse" />)}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {courses.map((course) => (
                    <Link key={course.id} href={`/courses/${course.id}`} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-blue-500/50 hover:shadow-blue-500/10 hover:shadow-lg transition-all duration-300 group flex flex-col">
                      <div className="w-full h-40 bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center relative overflow-hidden">
                        {course.thumbnail ? (
                          <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <span className="text-5xl">{course.category === 'Web Development' ? '⚛️' : course.category === 'Data Science' ? '📊' : '🏗️'}</span>
                        )}
                        <div className="absolute top-3 left-3 bg-emerald-500/90 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-md tracking-wider">
                          FREE
                        </div>
                      </div>
                      <div className="p-5 flex-1 flex flex-col">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-[10px] px-2.5 py-0.5 rounded-full border ${LEVEL_COLOR[String(course.level).toUpperCase()] || 'bg-slate-700 text-slate-300'}`}>{course.level}</span>
                          {course.isCertified && <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">Certified</span>}
                        </div>
                        <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors mb-1 line-clamp-2">{course.title}</h3>
                        <p className="text-slate-500 text-xs mb-3">Instructor: {course.instructor}</p>
                        <div className="flex items-center gap-1 text-sm mt-auto">
                          <span className="text-yellow-400">★</span>
                          <span className="text-white font-medium">{course.rating || 4.8}</span>
                          <span className="text-slate-500">({(course.reviewCount || 42).toLocaleString()})</span>
                          {course.progress !== undefined && (
                            <span className="ml-auto text-xs font-black text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-md">
                              Enrolled ({course.progress}%)
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Popular Free Certifications preview cards */}
            <div>
              <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                🔥 Most Popular Free Certifications
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {[
                  { emoji: '💻', title: 'Computer Science Basics', provider: 'Mindluster', students: '1,00,000+', url: 'https://www.mindluster.com/certificate/102', badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20', badgeLabel: 'Mindluster', category: 'Beginner' },
                  { emoji: '🔒', title: 'Google Cybersecurity Certificate', provider: 'Google · Coursera', students: '500K+', url: 'https://grow.google/intl/india/certificates/', badge: 'bg-sky-500/10 text-sky-400 border-sky-500/20', badgeLabel: 'Coursera', category: 'Beginner' },
                  { emoji: '☁️', title: 'Azure Fundamentals (AZ-900)', provider: 'Microsoft Learn', students: '2M+', url: 'https://learn.microsoft.com/en-us/certifications/azure-fundamentals/', badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20', badgeLabel: 'Microsoft', category: 'Beginner' },
                  { emoji: '🏕️', title: 'Responsive Web Design', provider: 'freeCodeCamp', students: '10M+', url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/', badge: 'bg-green-500/10 text-green-400 border-green-500/20', badgeLabel: 'freeCodeCamp', category: 'Beginner' },
                  { emoji: '🎓', title: 'Python (IIT Bombay)', provider: 'NPTEL / SWAYAM', students: '5,00,000+', url: 'https://nptel.ac.in/courses/106106182', badge: 'bg-violet-500/10 text-violet-400 border-violet-500/20', badgeLabel: 'NPTEL', category: 'Beginner' },
                  { emoji: '🧠', title: 'Generative AI Essentials', provider: 'Microsoft + LinkedIn', students: '500K+', url: 'https://www.linkedin.com/learning/paths/career-essentials-in-generative-ai-by-microsoft-and-linkedin', badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20', badgeLabel: 'LinkedIn', category: 'Beginner' },
                ].map(c => (
                  <a
                    key={c.title}
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-4 bg-white/[0.03] border border-white/8 rounded-2xl p-5 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/5 transition-all group"
                  >
                    <div className="text-3xl flex-shrink-0">{c.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg border ${c.badge} mb-1.5 inline-block`}>
                        {c.badgeLabel}
                      </span>
                      <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors leading-tight mb-1 line-clamp-2">
                        {c.title}
                      </h4>
                      <p className="text-slate-500 text-xs">{c.provider}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[9px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-lg">🆓 FREE</span>
                        <span className="text-[9px] font-black bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-lg">🏆 Certificate</span>
                        <span className="text-[10px] text-slate-600 ml-auto">👥 {c.students}</span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── My Courses Tab ──────────────────────────────────────────────── */}
        {tab === 'enrolled' && (
          <div className="space-y-6">
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
            ) : enrolledCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {enrolledCourses.map((course) => (
                  <Link key={course.id} href={`/courses/${course.id}`} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-blue-500/50 hover:shadow-blue-500/10 hover:shadow-lg transition-all duration-300 group flex flex-col">
                    <div className="w-full h-40 bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center relative overflow-hidden">
                      {course.thumbnail ? (
                        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <span className="text-5xl">{course.category === 'Web Development' ? '⚛️' : course.category === 'Data Science' ? '📊' : '🏗️'}</span>
                      )}
                      <div className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-md tracking-wider">
                        Active
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col space-y-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-[10px] px-2.5 py-0.5 rounded-full border ${LEVEL_COLOR[String(course.level).toUpperCase()] || 'bg-slate-700 text-slate-300'}`}>{course.level}</span>
                          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Free Course</span>
                        </div>
                        <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors mb-1 line-clamp-2">{course.title}</h3>
                        <p className="text-slate-500 text-xs">Instructor: {course.instructor}</p>
                      </div>

                      {/* Course Progress Percent Indicator */}
                      <div className="space-y-2 pt-2 border-t border-white/5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-slate-400">Progress</span>
                          <span className="font-black text-blue-400">{course.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5">
                          <div 
                            className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${course.progress || 0}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white/2 border border-dashed border-white/10 rounded-2xl">
                <div className="text-5xl mb-4">📖</div>
                <h3 className="text-lg font-bold text-white mb-1">No Enrolled Courses</h3>
                <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">
                  Start learning today! Browse available free courses or certifications and click Enroll.
                </p>
                <button 
                  onClick={() => setTab('certifications')}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider"
                >
                  Browse Free Courses
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
