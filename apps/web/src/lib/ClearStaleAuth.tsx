'use client';
import { useEffect } from 'react';

// One-time script to clear stale auth persisted state from localStorage
// This runs once on app boot and removes itself after clearing
export function ClearStaleAuth() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stale = localStorage.getItem('career-bridge-auth');
      if (stale) {
        try {
          const parsed = JSON.parse(stale);
          // If old format had isAuthenticated persisted, clear it
          if (parsed?.state?.isAuthenticated !== undefined) {
            localStorage.removeItem('career-bridge-auth');
          }
        } catch {
          localStorage.removeItem('career-bridge-auth');
        }
      }
    }
  }, []);

  return null;
}
