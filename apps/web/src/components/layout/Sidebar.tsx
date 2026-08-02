'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { label: 'Overview', href: '/dashboard', icon: '📊' },
    { label: 'Job Matching', href: '/jobs', icon: '💼' },
    { label: '1-on-1 Mentors', href: '/mentor', icon: '👨‍🏫' },
    { label: 'Learning Paths', href: '/courses', icon: '📚' },
    { label: 'ATS Resume Builder', href: '/resume', icon: '📄' },
    { label: 'Niral AI Copilot', href: '/ai-copilot', icon: '🤖' },
    { label: 'My Profile', href: '/profile', icon: '👤' },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 min-h-[calc(100vh-4rem)] p-4 hidden md:block">
      <div className="space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition ${
                isActive
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
};
