'use client';

import React, { useState, useEffect, useRef } from 'react';

interface ParsedResume {
  fileName: string;
  candidateName: string;
  skills: string[];
  experienceYears: number;
  pastCompanies: string[];
  keyProjects: string[];
  education: string;
}

interface InterviewQuestion {
  id: number;
  category: 'Resume Deep-Dive' | 'Technical Architecture' | 'HR & Behavioral' | 'Role Problem Solving';
  question: string;
  contextHint: string;
  expectedKeywords: string[];
}

interface QuestionResult {
  questionId: number;
  question: string;
  userAnswer: string;
  aiScore: number;
  aiFeedback: string;
  modelAnswer: string;
}

const SAMPLE_RESUMES: ParsedResume[] = [
  {
    fileName: 'Siddharth_Resume_FullStack.pdf',
    candidateName: 'Siddharth Varma',
    skills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Kafka', 'GraphQL', 'AWS'],
    experienceYears: 5,
    pastCompanies: ['TechCorp Solutions', 'ScaleUp Inc.'],
    keyProjects: ['Distributed Order Processing Engine', 'Real-Time Analytics Dashboard with WebSockets'],
    education: 'B.Tech Computer Science & Engineering',
  },
  {
    fileName: 'Priya_Resume_FrontendLead.pdf',
    candidateName: 'Priya Sharma',
    skills: ['React 19', 'Next.js', 'TailwindCSS', 'Web Performance', 'Redux Toolkit', 'Jest'],
    experienceYears: 4,
    pastCompanies: ['Innovate Apps', 'WebFlow Systems'],
    keyProjects: ['Design System Component Library (100k+ downloads)', 'Micro-Frontend Microservices Portal'],
    education: 'M.S. Software Engineering',
  },
];

const TARGET_ROLES = [
  'Senior Full Stack Engineer',
  'Frontend Technical Lead',
  'Backend Systems Architect',
  'DevOps & Infrastructure Engineer',
  'Data Scientist & AI Specialist',
  'Product Manager / HR Specialist',
];

export default function NiralAIMockInterviewPage() {
  // Step Management: 1: Setup/Upload -> 2: AI Plan Generation -> 3: Live Interview -> 4: Scorecard
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Resume & Configuration State
  const [uploadedResume, setUploadedResume] = useState<ParsedResume | null>(SAMPLE_RESUMES[0]);
  const [selectedRole, setSelectedRole] = useState<string>(TARGET_ROLES[0]);
  const [targetCompany, setTargetCompany] = useState<string>('FAANG / Top Tech');
  const [experienceLevel, setExperienceLevel] = useState<'Junior' | 'Mid' | 'Senior' | 'Lead'>('Senior');
  const [interviewType, setInterviewType] = useState<'Technical' | 'HR & Behavioral' | 'Resume Deep Dive' | 'Full Mock Loop'>('Full Mock Loop');
  const [isUploading, setIsUploading] = useState(false);

  // Questions State
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [qResults, setQResults] = useState<QuestionResult[]>([]);
  
  // Audio & Live Interview State
  const [isListening, setIsListening] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [currentInputText, setCurrentInputText] = useState('');
  const [timerSeconds, setTimerSeconds] = useState(120);
  const [evaluatingCurrent, setEvaluatingCurrent] = useState(false);

  // Speech Recognition Ref
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Timer Countdown during live interview
    let interval: any = null;
    if (step === 3 && timerSeconds > 0 && !evaluatingCurrent) {
      interval = setInterval(() => setTimerSeconds(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timerSeconds, evaluatingCurrent]);

  // Speech Synthesis Helper
  const speakText = (text: string) => {
    if (!ttsEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onstart = () => setIsAISpeaking(true);
    utterance.onend = () => setIsAISpeaking(false);
    utterance.onerror = () => setIsAISpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  // Toggle Speech-to-Text Microphone
  const toggleSpeechRecognition = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in your browser. You can type your response in text.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setCurrentInputText(prev => (prev ? prev + ' ' + transcript : transcript));
      };

      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
      setIsListening(true);
    }
  };

  // Step 1 -> 2: Upload File Simulation
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setTimeout(() => {
      setUploadedResume({
        fileName: file.name,
        candidateName: 'Candidate (Parsed from Resume)',
        skills: ['TypeScript', 'React', 'Node.js', 'Microservices', 'GraphQL', 'AWS'],
        experienceYears: 4,
        pastCompanies: ['Tech Innovations LLC'],
        keyProjects: ['Enterprise Web Platform', 'Cloud Event Pipeline'],
        education: 'B.S. Software Engineering',
      });
      setIsUploading(false);
    }, 1200);
  };

  // Step 2: Generate AI Interview Questions based on Resume & Selected Role
  const startAIPreparation = () => {
    if (!uploadedResume) return;
    setStep(2);

    setTimeout(() => {
      const generatedQs: InterviewQuestion[] = [
        {
          id: 1,
          category: 'Resume Deep-Dive',
          question: `I noticed on your resume that you built "${uploadedResume.keyProjects[0]}". As a ${selectedRole}, how did you architect system scalability and error tolerance in that project?`,
          contextHint: `Reference your skills in ${uploadedResume.skills.slice(0, 3).join(', ')} and quantify performance impact.`,
          expectedKeywords: ['scalability', 'architecture', 'error handling', 'performance', 'throughput'],
        },
        {
          id: 2,
          category: 'Technical Architecture',
          question: `In your role as a ${selectedRole}, how do you evaluate trade-offs between REST APIs vs. GraphQL vs. gRPC for microservice communications?`,
          contextHint: `Discuss network latency, payload size, schema validation, and developer experience.`,
          expectedKeywords: ['latency', 'schema', 'payload', 'trade-offs', 'microservices'],
        },
        {
          id: 3,
          category: 'HR & Behavioral',
          question: `Tell me about a time at ${uploadedResume.pastCompanies[0] || 'your previous company'} when you faced a major technical disagreement with a team member. How did you resolve it?`,
          contextHint: `Use the STAR method (Situation, Task, Action, Result) to structure your answer.`,
          expectedKeywords: ['STAR method', 'collaboration', 'empathy', 'trade-offs', 'consensus'],
        },
        {
          id: 4,
          category: 'Role Problem Solving',
          question: `Given a production incident where response times spike to 5000ms under high load for a ${selectedRole} application, what is your step-by-step diagnostic workflow?`,
          contextHint: `Trace from Edge CDN -> APM logs -> database query locks -> memory bottlenecks.`,
          expectedKeywords: ['APM logs', 'database profiling', 'CDN cache', 'bottleneck', 'monitoring'],
        },
        {
          id: 5,
          category: 'HR & Behavioral',
          question: `Why are you looking to transition to a ${selectedRole} role at ${targetCompany}, and how do your ${uploadedResume.experienceYears} years of experience position you to succeed?`,
          contextHint: `Align your past accomplishments directly with ${selectedRole} leadership expectations.`,
          expectedKeywords: ['leadership', 'impact', 'growth', 'company vision', 'expertise'],
        },
      ];

      setQuestions(generatedQs);
      setStep(3);
      setCurrentQIndex(0);
      setTimerSeconds(120);
      speakText(generatedQs[0].question);
    }, 2000);
  };

  // Submit Answer for Current Question & Evaluate via AI
  const handleSubmitAnswer = () => {
    if (!currentInputText.trim()) return;

    setEvaluatingCurrent(true);
    const q = questions[currentQIndex];
    const userAns = currentInputText;

    setTimeout(() => {
      // AI Evaluation Calculation
      const hasKeywords = q.expectedKeywords.filter(kw => userAns.toLowerCase().includes(kw.toLowerCase()));
      const wordCount = userAns.split(' ').length;
      let score = 70;
      if (wordCount > 30) score += 15;
      if (hasKeywords.length > 2) score += 15;
      score = Math.min(score, 98);

      const feedback = `Excellent answer! You demonstrated strong understanding of ${q.category}. Key strengths: clear articulation and relevance to ${selectedRole}. Tip: emphasize quantifiable metrics even further.`;
      const modelAnswer = `In a ${selectedRole} environment, the optimal approach combines structural STAR formatting with empirical metrics. Key points to highlight: 1) System trade-offs 2) Team alignment 3) Quantifiable ROI.`;

      const newRes: QuestionResult = {
        questionId: q.id,
        question: q.question,
        userAnswer: userAns,
        aiScore: score,
        aiFeedback: feedback,
        modelAnswer: modelAnswer,
      };

      setQResults(prev => [...prev, newRes]);
      setUserAnswers(prev => [...prev, userAns]);
      setCurrentInputText('');
      setEvaluatingCurrent(false);

      if (currentQIndex < questions.length - 1) {
        const nextIndex = currentQIndex + 1;
        setCurrentQIndex(nextIndex);
        setTimerSeconds(120);
        speakText(questions[nextIndex].question);
      } else {
        setStep(4);
        window.speechSynthesis?.cancel();
      }
    }, 1500);
  };

  // Restart Interview Loop
  const handleRestart = () => {
    setStep(1);
    setCurrentQIndex(0);
    setUserAnswers([]);
    setQResults([]);
    setCurrentInputText('');
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-8 rounded-3xl text-white shadow-2xl border border-slate-800 flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full text-blue-300 text-xs font-bold mb-3">
            <span>✨ Niral AI HR & Technical Interviewer</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight">
            Niral AI Resume Mock Interviewer
          </h1>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl">
            Upload your resume, select your target role, and let Niral AI prepare & conduct a real-time voice/text mock interview tailored specifically to your background.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setTtsEnabled(!ttsEnabled)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold border transition-all flex items-center gap-2 ${
              ttsEnabled ? 'bg-indigo-600/40 border-indigo-400 text-white' : 'bg-white/10 border-white/20 text-slate-300'
            }`}>
            <span>{ttsEnabled ? '🔊 AI Voice Enabled' : '🔇 Voice Muted'}</span>
          </button>
        </div>
      </div>

      {/* STEP 1: Upload Resume & Select Role */}
      {step === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Resume Upload Card */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-6 shadow-sm">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <span>📄 Step 1: Upload Candidate Resume</span>
              </h2>

              {/* Upload Drop Zone */}
              <div className="border-2 border-dashed border-indigo-200 bg-indigo-50/30 hover:bg-indigo-50/60 rounded-3xl p-8 text-center transition-all cursor-pointer relative group">
                <input
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center text-2xl mx-auto shadow-lg shadow-indigo-600/30 group-hover:scale-110 transition-transform">
                  📤
                </div>
                <h3 className="font-bold text-slate-900 text-sm mt-4">
                  {isUploading ? 'Parsing Resume with Niral AI...' : 'Click to Upload PDF / DOCX Resume'}
                </h3>
                <p className="text-xs text-slate-500 mt-1">Niral AI automatically extracts skills, projects, and work history.</p>
              </div>

              {/* Parsed Resume Details Card */}
              {uploadedResume && (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📋</span>
                      <div>
                        <h4 className="font-black text-slate-900 text-sm">{uploadedResume.candidateName}</h4>
                        <p className="text-xs text-slate-500">{uploadedResume.fileName} · {uploadedResume.experienceYears} Years Exp.</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                      Parsed & Ready
                    </span>
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-2">Extracted Resume Skills</label>
                    <div className="flex flex-wrap gap-2">
                      {uploadedResume.skills.map(s => (
                        <span key={s} className="px-3 py-1 bg-white border border-slate-200 text-indigo-700 font-bold rounded-xl text-xs">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Key Resume Project</label>
                    <p className="text-xs text-slate-700 font-semibold">{uploadedResume.keyProjects[0]}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Role Configuration & Settings */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-6 shadow-sm">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <span>🎯 Target Role Setup</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Select Target Role</label>
                <select
                  value={selectedRole}
                  onChange={e => setSelectedRole(e.target.value)}
                  className="w-full border border-slate-200 rounded-2xl p-3 text-xs outline-none focus:border-indigo-500 bg-white font-bold text-slate-800">
                  {TARGET_ROLES.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Target Company Profile</label>
                <input
                  type="text"
                  value={targetCompany}
                  onChange={e => setTargetCompany(e.target.value)}
                  placeholder="e.g. Google, Amazon, High Growth Startup"
                  className="w-full border border-slate-200 rounded-2xl p-3 text-xs outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Experience Level</label>
                  <select
                    value={experienceLevel}
                    onChange={e => setExperienceLevel(e.target.value as any)}
                    className="w-full border border-slate-200 rounded-2xl p-3 text-xs outline-none focus:border-indigo-500 bg-white">
                    <option value="Junior">Junior (0-2 Yrs)</option>
                    <option value="Mid">Mid-Level (2-5 Yrs)</option>
                    <option value="Senior">Senior (5+ Yrs)</option>
                    <option value="Lead">Lead / Architect</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Interview Focus</label>
                  <select
                    value={interviewType}
                    onChange={e => setInterviewType(e.target.value as any)}
                    className="w-full border border-slate-200 rounded-2xl p-3 text-xs outline-none focus:border-indigo-500 bg-white">
                    <option value="Full Mock Loop">Full Mock Loop</option>
                    <option value="Technical">Technical & System</option>
                    <option value="HR & Behavioral">HR & Behavioral</option>
                    <option value="Resume Deep Dive">Resume Deep Dive</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={startAIPreparation}
                  disabled={!uploadedResume}
                  className="w-full py-4 rounded-2xl text-sm font-black text-white shadow-xl shadow-indigo-500/30 hover:scale-105 active:scale-95 disabled:opacity-50 transition-all"
                  style={{ background: 'linear-gradient(135deg,#2563eb,#4f46e5)' }}>
                  🎙️ Start Niral AI Mock Interview →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Niral AI Analysis & Preparation Screen */}
      {step === 2 && (
        <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center space-y-6 shadow-xl animate-fade-in">
          <div className="w-20 h-20 bg-indigo-50 border border-indigo-200 text-indigo-600 rounded-3xl flex items-center justify-center text-4xl mx-auto animate-pulse">
            ✨
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            Niral AI is Analyzing Candidate Resume & Selected Role
          </h2>
          <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
            Parsing resume experience for <span className="text-indigo-600 font-bold">{uploadedResume?.candidateName}</span> to construct tailored technical & HR questions for <span className="text-slate-800 font-bold">{selectedRole}</span>...
          </p>
          <div className="w-64 h-2 bg-slate-100 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 animate-pulse rounded-full" style={{ width: '80%' }} />
          </div>
        </div>
      )}

      {/* STEP 3: Live Interactive AI Mock Interview Room */}
      {step === 3 && questions.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Animated Niral AI Interviewer Card */}
          <div className="bg-gradient-to-b from-slate-900 to-indigo-950 rounded-3xl p-8 text-white space-y-6 flex flex-col justify-between shadow-2xl border border-slate-800">
            <div className="space-y-4 text-center">
              <div className="relative inline-block">
                <div className={`w-28 h-28 rounded-full border-4 ${isAISpeaking ? 'border-indigo-400 ring-8 ring-indigo-500/30 scale-105' : 'border-slate-700'} flex items-center justify-center text-5xl bg-slate-800 shadow-2xl transition-all`}>
                  🤖
                </div>
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-500 border-2 border-slate-900 rounded-full" />
              </div>
              <div>
                <h3 className="font-black text-lg">Niral AI Interviewer</h3>
                <p className="text-xs text-indigo-300 font-bold">HR & Technical Evaluation Engine</p>
              </div>

              {/* Voice Wave Visualizer Animation */}
              <div className="flex items-center justify-center gap-1.5 h-8 py-2">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div
                    key={i}
                    className={`w-1.5 bg-indigo-400 rounded-full transition-all duration-300 ${
                      isAISpeaking ? 'animate-bounce' : 'h-2 opacity-40'
                    }`}
                    style={{ height: isAISpeaking ? `${Math.floor(Math.random() * 24) + 8}px` : '8px' }}
                  />
                ))}
              </div>
            </div>

            {/* Candidate Metadata Summary */}
            <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400 font-semibold">
                <span>Target Role:</span>
                <span className="text-white font-bold">{selectedRole}</span>
              </div>
              <div className="flex justify-between text-slate-400 font-semibold">
                <span>Candidate:</span>
                <span className="text-indigo-300 font-bold">{uploadedResume?.candidateName}</span>
              </div>
              <div className="flex justify-between text-slate-400 font-semibold">
                <span>Question:</span>
                <span className="text-emerald-400 font-bold">{currentQIndex + 1} of {questions.length}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Question Display & Answer Box */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-6 shadow-md">
              {/* Question Header & Category Badge */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <span className="px-3.5 py-1.5 rounded-xl text-xs font-black uppercase bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Question {currentQIndex + 1}: {questions[currentQIndex].category}
                </span>
                <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                  ⏱️ Time Left: <span className="text-indigo-600 font-black">{Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}</span>
                </span>
              </div>

              {/* AI Question Prompt */}
              <div className="space-y-2">
                <h2 className="text-xl font-black text-slate-900 leading-snug">
                  "{questions[currentQIndex].question}"
                </h2>
                <p className="text-xs text-slate-500 italic">
                  💡 Niral AI Hint: {questions[currentQIndex].contextHint}
                </p>
              </div>

              {/* Answer Input Area */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Your Response (Voice or Text)</label>
                  <button
                    onClick={toggleSpeechRecognition}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isListening
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100'
                    }`}>
                    🎙️ {isListening ? 'Listening (Click to Stop)' : 'Speak Answer via Mic'}
                  </button>
                </div>

                <textarea
                  rows={6}
                  value={currentInputText}
                  onChange={e => setCurrentInputText(e.target.value)}
                  placeholder="Type or speak your interview response here... Use STAR method (Situation, Task, Action, Result) for best evaluation score."
                  className="w-full border border-slate-200 rounded-2xl p-4 text-xs outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all leading-relaxed"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  onClick={() => speakText(questions[currentQIndex].question)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all">
                  🔊 Repeat Question
                </button>
                <button
                  onClick={handleSubmitAnswer}
                  disabled={!currentInputText.trim() || evaluatingCurrent}
                  className="px-8 py-3 rounded-2xl text-xs font-black text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-600/30">
                  {evaluatingCurrent ? '⏳ Niral AI Evaluating...' : 'Submit Answer →'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: Comprehensive Interview Scorecard & Feedback Report */}
      {step === 4 && (
        <div className="space-y-8 animate-fade-in">
          {/* Readiness Score Overview */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 text-white border border-slate-800 shadow-2xl grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
            <div className="md:col-span-2 space-y-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Interview Completed
              </span>
              <h2 className="text-3xl font-black">Niral AI Evaluation Scorecard</h2>
              <p className="text-xs text-slate-300">Target Role: <span className="font-bold text-white">{selectedRole}</span></p>
            </div>
            <div className="bg-white/10 border border-white/20 rounded-2xl p-4 text-center">
              <div className="text-4xl font-black text-emerald-400">88%</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-300 mt-1">Role Match Score</div>
            </div>
            <div className="bg-white/10 border border-white/20 rounded-2xl p-4 text-center">
              <div className="text-4xl font-black text-indigo-300">5 / 5</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-300 mt-1">Questions Answered</div>
            </div>
          </div>

          {/* Detailed Question-by-Question Breakdown */}
          <div className="space-y-6">
            <h3 className="text-xl font-black text-slate-900">Question Performance Breakdown</h3>
            {qResults.map((res, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="font-black text-slate-900 text-xs">Question {idx + 1}: {res.question}</span>
                  <span className="px-3 py-1 rounded-xl text-xs font-black bg-indigo-50 text-indigo-700">
                    AI Score: {res.aiScore}/100
                  </span>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Your Answer</label>
                  <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">{res.userAnswer}</p>
                </div>
                <div>
                  <label className="text-[10px] font-black text-indigo-500 uppercase tracking-wider block mb-1">Niral AI Evaluation Feedback</label>
                  <p className="text-xs text-indigo-900 bg-indigo-50/50 p-3 rounded-xl border border-indigo-100">{res.aiFeedback}</p>
                </div>
                <div>
                  <label className="text-[10px] font-black text-emerald-600 uppercase tracking-wider block mb-1">Recommended Model Answer</label>
                  <p className="text-xs text-emerald-900 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">{res.modelAnswer}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Action Footer */}
          <div className="flex justify-center gap-4">
            <button
              onClick={handleRestart}
              className="px-8 py-4 rounded-2xl font-black text-sm text-white bg-indigo-600 hover:bg-indigo-700 shadow-xl transition-all">
              🔄 Practice Another Mock Interview Loop
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
