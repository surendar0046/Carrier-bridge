'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { useOfflineQueueStore, useAuthStore } from '@career-bridge/store';
import { ClearStaleAuth } from './ClearStaleAuth';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000,  // 10 min — reuse cached data across page switches
      gcTime: 30 * 60 * 1000,     // 30 min — keep data in memory longer
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: false,       // Don't re-fetch if data is still fresh
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  const { setOnline } = useOfflineQueueStore();
  const { initialize } = useAuthStore();

  useEffect(() => {
    // 1. Initialize Auth Listener
    const unsubscribe = initialize();

    // 2. Network Listeners
    const handleOnline  = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener('online',  handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      unsubscribe();
      window.removeEventListener('online',  handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ClearStaleAuth />
      {children}
    </QueryClientProvider>
  );
}
