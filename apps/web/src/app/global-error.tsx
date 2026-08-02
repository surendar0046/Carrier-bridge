'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[GlobalError]', error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#020617' }}>
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '24px',
            color: '#e2e8f0',
            fontFamily: 'system-ui, sans-serif',
            padding: '32px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
            }}
          >
            ⚠️
          </div>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
              Something went wrong
            </h1>
            <p style={{ fontSize: '14px', color: '#64748b', maxWidth: '400px', lineHeight: 1.6 }}>
              {error?.message || 'An unexpected error occurred. Please try refreshing the page.'}
            </p>
            {error?.digest && (
              <p style={{ fontSize: '11px', color: '#334155', marginTop: '8px' }}>
                Error ID: {error.digest}
              </p>
            )}
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={reset}
              style={{
                background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
                color: '#fff',
                border: 'none',
                padding: '12px 28px',
                borderRadius: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Try Again
            </button>
            <button
              onClick={() => { window.location.href = '/login'; }}
              style={{
                background: 'rgba(255,255,255,0.05)',
                color: '#94a3b8',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '12px 28px',
                borderRadius: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Go to Login
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
