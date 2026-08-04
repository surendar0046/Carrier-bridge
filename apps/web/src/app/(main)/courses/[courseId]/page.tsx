'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { courseService } from '@career-bridge/services';
import { Course } from '@career-bridge/types';
import { 
  ChevronLeft, 
  BookOpen, 
  Clock, 
  Award, 
  Star, 
  CheckCircle2, 
  PlayCircle, 
  FileText 
} from 'lucide-react';
import { cn } from '@career-bridge/utils';

export default function CourseDetailsPage() {
  const { courseId } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!courseId) return;
    courseService.getCourseById(courseId as string).then(c => {
      setCourse(c);
      if (c && c.progress !== undefined) {
        setEnrolled(true);
      }
      setLoading(false);
    });
  }, [courseId]);

  const handleEnroll = async () => {
    if (!courseId) return;
    setUpdating(true);
    await courseService.enroll(courseId as string);
    // Reload course details
    const updated = await courseService.getCourseById(courseId as string);
    setCourse(updated);
    setEnrolled(true);
    setUpdating(false);
  };

  const handleToggleLesson = async (lessonId: string) => {
    if (!courseId || !enrolled || updating) return;
    setUpdating(true);
    const newProgress = await courseService.toggleLessonComplete(courseId as string, lessonId);
    // Reload course details
    const updated = await courseService.getCourseById(courseId as string);
    setCourse(updated);
    setUpdating(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold">Course Not Found</h2>
        <button onClick={() => router.push('/courses')} className="btn-primary px-6 py-2 rounded-xl">
          Back to Courses
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 pb-20">
      {/* Hero Header */}
      <div className="relative bg-slate-900/50 border-b border-white/5 py-12 px-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <button 
            onClick={() => router.push('/courses')} 
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-bold"
          >
            <ChevronLeft size={16} />
            Back to Learning Hub
          </button>
          
          <div className="flex flex-col lg:flex-row gap-8 items-start justify-between">
            <div className="space-y-4 max-w-3xl">
              <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                {course.category}
              </span>
              <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
                {course.title}
              </h1>
              <p className="text-slate-400 text-lg leading-relaxed">
                {course.description}
              </p>
              
              <div className="flex flex-wrap gap-6 text-sm text-slate-400 font-medium">
                <div className="flex items-center gap-1.5">
                  <Star className="text-yellow-500 fill-yellow-500" size={16} />
                  <span className="text-white font-bold">{course.rating || 4.9}</span>
                  <span>({course.reviewCount || 100} reviews)</span>
                </div>
                <div>Instructor: <span className="text-white font-bold">{course.instructor}</span></div>
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  <span>{course.duration ? `${Math.round(Number(course.duration) / 60)} mins` : 'Self-paced'}</span>
                </div>
              </div>
            </div>

            {/* Action Box */}
            <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl w-full lg:w-80 space-y-6 shadow-xl">
              <div className="text-center space-y-2">
                <div className="text-3xl font-black text-white">FREE</div>
                <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 py-1.5 px-3 rounded-full inline-block">
                  100% Free Available Course
                </div>
              </div>

              {enrolled ? (
                <div className="space-y-4 bg-white/5 p-4 rounded-xl border border-white/5">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-slate-300">Progress</span>
                    <span className="font-black text-blue-400">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${course.progress || 0}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 text-center">
                    Check off completed lessons in the curriculum below.
                  </p>
                </div>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={updating}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-black text-sm rounded-xl uppercase tracking-widest shadow-lg shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50"
                >
                  {updating ? 'Enrolling...' : 'Enroll Now'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Curriculum Section */}
      <div className="max-w-5xl mx-auto px-8 py-12 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <BookOpen size={22} className="text-blue-400" />
            Course Curriculum
          </h2>

          <div className="space-y-4">
            {course.curriculum?.map((module, mIdx) => (
              <div key={module.id} className="bg-slate-900/40 border border-white/5 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 bg-white/5 border-b border-white/5">
                  <span className="text-[10px] font-black uppercase text-blue-400 tracking-wider">Module {mIdx + 1}</span>
                  <h3 className="font-bold text-white text-base mt-0.5">{module.title}</h3>
                </div>
                <div className="divide-y divide-white/5">
                  {module.lessons.map(lesson => (
                    <div 
                      key={lesson.id} 
                      className={cn(
                        "px-6 py-4 flex items-center justify-between transition-colors",
                        enrolled ? "hover:bg-white/5" : ""
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {lesson.type === 'video' ? (
                          <PlayCircle className="text-slate-500" size={18} />
                        ) : (
                          <FileText className="text-slate-500" size={18} />
                        )}
                        <div>
                          <span className={cn(
                            "text-sm font-semibold text-slate-300",
                            lesson.isCompleted ? "line-through text-slate-500" : ""
                          )}>
                            {lesson.title}
                          </span>
                          <span className="text-[10px] text-slate-500 ml-3">({Math.round(lesson.duration / 60)} mins)</span>
                        </div>
                      </div>

                      {enrolled ? (
                        <button
                          onClick={() => handleToggleLesson(lesson.id)}
                          disabled={updating}
                          className="focus:outline-none"
                        >
                          <CheckCircle2 
                            className={cn(
                              "w-6 h-6 transition-all",
                              lesson.isCompleted 
                                ? "text-emerald-500 fill-emerald-500/10" 
                                : "text-slate-700 hover:text-slate-500"
                            )} 
                          />
                        </button>
                      ) : (
                        lesson.isPreview && (
                          <span className="text-[10px] font-black uppercase tracking-wider bg-white/5 border border-white/10 text-slate-400 py-1 px-2.5 rounded-lg">
                            Preview
                          </span>
                        )
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Covered Sidebar */}
        <div className="space-y-6">
          <div className="glass-card p-6 space-y-4">
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Award size={16} className="text-blue-400" />
              Skills You Will Learn
            </h3>
            <div className="flex flex-wrap gap-2">
              {course.skills?.map(skill => (
                <span key={skill} className="text-xs font-semibold bg-white/5 text-slate-300 border border-white/5 px-3 py-1.5 rounded-xl">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
