'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  XCircle, 
  Timer, 
  Trophy,
  ArrowRight,
  Info,
  Play,
  RotateCcw,
  Code2,
  Terminal,
  Cpu
} from 'lucide-react';
import { cn } from '@career-bridge/utils';
import { PRACTICE_QUESTIONS } from '@/data/practiceQuestions';

const LANGUAGES = [
  { id: 'javascript', name: 'JavaScript', icon: 'JS', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  { id: 'python', name: 'Python', icon: 'PY', color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { id: 'java', name: 'Java', icon: 'JV', color: 'text-red-400', bg: 'bg-red-400/10' },
  { id: 'c', name: 'C', icon: 'C', color: 'text-slate-400', bg: 'bg-slate-400/10' },
  { id: 'c++', name: 'C++', icon: 'C++', color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
];

export default function PracticeSessionPage({ params }: { params: { type: string } }) {
  const { type } = params;
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [codeValue, setCodeValue] = useState('');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

  const isTechnical = type === 'coding' || type === 'debugging';

  const filteredQuestions = useMemo(() => {
    let qs = PRACTICE_QUESTIONS.filter(q => q.type === type);
    if (isTechnical && selectedLanguage) {
      qs = qs.filter(q => q.language === selectedLanguage);
    }
    return qs;
  }, [type, selectedLanguage]);

  const currentQuestion = filteredQuestions[currentStep];

  useEffect(() => {
    if (currentQuestion?.type === 'coding' || currentQuestion?.type === 'debugging') {
      setCodeValue(currentQuestion.codeSnippet || '');
    }
  }, [currentStep, currentQuestion]);

  useEffect(() => {
    if (timeLeft > 0 && !isFinished && (selectedLanguage || !isTechnical)) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, isFinished, selectedLanguage, isTechnical]);

  if (isTechnical && !selectedLanguage) {
    return (
      <div className="max-w-4xl mx-auto space-y-12 py-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-black text-white capitalize">Select Language</h1>
          <p className="text-slate-400">Choose the language you want to practice for {type}.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.id}
              onClick={() => setSelectedLanguage(lang.id)}
              className="glass-card group p-8 text-left hover:border-blue-500/50 transition-all duration-300"
            >
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl mb-6 shadow-lg", lang.bg, lang.color)}>
                {lang.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{lang.name}</h3>
              <p className="text-slate-500 text-sm">Practice {type} challenges in {lang.name}.</p>
              <div className="mt-6 flex items-center gap-2 text-blue-400 font-bold text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                START SESSION <ChevronRight size={14} />
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (!currentQuestion && !isFinished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <h2 className="text-2xl font-bold text-white">No questions found for this selection.</h2>
        <button onClick={() => router.back()} className="btn-secondary px-8">Go Back</button>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOptionSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (isAnswered) {
      if (currentStep < filteredQuestions.length - 1) {
        setCurrentStep(currentStep + 1);
        setSelectedOption(null);
        setIsAnswered(false);
      } else {
        setIsFinished(true);
      }
      return;
    }

    if (currentQuestion.type === 'aptitude' || currentQuestion.type === 'verbal') {
      if (!selectedOption) return;
      if (selectedOption === currentQuestion.correctAnswer) {
        setScore(score + 1);
      }
    }
    
    setIsAnswered(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {!isFinished ? (
        <>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => isTechnical ? setSelectedLanguage(null) : router.back()}
                className="p-2 hover:bg-white/5 rounded-xl transition-colors text-slate-400"
              >
                <ChevronLeft size={24} />
              </button>
              <div>
                <h2 className="text-xl font-bold text-white capitalize">
                  {isTechnical ? `${selectedLanguage} ${type}` : `${type} Practice`}
                </h2>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-bold uppercase tracking-widest">
                  <span>Question {currentStep + 1} of {filteredQuestions.length}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Timer size={14} className="text-blue-400" />
                    <span className={cn(timeLeft < 60 ? "text-rose-400" : "text-blue-400")}>
                      {formatTime(timeLeft)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="text-right">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Score</div>
                <div className="text-lg font-bold text-white">{score} / {filteredQuestions.length}</div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / filteredQuestions.length) * 100}%` }}
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              {/* Question */}
              <div className="glass-card p-8 md:p-12 space-y-8">
                <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                  {currentQuestion.question}
                </h3>

                {/* Content based on type */}
                {(currentQuestion.type === 'aptitude' || currentQuestion.type === 'verbal') && (
                  <div className="grid gap-4">
                    {currentQuestion.options?.map((option: string, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => handleOptionSelect(option)}
                        className={cn(
                          "w-full p-6 rounded-2xl border text-left transition-all duration-300 flex items-center justify-between group",
                          isAnswered 
                            ? option === currentQuestion.correctAnswer
                              ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400"
                              : option === selectedOption
                                ? "bg-rose-500/10 border-rose-500/50 text-rose-400"
                                : "bg-white/5 border-white/5 text-slate-500"
                            : selectedOption === option
                              ? "bg-blue-500/10 border-blue-500/50 text-blue-400"
                              : "bg-white/5 border-white/5 text-slate-300 hover:border-white/20"
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-colors",
                            selectedOption === option ? "bg-blue-500 text-white" : "bg-slate-800 text-slate-500"
                          )}>
                            {String.fromCharCode(65 + idx)}
                          </div>
                          <span className="font-semibold">{option}</span>
                        </div>
                        {isAnswered && option === currentQuestion.correctAnswer && <CheckCircle2 size={20} />}
                        {isAnswered && option === selectedOption && option !== currentQuestion.correctAnswer && <XCircle size={20} />}
                      </button>
                    ))}
                  </div>
                )}

                {(currentQuestion.type === 'coding' || currentQuestion.type === 'debugging') && (
                  <div className="space-y-4">
                    <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#020617]">
                      <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-white/5">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-rose-500" />
                            <div className="w-3 h-3 rounded-full bg-amber-500" />
                            <div className="w-3 h-3 rounded-full bg-emerald-500" />
                          </div>
                          <span className="text-xs font-bold text-slate-500 uppercase ml-4">{currentQuestion.language}</span>
                        </div>
                        <button className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1">
                          <RotateCcw size={14} />
                          Reset
                        </button>
                      </div>
                      <textarea
                        value={codeValue}
                        onChange={(e) => setCodeValue(e.target.value)}
                        className="w-full h-64 p-6 bg-transparent text-emerald-400 font-mono text-sm focus:outline-none resize-none"
                        spellCheck={false}
                        disabled={isAnswered}
                      />
                    </div>
                    {isAnswered && (
                      <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                        <h4 className="font-bold text-white flex items-center gap-2">
                          <Info size={16} className="text-blue-400" />
                          Analysis
                        </h4>
                        <p className="text-sm text-slate-400 leading-relaxed">
                          {currentQuestion.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Feedback Area */}
                {isAnswered && (currentQuestion.type === 'aptitude' || currentQuestion.type === 'verbal') && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-3"
                  >
                    <div className="flex items-center gap-2 font-bold text-white">
                      <Info size={18} className="text-blue-400" />
                      Explanation
                    </div>
                    <p className="text-slate-400 leading-relaxed">
                      {currentQuestion.explanation}
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Footer Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <Info size={16} />
                  <span>Double check your answer before submitting.</span>
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={!selectedOption && currentQuestion.type !== 'coding' && currentQuestion.type !== 'debugging'}
                  className={cn(
                    "btn-primary px-10 py-4 text-lg font-bold flex items-center gap-3 group",
                    (!selectedOption && currentQuestion.type !== 'coding' && currentQuestion.type !== 'debugging') && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {isAnswered 
                    ? currentStep === filteredQuestions.length - 1 ? 'Show Results' : 'Next Question'
                    : 'Check Answer'
                  }
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20 space-y-12"
        >
          <div className="relative inline-block">
            <div className="w-32 h-32 bg-blue-600/20 rounded-full flex items-center justify-center">
              <Trophy size={64} className="text-yellow-500" />
            </div>
            <motion.div 
              className="absolute -top-4 -right-4 bg-emerald-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-black text-xl"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
            >
              100
            </motion.div>
          </div>

          <div className="space-y-4">
            <h2 className="text-5xl font-black text-white">Great job!</h2>
            <p className="text-xl text-slate-400 max-w-md mx-auto">
              You've completed the {selectedLanguage || ''} {type} practice session with a score of {score} / {filteredQuestions.length}.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6 max-w-xl mx-auto">
            <div className="glass-card p-6">
              <div className="text-2xl font-bold text-white">{score}</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">Accuracy</div>
            </div>
            <div className="glass-card p-6">
              <div className="text-2xl font-bold text-white">+50</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">XP Earned</div>
            </div>
            <div className="glass-card p-6">
              <div className="text-2xl font-bold text-white">4:25</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">Time Taken</div>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <button onClick={() => router.push('/profile')} className="btn-primary px-8 py-4">
              Proceed to Profile
            </button>
            <button onClick={() => window.location.reload()} className="btn-primary px-8 py-4 flex items-center gap-2">
              Practice Again
              <RotateCcw size={18} />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
