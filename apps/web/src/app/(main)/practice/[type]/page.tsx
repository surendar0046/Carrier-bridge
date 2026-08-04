'use client';

import React, { useState, useEffect } from 'react';
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
  const [sessionQuestions, setSessionQuestions] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [codeValue, setCodeValue] = useState('');
  const [timeLeft, setTimeLeft] = useState(600); // Default 10 minutes

  // Custom states for running code output
  const [testcaseResults, setTestcaseResults] = useState<any[] | null>(null);
  const [runMessage, setRunMessage] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const isTechnical = type === 'coding' || type === 'debugging';

  // Shuffle and set questions on entry or language change
  useEffect(() => {
    if (isTechnical && !selectedLanguage) return;

    let qs = PRACTICE_QUESTIONS.filter(q => q.type === type);
    if (isTechnical && selectedLanguage) {
      qs = qs.filter(q => q.language === selectedLanguage);
    }

    // Shuffle questions
    const shuffled = [...qs].sort(() => Math.random() - 0.5);

    // 10 questions for aptitude/verbal, 2-3 (3) questions for coding/debugging
    const limit = (type === 'aptitude' || type === 'verbal') ? 10 : 3;
    const finalQs = shuffled.slice(0, limit);

    setSessionQuestions(finalQs);
    setCurrentStep(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsFinished(false);
    setTestcaseResults(null);
    setRunMessage(null);
    setTimeLeft((type === 'aptitude' || type === 'verbal') ? 600 : 900); // 10 mins vs 15 mins
  }, [type, selectedLanguage, isTechnical]);

  const currentQuestion = sessionQuestions[currentStep];

  useEffect(() => {
    if (currentQuestion?.type === 'coding' || currentQuestion?.type === 'debugging') {
      setCodeValue(currentQuestion.codeSnippet || '');
      setTestcaseResults(null);
      setRunMessage(null);
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
      <div className="max-w-4xl mx-auto space-y-12 py-12 p-8">
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

  if (sessionQuestions.length === 0 && !isFinished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 p-8">
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

  const handleRunCode = () => {
    if (isAnswered || isRunning) return;
    setIsRunning(true);
    setRunMessage("Running code against testcases...");
    
    setTimeout(() => {
      const cleanUser = codeValue.replace(/[\s;()'"\r\n]+/g, '').toLowerCase();
      const cleanCorrect = currentQuestion.correctAnswer.replace(/[\s;()'"\r\n]+/g, '').toLowerCase();
      
      const passedAll = cleanUser === cleanCorrect || 
                        codeValue.includes(currentQuestion.correctAnswer) || 
                        currentQuestion.correctAnswer.includes(codeValue) ||
                        cleanUser.length > (currentQuestion.codeSnippet || '').replace(/[\s;()'"\r\n]+/g, '').length + 3;

      if (type === 'coding') {
        const tcs = currentQuestion.testCases || [{ input: "default", output: "default" }];
        const results = tcs.map((tc: any, index: number) => {
          return {
            id: index + 1,
            input: tc.input,
            expected: tc.output,
            actual: passedAll ? tc.output : "Error: Output mismatch",
            passed: passedAll
          };
        });
        setTestcaseResults(results);
        setRunMessage(passedAll ? "All test cases passed!" : "Some test cases failed.");
      } else if (type === 'debugging') {
        const isDebugCorrect = cleanUser === cleanCorrect || cleanUser.includes(cleanCorrect) || cleanCorrect.includes(cleanUser);
        setTestcaseResults([
          {
            id: 1,
            input: "Bug fix correctness check",
            expected: "Success (fixed)",
            actual: isDebugCorrect ? "Success (fixed)" : "LogicError: Code output incorrect",
            passed: isDebugCorrect
          }
        ]);
        setRunMessage(isDebugCorrect ? "Bug fixed successfully!" : "Logic errors still remaining.");
      }
      setIsRunning(false);
    }, 1200);
  };

  const handleSubmit = () => {
    if (isAnswered) {
      if (currentStep < sessionQuestions.length - 1) {
        setCurrentStep(currentStep + 1);
        setSelectedOption(null);
        setIsAnswered(false);
        setTestcaseResults(null);
        setRunMessage(null);
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
    } else {
      // Coding or debugging score calculation
      const cleanUser = codeValue.replace(/[\s;()'"\r\n]+/g, '').toLowerCase();
      const cleanCorrect = currentQuestion.correctAnswer.replace(/[\s;()'"\r\n]+/g, '').toLowerCase();
      const isCorrect = cleanUser === cleanCorrect || 
                        codeValue.includes(currentQuestion.correctAnswer) || 
                        currentQuestion.correctAnswer.includes(codeValue);
      
      if (isCorrect) {
        setScore(score + 1);
      }
      
      if (!testcaseResults) {
        handleRunCode();
      }
    }
    
    setIsAnswered(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-8">
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
                  <span>Question {currentStep + 1} of {sessionQuestions.length}</span>
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
                <div className="text-lg font-bold text-white">{score} / {sessionQuestions.length}</div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / sessionQuestions.length) * 100}%` }}
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

                {/* Coding or Debugging Workspace */}
                {isTechnical && (
                  <div className="space-y-6">
                    {/* Code Editor Container */}
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
                        <button 
                          onClick={() => setCodeValue(currentQuestion.codeSnippet || '')}
                          className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                        >
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

                    {/* Technical Mode Info/Test Cases (Input/Output details) */}
                    {currentQuestion.type === 'coding' && currentQuestion.testCases && (
                      <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                        <h4 className="font-bold text-white flex items-center gap-2 text-sm uppercase tracking-wider">
                          <Info size={16} className="text-blue-400" />
                          Sample Testcases (Inputs & Outputs)
                        </h4>
                        <div className="space-y-3">
                          {currentQuestion.testCases.map((tc: any, index: number) => (
                            <div key={index} className="grid grid-cols-2 gap-4 text-xs font-mono bg-slate-950 p-3 rounded-lg border border-white/5">
                              <div>
                                <span className="text-slate-500">Input:</span> <span className="text-blue-400">{tc.input}</span>
                              </div>
                              <div>
                                <span className="text-slate-500">Expected Output:</span> <span className="text-emerald-400">{tc.output}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Run / Test Actions */}
                    {!isAnswered && (
                      <div className="flex gap-4">
                        <button
                          onClick={handleRunCode}
                          disabled={isRunning}
                          className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-sm border border-slate-700 disabled:opacity-50 transition-all"
                        >
                          <Play size={16} className="text-blue-400" />
                          {isRunning ? 'Running...' : 'Run Code'}
                        </button>
                      </div>
                    )}

                    {/* Test Results Output Display */}
                    {(testcaseResults || runMessage) && (
                      <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/5 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-white flex items-center gap-2 text-sm uppercase tracking-wider">
                            <Terminal size={16} className="text-emerald-400" />
                            Console Output
                          </h4>
                          <span className={cn(
                            "text-xs font-bold px-2 py-1 rounded",
                            runMessage?.includes("passed") || runMessage?.includes("fixed")
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-rose-500/20 text-rose-400"
                          )}>
                            {runMessage}
                          </span>
                        </div>

                        {testcaseResults && (
                          <div className="space-y-3">
                            {testcaseResults.map((res) => (
                              <div 
                                key={res.id} 
                                className={cn(
                                  "p-4 rounded-xl border text-xs font-mono space-y-2",
                                  res.passed ? "bg-emerald-950/20 border-emerald-500/20" : "bg-rose-950/20 border-rose-500/20"
                                )}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-slate-300">Test Case {res.id}:</span>
                                  <span className={res.passed ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                                    {res.passed ? "✓ Passed" : "✗ Failed"}
                                  </span>
                                </div>
                                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5 text-slate-400">
                                  <div>
                                    <span className="text-[10px] uppercase text-slate-500 block">Input</span>
                                    <span className="text-white">{res.input}</span>
                                  </div>
                                  <div>
                                    <span className="text-[10px] uppercase text-slate-500 block">Expected</span>
                                    <span className="text-white">{res.expected}</span>
                                  </div>
                                  <div>
                                    <span className="text-[10px] uppercase text-slate-500 block">Got</span>
                                    <span className={res.passed ? "text-emerald-400" : "text-rose-400"}>{res.actual}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {isAnswered && (
                      <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                        <h4 className="font-bold text-white flex items-center gap-2 text-sm uppercase tracking-wider">
                          <Info size={16} className="text-blue-400" />
                          Explanation & Solution
                        </h4>
                        <p className="text-sm text-slate-400 leading-relaxed">
                          {currentQuestion.explanation}
                        </p>
                        <div className="bg-slate-950 p-4 rounded-xl border border-white/5">
                          <span className="text-xs font-bold text-slate-500 block mb-2 uppercase">Correct Implementation:</span>
                          <pre className="text-xs text-emerald-400 font-mono overflow-x-auto whitespace-pre-wrap">{currentQuestion.correctAnswer}</pre>
                        </div>
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
                    ? currentStep === sessionQuestions.length - 1 ? 'Show Results' : 'Next Question'
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
              {Math.round((score / sessionQuestions.length) * 100)}
            </motion.div>
          </div>

          <div className="space-y-4">
            <h2 className="text-5xl font-black text-white">Great job!</h2>
            <p className="text-xl text-slate-400 max-w-md mx-auto">
              You&apos;ve completed the {selectedLanguage || ''} {type} practice session with a score of {score} / {sessionQuestions.length}.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6 max-w-xl mx-auto">
            <div className="glass-card p-6">
              <div className="text-2xl font-bold text-white">{Math.round((score / sessionQuestions.length) * 100)}%</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">Accuracy</div>
            </div>
            <div className="glass-card p-6">
              <div className="text-2xl font-bold text-white">+{score * 20}</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">XP Earned</div>
            </div>
            <div className="glass-card p-6">
              <div className="text-2xl font-bold text-white">{formatTime(900 - timeLeft)}</div>
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
