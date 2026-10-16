'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore, useAuthStore } from '@career-bridge/store';
import { onboardingService } from '@/features/onboarding/services/onboardingService';
import { OnboardingQuestion, OnboardingResultPayload, Under18Consent } from '@career-bridge/types';
import { SCHOOL_QUESTIONS } from '@/data/onboardingQuestions';
import { QuestionStepCard } from '@/features/onboarding/components/QuestionStepCard';
import { 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  FileText,
  Building,
  Briefcase,
  Layers,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MentorMeetingModal } from '@/features/onboarding/components/MentorMeetingModal';

export default function SchoolOnboardingPage() {
  const router = useRouter();
  const { profile, fetchProfile } = useUserStore();
  const { isAuthenticated, isInitialized } = useAuthStore();

  const [questions, setQuestions] = useState<OnboardingQuestion[]>(SCHOOL_QUESTIONS);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({
    q1_subjects: ['Maths', 'Computer Science'],
    q2_languages: ['Python'],
    q3_comfort: 'a_little',
    q4_enjoyment: ['solving puzzles', 'building apps'],
    q5_fields: ['AI and data', 'software'],
    q6_work_env: 'computers',
    q7_priority: 'high-paying jobs',
  });

  // Under-18 Consent state
  const [consent, setConsent] = useState<Under18Consent>({
    isUnder18: true,
    studentConsent: true,
    parentConsent: false,
    parentName: '',
    parentEmail: '',
    parentPhone: '',
  });
  const [showUnder18Modal, setShowUnder18Modal] = useState(false);

  // Flow State
  const [startTime] = useState(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<OnboardingResultPayload | null>(null);
  const [selectedBranchTab, setSelectedBranchTab] = useState<'primary' | 'secondary'>('primary');
  const [reviewWarning, setReviewWarning] = useState<string | null>(null);
  const [showMeetingModal, setShowMeetingModal] = useState(false);

  const emailKey = profile?.email ? profile.email.toLowerCase().trim() : 'guest';

  // Auth & Saved Progress
  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.replace('/login');
      return;
    }
    if (!profile) {
      fetchProfile();
    }

    // Try restoring saved progress
    const saved = onboardingService.getSavedProgress(emailKey, 'school');
    if (saved && saved.answers) {
      setAnswers(saved.answers);
      if (typeof saved.currentStep === 'number' && saved.currentStep < SCHOOL_QUESTIONS.length) {
        setCurrentStepIndex(saved.currentStep);
      }
      if (saved.under18Consent) {
        setConsent(saved.under18Consent);
      }
    }
  }, [isInitialized, isAuthenticated, profile, fetchProfile, router, emailKey]);

  // Auto-save on answer update
  const autoSave = useCallback((newAnswers: Record<string, any>, stepIdx: number) => {
    onboardingService.saveProgress(emailKey, 'school', stepIdx, newAnswers, consent);
  }, [emailKey, consent]);

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
      // If student is under 18, ensure consent is noted
      if (consent.isUnder18 && !consent.parentConsent) {
        setShowUnder18Modal(true);
        return;
      }
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
        'school',
        answers,
        durationSeconds,
        consent
      );

      if (payload.reliabilityStatus === 'SUSPICIOUS_SPEED' || payload.reliabilityStatus === 'CONTRADICTORY') {
        setReviewWarning(payload.reviewReason || 'Please review your answers for consistency.');
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

  // ── RESULT SCREEN (Once Evaluation is complete) ─────────────────────────────
  if (result) {
    const activeSuggestion =
      selectedBranchTab === 'primary' ? result.primarySuggestion : result.secondarySuggestion || result.primarySuggestion;
    const insight = activeSuggestion.insight;

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900 py-12 px-4 sm:px-6 max-w-4xl mx-auto space-y-8">
        
        {/* Banner */}
        <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-emerald-600 via-teal-600 to-blue-700 text-white shadow-xl space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold tracking-wider uppercase backdrop-blur-sm">
              ✨ 12th Standard Career Discovery
            </span>
            <span className="text-xs text-emerald-100 font-semibold">
              Confidence: {result.confidence}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black leading-tight">
            Suggested Engineering Branches for You
          </h1>
          <p className="text-emerald-100 text-sm max-w-2xl leading-relaxed">
            Based on your subject strengths, problem-solving style, and curiosity. These are initial suggestions to guide your college exploration—not rigid labels.
          </p>

          {/* Toggle Tabs between Top 2 Branches */}
          <div className="flex items-center gap-3 pt-3 flex-wrap">
            <button
              onClick={() => setSelectedBranchTab('primary')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedBranchTab === 'primary'
                  ? 'bg-white text-emerald-900 shadow-md font-black'
                  : 'bg-white/15 text-white hover:bg-white/25'
              }`}
            >
              ⭐ Primary: {result.primarySuggestion.title.split('(')[0].trim()}
            </button>
            {result.secondarySuggestion && (
              <button
                onClick={() => setSelectedBranchTab('secondary')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedBranchTab === 'secondary'
                    ? 'bg-white text-emerald-900 shadow-md font-black'
                    : 'bg-white/15 text-white hover:bg-white/25'
                }`}
              >
                ⇄ Alternate: {result.secondarySuggestion.title.split('(')[0].trim()}
              </button>
            )}
          </div>
        </div>

        {/* Selected Branch Overview */}
        <div className="bg-white border border-slate-200 rounded-[2rem] p-7 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest">
                {selectedBranchTab === 'primary' ? 'Top Recommendation' : 'Suggested Alternate Pathway'}
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-0.5">
                {activeSuggestion.title}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {activeSuggestion.subtitle}
              </p>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-xl self-start sm:self-auto">
              <span className="text-xs font-bold text-emerald-800">
                Suggested For You ✓
              </span>
            </div>
          </div>

          {/* Plain Reasons */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Why this branch was suggested:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeSuggestion.reasons.map((reason, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-700 font-medium leading-relaxed">{reason}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Branch Insight Card with Sources */}
          {insight && (
            <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Building size={14} /> Branch Insight Card
                </span>
                <span className="text-[11px] text-slate-400">
                  Curated Reference
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Briefcase size={13} className="text-blue-400" /> Typical Career Roles
                  </h4>
                  <p className="text-xs text-slate-200 font-semibold leading-relaxed">
                    {insight.typicalRoles.join(' · ')}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Layers size={13} className="text-violet-400" /> Core Engineering Skills
                  </h4>
                  <p className="text-xs text-slate-200 font-semibold leading-relaxed">
                    {insight.keySkills.join(' · ')}
                  </p>
                </div>
              </div>

              {/* Demand Statement with Source Verification */}
              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Demand & Employment Outlook
                  </span>
                  {insight.source ? (
                    <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                      <ShieldCheck size={12} /> Verified Data
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-amber-400">
                      Source Pending
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  &ldquo;{insight.demandOutlook}&rdquo;
                </p>
                <div className="text-[10px] text-slate-400 flex items-center gap-2 pt-1 border-t border-slate-700/60">
                  <span>Source: <strong className="text-slate-300">{insight.source || 'Source pending'}</strong></span>
                  {insight.sourceDate && <span>· {insight.sourceDate}</span>}
                </div>
              </div>
            </div>
          )}

          {/* Starting Work Path */}
          {result.workPath && result.workPath.length > 0 && (
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Starting Work Path: From 12th to Year-1 College
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {result.workPath.map((step, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100/60 px-2.5 py-0.5 rounded-full">
                        {step.period}
                      </span>
                      <span className="text-xs text-slate-400 font-bold">Step {idx + 1}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{step.title}</h4>
                    <ul className="space-y-1.5 pt-1">
                      {step.items.map((item, i) => (
                        <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                          <span className="text-emerald-500 font-black">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-white border border-slate-200 rounded-3xl shadow-sm">
          <div>
            <h4 className="text-base font-bold text-slate-900">Ready to start exploring?</h4>
            <p className="text-xs text-slate-500">Your dashboard is already primed with beginner courses for {activeSuggestion.title.split('(')[0].trim()}.</p>
          </div>
          <button
            onClick={handleProceedToDashboard}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-sm shadow-lg shadow-emerald-600/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
          >
            <span>Enter My Dashboard & Courses</span>
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
          assignedDomain={result.assignedDomain || activeSuggestion.title}
          assignedRole={result.assignedRole || activeSuggestion.title}
          onboardingStage="school"
        />

      </div>
    );
  }

  // ── QUESTIONNAIRE FLOW ─────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-10 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header Navigation & Progress Bar */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleBack}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft size={14} /> Back
            </button>
            <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-100/60 px-3 py-1 rounded-full">
              Step {currentStepIndex + 1} of {questions.length}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-600"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Warning Alert if review needed */}
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

          {/* Bottom Bar: Auto-save status + Next / Submit button */}
          <div className="flex items-center justify-between pt-8 mt-6 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Answers saved automatically</span>
            </div>

            <button
              type="button"
              onClick={handleNext}
              disabled={isSubmitting}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-md shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <span>{isLastQuestion ? (isSubmitting ? 'Evaluating...' : 'Discover My Branches') : 'Next Question'}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Under-18 Privacy Notice */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 text-[11px] text-slate-500 flex items-start gap-2.5">
          <ShieldCheck size={16} className="text-emerald-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Privacy for School Students:</strong> Career Bridge collects only self-reported learning preferences to suggest engineering tracks. We do not sell personal data or display unverified recruitment claims.
          </p>
        </div>

      </div>

      {/* Under-18 Consent Modal */}
      {showUnder18Modal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <ShieldCheck size={22} />
            </div>

            <h3 className="text-xl font-bold text-slate-900">
              Student & Parent / Guardian Notice
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed">
              As you are completing the 12th standard discovery flow, please confirm student consent and provide optional parent/guardian acknowledgement for educational guidance.
            </p>

            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consent.studentConsent}
                  onChange={(e) => setConsent({ ...consent, studentConsent: e.target.checked })}
                  className="rounded text-emerald-600 mt-1"
                />
                <span className="text-xs text-slate-700">
                  I agree to receive educational branch recommendations based on my answers.
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consent.parentConsent}
                  onChange={(e) => setConsent({ ...consent, parentConsent: e.target.checked })}
                  className="rounded text-emerald-600 mt-1"
                />
                <span className="text-xs text-slate-700">
                  I have shared this career planning tool with my parent or guardian.
                </span>
              </label>

              <div className="space-y-2 pt-2">
                <input
                  type="text"
                  placeholder="Parent / Guardian Name (Optional)"
                  value={consent.parentName || ''}
                  onChange={(e) => setConsent({ ...consent, parentName: e.target.value })}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setConsent({ ...consent, parentConsent: true });
                  setShowUnder18Modal(false);
                  submitAnswers();
                }}
                className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs"
              >
                Confirm & View Suggestions
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
