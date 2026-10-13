'use client';

// Stale auth cleanup is no longer needed now that authSlice manages fast optimistic hydration
export function ClearStaleAuth() {
  return null;
}
