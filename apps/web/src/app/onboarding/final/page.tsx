'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore, useAuthStore } from '@career-bridge/store';
import { onboardingService } from '@/features/onboarding/services/onboardingService';
import { OnboardingQuestion, OnboardingResultPayload } from '@career-bridge/types';
import { FINAL_COLLEGE_QUESTIONS } from '@/data/onboardingQuestions';
import { QuestionStepCard } from '@/features/onboarding/components/QuestionStepCard';
import { 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  Target, 
  CheckCircle2, 
  AlertCircle,
  Calendar,
  Building2,
  FileCheck,
  Video,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MentorMeetingModal } from '@/features/onboarding/components/MentorMeetingModal';

export default function FinalCollegeOnboardingPage() {
  const router = useRouter();
  const { profile, fetchProfile, updateActiveRole } = useUserStore();
  const { isAuthenticated, isInitialized } = useAuthStore();

  const [questions, setQuestions] = useState<OnboardingQuestion[]>(FINAL_COLLEGE_QUESTIONS);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({
    q1_branch_domain: 'CSE - Software Development',
    q2_track: 'coding',
    q3_company_types: ['product', 'startups'],
    q3_specific_companies: '',
    q4_target_role: 'Software Development Engineer (SDE-1)',
    q5_placement_season: 'August 2026',
    q6_readiness: { aptitude: 3, coding: 3, communication: 4, resume: 2 },
    q7_help: ['resume_review', 'coding_practice', 'mock_interviews'],
    q8_hours: '10_to_15',
  });

  const [startTime] = useState(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<OnboardingResultPayload | null>(null);
  const [reviewWarning, setReviewWarning] = useState<string | null>(null);
  const [showMeetingModal, setShowMeetingModal] = useState(false);

  const emailKey = profile?.email ? profile.email.toLowerCase().trim() : 'guest';

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.replace('/login');
      return;
    }
    if (!profile) {
      fetchProfile();
    }

    const saved = onboardingService.getSavedProgress(emailKey, 'final');
    if (saved && saved.answers) {
      setAnswers(saved.answers);
      if (typeof saved.currentStep === 'number' && saved.currentStep < FINAL_COLLEGE_QUESTIONS.length) {
        setCurrentStepIndex(saved.currentStep);
      }
    }
  }, [isInitialized, isAuthenticated, profile, fetchProfile, router, emailKey]);

  const autoSave = useCallback((newAnswers: Record<string, any>, stepIdx: number) => {
    onboardingService.saveProgress(emailKey, 'final', stepIdx, newAnswers);
  }, [emailKey]);

  const currentQ = questions[currentStepIndex];
  const isLastQuestion = currentStepIndex === questions.length - 1;
  const progressPercent = Math.round(((currentStepIndex + 1) / questions.length) * 100);

  const handleAnswerChange = (val: any) => {
    const updated = { ...answers, [currentQ.id]: val };
    setAnswers(updated);
    autoSave(updated, currentStepIndex);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      submitAnswers();
    } else {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      autoSave(answers, nextIdx);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      setCurrentStepIndex(prevIdx);
      autoSave(answers, prevIdx);
    } else {
      router.push('/onboarding');
    }
  };

  const submitAnswers = async () => {
    setIsSubmitting(true);
    setReviewWarning(null);
    const durationSeconds = Math.max(1, Math.round((Date.now() - startTime) / 1000));

    try {
      const payload = await onboardingService.submitOnboarding(
        emailKey,
        'final',
        answers,
        durationSeconds
      );

      if (payload.reliabilityStatus === 'SUSPICIOUS_SPEED' || payload.reliabilityStatus === 'CONTRADICTORY') {
        setReviewWarning(payload.reviewReason || 'Please review your selections for consistency.');
        setIsSubmitting(false);
        return;
      }

      setResult(payload);
    } catch (err: any) {
      setReviewWarning(err.message || 'Something went wrong. Please check your answers.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProceedToDashboard = () => {
    setShowMeetingModal(true);
  };

  const handleFinalDashboard = () => {
    setShowMeetingModal(false);
    router.push('/dashboard');
  };

  // ── RESULT SCREEN (Time-Boxed Placement Plan) ─────────────────────────────
  if (result) {
    const suggestion = result.primarySuggestion;
    const plan = result.placementPlan || [];

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900 py-12 px-4 sm:px-6 max-w-4xl mx-auto space-y-8">
        
        {/* Banner */}
        <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-violet-700 via-indigo-700 to-slate-900 text-white shadow-xl space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold tracking-wider uppercase backdrop-blur-sm">
              🎯 3rd & 4th Year Placement Launchpad
            </span>
            <span className="text-xs text-violet-200 font-semibold">
              Season: {answers.q5_placement_season}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black leading-tight">
            Your Placement Preparation Plan is Activated
          </h1>
          <p className="text-violet-100 text-sm max-w-2xl leading-relaxed">
            Beginner fluff is bypassed. We have assembled a working-backwards sprint calibrated to your target company types and recruitment month.
          </p>
        </div>

        {/* Overview & Rationale */}
        <div className="bg-white border border-slate-200 rounded-[2rem] p-7 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-bold text-violet-600 uppercase tracking-widest">
                Target Role
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-0.5">
                {result.assignedRole}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {suggestion.subtitle}
              </p>
            </div>

            <div className="px-3.5 py-1.5 rounded-xl bg-violet-50 text-violet-800 border border-violet-200 text-xs font-bold self-start sm:self-auto">
              Time-Boxed Plan Active ✓
            </div>
          </div>

          {/* Key Strategic Rationale */}
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Strategy Drivers:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {suggestion.reasons.map((r, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-violet-600 shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-700 font-medium leading-relaxed">{r}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Working-Backwards Placement Modules */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Calendar size={18} className="text-violet-600" />
              <span>Sprint Roadmap Working Backwards to {answers.q5_placement_season}</span>
            </h3>
            <span className="text-xs text-slate-400 font-bold">3 Phase Sprint</span>
          </div>

          <div className="space-y-4">
            {plan.map((mod, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-violet-100 text-violet-700 font-black text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <h4 className="text-sm font-black text-slate-900">{mod.weekRange}</h4>
                  </div>
                  <span className="text-xs text-violet-600 font-bold">{mod.focusArea}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Preparation Modules */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <FileCheck size={12} /> Target Preparation Tasks
                    </span>
                    <ul className="space-y-1.5">
                      {mod.modules.map((m, i) => (
                        <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                          <span className="text-violet-500 font-black">•</span>
                          <span>{m}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Assessments & Mock Interviews */}
                  <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                        <Award size={12} /> Required Practice Tests
                      </span>
                      <div className="flex flex-wrap gap-1.5 pt-1.5">
                        {mod.assessmentsNeeded.map((a, i) => (
                          <span key={i} className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700">
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>

                    {mod.mockInterviewSlotSuggested && (
                      <div className="flex items-center gap-2 text-xs font-bold text-violet-700 bg-violet-100/60 px-3 py-1.5 rounded-lg border border-violet-200">
                        <Video size={14} />
                        <span>Recommended: Schedule 1-on-1 Mock Interview Slot</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-white border border-slate-200 rounded-3xl shadow-sm">
          <div>
            <h4 className="text-base font-bold text-slate-900">Your Placement Sprint is Configured</h4>
            <p className="text-xs text-slate-500">Your dashboard is populated with company-type question sets and resume checkpoints.</p>
          </div>
          <button
            onClick={handleProceedToDashboard}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-black text-sm shadow-lg shadow-violet-600/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
          >
            <span>Activate Placement Dashboard</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Mentor Meeting Booking Modal */}
        <MentorMeetingModal
          isOpen={showMeetingModal}
          onClose={handleFinalDashboard}
          onProceedToDashboard={handleFinalDashboard}
          studentName={profile?.name || 'Student'}
          studentEmail={emailKey}
          assignedDomain={result.assignedDomain || answers.q1_branch_domain || 'CSE - Software Development'}
          assignedRole={result.assignedRole || answers.q4_target_role || 'Software Development Engineer'}
          onboardingStage="final"
        />

      </div>
    );
  }

  // ── QUESTIONNAIRE FLOW ─────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-10 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header & Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleBack}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft size={14} /> Back
            </button>
            <span className="text-xs font-black uppercase tracking-wider text-violet-700 bg-violet-100/60 px-3 py-1 rounded-full">
              Step {currentStepIndex + 1} of {questions.length}
            </span>
          </div>

          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-violet-600 to-indigo-600"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Warning if review needed */}
        {reviewWarning && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
            <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 leading-relaxed font-medium">
              {reviewWarning}
            </div>
          </div>
        )}

        {/* Question Card */}
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-6 sm:p-8 shadow-sm">
          <AnimatePresence mode="wait">
            <QuestionStepCard
              key={currentQ.id}
              question={currentQ}
              value={answers[currentQ.id]}
              onChange={handleAnswerChange}
            />
          </AnimatePresence>

          {/* Optional specific companies input on Step 3 */}
          {currentQ.id === 'q3_company_types' && (
            <div className="pt-4 border-t border-slate-100 space-y-2 mt-4">
              <label className="text-xs font-bold text-slate-600">
                Optional: Any specific dream companies you are targeting?
              </label>
              <input
                type="text"
                placeholder="e.g. Google, Microsoft, Zoho, TCS Ninja, Amazon (Optional)"
                value={answers.q3_specific_companies || ''}
                onChange={(e) => handleAnswerChange(answers.q3_company_types)}
                onBlur={(e) => {
                  const updated = { ...answers, q3_specific_companies: e.target.value };
                  setAnswers(updated);
                  autoSave(updated, currentStepIndex);
                }}
                className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-900 outline-none focus:border-violet-600 focus:bg-white"
              />
              <p className="text-[10px] text-slate-400">
                Note: Named company hiring patterns use standard verified templates; custom company statistics show &ldquo;Source pending&rdquo;.
              </p>
            </div>
          )}

          <div className="flex items-center justify-between pt-8 mt-6 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
              <span>Answers saved automatically</span>
            </div>

            <button
              type="button"
              onClick={handleNext}
              disabled={isSubmitting}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-xs shadow-md shadow-violet-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <span>{isLastQuestion ? (isSubmitting ? 'Building Timeline...' : 'Build Placement Plan') : 'Next Question'}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
