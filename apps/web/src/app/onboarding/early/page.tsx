'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore, useAuthStore } from '@career-bridge/store';
import { onboardingService } from '@/features/onboarding/services/onboardingService';
import { OnboardingQuestion, OnboardingResultPayload } from '@career-bridge/types';
import { EARLY_COLLEGE_QUESTIONS } from '@/data/onboardingQuestions';
import { QuestionStepCard } from '@/features/onboarding/components/QuestionStepCard';
import { 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  Compass, 
  CheckCircle2, 
  AlertCircle,
  BookOpen,
  ArrowRightCircle,
  Repeat
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MentorMeetingModal } from '@/features/onboarding/components/MentorMeetingModal';

export default function EarlyCollegeOnboardingPage() {
  const router = useRouter();
  const { profile, fetchProfile, updateActiveRole } = useUserStore();
  const { isAuthenticated, isInitialized } = useAuthStore();

  const [questions, setQuestions] = useState<OnboardingQuestion[]>(EARLY_COLLEGE_QUESTIONS);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({
    q1_branch: '1st Year - CSE',
    q2_interests: ['software_development', 'data_science_ai'],
    q3_enjoy_coding: 'love_it',
    q4_languages: ['Python', 'JavaScript / TypeScript'],
    q5_goal: 'internship',
    q6_hours: '6_to_10',
  });

  const [startTime] = useState(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<OnboardingResultPayload | null>(null);
  const [reviewWarning, setReviewWarning] = useState<string | null>(null);

  // Switch domain confirmation modal
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [pendingDomainSwitch, setPendingDomainSwitch] = useState<string | null>(null);
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

    const saved = onboardingService.getSavedProgress(emailKey, 'early');
    if (saved && saved.answers) {
      setAnswers(saved.answers);
      if (typeof saved.currentStep === 'number' && saved.currentStep < EARLY_COLLEGE_QUESTIONS.length) {
        setCurrentStepIndex(saved.currentStep);
      }
    }
  }, [isInitialized, isAuthenticated, profile, fetchProfile, router, emailKey]);

  const autoSave = useCallback((newAnswers: Record<string, any>, stepIdx: number) => {
    onboardingService.saveProgress(emailKey, 'early', stepIdx, newAnswers);
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
        'early',
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

  const handleConfirmSwitchDomain = (domainName: string, roleName: string) => {
    if (!result) return;
    const updated = {
      ...result,
      assignedDomain: domainName,
      assignedRole: roleName,
    };
    setResult(updated);
    updateActiveRole(roleName);
    setShowSwitchModal(false);
  };

  const handleProceedToDashboard = () => {
    setShowMeetingModal(true);
  };

  const handleFinalDashboard = () => {
    setShowMeetingModal(false);
    router.push('/dashboard');
  };

  // ── RESULT SCREEN (Primary Domain + Alternate Domain) ─────────────────────
  if (result) {
    const primary = result.primarySuggestion;
    const alternate = result.secondarySuggestion;

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900 py-12 px-4 sm:px-6 max-w-4xl mx-auto space-y-8">
        
        {/* Banner */}
        <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 text-white shadow-xl space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold tracking-wider uppercase backdrop-blur-sm">
              🧭 1st & 2nd Year Domain Launchpad
            </span>
            <span className="text-xs text-blue-100 font-semibold">
              Confidence: {result.confidence}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black leading-tight">
            Your Technical Domain is Set
          </h1>
          <p className="text-blue-100 text-sm max-w-2xl leading-relaxed">
            We have calibrated your primary learning path based on your branch, coding comfort, and goals. Your dashboard now opens with the corresponding beginner-to-intermediate curriculum.
          </p>
        </div>

        {/* Primary and Alternate Domain Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Primary Domain Card (Fixed) */}
          <div className="bg-white border-2 border-blue-600 rounded-[2rem] p-7 shadow-lg shadow-blue-500/5 space-y-5 flex flex-col justify-between relative">
            <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
              ★ Primary Selected Domain
            </div>

            <div className="space-y-3">
              <span className="text-[11px] font-bold text-blue-600 uppercase tracking-widest">
                Recommended Main Path
              </span>
              <h2 className="text-2xl font-black text-slate-900">
                {primary.title}
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {primary.subtitle}
              </p>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Why this domain fits you:
                </span>
                <ul className="space-y-1.5">
                  {primary.reasons.map((r, i) => (
                    <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-blue-600 shrink-0 mt-0.5" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900 font-bold flex items-center justify-between">
              <span>Target Role: {result.assignedRole}</span>
              <span className="text-[10px] font-black text-blue-600 uppercase">Pre-selected</span>
            </div>
          </div>

          {/* Alternate Domain Card */}
          {alternate && (
            <div className="bg-white border border-slate-200 rounded-[2rem] p-7 shadow-sm space-y-5 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Suggested Alternate
                </span>
                <h3 className="text-2xl font-black text-slate-900">
                  {alternate.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {alternate.subtitle}
                </p>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Why this is a strong alternate:
                  </span>
                  <ul className="space-y-1.5">
                    {alternate.reasons.map((r, i) => (
                      <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                        <CheckCircle2 size={14} className="text-violet-600 shrink-0 mt-0.5" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setPendingDomainSwitch(alternate.title);
                  setShowSwitchModal(true);
                }}
                className="w-full py-3 px-4 rounded-xl border border-slate-200 hover:border-violet-500 hover:bg-violet-50 text-slate-700 hover:text-violet-900 text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <Repeat size={14} />
                <span>Switch to {alternate.title.split(' ')[0]} Instead</span>
              </button>
            </div>
          )}

        </div>

        {/* Starting 3-Phase Work Path */}
        {result.workPath && (
          <div className="bg-white border border-slate-200 rounded-[2rem] p-7 shadow-sm space-y-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-500">
              Beginner-to-Intermediate Learning Progression
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {result.workPath.map((step, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-100/60 px-2 py-0.5 rounded-full">
                    {step.period}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900">{step.title}</h4>
                  <ul className="space-y-1 pt-1">
                    {step.items.map((it, i) => (
                      <li key={i} className="text-[11px] text-slate-600 flex items-start gap-1.5">
                        <span className="text-blue-500">•</span>
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-white border border-slate-200 rounded-3xl shadow-sm">
          <div>
            <h4 className="text-base font-bold text-slate-900">Your personalized roadmap is ready</h4>
            <p className="text-xs text-slate-500">We have loaded matching foundational courses directly onto your dashboard.</p>
          </div>
          <button
            onClick={handleProceedToDashboard}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-sm shadow-lg shadow-blue-600/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
          >
            <span>Open My Dashboard & Courses</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Switch Confirmation Modal */}
        {showSwitchModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">
                Switch Primary Domain?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                You are switching your primary dashboard track to <strong>{pendingDomainSwitch}</strong>. Your curriculum, roadmap, and course suggestions will update to match.
              </p>
              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowSwitchModal(false)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Keep Current
                </button>
                <button
                  type="button"
                  onClick={() => handleConfirmSwitchDomain(pendingDomainSwitch || '', pendingDomainSwitch || '')}
                  className="flex-1 py-3 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-500/20"
                >
                  Confirm Switch
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mentor Meeting Booking Modal */}
        <MentorMeetingModal
          isOpen={showMeetingModal}
          onClose={handleFinalDashboard}
          onProceedToDashboard={handleFinalDashboard}
          studentName={profile?.name || 'Student'}
          studentEmail={emailKey}
          assignedDomain={result.assignedDomain || primary.title}
          assignedRole={result.assignedRole || primary.title}
          onboardingStage="early"
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
            <span className="text-xs font-black uppercase tracking-wider text-blue-700 bg-blue-100/60 px-3 py-1 rounded-full">
              Step {currentStepIndex + 1} of {questions.length}
            </span>
          </div>

          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-600"
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

          <div className="flex items-center justify-between pt-8 mt-6 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span>Answers saved automatically</span>
            </div>

            <button
              type="button"
              onClick={handleNext}
              disabled={isSubmitting}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs shadow-md shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <span>{isLastQuestion ? (isSubmitting ? 'Generating Pathway...' : 'Fix My Domain') : 'Next Question'}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
