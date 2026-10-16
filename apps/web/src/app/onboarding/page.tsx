'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore, useAuthStore } from '@career-bridge/store';
import { onboardingService } from '@/features/onboarding/services/onboardingService';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  Compass, 
  Target, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck,
  Clock
} from 'lucide-react';

export default function OnboardingStagePickerPage() {
  const router = useRouter();
  const { profile, fetchProfile } = useUserStore();
  const { isAuthenticated, isInitialized } = useAuthStore();
  const [selectedStage, setSelectedStage] = useState<'school' | 'early' | 'final' | null>(null);

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.replace('/login');
      return;
    }
    if (!profile) {
      fetchProfile();
    }
  }, [isInitialized, isAuthenticated, profile, fetchProfile, router]);

  const stages = [
    {
      id: 'school' as const,
      badge: 'School Level',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      title: 'I am in 12th Standard',
      tagline: 'Discover the right engineering branch for you',
      icon: GraduationCap,
      color: 'from-emerald-500 to-teal-600',
      shadowColor: 'hover:shadow-emerald-500/15 border-emerald-100 hover:border-emerald-500/50',
      description: 'Simple discovery questions to uncover your technical interests and suggest best-fit branches like CSE, ECE, AI & Data Science, or Mechanical.',
      highlights: [
        'Top 2 suggested engineering branches with clear reasons',
        'Pre-college roadmap & Year-1 foundation preparation',
        'Branch insight cards with verified industry sources',
      ],
      route: '/onboarding/school',
    },
    {
      id: 'early' as const,
      badge: '1st & 2nd Year',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      title: 'I am in 1st or 2nd Year of College',
      tagline: 'Fix your technical domain & build your roadmap',
      icon: Compass,
      color: 'from-blue-600 to-indigo-600',
      shadowColor: 'hover:shadow-blue-500/15 border-blue-100 hover:border-blue-500/50',
      description: 'Choose between Web, AI/Data, Cloud/DevOps, Cybersecurity, or Design. We pre-select your primary domain roadmap and pre-populate your courses.',
      highlights: [
        'Fix 1 Primary Domain + 1 Alternate Domain suggestion',
        'Beginner-to-intermediate personalized roadmap',
        'Dashboard automatically loaded with foundational courses',
      ],
      route: '/onboarding/early',
    },
    {
      id: 'final' as const,
      badge: '3rd & 4th Year',
      badgeColor: 'bg-violet-50 text-violet-700 border-violet-200',
      title: 'I am in 3rd or 4th Year of College',
      tagline: 'Placement-focused time-boxed preparation plan',
      icon: Target,
      color: 'from-violet-600 to-purple-700',
      shadowColor: 'hover:shadow-violet-500/15 border-violet-100 hover:border-violet-500/50',
      description: 'Skip beginner lessons. Work backwards from your campus recruitment month with targeted DSA, Aptitude, Resume ATS audits, and Mock Interview schedules.',
      highlights: [
        'Working-backwards weekly timeline to your placement month',
        'Company-type prep patterns (Product, IT Services, Startups)',
        'Direct access to weekly proctored tests & mock practice',
      ],
      route: '/onboarding/final',
    },
  ];

  const handleSelectStage = (stageId: 'school' | 'early' | 'final', route: string) => {
    setSelectedStage(stageId);
    if (profile?.email) {
      localStorage.setItem(`cb_onboarding_stage_${profile.email.toLowerCase().trim()}`, stageId);
    }
    router.push(route);
  };

  const userName = profile?.name ? profile.name.split(' ')[0] : 'there';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Subtle Blobs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-10 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold tracking-wide">
            <Sparkles size={14} className="text-blue-600" />
            <span>Personalized Career Launchpad</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Welcome, <span className="text-gradient">{userName}</span>! Select Your Stage
          </h1>

          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Career Bridge adapts to where you are right now. Pick your current academic stage below to unlock a tailored, short questionnaire and your customized dashboard.
          </p>

          <div className="flex items-center justify-center gap-6 text-xs text-slate-500 pt-2 font-medium">
            <span className="flex items-center gap-1.5">
              <Clock size={14} className="text-blue-600" /> Takes 3–4 minutes
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-600" /> No wrong answers
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-violet-600" /> Auto-saves progress
            </span>
          </div>
        </div>

        {/* 3 Large Stage Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stages.map((stage) => {
            const IconComponent = stage.icon;
            const isSelected = selectedStage === stage.id;

            return (
              <motion.div
                key={stage.id}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                onClick={() => handleSelectStage(stage.id, stage.route)}
                className={`bg-white rounded-[2rem] p-6 sm:p-7 border-2 transition-all cursor-pointer flex flex-col justify-between space-y-6 shadow-sm hover:shadow-xl ${stage.shadowColor} ${
                  isSelected ? 'ring-4 ring-blue-500/20 border-blue-600 scale-[1.02]' : ''
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stage.color} text-white flex items-center justify-center shadow-lg shadow-black/5`}>
                      <IconComponent size={28} />
                    </div>
                    <span className={`text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${stage.badgeColor}`}>
                      {stage.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                      {stage.title}
                    </h3>
                    <p className="text-xs font-bold text-blue-600 mt-1">
                      {stage.tagline}
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {stage.description}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">What you get:</span>
                    <ul className="space-y-1.5">
                      {stage.highlights.map((h, i) => (
                        <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                          <CheckCircle2 size={13} className="text-emerald-500 shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button
                  type="button"
                  className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'bg-slate-100 hover:bg-blue-600 text-slate-700 hover:text-white'
                  }`}
                >
                  <span>Start My Questionnaire</span>
                  <ArrowRight size={14} />
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="text-center pt-4">
          <p className="text-xs text-slate-500 font-medium">
            Already know your path or changed academic years? You can re-adjust your stage anytime from your <span className="font-bold text-slate-700">Profile Settings</span>.
          </p>
        </div>

      </div>
    </div>
  );
}
