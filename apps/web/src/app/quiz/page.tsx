'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Target, 
  Briefcase, 
  GraduationCap, 
  ArrowRight,
  CheckCircle2,
  Zap,
  TrendingUp,
  Code2,
  Compass,
  Check,
  Search,
  Layers,
  Cpu,
  Shield,
  Palette
} from 'lucide-react';
import { useAuthStore, useUserStore } from '@career-bridge/store';
import { cn } from '@career-bridge/utils';
import { careerEngine } from '@career-bridge/ai';
const { getRecommendationForRole, ROLE_PROFILES } = careerEngine;
import type { CareerRecommendation } from '@career-bridge/types';

type Recommendation = CareerRecommendation;

const DOMAIN_CATEGORIES = [
  { id: 'all', label: 'All Roles', icon: Sparkles },
  { id: 'software', label: 'Software & Web', icon: Code2 },
  { id: 'ai', label: 'AI & Data Science', icon: Cpu },
  { id: 'cloud', label: 'Cloud & DevOps', icon: Layers },
  { id: 'security', label: 'Cybersecurity', icon: Shield },
  { id: 'design', label: 'UI/UX & Product', icon: Palette },
];

const CURATED_ROLES = [
  {
    role: 'Full-Stack Developer',
    category: 'software',
    domain: 'Software & Application Development',
    salary: '₹6L–₹18L',
    demand: 98,
    match: 97,
    icon: '⚡',
    badge: 'Most Popular',
    summary: 'Master frontend, backend APIs, and cloud deployment for high-growth tech firms.'
  },
  {
    role: 'AI/ML Engineer',
    category: 'ai',
    domain: 'Artificial Intelligence & Machine Learning',
    salary: '₹10L–₹30L',
    demand: 99,
    match: 96,
    icon: '🤖',
    badge: 'High Demand',
    summary: 'Build intelligent models, LLM systems, neural architectures, and data pipelines.'
  },
  {
    role: 'Cloud Engineer',
    category: 'cloud',
    domain: 'Cloud Architecture & DevOps',
    salary: '₹8L–₹22L',
    demand: 96,
    match: 94,
    icon: '☁️',
    badge: 'Fast Growing',
    summary: 'Architect scalable cloud infrastructure, microservices, and automated CI/CD.'
  },
  {
    role: 'DevOps Engineer',
    category: 'cloud',
    domain: 'Cloud Architecture & DevOps',
    salary: '₹8L–₹24L',
    demand: 97,
    match: 93,
    icon: '🔄',
    summary: 'Automate deployment pipelines, Kubernetes orchestration, and system reliability.'
  },
  {
    role: 'Data Scientist',
    category: 'ai',
    domain: 'Data Analytics & Intelligence',
    salary: '₹8L–₹25L',
    demand: 96,
    match: 95,
    icon: '📊',
    summary: 'Extract actionable insights, statistical models, and predictive analytics from big data.'
  },
  {
    role: 'Frontend Developer',
    category: 'software',
    domain: 'Software & Application Development',
    salary: '₹5L–₹15L',
    demand: 94,
    match: 95,
    icon: '💻',
    summary: 'Create fast, responsive, and beautiful modern web applications with React and Next.js.'
  },
  {
    role: 'Backend Developer',
    category: 'software',
    domain: 'Software & Application Development',
    salary: '₹6L–₹20L',
    demand: 96,
    match: 96,
    icon: '⚙️',
    summary: 'Design robust APIs, high-throughput microservices, databases, and secure backend systems.'
  },
  {
    role: 'Cybersecurity Analyst',
    category: 'security',
    domain: 'Cybersecurity & Infrastructure Protection',
    salary: '₹7L–₹20L',
    demand: 95,
    match: 93,
    icon: '🛡️',
    summary: 'Protect systems and networks against vulnerabilities, security threats, and unauthorized access.'
  },
  {
    role: 'UI/UX Designer',
    category: 'design',
    domain: 'Product Design & User Experience',
    salary: '₹5L–₹16L',
    demand: 92,
    match: 92,
    icon: '🎨',
    summary: 'Design intuitive interfaces, interactive prototypes, user journeys, and cohesive design systems.'
  },
  {
    role: 'Product Manager',
    category: 'design',
    domain: 'Product Leadership & Strategy',
    salary: '₹12L–₹35L',
    demand: 93,
    match: 91,
    icon: '🧭',
    summary: 'Define product vision, run agile discovery sprints, and lead cross-functional development.'
  },
  {
    role: 'Mobile App Developer',
    category: 'software',
    domain: 'Software & Application Development',
    salary: '₹6L–₹17L',
    demand: 93,
    match: 94,
    icon: '📱',
    summary: 'Build high-performance cross-platform mobile apps using Flutter, React Native, and iOS/Android.'
  },
  {
    role: 'Data Analyst',
    category: 'ai',
    domain: 'Data Analytics & Intelligence',
    salary: '₹5L–₹14L',
    demand: 94,
    match: 92,
    icon: '📈',
    summary: 'Analyze operational data, build SQL queries, and present dynamic business intelligence dashboards.'
  }
];

export default function QuizPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('Full-Stack Developer');
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);

  const { isAuthenticated, isInitialized } = useAuthStore();
  const { profile, fetchProfile, updateProfile, updateActiveRole } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    if (isInitialized && !isAuthenticated) {
      router.replace('/login');
    } else if (isAuthenticated && !profile) {
      fetchProfile();
    }
  }, [isAuthenticated, isInitialized, profile, fetchProfile, router]);

  // Load existing role preference or default to Full-Stack Developer
  useEffect(() => {
    let initialRole = 'Full-Stack Developer';
    if (typeof window !== 'undefined') {
      const emailKey = profile?.email ? profile.email.toLowerCase().trim() : '';
      if (emailKey) {
        try {
          const stored = localStorage.getItem(`cb_prefs_${emailKey}`);
          if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed.activeRole) initialRole = parsed.activeRole;
          }
        } catch {}
      }
      try {
        const globalRec = localStorage.getItem('cb_recommendation');
        if (globalRec) {
          const parsed = JSON.parse(globalRec);
          if (parsed.role) initialRole = parsed.role;
        }
      } catch {}
    }
    setSelectedRole(initialRole);
    setRecommendation(getRecommendationForRole(initialRole, 'fresher'));
  }, [profile?.email]);

  const handleSelectRole = (roleName: string) => {
    setSelectedRole(roleName);
    const rec = getRecommendationForRole(roleName, 'fresher');
    setRecommendation(rec);

    if (typeof window !== 'undefined') {
      const emailKey = profile?.email ? profile.email.toLowerCase().trim() : '';
      const prefs = {
        hasCompletedTest: true,
        studentTrack: 'fresher',
        recommendation: rec,
        activeRole: roleName,
      };
      if (emailKey) {
        localStorage.setItem(`cb_prefs_${emailKey}`, JSON.stringify(prefs));
        localStorage.setItem(`cb_test_completed_${emailKey}`, 'true');
      }
      localStorage.setItem('cb_guest_prefs', JSON.stringify(prefs));
      localStorage.setItem('cb_recommendation', JSON.stringify(rec));
      window.dispatchEvent(new CustomEvent('cb-active-role-changed', { detail: roleName }));
    }
  };

  const handleConfirmAndProceed = (target: 'roadmap' | 'dashboard') => {
    const roleChosen = selectedRole || 'Full-Stack Developer';
    const rec = recommendation || getRecommendationForRole(roleChosen, 'fresher');
    
    if (typeof window !== 'undefined') {
      const emailKey = profile?.email ? profile.email.toLowerCase().trim() : '';
      const prefs = {
        hasCompletedTest: true,
        studentTrack: 'fresher',
        recommendation: rec,
        activeRole: roleChosen,
      };
      if (emailKey) {
        localStorage.setItem(`cb_test_completed_${emailKey}`, 'true');
        localStorage.setItem(`cb_prefs_${emailKey}`, JSON.stringify(prefs));
      }
      localStorage.setItem('cb_guest_prefs', JSON.stringify(prefs));
      localStorage.setItem('cb_recommendation', JSON.stringify(rec));
      window.dispatchEvent(new CustomEvent('cb-active-role-changed', { detail: roleChosen }));
    }

    if (updateActiveRole) {
      updateActiveRole(roleChosen);
    }
    if (updateProfile) {
      updateProfile({ hasCompletedAssessment: true } as any).catch(() => {});
    }

    if (target === 'roadmap') {
      router.push('/roadmap');
    } else {
      const roleLower = String(profile?.role || '').toLowerCase();
      const isPro = roleLower === 'professional' || roleLower === 'mentor';
      router.push(isPro ? '/professional' : '/dashboard');
    }
  };

  if (!mounted || !isInitialized) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <div className="min-h-screen bg-[#020617]" />;
  }

  const filteredRoles = CURATED_ROLES.filter(r => {
    const matchesCategory = selectedCategory === 'all' || r.category === selectedCategory;
    const matchesSearch = !searchQuery.trim() || 
      r.role.toLowerCase().includes(searchQuery.toLowerCase()) || 
      r.domain.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex flex-col items-center justify-start p-4 md:p-8 relative overflow-x-hidden">
      {/* Background Glow */}
      <div className="fixed top-[-10%] left-[-10%] w-[45%] h-[45%] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-violet-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="w-full max-w-5xl relative z-10 py-6 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-bold">
            <Sparkles size={14} />
            <span>Instant Role Suggestion & Career Customization</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            Choose Your Target Career Role
          </h1>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Select your desired career path to instantly unlock personalized roadmaps, curated courses, weekly assessments, and job matches.
          </p>
        </div>

        {/* Category Pills & Search */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {DOMAIN_CATEGORIES.map(cat => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border",
                    isActive
                      ? "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/20"
                      : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                  )}
                >
                  <Icon size={14} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          <div className="relative max-w-md mx-auto">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search roles (e.g. AI Engineer, Full-Stack, Cloud)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Role Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredRoles.map(item => {
            const isSelected = selectedRole === item.role;
            return (
              <div
                key={item.role}
                onClick={() => handleSelectRole(item.role)}
                className={cn(
                  "p-5 rounded-2xl border transition-all cursor-pointer relative group flex flex-col justify-between space-y-3",
                  isSelected
                    ? "bg-slate-900 border-blue-500 shadow-xl shadow-blue-500/10 scale-[1.02]"
                    : "bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-850"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-xl">
                    {item.icon}
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/25">
                      {item.badge}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                    {item.role}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {item.domain}
                  </p>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {item.summary}
                </p>

                <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                  <span className="text-emerald-400 font-bold">{item.salary}</span>
                  <span className={cn(
                    "font-bold transition-colors flex items-center gap-1",
                    isSelected ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300"
                  )}>
                    {isSelected ? '✓ Selected' : 'Tap to select'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Role AI Insights Panel */}
        {recommendation && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 md:p-8 rounded-3xl bg-slate-900/90 border border-blue-500/30 shadow-2xl space-y-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-800">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-black tracking-widest text-blue-400">
                  Target Career Recommendation
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white">
                  {recommendation.role}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-black">
                  {recommendation.confidence}% Match Confidence
                </span>
                <span className="px-3.5 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-black">
                  Demand: {recommendation.demandScore}/100
                </span>
              </div>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed italic bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
              "{recommendation.reasoning}"
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800 space-y-2">
                <h4 className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                  <Zap size={14} /> Core Required Skills
                </h4>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {recommendation.strengths.map(s => (
                    <span key={s} className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800 space-y-2">
                <h4 className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
                  <Target size={14} /> Career Growth Outlook
                </h4>
                <p className="text-slate-300 text-xs leading-relaxed">
                  {recommendation.futureScope}
                </p>
              </div>
            </div>

            {/* Closest Alternative Roles */}
            {recommendation.closeRoles && recommendation.closeRoles.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="text-xs font-bold text-slate-400 flex items-center gap-2">
                  <TrendingUp size={14} className="text-violet-400" />
                  <span>Also Closely Related to Your Profile:</span>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {recommendation.closeRoles.map((alt, i) => (
                    <div
                      key={alt.role}
                      onClick={() => handleSelectRole(alt.role)}
                      className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800 hover:border-violet-500/50 cursor-pointer transition-colors flex items-center justify-between"
                    >
                      <div>
                        <div className="text-sm font-bold text-white">{alt.role}</div>
                        <div className="text-[11px] text-slate-500">{alt.domain}</div>
                      </div>
                      <span className="text-xs font-bold text-violet-400 bg-violet-500/10 px-2.5 py-1 rounded-lg border border-violet-500/20">
                        {alt.confidence}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
              <button
                onClick={() => handleConfirmAndProceed('roadmap')}
                className="w-full sm:flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-extrabold text-sm shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Generate Dynamic Roadmap for {selectedRole}</span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={() => handleConfirmAndProceed('dashboard')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-bold text-sm border border-slate-800 transition-colors cursor-pointer text-center"
              >
                Go to Dashboard →
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
