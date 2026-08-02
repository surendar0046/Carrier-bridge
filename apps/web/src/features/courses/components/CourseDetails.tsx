'use client';
import React from 'react';
import { Course } from '@career-bridge/types';

interface CourseDetailsProps {
  course: Course;
  onEnroll: () => void;
}

export const CourseDetails: React.FC<CourseDetailsProps> = ({ course, onEnroll }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-8 text-slate-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-6">
        <div>
          <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-bold rounded-full mb-3 inline-block">
            {course.category}
          </span>
          <h1 className="text-3xl font-extrabold text-white">{course.title}</h1>
          <p className="text-sm text-slate-400 mt-1 font-medium">Provided by {course.provider || 'Career Bridge Academy'}</p>
        </div>
        <button
          onClick={onEnroll}
          className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-2xl shadow-xl shadow-blue-500/25 transition"
        >
          Enroll Free
        </button>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-bold text-white">Course Syllabus Overview</h3>
        <p className="text-sm text-slate-300 leading-relaxed">{course.description}</p>
      </div>
    </div>
  );
};
