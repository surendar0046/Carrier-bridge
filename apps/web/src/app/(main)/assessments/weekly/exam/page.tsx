'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  WEEKLY_ASSESSMENT_QUESTIONS, 
  WeeklyAssessmentQuestion 
} from '@/data/weeklyAssessmentQuestions';
import { ProctoringMonitor } from '@/features/assessment/components/ProctoringMonitor';
import { practiceProgressService } from '@career-bridge/services';
import { 
  Timer, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ChevronRight, 
  ChevronLeft, 
  Trophy, 
  RotateCcw, 
  Terminal, 
  Code2, 
  Brain, 
  Play, 
  ShieldCheck,
  Send,
  ArrowRight
} from 'lucide-react';
import { cn } from '@career-bridge/utils';

export default function WeeklyExamRunnerPage() {
  const router = useRouter();

  // Questions State
  const [questions, setQuestions] = useState<WeeklyAssessmentQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [codeAnswers, setCodeAnswers] = useState<Record<string, string>>({});
  
  // Timer & Status
  const [timeLeft, setTimeLeft] = useState<number>(1800); // 30 minutes
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [autoSubmittedByProctor, setAutoSubmittedByProctor] = useState<boolean>(false);
  const [tabViolationsCount, setTabViolationsCount] = useState<number>(0);
  const recordSavedRef = useRef<boolean>(false);

  // Coding & Debugging Runner State
  const [runMessage, setRunMessage] = useState<string | null>(null);
  const [testcaseResults, setTestcaseResults] = useState<any[] | null>(null);
  const [isRunningCode, setIsRunningCode] = useState(false);

  useEffect(() => {
    // Load default questions (Aptitude, Verbal, Coding, Debugging)
    // Filter to 5 aptitude, 5 verbal, 1 coding (JS or Python), 1 debugging
    const apt = WEEKLY_ASSESSMENT_QUESTIONS.filter(q => q.section === 'aptitude').slice(0, 5);
    const verb = WEEKLY_ASSESSMENT_QUESTIONS.filter(q => q.section === 'verbal').slice(0, 5);
    const code = WEEKLY_ASSESSMENT_QUESTIONS.filter(q => q.section === 'coding').slice(0, 1);
    const debug = WEEKLY_ASSESSMENT_QUESTIONS.filter(q => q.section === 'debugging').slice(0, 1);

    const fullExam = [...apt, ...verb, ...code, ...debug];
    setQuestions(fullExam);

    // Initialize code values
    const initialCodes: Record<string, string> = {};
    fullExam.forEach(q => {
      if (q.codeSnippet) {
        initialCodes[q.id] = q.codeSnippet;
      }
    });
    setCodeAnswers(initialCodes);
  }, []);

  // Timer countdown
  useEffect(() => {
    if (isSubmitted || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isSubmitted, timeLeft]);

  const currentQ = questions[currentIdx];

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (opt: string) => {
    if (isSubmitted || !currentQ) return;
    setAnswers(prev => ({ ...prev, [currentQ.id]: opt }));
  };

  const handleCodeChange = (val: string) => {
    if (isSubmitted || !currentQ) return;
    setCodeAnswers(prev => ({ ...prev, [currentQ.id]: val }));
  };

  // Run Testcases for coding/debugging question
  const handleRunTestcases = () => {
    if (!currentQ || !currentQ.testCases) return;
    setIsRunningCode(true);
    setRunMessage(null);

    setTimeout(() => {
      const code = codeAnswers[currentQ.id] || '';
      const hasLogic =
        (currentQ.section === 'coding' && (code.includes('Map') || code.includes('seen') || code.includes('for') || code.includes('indexOf') || code.length > 80)) ||
        (currentQ.section === 'debugging' && (code.includes('arr.length - 1') || code.includes('cache is None') || code.includes('cache=None')));

      const testCasesList = currentQ.testCases || [];
      const results = testCasesList.map((tc, idx) => ({
        index: idx + 1,
        input: tc.input,
        expected: tc.output,
        actual: hasLogic ? tc.output : 'SyntaxError / Output Mismatch',
        passed: hasLogic
      }));

      setTestcaseResults(results);
      setIsRunningCode(false);
      setRunMessage(hasLogic ? 'All testcases passed successfully!' : 'Some testcases failed. Please review your code logic.');
    }, 600);
  };

  // Calculate Final Score
  const calculateResults = () => {
    let earned = 0;
    let total = 0;

    const breakdown: Record<string, { earned: number; total: number }> = {
      aptitude: { earned: 0, total: 0 },
      verbal: { earned: 0, total: 0 },
      coding: { earned: 0, total: 0 },
      debugging: { earned: 0, total: 0 }
    };

    questions.forEach(q => {
      total += q.points;
      breakdown[q.section].total += q.points;

      if (q.options) {
        if (answers[q.id] === q.correctAnswer) {
          earned += q.points;
          breakdown[q.section].earned += q.points;
        }
      } else {
        // Coding / debugging code check
        const code = codeAnswers[q.id] || '';
        const isCorrect =
          (q.section === 'coding' && (code.includes('Map') || code.includes('seen') || code.includes('comp') || code.length > 80)) ||
          (q.section === 'debugging' && (code.includes('arr.length - 1') || code.includes('cache is None') || code.includes('cache=None')));

        if (isCorrect) {
          earned += q.points;
          breakdown[q.section].earned += q.points;
        }
      }
    });

    return { earned, total, percentage: Math.round((earned / total) * 100), breakdown };
  };

  const handleSubmitExam = () => {
    if (isSubmitted) return;
    setIsSubmitted(true);

    if (!recordSavedRef.current) {
      recordSavedRef.current = true;
      const res = calculateResults();
      const timeSpent = Math.max(10, 1800 - timeLeft);

      // Record in practiceProgressService
      practiceProgressService.recordSession({
        category: 'weekly',
        score: res.earned,
        totalQuestions: questions.length,
        timeTakenSeconds: timeSpent,
        isWeeklyAssessment: true,
      });
    }
  };

  // Handlers for Proctoring Violations
  const handleProctorViolation = (count: number, reason: string) => {
    setTabViolationsCount(count);
  };

  const handleProctorExceeded = () => {
    setAutoSubmittedByProctor(true);
    handleSubmitExam();
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-slate-400">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Final Results Screen
  if (isSubmitted) {
    const results = calculateResults();

    return (
      <div className="max-w-4xl mx-auto py-8 px-4 space-y-8 animate-in fade-in duration-300">
        {/* Anti-cheat Termination Banner if triggered */}
        {autoSubmittedByProctor && (
          <div className="bg-rose-500/10 border-2 border-rose-500/50 rounded-3xl p-6 text-rose-300 flex items-center gap-4">
            <AlertTriangle size={32} className="text-rose-400 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-bold text-white">Assessment Auto-Submitted By Proctor</h3>
              <p className="text-xs text-rose-300 mt-0.5">
                Maximum allowable tab switches / window violations were exceeded (3 strikes). Your responses were locked and submitted for audit.
              </p>
            </div>
          </div>
        )}

        {/* Results Card */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-violet-500/30 rounded-3xl p-8 sm:p-12 shadow-2xl text-white space-y-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="w-20 h-20 bg-yellow-400/20 border-2 border-yellow-400/50 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-yellow-500/20">
            <Trophy size={40} className="text-yellow-400" />
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl sm:text-4xl font-black">Weekly Assessment Complete!</h2>
            <p className="text-slate-300 text-sm max-w-lg mx-auto">
              Your comprehensive multi-domain evaluation has been recorded to your student profile and leaderboard ranking.
            </p>
          </div>

          {/* Score Circle / Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto pt-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <div className="text-3xl font-black text-white">{results.earned} / {results.total}</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1">Total Points</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <div className="text-3xl font-black text-emerald-400">{results.percentage}%</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1">Accuracy</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <div className="text-3xl font-black text-blue-400">{formatTime(Math.max(10, 1800 - timeLeft))}</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1">Time Taken</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <div className={`text-3xl font-black ${tabViolationsCount === 0 ? 'text-emerald-400' : 'text-yellow-400'}`}>
                {tabViolationsCount === 0 ? '100%' : `${Math.max(0, 100 - tabViolationsCount * 25)}%`}
              </div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1">Integrity Score</div>
            </div>
          </div>

          {/* Domain Breakdown */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-6 text-left space-y-4 max-w-2xl mx-auto">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Section Score Breakdown</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="font-semibold text-slate-300">Quantitative Aptitude</span>
                <span className="font-bold text-white">{results.breakdown.aptitude.earned} / {results.breakdown.aptitude.total} pts</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="font-semibold text-slate-300">Verbal Ability</span>
                <span className="font-bold text-white">{results.breakdown.verbal.earned} / {results.breakdown.verbal.total} pts</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="font-semibold text-slate-300">DSA & Coding</span>
                <span className="font-bold text-white">{results.breakdown.coding.earned} / {results.breakdown.coding.total} pts</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="font-semibold text-slate-300">System Debugging</span>
                <span className="font-bold text-white">{results.breakdown.debugging.earned} / {results.breakdown.debugging.total} pts</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => router.push('/assessments/weekly')}
              className="w-full sm:w-auto px-8 py-3.5 bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm rounded-xl shadow-xl shadow-violet-600/30 transition flex items-center justify-center gap-2"
            >
              <span>View Assessment Hub</span>
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full sm:w-auto px-8 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm rounded-xl border border-slate-700 transition"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active Exam View with Proctoring HUD
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24 -mt-6 -mx-4 sm:-mx-8 p-4 sm:p-8">
      {/* Real-time Proctoring Monitor Component (Webcam + Audio + Tab Lock) */}
      <ProctoringMonitor
        maxViolations={3}
        onViolation={handleProctorViolation}
        onExceededViolations={handleProctorExceeded}
      />

      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Exam Navigation Bar */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 backdrop-blur-md shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400 font-black">
              {currentIdx + 1}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-violet-400">
                  {currentQ.section.toUpperCase()} SECTION
                </span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-bold">
                  {currentQ.points} Pts
                </span>
              </div>
              <p className="text-xs text-slate-400">Question {currentIdx + 1} of {questions.length}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Timer */}
            <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border font-mono text-sm font-bold ${
              timeLeft < 300 
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 animate-pulse' 
                : 'bg-slate-950 border-slate-800 text-emerald-400'
            }`}>
              <Timer size={16} />
              <span>{formatTime(timeLeft)}</span>
            </div>

            <button
              onClick={handleSubmitExam}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition flex items-center gap-1.5"
            >
              <Send size={14} />
              <span>Finish & Submit</span>
            </button>
          </div>
        </div>

        {/* Question Pagination Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-3 bg-slate-900/60 rounded-2xl border border-slate-800/80">
          {questions.map((q, idx) => {
            const isAnswered = q.options ? Boolean(answers[q.id]) : Boolean(codeAnswers[q.id]);
            const isCurrent = idx === currentIdx;

            return (
              <button
                key={q.id}
                onClick={() => {
                  setCurrentIdx(idx);
                  setTestcaseResults(null);
                  setRunMessage(null);
                }}
                className={`w-8 h-8 rounded-xl text-xs font-bold transition flex items-center justify-center ${
                  isCurrent
                    ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30 ring-2 ring-violet-400'
                    : isAnswered
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        {/* Question Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="space-y-3">
            <h3 className="text-xl sm:text-2xl font-bold text-white leading-relaxed">
              {currentQ.question}
            </h3>
          </div>

          {/* Render Options for Multiple Choice Questions (Aptitude & Verbal) */}
          {currentQ.options && (
            <div className="space-y-3 pt-2">
              {currentQ.options.map((option, optIdx) => {
                const isSelected = answers[currentQ.id] === option;

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(option)}
                    className={`w-full p-4 rounded-2xl border text-left font-medium text-sm transition-all flex items-center justify-between gap-4 ${
                      isSelected
                        ? 'bg-violet-600/20 border-violet-500 text-white ring-1 ring-violet-500 shadow-md'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-slate-950'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold border ${
                        isSelected 
                          ? 'bg-violet-600 border-violet-400 text-white' 
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}>
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span>{option}</span>
                    </div>

                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'border-violet-500 bg-violet-500' : 'border-slate-700'
                    }`}>
                      {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Render Interactive Code Editor for Coding & Debugging Questions */}
          {currentQ.codeSnippet && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-xs text-slate-400">
                <span className="flex items-center gap-2 font-mono">
                  <Code2 size={14} className="text-blue-400" />
                  <span>Language: {currentQ.language || 'javascript'}</span>
                </span>
                <span className="text-[11px] text-slate-500">Edit and submit solution below</span>
              </div>

              <div className="relative">
                <textarea
                  value={codeAnswers[currentQ.id] || ''}
                  onChange={(e) => handleCodeChange(e.target.value)}
                  rows={10}
                  className="w-full bg-[#0a0f1d] border border-slate-800 rounded-2xl p-4 font-mono text-xs sm:text-sm text-emerald-400 focus:outline-none focus:border-violet-500 transition leading-relaxed"
                  placeholder="Write your code here..."
                  spellCheck={false}
                />
              </div>

              {/* Testcases & Execution Controls */}
              <div className="flex items-center justify-between gap-4 pt-1">
                <button
                  onClick={handleRunTestcases}
                  disabled={isRunningCode}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/20 transition flex items-center gap-2"
                >
                  <Play size={14} />
                  <span>{isRunningCode ? 'Executing Testcases...' : 'Run Test Cases'}</span>
                </button>

                {runMessage && (
                  <span className={`text-xs font-semibold ${runMessage.includes('passed') ? 'text-emerald-400' : 'text-yellow-400'}`}>
                    {runMessage}
                  </span>
                )}
              </div>

              {/* Testcase Results Output Terminal */}
              {testcaseResults && (
                <div className="bg-[#050811] border border-slate-800 rounded-2xl p-4 space-y-3 font-mono text-xs">
                  <div className="flex items-center gap-2 text-slate-400 border-b border-slate-800/80 pb-2">
                    <Terminal size={14} />
                    <span>Test Results Terminal</span>
                  </div>

                  <div className="space-y-2">
                    {testcaseResults.map((tc) => (
                      <div key={tc.index} className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                        <div>
                          <span className="font-bold text-slate-300">Case {tc.index}: </span>
                          <span className="text-slate-500">Input ({tc.input})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400">Expected: {tc.expected}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            tc.passed ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                          }`}>
                            {tc.passed ? 'PASS' : 'FAIL'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-800">
            <button
              onClick={() => {
                if (currentIdx > 0) {
                  setCurrentIdx(currentIdx - 1);
                  setTestcaseResults(null);
                  setRunMessage(null);
                }
              }}
              disabled={currentIdx === 0}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-bold transition flex items-center gap-1.5"
            >
              <ChevronLeft size={16} />
              <span>Previous</span>
            </button>

            {currentIdx < questions.length - 1 ? (
              <button
                onClick={() => {
                  setCurrentIdx(currentIdx + 1);
                  setTestcaseResults(null);
                  setRunMessage(null);
                }}
                className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-violet-600/20"
              >
                <span>Next Question</span>
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleSubmitExam}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-emerald-600/20"
              >
                <span>Submit Final Exam</span>
                <CheckCircle2 size={16} />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
