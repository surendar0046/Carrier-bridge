'use client';
import React, { useState, useRef, useEffect, memo, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useUserStore } from '@career-bridge/store';

const STUDENT_NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { href: '/practice', label: 'Practice', icon: '⚡' },
  { href: '/jobs', label: 'Job Board', icon: '💼' },
  { href: '/courses', label: 'Learning', icon: '🎓' },
  { href: '/resume', label: 'Resume AI', icon: '📄' },
  { href: '/mentor', label: 'Mentorship', icon: '👨‍🏫' },
  { href: '/ai-copilot', label: 'Niral AI', icon: '✨' },
  { href: '/profile', label: 'Profile', icon: '👤' },
];

const PROFESSIONAL_NAV = [
  { href: '/professional', label: 'Pro Dashboard', icon: '🏠' },
  { href: '/professional/forum', label: 'Pro Discussion Forum', icon: '💬' },
  { href: '/professional/mock-interview', label: 'AI Mock Interview', icon: '🎙️' },
  { href: '/professional/resources', label: 'Resources', icon: '📚' },
  { href: '/professional/analytics', label: 'Insights & Analytics', icon: '📈' },
  { href: '/professional/reputation', label: 'Reputation & Badges', icon: '⭐' },
  { href: '/mentor/sessions', label: 'Live Mentoring Sessions', icon: '👨‍🏫' },
  { href: '/ai-copilot', label: 'Niral AI', icon: '✨' },
  { href: '/profile', label: 'Profile', icon: '👤' },
];

const NOTIFICATIONS = [
  { id: 1, type: 'answer', msg: 'Ravi Kumar replied to your solution post', time: '5m ago', read: false, icon: '💬' },
  { id: 2, type: 'badge', msg: 'You earned the "Answer Guru" badge! 🏆', time: '2h ago', read: false, icon: '🎖️' },
  { id: 3, type: 'upvote', msg: 'Your LeetCode system design post got 50 upvotes!', time: '4h ago', read: true, icon: '📌' },
  { id: 4, type: 'mention', msg: 'Priya Sharma requested a LinkedIn connection', time: '1d ago', read: true, icon: '🔔' },
  { id: 5, type: 'test', msg: 'Candidate submitted a resume for AI Mock Interview', time: '2d ago', read: true, icon: '🎙️' },
];

const SEARCH_RESULTS = [
  { label: '1-on-1 Mentorship Booking', href: '/mentor', icon: '👨‍🏫', category: 'Mentors' },
  { label: 'My Mentorship Bookings', href: '/mentor/sessions', icon: '📅', category: 'Mentors' },
  { label: 'Pro Discussion Forum', href: '/professional/forum', icon: '💬', category: 'Forum' },
  { label: 'Niral AI Resume Mock Interview', href: '/professional/mock-interview', icon: '🎙️', category: 'Mock Interview' },
  { label: 'Share a Pro Resource', href: '/professional/resources/new', icon: '📤', category: 'Resources' },
  { label: 'Pro Analytics & Insights', href: '/professional/analytics', icon: '📈', category: 'Analytics' },
  { label: 'Leaderboard & Reputation', href: '/professional/reputation', icon: '🏆', category: 'Reputation' },
  { label: 'Pro Dashboard', href: '/professional', icon: '🏠', category: 'Dashboard' },
  { label: 'AI Copilot', href: '/ai-copilot', icon: '✨', category: 'AI' },
  { label: 'Job Board', href: '/jobs', icon: '💼', category: 'Jobs' },
  { label: 'Resume Builder', href: '/resume/builder', icon: '📄', category: 'Resume' },
];



function NotificationPanel({
  visible,
  anchorRef,
  onClose,
}: {
  visible: boolean;
  anchorRef: React.RefObject<HTMLButtonElement | null>;
  onClose: () => void;
}) {
  const [items, setItems] = useState(NOTIFICATIONS);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 320 });
  const unread = items.filter(n => !n.read).length;

  // Recompute position every time the panel becomes visible
  useEffect(() => {
    if (visible && anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      const vw = window.innerWidth;
      const W = 320;
      let left = rect.left;
      if (left + W > vw - 8) left = vw - W - 8;
      if (left < 8) left = 8;
      setPos({ top: rect.bottom + 8, left, width: Math.min(W, vw - 16) });
    }
  }, [visible, anchorRef]);

  const markAll = useCallback(() => {
    setItems(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  return (
    <>
      {/* Backdrop — only interactive when visible */}
      <div
        onClick={onClose}
        style={{
          display: visible ? 'block' : 'none',
          position: 'fixed', inset: 0, zIndex: 9998,
        }}
      />
      {/* Panel */}
      <div
        style={{
          display: visible ? 'block' : 'none',
          position: 'fixed',
          top: pos.top,
          left: pos.left,
          width: pos.width,
          zIndex: 9999,
        }}
        className="notif-panel rounded-3xl border border-slate-200 bg-white shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="font-black text-slate-800 text-sm">Notifications</span>
            {unread > 0 && (
              <span className="text-[10px] font-black text-white bg-blue-600 rounded-full px-2 py-0.5">{unread}</span>
            )}
          </div>
          {unread > 0 && (
            <button onClick={markAll} className="text-[11px] font-bold text-blue-600 hover:underline">
              Mark all read
            </button>
          )}
        </div>
        <div className="max-h-72 overflow-y-auto divide-y divide-slate-100" style={{ scrollbarWidth: 'thin' as const }}>
          {items.map(n => (
            <div
              key={n.id}
              onClick={() => setItems(prev => prev.map(item => item.id === n.id ? { ...item, read: true } : item))}
              className={`flex items-start gap-3.5 px-5 py-3.5 hover:bg-slate-50 cursor-pointer transition-colors ${!n.read ? 'bg-blue-50/50' : ''}`}
            >
              <span className="text-xl flex-shrink-0 mt-0.5">{n.icon}</span>
              <div className="flex-1 min-w-0">
                <p className={`text-xs leading-snug ${!n.read ? 'font-bold text-slate-800' : 'text-slate-500'}`}>{n.msg}</p>
                <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
              </div>
              {!n.read && <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-2" />}
            </div>
          ))}
        </div>
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{items.length} updates</span>
          <button onClick={onClose} className="text-xs font-bold text-slate-500 hover:text-slate-800 px-3 py-1 rounded-lg hover:bg-slate-200/50 transition-colors">
            Close
          </button>
        </div>
      </div>
    </>
  );
}

function SearchPanel({
  visible,
  anchorRef,
  onClose,
  onNavigate,
}: {
  visible: boolean;
  anchorRef: React.RefObject<HTMLButtonElement | null>;
  onClose: () => void;
  onNavigate?: () => void;
}) {
  const [query, setQuery] = useState('');
  const [pos, setPos] = useState({ top: 0, left: 0, width: 360 });
  const inputRef = useRef<HTMLInputElement>(null);

  // Recompute position and focus when becoming visible
  useEffect(() => {
    if (visible && anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      const vw = window.innerWidth;
      const W = 360;
      let left = rect.left;
      if (left + W > vw - 8) left = vw - W - 8;
      if (left < 8) left = 8;
      setPos({ top: rect.bottom + 8, left, width: Math.min(W, vw - 16) });
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [visible, anchorRef]);

  const qClean = query.trim().toLowerCase();
  const results = qClean
    ? SEARCH_RESULTS.filter(r =>
        r.label.toLowerCase().includes(qClean) ||
        r.category.toLowerCase().includes(qClean)
      )
    : SEARCH_RESULTS.slice(0, 5);

  return (
    <>
      <div
        onClick={onClose}
        style={{
          display: visible ? 'block' : 'none',
          position: 'fixed', inset: 0, zIndex: 9998,
        }}
      />
      <div
        style={{
          display: visible ? 'block' : 'none',
          position: 'fixed',
          top: pos.top,
          left: pos.left,
          width: pos.width,
          zIndex: 9999,
        }}
        className="search-panel rounded-3xl border border-slate-200 bg-white shadow-2xl overflow-hidden"
      >
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
        <div className="max-h-72 overflow-y-auto py-2" style={{ scrollbarWidth: 'thin' as const }}>
          {results.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-xs">No results found</div>
          ) : (
            results.map(r => (
              <Link key={r.href} href={r.href} onClick={() => { onClose(); onNavigate?.(); }}
                className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 group">
                <span className="text-lg">{r.icon}</span>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-slate-700 group-hover:text-blue-700">{r.label}</div>
                  <div className="text-[10px] text-slate-400">{r.category}</div>
                </div>
                <span className="text-slate-300 group-hover:text-blue-400 text-xs">→</span>
              </Link>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export const Sidebar = memo(function Sidebar({ onNavigate }: { onNavigate?: () => void } = {}) {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, updateProfile } = useUserStore();
  const [showNotif, setShowNotif] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const notifBtnRef = useRef<HTMLButtonElement>(null);
  const searchBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => { setPendingHref(null); }, [pathname]);

  const roleLower = String(profile?.role || '').toLowerCase();
  const isProfessional =
    roleLower === 'professional' ||
    roleLower === 'mentor' ||
    (profile?.email || '').toLowerCase().includes('rajaprabhu') ||
    (profile?.name || '').toLowerCase().includes('rajaprabhu') ||
    (profile?.email || '').toLowerCase().includes('shriraam') ||
    (profile?.name || '').toLowerCase().includes('shriraam') ||
    (profile?.email || '').toLowerCase().includes('shriram') ||
    (profile?.name || '').toLowerCase().includes('shriram');
  const NAV = isProfessional ? PROFESSIONAL_NAV : STUDENT_NAV;
  const unreadCount = NOTIFICATIONS.filter(n => !n.read).length;

  useEffect(() => {
    NAV.forEach(item => { try { router.prefetch(item.href); } catch {} });
  }, [NAV, router]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setShowNotif(false); setShowSearch(false); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleToggleMode = async () => {
    const nextRole = isProfessional ? 'student' : 'professional';
    if (typeof window !== 'undefined') {
      const emailLower = (profile?.email || '').toLowerCase().trim();
      localStorage.setItem(`cb_role_${emailLower}`, nextRole);
      localStorage.setItem('cb_active_mode', nextRole);
    }
    await updateProfile({ role: nextRole as any });
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="px-4 pb-3 flex items-center gap-2">
        <button
          ref={searchBtnRef}
          onClick={() => { setShowSearch(v => !v); setShowNotif(false); }}
          className={`flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-all text-left group ${
            showSearch ? 'border-blue-400 bg-white ring-2 ring-blue-100' : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300'
          }`}
        >
          <span className="text-slate-400 text-sm">🔍</span>
          <span className="text-xs text-slate-400 group-hover:text-slate-600 transition-colors flex-1">Search…</span>
          <span className="text-[10px] text-slate-300 font-mono hidden sm:block">⌘K</span>
        </button>

        <button
          ref={notifBtnRef}
          onClick={() => { setShowNotif(v => !v); setShowSearch(false); }}
          className={`relative w-10 h-10 rounded-xl border transition-all flex items-center justify-center ${
            showNotif ? 'border-blue-400 bg-blue-50 text-blue-600 ring-2 ring-blue-100' : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300'
          }`}
        >
          <span className="text-base">🔔</span>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-sm">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Always mounted — visibility toggled via display:none inside each panel */}
      <SearchPanel visible={showSearch} anchorRef={searchBtnRef} onClose={() => setShowSearch(false)} onNavigate={onNavigate} />
      <NotificationPanel visible={showNotif} anchorRef={notifBtnRef} onClose={() => setShowNotif(false)} />

      {profile && (
        <div className="px-4 mb-3">
          <button
            onClick={handleToggleMode}
            title="Click to switch between Professional Mode and Student Mode"
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all duration-200 group ${
              isProfessional
                ? 'bg-indigo-50 hover:bg-indigo-100/80 text-indigo-700 border border-indigo-200/80 shadow-sm'
                : 'bg-blue-50 hover:bg-blue-100/80 text-blue-700 border border-blue-200/80 shadow-sm'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm">{isProfessional ? '💼' : '🎓'}</span>
              <span>{isProfessional ? 'Professional Mode' : 'Student Mode'}</span>
            </div>
            <span className="text-[9px] font-bold opacity-60 group-hover:opacity-100 transition-opacity bg-white/90 px-1.5 py-0.5 rounded border border-slate-200/80">Switch ⇄</span>
          </button>
        </div>
      )}

      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto scrollbar-hide">
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-4">
          {isProfessional ? 'Pro Features' : 'Main Menu'}
        </div>
        {NAV.map(({ href, label, icon }) => {
          const active = pendingHref
            ? pendingHref === href
            : pathname === href || (href !== '/professional' && href !== '/dashboard' && pathname?.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              prefetch={true}
              scroll={false}
              onMouseEnter={() => { try { router.prefetch(href); } catch {} }}
              onPointerDown={() => { try { router.prefetch(href); } catch {} }}
              onClick={() => { setPendingHref(href); onNavigate?.(); }}
              className={`flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-150 group ${
                active
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20 translate-x-1'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span className={`text-lg transition-transform group-hover:scale-110 ${active ? 'scale-110' : 'grayscale group-hover:grayscale-0'}`}>{icon}</span>
              <span className="flex-1">{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
});
