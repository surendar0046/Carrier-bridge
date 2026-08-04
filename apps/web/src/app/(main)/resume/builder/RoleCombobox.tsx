'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ROLES } from './useResumeStore';

interface RoleComboboxProps {
  value: string;
  onChange: (value: string) => void;
  /** Optional extra CSS class for the outer wrapper */
  className?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Visual style variant */
  variant?: 'light' | 'dark';
}

// Category labels — match the comment prefixes in ROLES
const CATEGORY_MAP: { label: string; test: (r: string) => boolean }[] = [
  { label: '🖥️ Software Engineering',     test: r => ['Software Engineer','Frontend','Backend','Full Stack','Mobile','Flutter','React Native','Embedded','Firmware','Game','Graphics','Blockchain','Web3','Smart Contract'].some(k => r.includes(k)) },
  { label: '☁️ Cloud & Infrastructure',   test: r => ['Cloud','SRE','DevOps','Platform','Infrastructure','Systems Administrator','Linux','Network','Storage','Kubernetes','Terraform'].some(k => r.includes(k)) },
  { label: '🔐 Cybersecurity',             test: r => ['Cybersecurity','SOC','Security','Penetration','Ethical','Red Team','Blue Team','Threat','Incident','Malware','GRC','Compliance','IAM','SIEM','Vulnerability','Forensic'].some(k => r.includes(k)) },
  { label: '📊 Data & Analytics',          test: r => ['Data Scientist','Data Engineer','Data Analyst','Business Intelligence','BI Developer','Analytics Engineer','Data Architect','Database','DBA','ETL','Data Warehouse','Quantitative','Statistical','Decision Scientist'].some(k => r.includes(k)) },
  { label: '🤖 AI & Machine Learning',     test: r => ['ML Engineer','AI Engineer','Deep Learning','NLP','Computer Vision','MLOps','Generative AI','LLM','AI Research','Reinforcement','Robotics','Speech'].some(k => r.includes(k)) },
  { label: '🎨 Design & Product',          test: r => ['UX','UI','Product Designer','Interaction','Visual','Motion','UX Researcher','Design System','Product Manager','Product Analyst','Growth Product'].some(k => r.includes(k)) },
  { label: '✅ QA & Testing',              test: r => ['QA','SDET','Automation Test','Performance Test','Manual QA'].some(k => r.includes(k)) },
  { label: '👔 Management & Leadership',   test: r => ['Engineering Manager','Director','VP of','CTO','Technical Lead','Tech Lead'].some(k => r.includes(k)) },
  { label: '⚡ Specialized & Emerging',    test: r => ['Solutions Architect','Enterprise Architect','Integration','API Developer','Developer Advocate','Technical Writer','Scrum','Agile Coach','IT Project','IT Support','Help Desk'].some(k => r.includes(k)) },
];

function getCategoryLabel(role: string): string {
  for (const cat of CATEGORY_MAP) {
    if (cat.test(role)) return cat.label;
  }
  return '🔧 Other';
}

export default function RoleCombobox({
  value,
  onChange,
  className = '',
  placeholder = 'Search or type your role...',
  variant = 'light',
}: RoleComboboxProps) {
  const [query, setQuery] = useState(value || '');
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // ── Filter logic ─────────────────────────────────────────────────────────
  const filtered = query.trim()
    ? ROLES.filter(r => r.toLowerCase().includes(query.toLowerCase()))
    : ROLES;

  // Group into categories
  const grouped = filtered.reduce<Record<string, string[]>>((acc, role) => {
    const cat = getCategoryLabel(role);
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(role);
    return acc;
  }, {});

  // Flat list for keyboard navigation
  const flatList = Object.values(grouped).flat();

  // ── Sync external value → input ──────────────────────────────────────────
  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  // ── Close on outside click ────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
        // Commit what the user typed as custom role if not in list
        if (query && query !== value) onChange(query);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [query, value, onChange]);

  // ── Scroll highlighted item into view ─────────────────────────────────────
  useEffect(() => {
    if (listRef.current) {
      const item = listRef.current.querySelector(`[data-idx="${highlighted}"]`) as HTMLElement;
      item?.scrollIntoView({ block: 'nearest' });
    }
  }, [highlighted]);

  const select = useCallback((role: string) => {
    setQuery(role);
    onChange(role);
    setOpen(false);
    setHighlighted(0);
  }, [onChange]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open && (e.key === 'ArrowDown' || e.key === 'Enter')) {
      setOpen(true);
      return;
    }
    if (e.key === 'ArrowDown') {
      setHighlighted(h => Math.min(h + 1, flatList.length - 1));
    } else if (e.key === 'ArrowUp') {
      setHighlighted(h => Math.max(h - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (flatList[highlighted]) {
        select(flatList[highlighted]);
      } else if (query.trim()) {
        // Allow custom role
        onChange(query.trim());
        setOpen(false);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  // ── Styles ────────────────────────────────────────────────────────────────
  const isDark = variant === 'dark';
  const inputCls = isDark
    ? 'w-full bg-slate-950 border border-slate-700 hover:border-slate-600 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all pr-10'
    : 'w-full bg-white border border-slate-300 hover:border-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-all pr-10';

  const dropdownCls = isDark
    ? 'absolute z-50 mt-1.5 w-full bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden'
    : 'absolute z-50 mt-1.5 w-full bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden';

  const itemBase = 'px-4 py-2 text-sm cursor-pointer transition-colors rounded-lg mx-1';
  const itemActiveLight = 'bg-blue-50 text-blue-700 font-semibold';
  const itemActiveDark = 'bg-blue-600/20 text-blue-300 font-semibold';
  const itemDefault = isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-50';

  let globalIdx = 0;

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      {/* Input */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          placeholder={placeholder}
          className={inputCls}
          onFocus={() => { setOpen(true); setHighlighted(0); }}
          onChange={(e) => {
            setQuery(e.target.value);
            onChange(e.target.value); // allow free text
            setOpen(true);
            setHighlighted(0);
          }}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          spellCheck={false}
        />
        {/* Chevron icon */}
        <button
          type="button"
          tabIndex={-1}
          onClick={() => { setOpen(o => !o); inputRef.current?.focus(); }}
          className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'} transition-transform ${open ? 'rotate-180' : ''}`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>

      {/* Dropdown */}
      {open && (
        <div className={dropdownCls}>
          {/* Custom role hint */}
          {query.trim() && !ROLES.includes(query.trim()) && (
            <div
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold cursor-pointer border-b ${isDark ? 'border-slate-700 text-emerald-400 hover:bg-slate-800' : 'border-slate-100 text-emerald-700 hover:bg-emerald-50'} transition-colors`}
              onMouseDown={(e) => { e.preventDefault(); select(query.trim()); }}
            >
              <span className="text-base">✏️</span>
              Use custom role: <strong>"{query.trim()}"</strong>
            </div>
          )}

          {/* Scrollable role list */}
          <ul ref={listRef} className="max-h-72 overflow-y-auto py-2">
            {Object.entries(grouped).length === 0 ? (
              <li className={`px-4 py-3 text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                No matching roles — your custom entry will be used.
              </li>
            ) : (
              Object.entries(grouped).map(([cat, roles]) => (
                <li key={cat}>
                  {/* Category header */}
                  <div className={`px-4 pt-3 pb-1 text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {cat}
                  </div>
                  {roles.map((role) => {
                    const idx = globalIdx++;
                    const isActive = idx === highlighted || role === value;
                    return (
                      <div
                        key={role}
                        data-idx={idx}
                        onMouseEnter={() => setHighlighted(idx)}
                        onMouseDown={(e) => { e.preventDefault(); select(role); }}
                        className={`${itemBase} ${isActive ? (isDark ? itemActiveDark : itemActiveLight) : itemDefault}`}
                      >
                        {role}
                      </div>
                    );
                  })}
                </li>
              ))
            )}
          </ul>

          {/* Footer */}
          <div className={`px-4 py-2 text-[10px] border-t ${isDark ? 'border-slate-700 text-slate-600' : 'border-slate-100 text-slate-400'}`}>
            {ROLES.length} roles available · Type anything to use a custom role
          </div>
        </div>
      )}
    </div>
  );
}
