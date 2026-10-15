'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function QuizPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/roadmap');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
    </div>
  );
}
