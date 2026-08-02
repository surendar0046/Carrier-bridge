'use client';
import React, { useState } from 'react';

interface ApplicationFormProps {
  jobId: string;
  onSubmit: (resumeId: string, coverLetter?: string) => Promise<void>;
}

export const ApplicationForm: React.FC<ApplicationFormProps> = ({ jobId, onSubmit }) => {
  const [resumeId, setResumeId] = useState('res-main-1');
  const [coverLetter, setCoverLetter] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit(resumeId, coverLetter);
    setIsSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="p-8 bg-emerald-950/30 border border-emerald-800/40 rounded-3xl text-center space-y-3">
        <div className="text-4xl">🎉</div>
        <h3 className="text-xl font-bold text-emerald-400">Application Submitted!</h3>
        <p className="text-xs text-slate-300">Your profile and tailored ATS resume were sent to the employer.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
      <h3 className="text-base font-bold text-white">Apply for Role</h3>
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Select Resume Version</label>
        <select
          value={resumeId}
          onChange={(e) => setResumeId(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
        >
          <option value="res-main-1">Master ATS Optimized Resume (96% Match)</option>
          <option value="res-dev-2">Full Stack Specialist Resume (92% Match)</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Cover Note (Optional)</label>
        <textarea
          rows={4}
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          placeholder="Why are you a great fit for this position?"
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition shadow-lg shadow-blue-500/20"
      >
        {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
      </button>
    </form>
  );
};
