'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  AlertCircle, 
  Zap, 
  Loader2
} from 'lucide-react';
import { ROLES } from '../builder/useResumeStore';
import RoleCombobox from '../builder/RoleCombobox';
import AnalysisPanel, { AnalysisResult } from '../builder/AnalysisPanel';
import { env } from '@career-bridge/services';

const AI_URL = '/api/resume/analyze';

export default function ATSScorePage() {
  const [text, setText] = useState('');
  const [targetRole, setTargetRole] = useState(ROLES[0]);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const runAnalysis = async () => {
    if (text.trim().length < 100) {
      setError('Please paste a more detailed resume text (at least 100 characters).');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const extractedText = text;

      // Automatically scan and extract popular technical skills from the pasted text
      const commonSkills = [
        'React', 'TypeScript', 'Node.js', 'Python', 'SQL', 'NoSQL', 'AWS', 'Docker', 'Kubernetes',
        'Figma', 'User Research', 'Prototyping', 'Git', 'Agile', 'Java', 'C++', 'HTML', 'CSS',
        'Machine Learning', 'TensorFlow', 'PyTorch', 'ETL', 'CI/CD', 'Linux', 'Terraform',
        'System Design', 'microservices', 'REST API', 'GraphQL', 'Ansible', 'Jenkins', 'Framer Motion'
      ];
      const foundSkills = commonSkills.filter(s => 
        extractedText.toLowerCase().includes(s.toLowerCase())
      );

      const payload = {
        personalInfo: { fullName: 'User', email: 'user@example.com' },
        summary: extractedText,
        experience: [], 
        skills: foundSkills, 
        projects: [],
        education: [],
        targetRole: targetRole,
        isQuickCheck: true
      };

      const res = await fetch(AI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.message || 'Analysis failed');
      
      setAnalysis(json.data);
    } catch (e: any) {
      setError(e.message || 'Analysis failed. Make sure the AI service is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-xs font-bold text-blue-600 mb-6 uppercase tracking-widest">
            <Zap size={14} /> ATS Optimizer
          </div>
          <h1 className="text-5xl font-black mb-4 tracking-tight">
            Real-Time <span className="text-gradient">ATS Analysis</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl">
            Get an instant AI-powered score for your resume based on your target role. 
            Identify keyword gaps and structural issues in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
          {/* Main Controls */}
          <div className="space-y-8">
            {/* Step 1: Role Selection */}
            <div className="glass-card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-600 font-bold">1</div>
                <div>
                  <h2 className="text-xl font-bold">Target Career Role</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Search from {ROLES.length}+ roles or type your own custom role</p>
                </div>
              </div>
              <RoleCombobox
                value={targetRole}
                onChange={setTargetRole}
                variant="light"
                placeholder="Search (e.g. SOC Analyst, Cloud Security Engineer, ML Engineer)..."
              />
              {targetRole && (
                <div className="mt-3 inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                  <span>🎯</span> {targetRole}
                </div>
              )}
            </div>

            {/* Step 2: Content Input */}
            <div className="glass-card p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-violet-500/10 rounded-xl flex items-center justify-center text-violet-600 font-bold">2</div>
                  <h2 className="text-xl font-bold">Resume Content</h2>
                </div>
              </div>

              <textarea
                className="w-full h-80 bg-white border border-slate-300 rounded-3xl p-6 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all resize-none"
                placeholder="Paste your entire resume text here for detailed analysis..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 flex items-center gap-2 text-rose-600 bg-rose-50 border border-rose-200 p-4 rounded-xl text-sm font-bold"
                >
                  <AlertCircle size={16} /> {error}
                </motion.div>
              )}

              <button 
                onClick={runAnalysis}
                disabled={loading}
                className="w-full mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 py-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" />
                    AI is Analyzing...
                  </>
                ) : (
                  <>
                    <Zap size={20} />
                    Get ATS Score Now
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Analysis Sidebar (Mobile: Below) */}
          <div className="space-y-6">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest ml-4">Analysis Results</h3>
            {analysis ? (
              <AnalysisPanel result={analysis} loading={loading} />
            ) : (
              <div className="glass-card p-8 text-center space-y-4 opacity-50">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-slate-500 mx-auto">
                  <Target size={32} />
                </div>
                <p className="text-sm text-slate-400 font-medium">
                  Run analysis to see your ATS score breakdown and improvement tips.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
