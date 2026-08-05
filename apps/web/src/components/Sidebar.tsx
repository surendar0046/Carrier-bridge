'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUserStore } from '@career-bridge/store';

// ── Student Navigation ──────────────────────────────────────────────────────
const STUDENT_NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { href: '/practice', label: 'Practice', icon: '⚡' },
  { href: '/jobs', label: 'Job Board', icon: '💼' },
  { href: '/courses', label: 'Learning', icon: '🎓' },
  { href: '/resume', label: 'Resume AI', icon: '📄' },
  { href: '/ai-copilot', label: 'Niral AI', icon: '✨' },
  { href: '/profile', label: 'Profile', icon: '👤' },
];

// ── Professional Navigation ─────────────────────────────────────────────────
const PROFESSIONAL_NAV = [
  { href: '/professional', label: 'Pro Dashboard', icon: '🏠' },
  { href: '/professional/forum', label: 'Pro Discussion Forum', icon: '💬' },
  { href: '/professional/mock-interview', label: 'AI Mock Interview', icon: '🎙️' },
  { href: '/professional/resources', label: 'Resources', icon: '📚' },
  { href: '/professional/analytics', label: 'Insights & Analytics', icon: '📈' },
  { href: '/professional/reputation', label: 'Reputation & Badges', icon: '⭐' },
  { href: '/ai-copilot', label: 'Niral AI', icon: '✨' },
  { href: '/profile', label: 'Profile', icon: '👤' },
];

// ── Notification Popup ──────────────────────────────────────────────────────
const NOTIFICATIONS = [
  { id: 1, type: 'answer', msg: 'Ravi Kumar replied to your solution post', time: '5m ago', read: false, icon: '💬' },
  { id: 2, type: 'badge', msg: 'You earned the "Answer Guru" badge! 🏆', time: '2h ago', read: false, icon: '🎖️' },
  { id: 3, type: 'upvote', msg: 'Your LeetCode system design post got 50 upvotes!', time: '4h ago', read: true, icon: '📌' },
  { id: 4, type: 'mention', msg: 'Priya Sharma requested a LinkedIn connection', time: '1d ago', read: true, icon: '🔔' },
  { id: 5, type: 'test', msg: 'Candidate submitted a resume for AI Mock Interview', time: '2d ago', read: true, icon: '🎙️' },
];

// ── Search Results ──────────────────────────────────────────────────────────
const SEARCH_RESULTS = [
  { label: 'Pro Discussion Forum (LeetCode Solutions)', href: '/professional/forum', icon: '💬', category: 'Forum' },
  { label: 'Niral AI Resume Mock Interview', href: '/professional/mock-interview', icon: '🎙️', category: 'Mock Interview' },
  { label: 'Share a Pro Resource', href: '/professional/resources/new', icon: '📤', category: 'Resources' },
  { label: 'Pro Analytics & Insights', href: '/professional/analytics', icon: '📈', category: 'Analytics' },
  { label: 'Leaderboard & Reputation', href: '/professional/reputation', icon: '🏆', category: 'Reputation' },
  { label: 'Pro Dashboard', href: '/professional', icon: '🏠', category: 'Dashboard' },
  { label: 'AI Copilot', href: '/ai-copilot', icon: '✨', category: 'AI' },
  { label: 'Job Board', href: '/jobs', icon: '💼', category: 'Jobs' },
  { label: 'Resume Builder', href: '/resume/builder', icon: '📄', category: 'Resume' },
];

function NotificationPanel({ onClose }: { onClose: () => void }) {
  const [items, setItems] = useState(NOTIFICATIONS);
  const unread = items.filter(n => !n.read).length;

  const markAll = () => setItems(prev => prev.map(n => ({ ...n, read: true })));

  return (
    <div className="absolute top-full right-0 mt-3 w-80 bg-white border border-slate-200 rounded-3xl shadow-2xl shadow-slate-200/80 z-50 overflow-hidden animate-fade-in">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <span className="font-black text-slate-800 text-sm">
          Notifications {unread > 0 && <span className="ml-2 text-[10px] font-black text-white bg-blue-500 rounded-full px-2 py-0.5">{unread}</span>}
        </span>
        {unread > 0 && <button onClick={markAll} className="text-[11px] font-bold text-blue-600 hover:text-blue-700">Mark all read</button>}
      </div>
      <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
        {items.map(n => (
          <div key={n.id} className={`flex items-start gap-3 px-5 py-4 hover:bg-slate-50 transition-all cursor-pointer ${!n.read ? 'bg-blue-50/50' : ''}`}>
            <span className="text-xl flex-shrink-0 mt-0.5">{n.icon}</span>
            <div className="flex-1 min-w-0">
              <p className={`text-xs leading-snug ${!n.read ? 'font-bold text-slate-800' : 'font-semibold text-slate-500'}`}>{n.msg}</p>
              <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
            </div>
            {!n.read && <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />}
          </div>
        ))}
      </div>
      <div className="px-5 py-3 border-t border-slate-100">
        <button onClick={onClose} className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors w-full text-center">Close</button>
      </div>
    </div>
  );
}

function SearchPanel({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const results = query.trim()
    ? SEARCH_RESULTS.filter(r => r.label.toLowerCase().includes(query.toLowerCase()))
    : SEARCH_RESULTS.slice(0, 5);

  return (
    <div className="absolute top-full right-0 mt-3 w-96 bg-white border border-slate-200 rounded-3xl shadow-2xl shadow-slate-200/80 z-50 overflow-hidden animate-fade-in">
      <div className="p-4 border-b border-slate-100">
        <div className="relative">
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search pages, features…"
            className="w-full border border-slate-200 rounded-2xl px-4 py-2.5 text-sm pl-9 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold">✕</button>
          )}
        </div>
      </div>
      <div className="max-h-72 overflow-y-auto py-2">
        {results.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs font-semibold">No results found</div>
        ) : (
          results.map(r => (
            <Link key={r.href} href={r.href} onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-all group">
              <span className="text-lg">{r.icon}</span>
              <div className="flex-1">
                <div className="text-sm font-semibold text-slate-700 group-hover:text-blue-700 transition-colors">{r.label}</div>
                <div className="text-[10px] text-slate-400">{r.category}</div>
              </div>
              <span className="text-slate-300 group-hover:text-blue-400 transition-colors text-xs">→</span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { profile } = useUserStore();
  const [showNotif, setShowNotif] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const roleLower = String(profile?.role || '').toLowerCase();
  const isProfessional =
    roleLower === 'professional' ||
    roleLower === 'mentor' ||
    (profile?.email || '').toLowerCase().includes('rajaprabhu') ||
    (profile?.name || '').toLowerCase().includes('rajaprabhu');
  const NAV = isProfessional ? PROFESSIONAL_NAV : STUDENT_NAV;
  const unreadCount = NOTIFICATIONS.filter(n => !n.read).length;

  // Close popups on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!(e.target as Element).closest('.notif-container') && !(e.target as Element).closest('.search-container')) {
        setShowNotif(false);
        setShowSearch(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Search + Notifications row */}
      <div className="px-4 pb-3 flex items-center gap-2">
        {/* Search */}
        <div className="search-container relative flex-1">
          <button
            onClick={() => { setShowSearch(v => !v); setShowNotif(false); }}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300 transition-all text-left group">
            <span className="text-slate-400 text-sm">🔍</span>
            <span className="text-xs text-slate-400 group-hover:text-slate-600 transition-colors flex-1">Search…</span>
            <span className="text-[10px] text-slate-300 font-mono hidden sm:block">⌘K</span>
          </button>
          {showSearch && <SearchPanel onClose={() => setShowSearch(false)} />}
        </div>

        {/* Notifications */}
        <div className="notif-container relative">
          <button
            onClick={() => { setShowNotif(v => !v); setShowSearch(false); }}
            className="relative w-10 h-10 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300 transition-all flex items-center justify-center">
            <span className="text-base">🔔</span>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          {showNotif && <NotificationPanel onClose={() => setShowNotif(false)} />}
        </div>
      </div>

      {/* Role badge */}
      {profile && (
        <div className="px-4 mb-3">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest ${isProfessional ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'bg-blue-50 text-blue-700 border border-blue-100'}`}>
            <span>{isProfessional ? '💼' : '🎓'}</span>
            {isProfessional ? 'Professional Mode' : 'Student Mode'}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto scrollbar-hide">
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-4">
          {isProfessional ? 'Pro Features' : 'Main Menu'}
        </div>
        {NAV.map(({ href, label, icon }) => {
          const active = pathname === href || (href !== '/professional' && href !== '/dashboard' && pathname?.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-200 group ${
                active
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20 translate-x-1'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}>
              <span className={`text-lg transition-transform group-hover:scale-110 ${active ? 'scale-110' : 'grayscale group-hover:grayscale-0'}`}>{icon}</span>
              <span className="flex-1">{label}</span>
            </Link>
          );
        })}
      </nav>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.15s ease-out forwards; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}
