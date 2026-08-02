'use client';
import React from 'react';
import { useParams } from 'next/navigation';

export default function MentorProfilePage() {
  const { mentorId } = useParams();
  
  return (
    <div className="min-h-screen bg-[#020617] text-white p-8">
      <h1 className="text-4xl font-bold">Mentor Profile: {mentorId}</h1>
      <p className="text-slate-400 mt-4">Mentor details coming soon...</p>
    </div>
  );
}
