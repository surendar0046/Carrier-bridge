'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Mentor } from '@career-bridge/types';
import { ALL_MENTORS } from '@/data/mentorsData';
import {
  Video,
  Calendar,
  Clock,
  CheckCircle2,
  X,
  Phone,
  Mail,
  MessageCircle,
  ArrowRight,
  Sparkles,
  Users,
  Shield,
  ChevronDown,
  ExternalLink,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MentorMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToDashboard: () => void;
  studentName: string;
  studentEmail: string;
  assignedDomain: string;
  assignedRole: string;
  onboardingStage: 'school' | 'early' | 'final';
}

// ── Domain → Mentor Expertise Mapping ────────────────────────────────────
const DOMAIN_MENTOR_MAP: Record<string, string[]> = {
  // School stage branches
  'Computer Science': ['Full Stack Development', 'React & Next.js', 'Backend Development'],
  'CSE': ['Full Stack Development', 'React & Next.js', 'Backend Development'],
  'AI & Data Science': ['AI & Machine Learning', 'Python & PyTorch', 'Data Engineering'],
  'AI': ['AI & Machine Learning', 'Python & PyTorch', 'Data Engineering'],
  'Electronics': ['Full Stack Development', 'Backend Development'],
  'ECE': ['Full Stack Development', 'Backend Development'],
  'Mechanical': ['Full Stack Development', 'Career Strategy'],
  'Information Technology': ['Full Stack Development', 'React & Next.js'],
  'IT': ['Full Stack Development', 'React & Next.js'],

  // Early & Final stage domains
  'Full-Stack Software Development': ['Full Stack Development', 'React & Next.js', 'Backend Development'],
  'Full Stack': ['Full Stack Development', 'React & Next.js'],
  'Frontend': ['UI/UX Design', 'Frontend Engineering', 'React & Next.js'],
  'Backend': ['Backend Development', 'Node.js & Go', 'PostgreSQL & Redis'],
  'AI/ML': ['AI & Machine Learning', 'Python & PyTorch', 'Deep Learning'],
  'Data Science': ['AI & Machine Learning', 'Data Engineering'],
  'Cloud & DevOps': ['DevOps & CI/CD', 'Docker & Kubernetes', 'AWS / Cloud Infrastructure'],
  'DevOps': ['DevOps & CI/CD', 'Docker & Kubernetes'],
  'Cybersecurity': ['Cybersecurity', 'Penetration Testing', 'Network Security'],
  'Mobile Development': ['Mobile App Development', 'Flutter & React Native'],
  'UI/UX Design': ['UI/UX Design', 'Design Systems', 'Product Design'],

  // Placement roles
  'Software Development Engineer': ['Full Stack Development', 'Backend Development', 'Interview Preparation'],
  'SDE': ['Full Stack Development', 'Backend Development', 'Interview Preparation'],
  'Data Analyst': ['AI & Machine Learning', 'Data Engineering'],
  'DevOps Engineer': ['DevOps & CI/CD', 'Docker & Kubernetes'],
  'QA Engineer': ['QA & Automation Testing', 'Agile Workflows'],
};

function findBestMentors(assignedDomain: string, assignedRole: string): Mentor[] {
  // Find matching expertise tags
  const domainKey = Object.keys(DOMAIN_MENTOR_MAP).find(
    (k) =>
      assignedDomain.toLowerCase().includes(k.toLowerCase()) ||
      assignedRole.toLowerCase().includes(k.toLowerCase()) ||
      k.toLowerCase().includes(assignedDomain.toLowerCase().split(' ')[0])
  );

  const targetExpertise = domainKey ? DOMAIN_MENTOR_MAP[domainKey] : [];

  // Score each mentor
  const scored = ALL_MENTORS.map((mentor) => {
    let score = 0;
    for (const exp of mentor.expertise) {
      if (targetExpertise.some((t) => exp.toLowerCase().includes(t.toLowerCase()) || t.toLowerCase().includes(exp.toLowerCase()))) {
        score += 10;
      }
    }
    // Bonus for verified + high rating
    if (mentor.isVerified) score += 3;
    score += mentor.rating * 2;
    return { mentor, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.map((s) => s.mentor);
}

// ── Time Slot Generator ──────────────────────────────────────────────────
function generateTimeSlots(): { date: string; display: string; time: string; dayLabel: string }[] {
  const slots: { date: string; display: string; time: string; dayLabel: string }[] = [];
  const now = new Date();

  for (let d = 1; d <= 7; d++) {
    const date = new Date(now);
    date.setDate(date.getDate() + d);
    const dayLabel =
      d === 1 ? 'Tomorrow' : date.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });

    const times = ['17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00'];
    // Weekend has more slots
    if (date.getDay() === 0 || date.getDay() === 6) {
      times.unshift('10:00', '10:30', '11:00', '14:00', '14:30', '15:00');
    }

    for (const t of times) {
      const [h, m] = t.split(':');
      const hour = parseInt(h, 10);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour > 12 ? hour - 12 : hour;
      slots.push({
        date: date.toISOString().split('T')[0],
        display: `${displayHour}:${m} ${ampm}`,
        time: t,
        dayLabel,
      });
    }
  }
  return slots;
}

// ── Generate a deterministic Google Meet-style room code ─────────────────
function generateMeetCode(email: string, mentorId: string): string {
  const hash = (email + mentorId + Date.now().toString(36)).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  const seg1 = Array.from({ length: 3 }, (_, i) => chars[(hash * (i + 1)) % 26]).join('');
  const seg2 = Array.from({ length: 4 }, (_, i) => chars[(hash * (i + 4)) % 26]).join('');
  const seg3 = Array.from({ length: 3 }, (_, i) => chars[(hash * (i + 8)) % 26]).join('');
  return `${seg1}-${seg2}-${seg3}`;
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN MODAL COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
export const MentorMeetingModal: React.FC<MentorMeetingModalProps> = ({
  isOpen,
  onClose,
  onProceedToDashboard,
  studentName,
  studentEmail,
  assignedDomain,
  assignedRole,
  onboardingStage,
}) => {
  const [step, setStep] = useState<'select_mentor' | 'select_slot' | 'confirmed'>('select_mentor');
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ date: string; time: string; display: string; dayLabel: string } | null>(null);
  const [meetCode, setMeetCode] = useState('');
  const [showAllMentors, setShowAllMentors] = useState(false);

  const rankedMentors = useMemo(() => findBestMentors(assignedDomain, assignedRole), [assignedDomain, assignedRole]);
  const timeSlots = useMemo(() => generateTimeSlots(), []);

  // Group slots by day
  const slotsByDay = useMemo(() => {
    const map: Record<string, typeof timeSlots> = {};
    for (const s of timeSlots) {
      if (!map[s.dayLabel]) map[s.dayLabel] = [];
      map[s.dayLabel].push(s);
    }
    return map;
  }, [timeSlots]);

  const [expandedDay, setExpandedDay] = useState<string>(Object.keys(slotsByDay)[0] || '');

  useEffect(() => {
    if (isOpen) {
      setStep('select_mentor');
      setSelectedMentor(null);
      setSelectedSlot(null);
      setMeetCode('');
      setShowAllMentors(false);
    }
  }, [isOpen]);

  const stageLabel =
    onboardingStage === 'school'
      ? '12th Standard'
      : onboardingStage === 'early'
        ? '1st & 2nd Year'
        : '3rd & 4th Year';

  const stageColor =
    onboardingStage === 'school'
      ? { gradient: 'from-emerald-600 to-teal-600', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', ring: 'ring-emerald-500/20' }
      : onboardingStage === 'early'
        ? { gradient: 'from-blue-600 to-indigo-600', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', ring: 'ring-blue-500/20' }
        : { gradient: 'from-violet-600 to-purple-700', bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200', ring: 'ring-violet-500/20' };

  const handleSelectMentor = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    setStep('select_slot');
  };

  const handleSelectSlot = (slot: typeof timeSlots[0]) => {
    setSelectedSlot(slot);
    const code = generateMeetCode(studentEmail, selectedMentor!.id);
    setMeetCode(code);

    // Persist meeting to localStorage
    if (typeof window !== 'undefined') {
      const emailKey = studentEmail.toLowerCase().trim();
      const meetingData = {
        mentorId: selectedMentor!.id,
        mentorName: selectedMentor!.name,
        mentorAvatar: selectedMentor!.avatar,
        mentorEmail: selectedMentor!.email,
        mentorPhone: selectedMentor!.phone,
        mentorExpertise: selectedMentor!.expertise,
        date: slot.date,
        time: slot.time,
        display: slot.display,
        dayLabel: slot.dayLabel,
        meetCode: code,
        meetUrl: `/meet/${code}?mentorId=${selectedMentor!.id}&domain=${encodeURIComponent(assignedDomain)}&role=${encodeURIComponent(assignedRole)}&stage=${onboardingStage}`,
        topic: `${stageLabel} Onboarding Guidance - ${assignedRole}`,
        stage: onboardingStage,
        assignedDomain,
        assignedRole,
        bookedAt: new Date().toISOString(),
        status: 'scheduled',
      };
      localStorage.setItem(`cb_mentor_meeting_${emailKey}`, JSON.stringify(meetingData));

      // Also add to the sessions list
      const existingSessions = JSON.parse(localStorage.getItem(`cb_mentor_sessions_${emailKey}`) || '[]');
      existingSessions.push(meetingData);
      localStorage.setItem(`cb_mentor_sessions_${emailKey}`, JSON.stringify(existingSessions));
    }

    setStep('confirmed');
  };

  const displayedMentors = showAllMentors ? rankedMentors : rankedMentors.slice(0, 3);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
          transition={{ type: 'spring', duration: 0.4 }}
          className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-[2rem] shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
        >
          {/* ─── Header ────────────────────────────────────────────────── */}
          <div className={`relative px-7 pt-7 pb-5 bg-gradient-to-r ${stageColor.gradient} text-white overflow-hidden`}>
            <div className="absolute top-0 right-0 w-60 h-60 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition"
            >
              <X size={16} />
            </button>

            <div className="relative z-10 flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Video size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider opacity-80">
                    {stageLabel} Onboarding Complete
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <h2 className="text-xl sm:text-2xl font-black leading-tight mt-0.5">
                  {step === 'confirmed' ? 'Meeting Scheduled!' : 'Schedule Your Mentor Meeting'}
                </h2>
                <p className="text-sm opacity-80 mt-1 max-w-md">
                  {step === 'confirmed'
                    ? 'Your 1-on-1 Google Meet session is booked. Check your WhatsApp and email for the link.'
                    : 'Book a free 1-on-1 video call with a verified mentor to discuss your personalized path.'}
                </p>
              </div>
            </div>
          </div>

          {/* ─── Body ──────────────────────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto px-7 py-5 space-y-5">
            {/* STEP 1: Select Mentor */}
            {step === 'select_mentor' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                      <Users size={16} className={stageColor.text} />
                      Recommended Mentors for {assignedDomain || assignedRole}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Matched based on your onboarding results. All mentors are verified industry professionals.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {displayedMentors.map((mentor, idx) => (
                    <button
                      key={mentor.id}
                      onClick={() => handleSelectMentor(mentor)}
                      className={`w-full p-4 rounded-2xl border text-left transition-all hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] flex items-start gap-4 group ${
                        idx === 0
                          ? `${stageColor.bg} ${stageColor.border} ring-2 ${stageColor.ring}`
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="relative shrink-0">
                        <img
                          src={mentor.avatar}
                          alt={mentor.name}
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-md"
                        />
                        {idx === 0 && (
                          <div className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gradient-to-r ${stageColor.gradient} flex items-center justify-center`}>
                            <Sparkles size={10} className="text-white" />
                          </div>
                        )}
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
                      </div>

                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-black text-slate-900">{mentor.name}</span>
                          {idx === 0 && (
                            <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r ${stageColor.gradient} text-white`}>
                              Best Match
                            </span>
                          )}
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                            <Shield size={9} /> Verified
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 font-semibold">{mentor.title}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {mentor.expertise.slice(0, 3).map((exp) => (
                            <span key={exp} className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 border border-slate-200">
                              {exp}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
                          <span className="flex items-center gap-1">
                            ⭐ {mentor.rating}
                          </span>
                          <span>{mentor.reviewCount} reviews</span>
                          <span>{mentor.totalSessions} sessions</span>
                        </div>
                      </div>

                      <div className={`self-center w-8 h-8 rounded-xl bg-gradient-to-r ${stageColor.gradient} flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity`}>
                        <ArrowRight size={14} className="text-white" />
                      </div>
                    </button>
                  ))}
                </div>

                {!showAllMentors && rankedMentors.length > 3 && (
                  <button
                    onClick={() => setShowAllMentors(true)}
                    className="w-full py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center justify-center gap-1.5 transition"
                  >
                    <ChevronDown size={14} />
                    Show all {rankedMentors.length} mentors
                  </button>
                )}
              </div>
            )}

            {/* STEP 2: Select Time Slot */}
            {step === 'select_slot' && selectedMentor && (
              <div className="space-y-4">
                <button
                  onClick={() => setStep('select_mentor')}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 transition flex items-center gap-1"
                >
                  ← Change Mentor
                </button>

                {/* Selected mentor mini-card */}
                <div className={`p-3.5 rounded-2xl ${stageColor.bg} ${stageColor.border} border flex items-center gap-3`}>
                  <img src={selectedMentor.avatar} alt={selectedMentor.name} className="w-10 h-10 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-black text-slate-900">{selectedMentor.name}</span>
                    <p className="text-xs text-slate-600">{selectedMentor.title}</p>
                  </div>
                  <CheckCircle2 size={18} className={stageColor.text} />
                </div>

                <div>
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <Calendar size={16} className={stageColor.text} />
                    Pick a Time Slot
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    30-minute free 1-on-1 video call via Google Meet
                  </p>
                </div>

                <div className="space-y-3">
                  {Object.entries(slotsByDay).slice(0, 5).map(([dayLabel, slots]) => (
                    <div key={dayLabel}>
                      <button
                        onClick={() => setExpandedDay(expandedDay === dayLabel ? '' : dayLabel)}
                        className="w-full flex items-center justify-between text-xs font-black text-slate-700 uppercase tracking-wider py-2 px-1 hover:text-slate-900 transition"
                      >
                        <span className="flex items-center gap-1.5">
                          <Clock size={12} className={stageColor.text} />
                          {dayLabel}
                        </span>
                        <ChevronDown size={14} className={`transition-transform ${expandedDay === dayLabel ? 'rotate-180' : ''}`} />
                      </button>

                      {expandedDay === dayLabel && (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pb-2">
                          {slots.map((slot) => (
                            <button
                              key={`${slot.date}-${slot.time}`}
                              onClick={() => handleSelectSlot(slot)}
                              className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all hover:scale-[1.03] active:scale-95 ${
                                selectedSlot?.date === slot.date && selectedSlot?.time === slot.time
                                  ? `bg-gradient-to-r ${stageColor.gradient} text-white border-transparent shadow-md`
                                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                              }`}
                            >
                              {slot.display}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 3: Confirmed - Google Meet Style */}
            {step === 'confirmed' && selectedMentor && selectedSlot && (
              <div className="space-y-5">
                {/* Meet Card */}
                <div className="p-6 rounded-[2rem] bg-slate-900 text-white space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                        <Video size={16} className="text-emerald-400" />
                      </div>
                      <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">
                        Career Bridge Meet
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full">
                      30 min session
                    </span>
                  </div>

                  {/* Meeting Link & Launch Call */}
                  <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                        Google Meet Link
                      </span>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full">
                        Room Ready
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-600 text-xs font-mono text-emerald-300 truncate">
                        meet.careerbridge.app/{meetCode}
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`https://meet.careerbridge.app/${meetCode}`);
                        }}
                        className="px-3.5 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold transition shrink-0"
                      >
                        Copy
                      </button>
                    </div>

                    <a
                      href={`/meet/${meetCode}?mentorId=${selectedMentor.id}&domain=${encodeURIComponent(assignedDomain)}&role=${encodeURIComponent(assignedRole)}&stage=${onboardingStage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-black text-xs shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition hover:scale-[1.01]"
                    >
                      <Video size={16} />
                      <span>Join Google Meet Call Now</span>
                      <ExternalLink size={13} className="opacity-80" />
                    </a>
                  </div>

                  {/* Participants */}
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-3">
                      <img
                        src={selectedMentor.avatar}
                        alt={selectedMentor.name}
                        className="w-10 h-10 rounded-full border-2 border-slate-900 object-cover"
                      />
                      <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-xs font-black">
                        {studentName.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div className="text-xs text-slate-300">
                      <span className="font-bold text-white">{selectedMentor.name}</span>
                      <span className="text-slate-500"> &amp; </span>
                      <span className="font-bold text-white">{studentName}</span>
                    </div>
                  </div>

                  {/* Schedule Info */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-slate-800 border border-slate-700">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Date</span>
                      <p className="text-sm font-black text-white mt-0.5">{selectedSlot.dayLabel}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-800 border border-slate-700">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Time</span>
                      <p className="text-sm font-black text-white mt-0.5">{selectedSlot.display} IST</p>
                    </div>
                  </div>

                  {/* Topic */}
                  <div className="p-3 rounded-xl bg-slate-800 border border-slate-700">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Discussion Topic</span>
                    <p className="text-sm font-bold text-white mt-0.5">
                      {stageLabel} Onboarding Guidance &mdash; {assignedRole}
                    </p>
                  </div>
                </div>

                {/* Contact Channels */}
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    Mentor Contact Channels
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <a
                      href={`https://wa.me/91${(selectedMentor.phone || '').replace(/\D/g, '')}?text=${encodeURIComponent(
                        `*Book for mentor session*\n\nHello ${selectedMentor.name},\n\nI just completed my ${stageLabel} onboarding on CareerBridge and have been matched with you as my mentor.\n\nDomain: ${assignedDomain}\nRole: ${assignedRole}\nMeeting: ${selectedSlot.dayLabel} at ${selectedSlot.display} IST\nMeet Link: https://meet.careerbridge.app/${meetCode}\n\nLooking forward to connecting!\n\n- ${studentName}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition flex items-center gap-3"
                    >
                      <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center">
                        <MessageCircle size={16} className="text-white" />
                      </div>
                      <div>
                        <span className="text-xs font-black text-emerald-900">WhatsApp</span>
                        <p className="text-[10px] text-emerald-700 font-medium">+91 {selectedMentor.phone}</p>
                      </div>
                    </a>

                    <a
                      href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(selectedMentor.email || '')}&su=${encodeURIComponent(
                        `Book for mentor session: ${stageLabel} Onboarding - ${assignedRole}`
                      )}&body=${encodeURIComponent(
                        `*Book for mentor session*\n\nDear ${selectedMentor.name},\n\nI just completed my ${stageLabel} onboarding on CareerBridge.\n\nDomain: ${assignedDomain}\nRole: ${assignedRole}\nScheduled: ${selectedSlot.dayLabel} at ${selectedSlot.display} IST\nMeet Link: https://meet.careerbridge.app/${meetCode}\n\nLooking forward to our session!\n\nBest regards,\n${studentName}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 hover:bg-blue-100 transition flex items-center gap-3"
                    >
                      <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
                        <Mail size={16} className="text-white" />
                      </div>
                      <div>
                        <span className="text-xs font-black text-blue-900">Gmail</span>
                        <p className="text-[10px] text-blue-700 font-medium truncate max-w-[160px]">{selectedMentor.email}</p>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ─── Footer ────────────────────────────────────────────────── */}
          <div className="px-7 py-4 border-t border-slate-200 bg-slate-50/80 flex items-center justify-between gap-3">
            {step === 'confirmed' ? (
              <>
                <p className="text-[11px] text-slate-500 font-medium">
                  Meeting saved to your dashboard. Your mentor will be notified.
                </p>
                <button
                  onClick={onProceedToDashboard}
                  className={`px-6 py-3 rounded-2xl bg-gradient-to-r ${stageColor.gradient} text-white font-black text-xs shadow-lg hover:scale-[1.02] transition-transform flex items-center gap-2 shrink-0`}
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight size={14} />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={step === 'select_mentor' ? onClose : () => setStep('select_mentor')}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 transition"
                >
                  {step === 'select_mentor' ? 'Skip for now' : '← Back'}
                </button>
                <button
                  onClick={onProceedToDashboard}
                  className="text-xs font-bold text-slate-400 hover:text-slate-600 transition"
                >
                  Skip &amp; go to dashboard →
                </button>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
