'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ALL_MENTORS } from '@/data/mentorsData';
import { Mentor } from '@career-bridge/types';
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  PhoneOff,
  MessageSquare,
  Users,
  Info,
  Share2,
  Smile,
  Hand,
  Subtitles,
  MoreVertical,
  Check,
  Send,
  Sparkles,
  ExternalLink,
  Volume2,
  VolumeX,
  ShieldCheck,
  Award,
  Pin,
  Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GoogleMeetCallPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const roomCode = String(params?.roomCode || 'onboarding-guidance');
  const mentorId = searchParams.get('mentorId');
  const stage = searchParams.get('stage') || 'early';
  const domain = searchParams.get('domain') || 'Software Engineering';
  const role = searchParams.get('role') || 'Career Track';

  // Find mentor
  const [mentor, setMentor] = useState<Mentor>(() => {
    if (mentorId) {
      const found = ALL_MENTORS.find((m) => m.id.toLowerCase() === mentorId.toLowerCase());
      if (found) return found;
    }
    return ALL_MENTORS[0];
  });

  // Call States
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [captionsEnabled, setCaptionsEnabled] = useState(true);
  const [activeSidePanel, setActiveSidePanel] = useState<'chat' | 'people' | 'info' | null>(null);
  const [speakingMentor, setSpeakingMentor] = useState(true);
  const [voiceSpeechEnabled, setVoiceSpeechEnabled] = useState(false);
  const [reactions, setReactions] = useState<{ id: string; emoji: string }[]>([]);
  const [copiedLink, setCopiedLink] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  // Chat state
  const [chatMessages, setChatMessages] = useState<
    { sender: 'mentor' | 'student'; text: string; time: string }[]
  >([]);
  const [newMessage, setNewMessage] = useState('');

  // WebCam Video Ref
  const userVideoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState(false);

  // Time ticker
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  // Initialize camera
  useEffect(() => {
    let stream: MediaStream | null = null;
    async function startCamera() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 640 }, height: { ideal: 480 } },
            audio: false,
          });
          setCameraStream(stream);
          if (userVideoRef.current) {
            userVideoRef.current.srcObject = stream;
          }
        }
      } catch (e) {
        console.warn('Camera access not granted or not available:', e);
        setCameraError(true);
      }
    }
    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Toggle Camera
  const toggleCamera = () => {
    if (cameraStream) {
      cameraStream.getVideoTracks().forEach((track) => {
        track.enabled = isVideoOff;
      });
    }
    setIsVideoOff(!isVideoOff);
  };

  // Stage Greeting Message
  const stageTitle =
    stage === 'school'
      ? '12th Standard Career Discovery'
      : stage === 'early'
        ? '1st & 2nd Year Domain Exploration'
        : '3rd & 4th Year Placement Launchpad';

  // Seed initial welcome message from mentor
  useEffect(() => {
    const mentorWelcome =
      stage === 'school'
        ? `Hello! Great to meet you! Welcome to Career Bridge. I see you've completed your 12th standard discovery for ${domain}. I'm here to answer any questions about engineering branches, curriculum, and early coding!`
        : stage === 'early'
          ? `Welcome to our 1-on-1 session! Congratulations on identifying your track in ${domain} (${role}). Let's discuss your roadmap, foundational projects, and how to get your first internship!`
          : `Hi! Welcome to your Placement Launchpad session. For ${role} aiming for placement, time is critical. I'm ready to review your core DSA, system design prep, resume bullet points, and mock interviews!`;

    setChatMessages([
      {
        sender: 'mentor',
        text: mentorWelcome,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, [stage, domain, role]);

  // Audio Speech synthesis option for realistic speaking
  const speakGreeting = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && voiceSpeechEnabled) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.05;
      utterance.onstart = () => setSpeakingMentor(true);
      utterance.onend = () => setSpeakingMentor(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Periodic simulated mentor speaking state for realism
  useEffect(() => {
    const timer = setInterval(() => {
      setSpeakingMentor((prev) => !prev);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Send Chat Message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMsg = {
      sender: 'student' as const,
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    const studentQuery = newMessage;
    setNewMessage('');

    // Trigger Mentor Response
    setSpeakingMentor(true);
    setTimeout(() => {
      let reply = `That's an excellent question regarding ${domain}. In industry, having 2 strong GitHub projects and consistent practice in core fundamentals puts you ahead of 90% of applicants. Let's work on that step by step!`;

      const q = studentQuery.toLowerCase();
      if (q.includes('dsa') || q.includes('coding') || q.includes('algorithm')) {
        reply = `For DSA, focus on Patterns: Two Pointers, Sliding Window, Trees BFS/DFS, and Dynamic Programming. Solving 150 targeted problems is better than doing 500 random ones!`;
      } else if (q.includes('resume') || q.includes('cv') || q.includes('ats')) {
        reply = `Make sure your resume uses the Google X-Y-Z formula: 'Accomplished [X] as measured by [Y], by doing [Z]'. Keep it strictly 1 page with live demo links!`;
      } else if (q.includes('internship') || q.includes('job') || q.includes('hire')) {
        reply = `For internships, warm referrals on LinkedIn work 10x better than cold portal applies. Connect with engineering leads and share your live deployed project links!`;
      } else if (q.includes('branch') || q.includes('college') || q.includes('12th')) {
        reply = `For ${domain}, pick a college with active technical clubs and hackathons. College teaches fundamentals, but self-learning through Career Bridge will build your real skills!`;
      }

      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'mentor',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      speakGreeting(reply);
      setTimeout(() => setSpeakingMentor(false), 3000);
    }, 1200);
  };

  // Add Emoji Reaction
  const sendReaction = (emoji: string) => {
    const id = Math.random().toString();
    setReactions((prev) => [...prev, { id, emoji }]);
    setTimeout(() => {
      setReactions((prev) => prev.filter((r) => r.id !== id));
    }, 2500);
  };

  // End Call Handler
  const handleEndCall = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
    }
    setCallEnded(true);
  };

  if (callEnded) {
    return (
      <div className="min-h-screen bg-[#202124] text-white flex items-center justify-center p-4">
        <div className="bg-[#2d2e30] border border-slate-700 rounded-3xl max-w-lg w-full p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-2xl font-black">
            ✓
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">You left the meeting</h1>
            <p className="text-slate-400 text-sm">
              Your 1-on-1 mentorship session with <strong>{mentor.name}</strong> has been logged to your dashboard.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#202124] border border-slate-700 text-left space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Domain Track</span>
              <span className="font-bold text-white">{domain}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Target Role</span>
              <span className="font-bold text-white">{role}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Onboarding Stage</span>
              <span className="font-bold text-emerald-400">{stageTitle}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => {
                setCallEnded(false);
              }}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-600 text-slate-200 text-sm font-semibold hover:bg-slate-700 transition"
            >
              Rejoin Call
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-lg shadow-blue-600/30 transition"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#202124] text-white flex flex-col justify-between overflow-hidden select-none">
      
      {/* ─── TOP BAR ──────────────────────────────────────────────────────── */}
      <header className="h-16 px-6 flex items-center justify-between border-b border-slate-800/80 bg-[#1e1f22]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
            <VideoIcon size={18} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-tight text-white">
                Career Bridge Meet
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                Encrypted • Live
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              meet.careerbridge.app/{roomCode}
            </p>
          </div>
        </div>

        {/* Center: Stage topic */}
        <div className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/70 border border-slate-700/60 text-xs">
          <Award size={14} className="text-amber-400" />
          <span className="font-semibold text-slate-200">{stageTitle}</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400">{role}</span>
        </div>

        {/* Right Info & Toggles */}
        <div className="flex items-center gap-3 text-slate-300">
          <span className="text-xs font-mono font-medium text-slate-400 hidden sm:block">
            {currentTime}
          </span>
          <button
            onClick={() => setActiveSidePanel(activeSidePanel === 'people' ? null : 'people')}
            className={`p-2.5 rounded-xl hover:bg-slate-700/60 transition relative ${
              activeSidePanel === 'people' ? 'bg-blue-600 text-white' : ''
            }`}
            title="People (2)"
          >
            <Users size={18} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-slate-900 rounded-full text-[9px] font-black flex items-center justify-center">
              2
            </span>
          </button>

          <button
            onClick={() => setActiveSidePanel(activeSidePanel === 'chat' ? null : 'chat')}
            className={`p-2.5 rounded-xl hover:bg-slate-700/60 transition relative ${
              activeSidePanel === 'chat' ? 'bg-blue-600 text-white' : ''
            }`}
            title="Meeting Chat"
          >
            <MessageSquare size={18} />
            {chatMessages.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-white rounded-full text-[9px] font-black flex items-center justify-center">
                {chatMessages.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSidePanel(activeSidePanel === 'info' ? null : 'info')}
            className={`p-2.5 rounded-xl hover:bg-slate-700/60 transition ${
              activeSidePanel === 'info' ? 'bg-blue-600 text-white' : ''
            }`}
            title="Meeting Info"
          >
            <Info size={18} />
          </button>
        </div>
      </header>

      {/* ─── MAIN STAGE / VIDEO GRID ───────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden relative p-4 gap-4">
        
        {/* Floating Emojis Reaction Layer */}
        <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
          <AnimatePresence>
            {reactions.map((r) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 1, y: 300, x: Math.random() * 200 + 100, scale: 0.5 }}
                animate={{ opacity: 0, y: -100, scale: 2 }}
                transition={{ duration: 2.5, ease: 'easeOut' }}
                className="absolute text-5xl select-none"
              >
                {r.emoji}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Video Area Grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 h-full relative">
          
          {/* MENTOR VIDEO TILE */}
          <div className={`relative bg-[#3c4043] rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between border-2 transition-all ${
            speakingMentor ? 'border-emerald-400 ring-4 ring-emerald-500/20' : 'border-slate-700'
          }`}>
            
            {/* Top Tag */}
            <div className="p-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full border border-slate-700/60 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold text-white">{mentor.name}</span>
                <span className="text-[10px] font-black uppercase text-blue-400 bg-blue-500/20 px-2 py-0.5 rounded-full">
                  Mentor
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setVoiceSpeechEnabled(!voiceSpeechEnabled)}
                  className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 text-xs flex items-center gap-1 transition"
                  title={voiceSpeechEnabled ? 'Mute AI voice' : 'Enable voice narration'}
                >
                  {voiceSpeechEnabled ? <Volume2 size={14} className="text-emerald-400" /> : <VolumeX size={14} />}
                </button>
                <div className="bg-slate-900/80 backdrop-blur-md p-1.5 rounded-lg text-slate-300">
                  <Pin size={14} />
                </div>
              </div>
            </div>

            {/* Mentor Visual Centerpiece */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
              <div className="relative">
                <div className={`w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-slate-800 shadow-2xl transition-transform ${
                  speakingMentor ? 'scale-105' : 'scale-100'
                }`}>
                  <img
                    src={mentor.avatar}
                    alt={mentor.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {speakingMentor && (
                  <span className="absolute -bottom-2 -right-2 px-3 py-1 bg-emerald-500 text-slate-950 font-black text-[10px] rounded-full shadow-lg animate-pulse uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />
                    Speaking
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-lg font-black text-white">{mentor.name}</h3>
                <p className="text-xs text-slate-300 font-medium">
                  {mentor.title} @ <strong className="text-blue-400">{mentor.company}</strong>
                </p>
                <p className="text-[11px] text-slate-400 mt-1 max-w-sm">
                  Expertise: {mentor.expertise.slice(0, 3).join(' • ')}
                </p>
              </div>

              {/* Live Mentor Transcribed Guidance (Google Meet Captions) */}
              {captionsEnabled && chatMessages.length > 0 && (
                <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-2xl p-3 text-left shadow-xl">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-emerald-400 mb-1">
                    <Subtitles size={12} />
                    <span>Live Mentor Transcripts</span>
                  </div>
                  <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed">
                    &ldquo;{chatMessages[chatMessages.length - 1]?.text}&rdquo;
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Status */}
            <div className="p-4 flex items-center justify-between text-xs text-slate-400 bg-gradient-to-t from-slate-950/80 to-transparent">
              <span className="font-mono text-[11px]">720p HD • 60 FPS</span>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-[11px]">Optimal Connection</span>
              </div>
            </div>
          </div>

          {/* STUDENT VIDEO TILE (You) */}
          <div className="relative bg-[#3c4043] rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between border-2 border-slate-700">
            
            {/* Real Webcam Stream or Fallback */}
            {!isVideoOff && !cameraError ? (
              <video
                ref={userVideoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 flex flex-col items-center justify-center p-6 text-center space-y-3">
                <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-3xl flex items-center justify-center shadow-xl border-4 border-slate-700">
                  You
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Camera is off</h4>
                  <p className="text-[11px] text-slate-400">Click camera button below to enable video preview</p>
                </div>
              </div>
            )}

            {/* Top Tag */}
            <div className="p-4 flex items-center justify-between z-10 relative">
              <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full border border-slate-700/60 text-xs">
                <span className="font-bold text-white">You</span>
                {isAudioMuted && (
                  <span className="text-rose-400">
                    <MicOff size={12} />
                  </span>
                )}
                {isHandRaised && (
                  <span className="text-amber-400 flex items-center gap-1 text-[10px] font-bold">
                    <Hand size={12} /> Raised
                  </span>
                )}
              </div>

              <div className="bg-slate-900/80 backdrop-blur-md p-1.5 rounded-lg text-slate-300">
                <Maximize2 size={14} />
              </div>
            </div>

            {/* Bottom Tag */}
            <div className="p-4 flex items-center justify-between z-10 relative bg-gradient-to-t from-slate-950/80 to-transparent">
              <span className="text-xs text-slate-300 font-semibold">
                {isAudioMuted ? 'Microphone Muted' : 'Microphone Active'}
              </span>
              <div className="flex items-center gap-1 text-slate-400 text-xs">
                {isVideoOff ? <VideoOff size={14} className="text-rose-400" /> : <VideoIcon size={14} className="text-emerald-400" />}
              </div>
            </div>
          </div>

        </div>

        {/* ─── SIDE PANEL (Chat / People / Info) ───────────────────────────── */}
        <AnimatePresence>
          {activeSidePanel && (
            <motion.div
              initial={{ x: 350, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 350, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-80 md:w-96 bg-[#2d2e30] border-l border-slate-700 rounded-3xl p-5 flex flex-col justify-between shadow-2xl relative z-30"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-700">
                <h3 className="text-sm font-bold capitalize text-white flex items-center gap-2">
                  {activeSidePanel === 'chat' && <MessageSquare size={16} className="text-blue-400" />}
                  {activeSidePanel === 'people' && <Users size={16} className="text-emerald-400" />}
                  {activeSidePanel === 'info' && <Info size={16} className="text-violet-400" />}
                  <span>
                    {activeSidePanel === 'chat' && 'In-call Messages'}
                    {activeSidePanel === 'people' && 'Meeting Participants'}
                    {activeSidePanel === 'info' && 'Joining Details'}
                  </span>
                </h3>
                <button
                  onClick={() => setActiveSidePanel(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700"
                >
                  ✕
                </button>
              </div>

              {/* Panel Body */}
              <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
                {/* CHAT TAB */}
                {activeSidePanel === 'chat' && (
                  <div className="space-y-3">
                    <p className="text-[11px] text-slate-400 leading-relaxed bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                      Messages can be seen only by people in the call and are deleted when the call ends.
                    </p>

                    {chatMessages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-2xl text-xs space-y-1 ${
                          msg.sender === 'mentor'
                            ? 'bg-slate-800 text-slate-200 border border-slate-700'
                            : 'bg-blue-600/30 text-blue-100 border border-blue-500/30 ml-4'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold text-[10px]">
                          <span className={msg.sender === 'mentor' ? 'text-emerald-400' : 'text-blue-300'}>
                            {msg.sender === 'mentor' ? `${mentor.name} (Mentor)` : 'You'}
                          </span>
                          <span className="text-slate-400">{msg.time}</span>
                        </div>
                        <p className="leading-relaxed">{msg.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* PEOPLE TAB */}
                {activeSidePanel === 'people' && (
                  <div className="space-y-3">
                    <div className="p-3 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={mentor.avatar}
                          alt={mentor.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-700"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                            {mentor.name}
                            <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-black">
                              Host
                            </span>
                          </h4>
                          <p className="text-[10px] text-slate-400">{mentor.title} @ {mentor.company}</p>
                        </div>
                      </div>
                      <span className="text-emerald-400 text-xs">● Active</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center">
                          You
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white">You (Student)</h4>
                          <p className="text-[10px] text-slate-400">{stageTitle}</p>
                        </div>
                      </div>
                      <span className="text-blue-400 text-xs">● You</span>
                    </div>
                  </div>
                )}

                {/* INFO TAB */}
                {activeSidePanel === 'info' && (
                  <div className="space-y-4 text-xs">
                    <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 space-y-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                        Joining Info
                      </span>
                      <p className="font-mono text-emerald-400 text-sm">
                        meet.careerbridge.app/{roomCode}
                      </p>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`https://meet.careerbridge.app/${roomCode}`);
                          setCopiedLink(true);
                          setTimeout(() => setCopiedLink(false), 2000);
                        }}
                        className="w-full py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold flex items-center justify-center gap-2 transition"
                      >
                        {copiedLink ? <Check size={14} className="text-emerald-400" /> : <Share2 size={14} />}
                        <span>{copiedLink ? 'Copied Link' : 'Copy Joining Info'}</span>
                      </button>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 space-y-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                        Mentor Direct Contacts
                      </span>
                      <p className="text-slate-300">
                        WhatsApp: <strong>+91 {mentor.phone || '7092036790'}</strong>
                      </p>
                      <p className="text-slate-300">
                        Email: <strong>{mentor.email || 'mentor@careerbridge.app'}</strong>
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Form Footer */}
              {activeSidePanel === 'chat' && (
                <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-700 flex items-center gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Send a message to your mentor..."
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition disabled:opacity-50"
                    disabled={!newMessage.trim()}
                  >
                    <Send size={14} />
                  </button>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* ─── BOTTOM CONTROL BAR (Exact Google Meet Design) ───────────────── */}
      <footer className="h-20 px-6 flex items-center justify-between border-t border-slate-800/80 bg-[#1e1f22]">
        
        {/* Left: Meeting code */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400">
          <span>{roomCode}</span>
        </div>

        {/* Center: Essential Controls */}
        <div className="flex items-center gap-3 mx-auto sm:mx-0">
          
          {/* Audio Mute/Unmute */}
          <button
            onClick={() => setIsAudioMuted(!isAudioMuted)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              isAudioMuted
                ? 'bg-rose-600 hover:bg-rose-500 text-white'
                : 'bg-slate-700 hover:bg-slate-600 text-white'
            }`}
            title={isAudioMuted ? 'Turn on microphone' : 'Turn off microphone'}
          >
            {isAudioMuted ? <MicOff size={18} /> : <Mic size={18} />}
          </button>

          {/* Video On/Off */}
          <button
            onClick={toggleCamera}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              isVideoOff
                ? 'bg-rose-600 hover:bg-rose-500 text-white'
                : 'bg-slate-700 hover:bg-slate-600 text-white'
            }`}
            title={isVideoOff ? 'Turn on camera' : 'Turn off camera'}
          >
            {isVideoOff ? <VideoOff size={18} /> : <VideoIcon size={18} />}
          </button>

          {/* Captions (CC) */}
          <button
            onClick={() => setCaptionsEnabled(!captionsEnabled)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              captionsEnabled ? 'bg-blue-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
            }`}
            title="Turn on/off captions"
          >
            <Subtitles size={18} />
          </button>

          {/* Raise Hand */}
          <button
            onClick={() => setIsHandRaised(!isHandRaised)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              isHandRaised ? 'bg-amber-500 text-slate-900' : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
            }`}
            title="Raise hand"
          >
            <Hand size={18} />
          </button>

          {/* Reaction Trays */}
          <div className="relative group">
            <button
              className="w-12 h-12 rounded-full bg-slate-700 hover:bg-slate-600 text-slate-300 flex items-center justify-center transition"
              title="Send a reaction"
            >
              <Smile size={18} />
            </button>
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 hidden group-hover:flex items-center gap-1.5 p-2 bg-slate-800 border border-slate-700 rounded-full shadow-2xl z-50">
              {['💖', '👍', '🎉', '👏', '😂', '🔥'].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => sendReaction(emoji)}
                  className="w-8 h-8 rounded-full hover:bg-slate-700 text-lg flex items-center justify-center transition hover:scale-125"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Screen Share */}
          <button
            onClick={() => setIsScreenSharing(!isScreenSharing)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              isScreenSharing ? 'bg-blue-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
            }`}
            title="Present now"
          >
            <Share2 size={18} />
          </button>

          {/* End Call Button */}
          <button
            onClick={handleEndCall}
            className="w-16 h-12 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-600/30 transition-all hover:scale-105 ml-2"
            title="Leave call"
          >
            <PhoneOff size={20} />
          </button>

        </div>

        {/* Right: Quick Dashboard exit */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={handleEndCall}
            className="text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            Leave & Return
          </button>
        </div>

      </footer>

    </div>
  );
}
