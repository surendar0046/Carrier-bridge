'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import Link from 'next/link';
import { Mentor } from '@career-bridge/types';
import { 
  buildMentorWhatsAppLink, 
  buildMentorGmailLink 
} from '@career-bridge/services';
import { ALL_MENTORS } from '@/data/mentorsData';
import { ChatInterface } from '@/features/mentor/components/ChatInterface';
import { SessionBooking } from '@/features/mentor/components/SessionBooking';
import { 
  MessageCircle, 
  Mail, 
  Calendar, 
  Star, 
  ShieldCheck, 
  ExternalLink,
  Search,
  Filter,
  Users,
  CheckCircle2,
  Clock
} from 'lucide-react';

/* ─── 1-on-1 Mentorship Booking & Chat Modal ─────────────────────────────── */
function BookingAndChatModal({ 
  mentor, 
  initialTab = 'book', 
  onClose 
}: { 
  mentor: Mentor; 
  initialTab?: 'book' | 'chat'; 
  onClose: () => void; 
}) {
  const [tab, setTab] = useState<'book' | 'chat'>(initialTab);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const phone = mentor.phone || '9342397141';
  const email = mentor.email || 'mentor@careerbridge.com';
  const cleanPhone = phone.replace(/\D/g, '');
  const waNumber = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div 
        ref={panelRef} 
        className="relative w-full sm:max-w-3xl max-h-[92dvh] bg-[#0b1120] border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md flex-shrink-0">
          <div className="flex items-center gap-3">
            <img
              src={mentor.avatar}
              alt={mentor.name}
              className="w-12 h-12 rounded-2xl border-2 border-blue-500/40 object-cover shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <p className="font-bold text-white text-base leading-tight">{mentor.name}</p>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                  Verified Mentor
                </span>
              </div>
              <p className="text-xs text-slate-400">{mentor.title}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-950 rounded-xl p-1 border border-slate-800">
              <button
                onClick={() => setTab('book')}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                  tab === 'book'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Calendar size={13} />
                <span>Book Session</span>
              </button>
              <button
                onClick={() => setTab('chat')}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                  tab === 'chat'
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <MessageCircle size={13} />
                <span>Message Mentor</span>
              </button>
            </div>

            <button 
              onClick={onClose} 
              className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-sm transition"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Mentor Direct Contact Channels */}
        <div className="px-6 py-2.5 bg-slate-950/80 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
          <div className="flex items-center gap-4">
            <a
              href={`https://wa.me/${waNumber}?text=${encodeURIComponent('*Book for mentor session*\n\nHello ' + mentor.name + ', I would like to book a mentorship session.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition font-medium"
            >
              <MessageCircle size={14} />
              <span>WhatsApp: +91 {phone}</span>
            </a>
            <span className="text-slate-700">•</span>
            <a
              href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent('Book for mentor session: Inquiry')}&body=${encodeURIComponent('*Book for mentor session*\n\nDear ' + mentor.name + ',\n\nI want to book a mentorship session.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition font-medium"
            >
              <Mail size={14} />
              <span>Gmail: {email}</span>
            </a>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">Response time: {mentor.responseTime}</span>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          {tab === 'book' ? (
            <div className="max-w-xl mx-auto py-2">
              <SessionBooking mentorId={mentor.id} mentor={mentor} />
            </div>
          ) : (
            <div className="max-w-2xl mx-auto py-2">
              <ChatInterface 
                conversationId={`mentor-session-${mentor.id}`} 
                mentor={mentor} 
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const CATEGORIES = [
  'All',
  'Full Stack',
  'AI / ML',
  'DevOps',
  'Cybersecurity',
  'Backend',
  'UI/UX',
  'Mobile & QA'
];

/* ─── Main Mentorship Page ──────────────────────────────────────────────── */
export default function MentorPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'book' | 'chat'>('book');
  const [modalMentor, setModalMentor] = useState<Mentor>(ALL_MENTORS[0]);

  const filteredMentors = useMemo(() => {
    return ALL_MENTORS.filter((m) => {
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        q === '' ||
        m.name.toLowerCase().includes(q) ||
        m.title.toLowerCase().includes(q) ||
        m.expertise.some((e) => e.toLowerCase().includes(q)) ||
        (m.email || '').toLowerCase().includes(q);

      const cat = activeCategory.toLowerCase();
      const matchCategory =
        activeCategory === 'All' ||
        m.expertise.some((e) => e.toLowerCase().includes(cat)) ||
        m.title.toLowerCase().includes(cat);

      return matchSearch && matchCategory;
    });
  }, [searchQuery, activeCategory]);

  const openBookingModal = (mentor: Mentor, tab: 'book' | 'chat' = 'book') => {
    setModalMentor(mentor);
    setModalTab(tab);
    setModalOpen(true);
  };

  const getDirectLinks = (mentor: Mentor) => {
    const phone = mentor.phone || '9342397141';
    const email = mentor.email || 'mentor@careerbridge.com';
    const cleanPhone = phone.replace(/\D/g, '');
    const waNumber = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
    const defaultWaMessage = `*Book for mentor session*\n\nHello ${mentor.name}, I would like to schedule a 1-on-1 mentorship session with you through CareerBridge.`;
    const whatsappDirectUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(defaultWaMessage)}`;
    const gmailDirectUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(`Book for mentor session: Inquiry (${mentor.name})`)}&body=${encodeURIComponent(`Dear ${mentor.name},\n\n*Book for mentor session*\n\nI would like to book a 1-on-1 mentorship session with you on CareerBridge.\n\nWarm regards,\nStudent`)}`;
    return { phone, email, whatsappDirectUrl, gmailDirectUrl };
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-8 pb-28">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-black text-white tracking-tight">Mentorship Network</h1>
              <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 shadow-sm">
                <ShieldCheck size={14} /> {ALL_MENTORS.length} Industry Mentors Active
              </span>
            </div>
            <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
              Connect directly with verified mentors. Select any mentor to book a 1-on-1 session with instant WhatsApp & Gmail booking dispatch, or start a live chat.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/mentor/sessions"
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow"
            >
              <Calendar size={15} />
              <span>My Booked Sessions</span>
            </Link>
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="space-y-4 bg-slate-900/70 p-5 sm:p-6 rounded-3xl border border-slate-800 shadow-xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search mentor by name, track, or skill (e.g. Sivaabinesh, Surendar, DevOps, AI, Python)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mr-2 flex items-center gap-1">
              <Filter size={12} /> Tracks:
            </span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 border border-blue-500'
                    : 'bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800/80 hover:border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* All Mentors Grid - Featured Front & Center */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Users size={20} className="text-blue-400" />
              <span>Mentors Directory</span>
              <span className="text-xs bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2.5 py-0.5 rounded-full font-mono font-bold">
                {filteredMentors.length} Available
              </span>
            </h2>
            <span className="text-xs text-slate-400 hidden sm:inline">Choose any mentor to schedule or contact</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMentors.map((m) => {
              const links = getDirectLinks(m);

              return (
                <div
                  key={m.id}
                  className="bg-slate-900/90 border border-slate-800 hover:border-blue-500/60 rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 group"
                >
                  <div className="space-y-4">
                    {/* Avatar, Online status, Name, Role */}
                    <div className="flex items-start gap-4">
                      <div className="relative flex-shrink-0">
                        <img
                          src={m.avatar}
                          alt={m.name}
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-700 shadow-md group-hover:border-blue-500/60 transition"
                        />
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-900 shadow" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="text-base font-black text-white group-hover:text-blue-400 transition truncate">{m.name}</h3>
                          <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                            Verified
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-slate-300 mt-0.5 leading-snug line-clamp-2">{m.title}</p>
                      </div>
                    </div>

                    {/* Stats Pill */}
                    <div className="flex items-center justify-between p-2.5 bg-slate-950/80 rounded-xl border border-slate-800/80 text-xs">
                      <span className="font-bold text-yellow-400 flex items-center gap-1">
                        <Star size={13} fill="currentColor" /> {m.rating} ({m.reviewCount})
                      </span>
                      <span className="text-slate-400 text-[11px]">
                        {m.totalSessions}+ sessions
                      </span>
                      <span className="font-extrabold text-emerald-400">
                        ₹{m.hourlyRate}/hr
                      </span>
                    </div>

                    {/* Direct Contact Links */}
                    <div className="space-y-1.5 text-xs">
                      <a
                        href={links.whatsappDirectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 px-3 py-1.5 rounded-xl font-medium"
                      >
                        <MessageCircle size={14} className="flex-shrink-0" />
                        <span className="truncate">WhatsApp: +91 {links.phone}</span>
                      </a>
                      <a
                        href={links.gmailDirectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 px-3 py-1.5 rounded-xl font-medium truncate"
                      >
                        <Mail size={14} className="flex-shrink-0" />
                        <span className="truncate">Gmail: {links.email}</span>
                      </a>
                    </div>

                    {/* Bio Snippet */}
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {m.bio}
                    </p>

                    {/* Expertise Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {m.expertise.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[10px] font-semibold rounded-lg border border-slate-700/60"
                        >
                          {tag}
                        </span>
                      ))}
                      {m.expertise.length > 3 && (
                        <span className="px-1.5 py-0.5 text-slate-500 text-[10px] font-bold">
                          +{m.expertise.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Booking / Action Buttons */}
                  <div className="pt-4 border-t border-slate-800/80 mt-4 space-y-2">
                    <button
                      onClick={() => openBookingModal(m, 'book')}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/25 transition flex items-center justify-center gap-1.5"
                    >
                      <Calendar size={14} />
                      <span>Book 1-on-1 Session</span>
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => openBookingModal(m, 'chat')}
                        className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition flex items-center justify-center gap-1.5"
                      >
                        <MessageCircle size={13} />
                        <span>Chat</span>
                      </button>

                      <Link
                        href={`/mentor/${m.id}`}
                        className="w-full py-2 bg-slate-950 hover:bg-slate-800 text-blue-400 font-bold text-xs rounded-xl border border-slate-800 transition flex items-center justify-center gap-1"
                      >
                        <span>Profile</span>
                        <ExternalLink size={12} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Modal for popup booking / chat */}
      {modalOpen && (
        <BookingAndChatModal
          mentor={modalMentor}
          initialTab={modalTab}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
