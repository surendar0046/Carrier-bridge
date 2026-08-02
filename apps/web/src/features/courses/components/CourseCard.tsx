'use client';
import React from 'react';
import { Course } from '@career-bridge/types';
import Link from 'next/link';

interface CourseCardProps {
  course: Course;
  onEnroll?: (courseId: string) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onEnroll }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 hover:border-blue-500/40 rounded-3xl overflow-hidden transition duration-200 shadow-lg flex flex-col justify-between group">
      <div>
        <div className="h-44 relative overflow-hidden bg-slate-800">
          <img
            src={course.image || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80'}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
          <div className="absolute top-3 left-3 px-3 py-1 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold rounded-full">
            {course.level || 'Intermediate'}
          </div>
        </div>

        <div className="p-6">
          <span className="text-[11px] font-extrabold text-blue-400 uppercase tracking-wider">{course.category}</span>
          <h3 className="font-extrabold text-base text-white group-hover:text-blue-400 transition mt-1 line-clamp-2">{course.title}</h3>
          <p className="text-xs text-slate-400 mt-2 line-clamp-2">{course.description}</p>
        </div>
      </div>

      <div className="px-6 pb-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span>⏱️ {course.duration}</span>
          <span>⭐ {course.rating || 4.9}</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/courses/${course.id}`}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition"
          >
            Explore
          </Link>
          {onEnroll && (
            <button
              onClick={() => onEnroll(course.id)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition shadow-md shadow-blue-500/20"
            >
              Enroll
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
