'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[AppError]', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-8 text-slate-200">
      <div className="text-center max-w-md mx-auto space-y-6">
        {/* Icon */}
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-2xl flex items-center justify-center text-3xl">
          ⚠️
        </div>

        {/* Message */}
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-white">Page crashed</h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            {error?.message || 'An unexpected error occurred while loading this page.'}
          </p>
          {error?.digest && (
            <p className="text-[11px] text-slate-600 font-mono mt-2">
              Ref: {error.digest}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold rounded-xl text-sm hover:opacity-90 transition-opacity"
          >
            Try Again
          </button>
          <Link
            href="/dashboard"
            className="px-6 py-2.5 bg-white/5 border border-white/10 text-slate-300 font-bold rounded-xl text-sm hover:bg-white/10 transition-all"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
