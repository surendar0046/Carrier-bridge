'use client';
import React from 'react';
import Link from 'next/link';
import { useAuthStore, useUserStore } from '@career-bridge/store';

export const Header: React.FC = () => {
  const { isAuthenticated, logout } = useAuthStore();
  const { profile } = useUserStore();

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-900/80 border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-3 font-extrabold text-xl tracking-tight">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            🌉
          </div>
          <span>Career<span className="text-blue-400">Bridge</span></span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <Link href="/dashboard" className="hover:text-white transition">Dashboard</Link>
          <Link href="/jobs" className="hover:text-white transition">Jobs</Link>
          <Link href="/mentor" className="hover:text-white transition">Mentors</Link>
          <Link href="/courses" className="hover:text-white transition">Courses</Link>
          <Link href="/resume" className="hover:text-white transition">Resume</Link>
          <Link href="/ai-copilot" className="text-blue-400 hover:text-blue-300 transition flex items-center gap-1">
            <span>✨ AI Copilot</span>
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link href="/profile" className="flex items-center gap-2">
                <img
                  src={profile?.avatar || 'https://ui-avatars.com/api/?name=User'}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full border border-slate-700 object-cover"
                />
                <span className="text-sm font-medium hidden sm:inline">{profile?.name || 'Account'}</span>
              </Link>
              <button
                onClick={logout}
                className="text-xs font-semibold px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm rounded-xl transition"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
