'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useUserStore } from '@career-bridge/store';

export interface AlternativeRoleMatch {
  role: string;
  confidence: number;
  domain?: string;
  reasoning?: string;
}

export interface StudentCareerMatchState {
  hasCompletedQuiz: boolean;
  primaryRole: string | null;
  primaryConfidence: number;
  closeRoles: AlternativeRoleMatch[];
  activeRole: string | null;
  allMatchedRoles: string[];
  track: 'first_year' | 'fresher' | null;
  setActiveRole: (role: string | null) => void;
  resetFilter: () => void;
  isFilteredByRole: boolean;
}

// Map career roles to search keywords & synonyms for accurate job & course filtering
export const ROLE_KEYWORD_MAP: Record<string, string[]> = {
  'Full-Stack Developer': ['full stack', 'fullstack', 'mern', 'mean', 'react', 'node', 'software engineer', 'web developer'],
  'Frontend Developer': ['frontend', 'front-end', 'react', 'angular', 'vue', 'web developer', 'ui developer', 'javascript'],
  'Backend Developer': ['backend', 'back-end', 'node', 'java', 'python', 'spring', 'golang', 'api', 'microservices'],
  'DevOps Engineer': ['devops', 'cloud', 'kubernetes', 'docker', 'aws', 'azure', 'ci/cd', 'platform engineer', 'sre', 'terraform'],
  'Cloud Engineer': ['cloud', 'aws', 'azure', 'gcp', 'cloud architect', 'infrastructure', 'cloud platform'],
  'Data Scientist': ['data science', 'data scientist', 'machine learning', 'python', 'pandas', 'analytics', 'statistics'],
  'Data Analyst': ['data analyst', 'business analyst', 'bi analyst', 'sql', 'tableau', 'power bi', 'excel', 'analytics'],
  'Data Engineer': ['data engineer', 'etl', 'spark', 'kafka', 'data pipeline', 'hadoop', 'big data'],
  'AI/ML Engineer': ['ai', 'machine learning', 'deep learning', 'nlp', 'llm', 'computer vision', 'generative ai', 'pytorch', 'tensorflow'],
  'Cybersecurity Analyst': ['security', 'cybersecurity', 'cyber security', 'soc', 'infosec', 'network security', 'threat'],
  'Penetration Tester': ['penetration', 'pen test', 'ethical hacker', 'vapt', 'red team', 'offensive security', 'security'],
  'Mobile App Developer': ['mobile', 'android', 'ios', 'flutter', 'react native', 'kotlin', 'swift'],
  'UI/UX Designer': ['ui', 'ux', 'product design', 'figma', 'user experience', 'interaction design', 'wireframing'],
  'Product Manager': ['product manager', 'product management', 'product owner', 'program manager', 'agile'],
  'QA / Software Tester': ['qa', 'quality assurance', 'test engineer', 'sdet', 'automation testing', 'selenium'],
  'System Administrator': ['system administrator', 'sysadmin', 'linux', 'network engineer', 'infrastructure'],
  'Robotics Engineer': ['robotics', 'iot', 'embedded', 'hardware', 'arduino', 'raspberry pi'],
  'Game Developer': ['game developer', 'unity', 'unreal', 'c#', 'c++', 'graphics', 'shader'],
  'Blockchain Developer': ['blockchain', 'web3', 'solidity', 'smart contract', 'ethereum', 'crypto'],
};

export function getKeywordsForRole(roleName: string): string[] {
  if (!roleName) return [];
  if (ROLE_KEYWORD_MAP[roleName]) {
    return ROLE_KEYWORD_MAP[roleName];
  }
  // Fallback: split role name into tokens
  return [roleName.toLowerCase(), ...roleName.toLowerCase().split(/\s+/).filter(w => w.length > 2)];
}

export function useStudentCareerMatch(): StudentCareerMatchState {
  const { profile } = useUserStore();
  const [hasCompletedQuiz, setHasCompletedQuiz] = useState<boolean>(false);
  const [primaryRole, setPrimaryRole] = useState<string | null>(null);
  const [primaryConfidence, setPrimaryConfidence] = useState<number>(0);
  const [closeRoles, setCloseRoles] = useState<AlternativeRoleMatch[]>([]);
  const [activeRole, setActiveRoleState] = useState<string | null>(null);
  const [track, setTrack] = useState<'first_year' | 'fresher' | null>(null);

  const emailKey = useMemo(() => {
    return profile?.email ? profile.email.toLowerCase().trim() : '';
  }, [profile?.email]);

  const readPrefs = useCallback(() => {
    if (typeof window === 'undefined') return;

    // First check user-specific key
    let prefs: any = null;
    if (emailKey) {
      try {
        const stored = localStorage.getItem(`cb_prefs_${emailKey}`);
        if (stored) prefs = JSON.parse(stored);
      } catch {}
    }

    // Fallback to legacy global recommendation if not found under email
    if (!prefs?.recommendation) {
      try {
        const globalRec = localStorage.getItem('cb_recommendation');
        if (globalRec) {
          const parsed = JSON.parse(globalRec);
          prefs = {
            hasCompletedTest: true,
            recommendation: parsed,
            activeRole: parsed.role,
          };
        }
      } catch {}
    }

    const rec = prefs?.recommendation;
    const prime = rec?.role || prefs?.activeRole || 'Full-Stack Developer';
    setHasCompletedQuiz(true);
    setPrimaryRole(prime);
    setPrimaryConfidence(rec?.confidence || 96);
    setCloseRoles(rec?.closeRoles?.length ? rec.closeRoles : [
      { role: 'AI/ML Engineer', confidence: 93, domain: 'Artificial Intelligence & Machine Learning' },
      { role: 'Cloud Engineer', confidence: 91, domain: 'Cloud Architecture & DevOps' },
    ]);
    setTrack(prefs?.studentTrack || rec?.studentTrack || 'fresher');

    // Active role preference
    const currentActive = prefs?.activeRole || prime;
    setActiveRoleState(currentActive);
  }, [emailKey]);

  useEffect(() => {
    readPrefs();

    const handleRoleUpdate = (e: any) => {
      if (e?.detail) {
        setActiveRoleState(e.detail);
      } else {
        readPrefs();
      }
    };

    window.addEventListener('cb-active-role-changed', handleRoleUpdate);
    window.addEventListener('storage', readPrefs);

    return () => {
      window.removeEventListener('cb-active-role-changed', handleRoleUpdate);
      window.removeEventListener('storage', readPrefs);
    };
  }, [readPrefs]);

  const setActiveRole = useCallback((role: string | null) => {
    setActiveRoleState(role);
    if (typeof window !== 'undefined') {
      const storageKey = emailKey ? `cb_prefs_${emailKey}` : 'cb_guest_prefs';
      try {
        const stored = localStorage.getItem(storageKey);
        const prefs = stored ? JSON.parse(stored) : {};
        prefs.activeRole = role;
        localStorage.setItem(storageKey, JSON.stringify(prefs));

        // Keep global fallback aligned
        const globalStored = localStorage.getItem('cb_recommendation');
        if (globalStored) {
          const rec = JSON.parse(globalStored);
          if (role) rec.role = role;
          localStorage.setItem('cb_recommendation', JSON.stringify(rec));
        }
      } catch {}

      // Broadcast for real-time cross-tab & cross-component synchronization
      window.dispatchEvent(new CustomEvent('cb-active-role-changed', { detail: role }));
    }
  }, [emailKey]);

  const resetFilter = useCallback(() => {
    setActiveRole(null);
  }, [setActiveRole]);

  const allMatchedRoles = useMemo(() => {
    const list: string[] = [];
    if (primaryRole) list.push(primaryRole);
    closeRoles.forEach(r => {
      if (r.role && !list.includes(r.role)) list.push(r.role);
    });
    return list;
  }, [primaryRole, closeRoles]);

  return {
    hasCompletedQuiz,
    primaryRole,
    primaryConfidence,
    closeRoles,
    activeRole,
    allMatchedRoles,
    track,
    setActiveRole,
    resetFilter,
    isFilteredByRole: Boolean(activeRole),
  };
}
