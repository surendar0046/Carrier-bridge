'use client';
import React from 'react';
import { useParams } from 'next/navigation';

export default function JobDetailsPage() {
  const { jobId } = useParams();
  
  return (
    <div className="min-h-screen bg-[#020617] text-white p-8">
      <h1 className="text-4xl font-bold">Job Details: {jobId}</h1>
      <p className="text-slate-400 mt-4">Job description and application details coming soon...</p>
    </div>
  );
}
