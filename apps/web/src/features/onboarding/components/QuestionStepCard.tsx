'use client';

import React from 'react';
import { OnboardingQuestion } from '@career-bridge/types';
import { motion } from 'framer-motion';
import { Check, ChevronRight } from 'lucide-react';

interface QuestionStepCardProps {
  question: OnboardingQuestion;
  value: any;
  onChange: (val: any) => void;
  onNext?: () => void;
}

export const QuestionStepCard: React.FC<QuestionStepCardProps> = ({
  question,
  value,
  onChange,
  onNext,
}) => {
  const isMulti = question.type === 'multi';

  const handleToggleOption = (optId: string) => {
    if (isMulti) {
      const currentList: string[] = Array.isArray(value) ? [...value] : [];
      if (optId === 'none') {
        onChange(['none']);
        return;
      }
      const filtered = currentList.filter((x) => x !== 'none');
      if (filtered.includes(optId)) {
        onChange(filtered.filter((x) => x !== optId));
      } else {
        onChange([...filtered, optId]);
      }
    } else {
      onChange(optId);
      // Auto-advance single-select questions for fluid UX if desired
    }
  };

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight">
          {question.questionText}
        </h2>
        {question.description && (
          <p className="text-sm text-slate-500 font-medium leading-relaxed">
            {question.description}
          </p>
        )}
      </div>

      {/* Single / Multi Options Grid */}
      {(question.type === 'single' || question.type === 'multi') && question.options && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {question.options.map((opt) => {
            const isSelected = isMulti
              ? Array.isArray(value) && value.includes(opt.id)
              : value === opt.id;

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleToggleOption(opt.id)}
                className={`w-full p-4 rounded-2xl border text-left transition-all duration-200 flex items-start gap-3.5 group relative ${
                  isSelected
                    ? 'bg-blue-50/80 border-blue-600 shadow-md shadow-blue-500/10 ring-2 ring-blue-500/20'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 shadow-sm'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                    isSelected
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-slate-300 bg-white group-hover:border-slate-400'
                  }`}
                >
                  {isSelected ? <Check size={14} strokeWidth={3} /> : null}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {opt.icon && <span className="text-lg">{opt.icon}</span>}
                    <span
                      className={`text-sm font-bold truncate ${
                        isSelected ? 'text-blue-900' : 'text-slate-800'
                      }`}
                    >
                      {opt.label}
                    </span>
                  </div>
                  {opt.description && (
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {opt.description}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Dropdown Type */}
      {question.type === 'dropdown' && question.options && (
        <div className="space-y-3 pt-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Select Your Option:
          </label>
          <select
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full p-4 rounded-2xl border border-slate-200 bg-white text-sm font-bold text-slate-900 shadow-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
          >
            <option value="" disabled>
              -- Tap to select an option --
            </option>
            {question.options.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Rating (1 to 5) for Readiness */}
      {question.type === 'rating' && (
        <div className="space-y-5 pt-2">
          {[
            { key: 'aptitude', label: 'Quantitative & Logical Aptitude', icon: '⚡' },
            { key: 'coding', label: 'Data Structures & Coding Ability', icon: '💻' },
            { key: 'communication', label: 'Communication & Verbal Articulation', icon: '🎙️' },
            { key: 'resume', label: 'Resume & Portfolio Preparedness', icon: '📄' },
          ].map((item) => {
            const currentScore = (value && value[item.key]) || 3;
            return (
              <div
                key={item.key}
                className="p-4 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-sm font-bold text-slate-900">{item.label}</span>
                  </div>
                  <span className="text-xs font-black px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                    {currentScore} / 5
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() =>
                        onChange({
                          ...(value || { aptitude: 3, coding: 3, communication: 3, resume: 3 }),
                          [item.key]: lvl,
                        })
                      }
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        currentScore === lvl
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {lvl === 1 ? '1 (Beg)' : lvl === 5 ? '5 (Pro)' : lvl}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Month Picker for Placement Season */}
      {question.type === 'month_picker' && question.options && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {question.options.map((opt) => {
            const isSelected = value === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChange(opt.id)}
                className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-blue-50/80 border-blue-600 shadow-sm ring-2 ring-blue-500/20'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">📅</span>
                  <span
                    className={`text-sm font-bold ${
                      isSelected ? 'text-blue-900' : 'text-slate-800'
                    }`}
                  >
                    {opt.label}
                  </span>
                </div>
                {isSelected && <Check size={16} className="text-blue-600" />}
              </button>
            );
          })}
        </div>
      )}

      {/* Free Text Input */}
      {question.type === 'text' && (
        <div className="space-y-2 pt-2">
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={question.placeholder || 'Type your response here...'}
            className="w-full p-4 rounded-2xl border border-slate-200 bg-white text-sm font-medium text-slate-900 shadow-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      )}
    </motion.div>
  );
};
