'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, useUserStore } from '@career-bridge/store';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isInitialized } = useAuthStore();
  const { profile, fetchProfile } = useUserStore();

  useEffect(() => {
    if (!isInitialized) return;

    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    if (!profile) {
      fetchProfile();
      return;
    }

    const roleLower = String(profile.role || '').toLowerCase();
    if (roleLower === 'professional') {
      router.replace('/professional');
      return;
    }

    const emailKey = (profile.email || '').toLowerCase().trim();
    const hasCompleted = emailKey
      ? localStorage.getItem(`cb_onboarding_completed_${emailKey}`) === 'true'
      : false;

    if (hasCompleted) {
      router.replace('/dashboard');
    } else {
      router.replace('/onboarding');
    }
  }, [isInitialized, isAuthenticated, profile, fetchProfile, router]);

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
