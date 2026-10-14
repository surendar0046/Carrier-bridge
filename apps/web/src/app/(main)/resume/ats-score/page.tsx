'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target,
  AlertCircle,
  Zap,
  Loader2,
  Upload,
  FileText,
  CheckCircle2,
  X,
  FileUp,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  FileCode,
} from 'lucide-react';
import Link from 'next/link';
import { ROLES } from '../builder/useResumeStore';
import RoleCombobox from '../builder/RoleCombobox';
import AnalysisPanel, { AnalysisResult } from '../builder/AnalysisPanel';

const PARSE_URL = '/api/resume/parse';
const AI_URL = '/api/resume/analyze';

interface UploadedFileInfo {
  name: string;
  size: number;
  wordCount: number;
  characterCount: number;
}

export default function ATSScorePage() {
  const [inputMode, setInputMode] = useState<'upload' | 'paste'>('upload');
  const [text, setText] = useState('');
  const [targetRole, setTargetRole] = useState(ROLES[0]);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState('');
  const [uploadedFile, setUploadedFile] = useState<UploadedFileInfo | null>(null);
  const [showExtractedPreview, setShowExtractedPreview] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Common skills scanner for quick matching
  const extractSkills = (content: string) => {
    const commonSkills = [
      'React', 'TypeScript', 'Node.js', 'Python', 'SQL', 'NoSQL', 'AWS', 'Docker', 'Kubernetes',
      'Figma', 'User Research', 'Prototyping', 'Git', 'Agile', 'Java', 'C++', 'HTML', 'CSS',
      'Machine Learning', 'TensorFlow', 'PyTorch', 'ETL', 'CI/CD', 'Linux', 'Terraform',
      'System Design', 'Microservices', 'REST API', 'GraphQL', 'Ansible', 'Jenkins', 'Framer Motion',
      'MongoDB', 'PostgreSQL', 'Express', 'Spring Boot', 'Tailwind CSS', 'Next.js', 'Jest', 'Redux'
    ];
    return commonSkills.filter(s => content.toLowerCase().includes(s.toLowerCase()));
  };

  const handleFileUpload = async (file: File) => {
    setError('');
    setParsing(true);
    setAnalysis(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(PARSE_URL, {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();
      if (!res.ok || json.error) {
        throw new Error(json.message || 'Failed to parse resume file');
      }

      const extracted = json.data.text;
      setText(extracted);
      setUploadedFile({
        name: json.data.fileName,
        size: json.data.fileSize,
        wordCount: json.data.wordCount,
        characterCount: json.data.characterCount,
      });

      // Automatically run ATS analysis immediately after successful upload
      await triggerAnalysis(extracted, targetRole);
    } catch (err: any) {
      setError(err.message || 'Failed to extract text from resume. Please check the file or paste text directly.');
    } finally {
      setParsing(false);
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const triggerAnalysis = async (resumeContent: string, role: string) => {
    if (resumeContent.trim().length < 80) {
      setError('Please provide a resume with more detail (at least 80 characters).');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const foundSkills = extractSkills(resumeContent);

      const payload = {
        personalInfo: { fullName: 'Candidate', email: 'candidate@example.com' },
        summary: resumeContent,
        experience: [],
        skills: foundSkills,
        projects: [],
        education: [],
        targetRole: role,
        isQuickCheck: true,
      };

      const res = await fetch(AI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || json.error) {
        throw new Error(json.message || 'Analysis failed');
      }

      setAnalysis(json.data);
    } catch (e: any) {
      setError(e.message || 'Analysis failed. Make sure the AI service is operational.');
    } finally {
      setLoading(false);
    }
  };

  const handleManualAnalyze = () => {
    triggerAnalysis(text, targetRole);
  };

  const clearFile = () => {
    setUploadedFile(null);
    setText('');
    setAnalysis(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6 md:p-10 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-xs font-bold text-blue-600 mb-4 uppercase tracking-widest">
            <Zap size={14} /> ATS Resume Scanner
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-3 tracking-tight">
            Resume <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">ATS Score Checker</span>
          </h1>
          <p className="text-slate-500 text-base max-w-2xl leading-relaxed">
            Upload your resume (PDF, DOCX, or TXT) and instantly receive an AI-powered ATS compatibility score,
            keyword gap breakdown, and structural feedback tailored to your target job role.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8">
          {/* Main Controls Column */}
          <div className="space-y-6">

            {/* Step 1: Target Career Role Selection */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 bg-blue-600 text-white rounded-xl flex items-center justify-center font-black text-sm shadow-md shadow-blue-500/20">
                  1
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Select Target Role</h2>
                  <p className="text-xs text-slate-500">The ATS test compares your resume against real recruiter standards for this role</p>
                </div>
              </div>

              <RoleCombobox
                value={targetRole}
                onChange={(role) => {
                  setTargetRole(role);
                  if (text.length >= 80) {
                    triggerAnalysis(text, role);
                  }
                }}
                variant="light"
                placeholder="Search target role (e.g. UX Designer, Full Stack Developer, DevOps)..."
              />

              {targetRole && (
                <div className="mt-3 flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                    <span>🎯 Scoring for:</span> <strong>{targetRole}</strong>
                  </div>
                  {analysis && (
                    <span className="text-[11px] text-slate-400 font-medium">
                      Changing role automatically updates ATS score
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Step 2: Upload Resume or Paste Text */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-black text-sm shadow-md shadow-indigo-500/20">
                    2
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Provide Your Resume</h2>
                    <p className="text-xs text-slate-500">Upload your existing document or paste the text</p>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200/80 w-fit">
                  <button
                    type="button"
                    onClick={() => setInputMode('upload')}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      inputMode === 'upload'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Upload size={13} /> Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputMode('paste')}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      inputMode === 'paste'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <FileText size={13} /> Paste Text
                  </button>
                </div>
              </div>

              {/* ── Mode 1: Upload File Drag & Drop Zone ── */}
              {inputMode === 'upload' && (
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx,.doc,.txt"
                    className="hidden"
                    onChange={onFileInputChange}
                  />

                  {!uploadedFile ? (
                    <div
                      onDragOver={onDragOver}
                      onDragLeave={onDragLeave}
                      onDrop={onDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`relative border-2 border-dashed rounded-3xl p-8 md:p-12 text-center cursor-pointer transition-all duration-200 ${
                        isDragging
                          ? 'border-blue-500 bg-blue-50/70 scale-[0.99]'
                          : 'border-slate-300 hover:border-blue-400 bg-slate-50/60 hover:bg-slate-50'
                      }`}
                    >
                      {parsing ? (
                        <div className="flex flex-col items-center justify-center py-6 gap-3">
                          <Loader2 size={36} className="text-blue-600 animate-spin" />
                          <h4 className="font-bold text-slate-800 text-sm">Extracting Resume Text…</h4>
                          <p className="text-xs text-slate-500">Reading document formatting, skills, and experience</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center gap-3">
                          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200/80 flex items-center justify-center shadow-sm mb-1 group-hover:scale-105 transition-transform">
                            <FileUp size={30} />
                          </div>
                          <div>
                            <p className="text-base font-bold text-slate-800">
                              Click to upload your resume, or drag & drop here
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              Supports <span className="font-semibold text-slate-700">PDF, DOCX, DOC, TXT</span> (up to 10MB)
                            </p>
                          </div>
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-white border border-slate-200 text-slate-600 px-2.5 py-1 rounded-md">
                              📄 PDF
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-white border border-slate-200 text-slate-600 px-2.5 py-1 rounded-md">
                              📝 DOCX
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-white border border-slate-200 text-slate-600 px-2.5 py-1 rounded-md">
                              📑 Word
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-white border border-slate-200 text-slate-600 px-2.5 py-1 rounded-md">
                              TXT
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Uploaded File Summary Card */
                    <div className="border border-emerald-200 bg-emerald-50/40 rounded-2xl p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
                            <CheckCircle2 size={24} />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-slate-900 text-sm truncate">{uploadedFile.name}</h4>
                              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-white px-2 py-0.5 rounded-full">
                                Uploaded
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {formatFileSize(uploadedFile.size)} · {uploadedFile.wordCount} words extracted
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-white border border-slate-200 px-3 py-1.5 rounded-xl hover:bg-slate-50 transition-colors"
                          >
                            Replace
                          </button>
                          <button
                            type="button"
                            onClick={clearFile}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                            title="Remove file"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Extracted text preview toggle */}
                      <div className="border-t border-emerald-200/60 pt-3">
                        <button
                          type="button"
                          onClick={() => setShowExtractedPreview(v => !v)}
                          className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-blue-600 transition-colors"
                        >
                          {showExtractedPreview ? <EyeOff size={13} /> : <Eye size={13} />}
                          {showExtractedPreview ? 'Hide Extracted Resume Text' : 'View Extracted Resume Text'}
                        </button>

                        {showExtractedPreview && (
                          <div className="mt-3 bg-white border border-slate-200 rounded-xl p-4 max-h-60 overflow-y-auto text-xs text-slate-700 font-mono whitespace-pre-wrap leading-relaxed shadow-inner">
                            {text}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── Mode 2: Paste Raw Text ── */}
              {inputMode === 'paste' && (
                <div>
                  <textarea
                    className="w-full h-72 bg-white border border-slate-300 rounded-2xl p-5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all resize-none leading-relaxed"
                    placeholder="Paste your complete resume text here (Summary, Work Experience, Education, Skills, Projects, Certifications)..."
                    value={text}
                    onChange={(e) => {
                      setText(e.target.value);
                      if (uploadedFile) setUploadedFile(null);
                    }}
                  />
                  <div className="flex justify-between items-center text-xs text-slate-400 mt-2">
                    <span>{text.split(/\s+/).filter(Boolean).length} words</span>
                    <span>Min. 80 characters for accurate AI score</span>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 flex items-center gap-2 text-rose-600 bg-rose-50 border border-rose-200 p-4 rounded-xl text-sm font-bold"
                >
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}

              {/* Action Button */}
              <button
                onClick={handleManualAnalyze}
                disabled={loading || parsing || text.trim().length < 80}
                className="w-full mt-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-indigo-500 py-4 rounded-2xl font-black text-white text-base shadow-xl shadow-blue-500/25 transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 active:scale-95 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Calculating ATS Score & Gaps…
                  </>
                ) : (
                  <>
                    <Zap size={18} />
                    {analysis ? 'Re-calculate ATS Score' : 'Calculate ATS Score'}
                  </>
                )}
              </button>

              {/* Link to Resume Builder */}
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Want to build a formatted resume with our Canva template?</span>
                <Link
                  href="/resume/builder"
                  className="font-bold text-blue-600 hover:underline flex items-center gap-1"
                >
                  Resume Builder →
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: ATS Score Analysis Panel */}
          <div className="space-y-6">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles size={14} className="text-blue-500" /> ATS Scorecard
              </h3>
              {analysis && (
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  Score: {analysis.overallScore}/100
                </span>
              )}
            </div>

            {analysis ? (
              <div className="space-y-4">
                <AnalysisPanel result={analysis} loading={loading} />

                {/* Call-to-action: Polish in Builder */}
                <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-5 shadow-xl border border-white/10 space-y-3">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-black uppercase tracking-wider">
                    <span>✨ Next Step</span>
                  </div>
                  <h4 className="font-bold text-sm text-white">
                    Apply Recommended Fixes to Your Resume
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Format your resume with the newly added <strong>Canva Minimalist Pro (Black & White)</strong> template to maximize readability and scoring.
                  </p>
                  <Link
                    href="/resume/builder"
                    className="inline-flex items-center gap-2 w-full justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-500 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95"
                  >
                    Open in Resume Builder <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-4 shadow-sm">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 border border-blue-200/80 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                  <Target size={30} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">No Resume Scored Yet</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
                    Upload your resume file above or drag & drop to get an instant breakdown of your ATS score, missing keywords, and recruiter tips.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
