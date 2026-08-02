'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/dashboard',   label: 'Dashboard',   icon: '🏠' },
  { href: '/practice',    label: 'Practice',    icon: '⚡' },
  { href: '/jobs',        label: 'Job Board',   icon: '💼' },
  { href: 'https://mentors.codingcoach.io/', label: 'Mentors', icon: '🤝', external: true },
  { href: '/courses',     label: 'Learning',    icon: '🎓' },
  { href: '/resume',      label: 'Resume AI',    icon: '📄' },
  { href: '/ai-copilot',  label: 'Niral AI',    icon: '✨' },
  { href: '/profile',     label: 'Profile',      icon: '👤' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 px-4 py-2 space-y-2 overflow-y-auto scrollbar-hide">
      <div className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4 ml-4">Main Menu</div>
      {NAV.map(({ href, label, icon, external }) => {
        const active = !external && pathname?.startsWith(href);
        const Component = external ? 'a' : Link;
        const extraProps = external ? { target: '_blank', rel: 'noopener noreferrer' } : {};

        return (
          <Component
            key={href}
            href={href}
            {...extraProps}
            className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 group ${
              active
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-600/20 translate-x-1'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span className={`text-lg transition-transform group-hover:scale-110 ${active ? 'scale-110' : 'grayscale group-hover:grayscale-0'}`}>{icon}</span>
            <span className="flex-1">{label}</span>
            {external && <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">↗</span>}
          </Component>
        );
      })}
    </nav>
  );
}
