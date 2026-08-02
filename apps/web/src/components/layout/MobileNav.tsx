'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const MobileNav: React.FC = () => {
  const pathname = usePathname();

  const items = [
    { label: 'Home', href: '/dashboard', icon: '🏠' },
    { label: 'Jobs', href: '/jobs', icon: '💼' },
    { label: 'Copilot', href: '/ai-copilot', icon: '✨' },
    { label: 'Mentors', href: '/mentor', icon: '👨‍🏫' },
    { label: 'Courses', href: '/courses', icon: '📚' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-lg border-t border-slate-800 md:hidden">
      <div className="flex items-center justify-around h-16">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 text-xs font-medium ${
                isActive ? 'text-blue-400 font-semibold' : 'text-slate-400'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
