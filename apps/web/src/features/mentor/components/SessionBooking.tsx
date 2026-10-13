'use client';

import React, { useState, useEffect } from 'react';
import { Mentor } from '@career-bridge/types';
import { 
  mentorService, 
  LAKSHANAPRIYA_MENTOR, 
  buildMentorWhatsAppLink, 
  buildMentorGmailLink,
  buildMentorWebGmailLink 
} from '@career-bridge/services';
import { 
  CheckCircle2, 
  Send, 
  MessageCircle, 
  Mail, 
  Calendar, 
  Clock, 
  User, 
  Sparkles,
  ExternalLink,
  ArrowRight,
  MessageSquare
} from 'lucide-react';

interface SessionBookingProps {
  mentorId: string;
  mentor?: Mentor;
  onSuccess?: (sessionData?: any) => void;
}

export const SessionBooking: React.FC<SessionBookingProps> = ({ mentorId, mentor: propMentor, onSuccess }) => {
  const [mentor, setMentor] = useState<Mentor>(propMentor || LAKSHANAPRIYA_MENTOR);
  
  // Date default to tomorrow formatted YYYY-MM-DD
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(tomorrowStr);
  const [selectedTime, setSelectedTime] = useState('06:00 PM');
  const [topic, setTopic] = useState('1-on-1 Career Strategy & Technical Guidance');
  const [studentName, setStudentName] = useState('Rahul Kumar');
  const [studentEmail, setStudentEmail] = useState('student@careerbridge.com');
  const [studentPhone, setStudentPhone] = useState('');
  const [notes, setNotes] = useState('Looking forward to discussing full-stack career growth and interview preparation.');
  
  const [isBooking, setIsBooking] = useState(false);
  const [bookedSession, setBookedSession] = useState<any | null>(null);
  const [whatsappUrl, setWhatsappUrl] = useState<string>('');
  const [gmailUrl, setGmailUrl] = useState<string>('');
  const [webGmailUrl, setWebGmailUrl] = useState<string>('');
  const [redirectNotice, setRedirectNotice] = useState<string>('');

  useEffect(() => {
    if (propMentor) {
      setMentor(propMentor);
    } else {
      mentorService.getMentorById(mentorId).then((found) => {
        if (found) setMentor(found);
        else if (mentorId.includes('lakshanapriya')) setMentor(LAKSHANAPRIYA_MENTOR);
      });
    }

    // Try reading active student name & email from localStorage
    try {
      const userStr = localStorage.getItem('career-bridge-user');
      if (userStr) {
        const parsed = JSON.parse(userStr);
        const profile = parsed?.state?.profile;
        if (profile?.name) setStudentName(profile.name);
        if (profile?.email) setStudentEmail(profile.email);
        if (profile?.phone) setStudentPhone(profile.phone);
      }
    } catch {}
  }, [mentorId, propMentor]);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsBooking(true);

    const activeMentor = mentor || LAKSHANAPRIYA_MENTOR;
    const scheduledDateTime = new Date(`${selectedDate}T${selectedTime.replace(' PM', '').replace(' AM', '')}:00`).toISOString();

    const sessionPayload = {
      studentName,
      studentEmail,
      studentPhone,
      scheduledAt: scheduledDateTime || new Date().toISOString(),
      topic,
      duration: 45,
      notes,
      meetingUrl: typeof window !== 'undefined' ? `${window.location.origin}/mentor/${activeMentor.id}` : `/mentor/${activeMentor.id}`,
    };

    // Build WhatsApp and Gmail links with 'Book for mentor session'
    const waLink = buildMentorWhatsAppLink(activeMentor, sessionPayload);
    const webGLink = buildMentorWebGmailLink(activeMentor, sessionPayload);
    const gLink = buildMentorGmailLink(activeMentor, sessionPayload);

    setWhatsappUrl(waLink);
    setWebGmailUrl(webGLink);
    setGmailUrl(gLink);

    // Auto-redirect immediately upon user gesture to avoid popup blocker
    try {
      if (typeof window !== 'undefined') {
        setRedirectNotice('Redirecting to WhatsApp and Gmail...');
        // 1. Open WhatsApp in new tab
        window.open(waLink, '_blank');
        // 2. Open Gmail Web compose in new tab
        setTimeout(() => {
          window.open(webGLink, '_blank');
        }, 300);
      }
    } catch (popupErr) {
      console.warn('Auto redirect triggered, fallback to direct buttons:', popupErr);
    }

    try {
      // Record session in mentorService persistent state
      const session = await mentorService.bookSession({
        mentorId: activeMentor.id,
        scheduledAt: scheduledDateTime || new Date().toISOString(),
        duration: 45,
        topic,
        studentName,
        studentEmail,
        studentPhone,
        notes,
      });

      // Dispatch notification request via API
      try {
        const res = await fetch('/api/mentorship/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mentorId: activeMentor.id,
            mentorName: activeMentor.name,
            mentorEmail: activeMentor.email || 'lakshanapriya0801@gmail.com',
            mentorPhone: activeMentor.phone || '7092036790',
            studentName,
            studentEmail,
            studentPhone,
            scheduledAt: session.scheduledAt,
            topic,
            duration: 45,
            notes,
            meetingUrl: typeof window !== 'undefined' ? `${window.location.origin}/mentor/${activeMentor.id}` : `/mentor/${activeMentor.id}`,
          }),
        });
        const resData = await res.json();
        if (resData?.data?.whatsappUrl) setWhatsappUrl(resData.data.whatsappUrl);
        if (resData?.data?.webGmailUrl) setWebGmailUrl(resData.data.webGmailUrl);
        if (resData?.data?.gmailUrl) setGmailUrl(resData.data.gmailUrl);
      } catch (notifyErr) {
        console.warn('API notification dispatch error, using direct links:', notifyErr);
      }

      setBookedSession(session);
      setIsBooking(false);

      if (onSuccess) {
        onSuccess(session);
      }
    } catch (err) {
      console.error('Booking failed:', err);
      setIsBooking(false);
    }
  };

  const activeMentor = mentor || LAKSHANAPRIYA_MENTOR;
  const mentorEmail = activeMentor.email || 'lakshanapriya0801@gmail.com';
  const mentorPhone = activeMentor.phone || '7092036790';

  if (bookedSession) {
    return (
      <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 space-y-6 text-slate-200 animate-fadeIn shadow-2xl">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
            <CheckCircle2 size={36} />
          </div>
          <h3 className="text-2xl font-black text-white">Mentorship Booking Confirmed!</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Session with <strong className="text-white">{activeMentor.name}</strong> booked successfully. WhatsApp la <span className="text-emerald-400 font-bold">&quot;*Book for mentor session*&quot;</span> message and Gmail compose redirect aagiduchu.
          </p>
        </div>

        {/* Redirect Status Banner */}
        <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <p className="text-xs text-emerald-300 font-medium">
            WhatsApp &amp; Gmail redirect tabs opened! Browsers pop-up block panniruntha keezha irukura buttons click panni direct-ah send pannunga.
          </p>
        </div>

        {/* High-visibility Action Cards for WhatsApp & Gmail */}
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Direct Messaging &amp; Redirection Links:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* WhatsApp Card */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-4 bg-gradient-to-br from-emerald-900/60 to-slate-900 border border-emerald-500/40 hover:border-emerald-400 rounded-2xl transition shadow-lg hover:shadow-emerald-500/20 flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center">
                  <MessageCircle size={22} />
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Redirected
                </span>
              </div>
              <div>
                <h4 className="font-bold text-white text-sm group-hover:text-emerald-300 transition flex items-center gap-1.5">
                  Open WhatsApp Chat <ExternalLink size={14} />
                </h4>
                <p className="text-[11px] text-slate-400 mt-1">
                  Recipient: <span className="font-mono text-emerald-400">+91 {mentorPhone}</span>
                </p>
                <p className="text-[10px] text-emerald-400/90 font-mono mt-0.5">
                  Message: &quot;*Book for mentor session*&quot;
                </p>
              </div>
              <div className="pt-1 text-xs font-bold text-emerald-400 flex items-center gap-1">
                <span>Send WhatsApp message</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
              </div>
            </a>

            {/* Gmail Card */}
            <a
              href={webGmailUrl || gmailUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-4 bg-gradient-to-br from-red-950/40 via-blue-950/40 to-slate-900 border border-red-500/30 hover:border-red-400 rounded-2xl transition shadow-lg hover:shadow-red-500/20 flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="p-2.5 bg-red-500/20 text-red-400 rounded-xl flex items-center justify-center">
                  <Mail size={22} />
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30">
                  Redirected
                </span>
              </div>
              <div>
                <h4 className="font-bold text-white text-sm group-hover:text-red-300 transition flex items-center gap-1.5">
                  Open Web Gmail <ExternalLink size={14} />
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 truncate">
                  Recipient: <span className="font-mono text-red-300">{mentorEmail}</span>
                </p>
                <p className="text-[10px] text-blue-300 font-mono mt-0.5 truncate">
                  Subject: Book for mentor session: {topic.slice(0, 24)}...
                </p>
              </div>
              <div className="pt-1 text-xs font-bold text-red-400 flex items-center gap-1">
                <span>Compose in Gmail</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
              </div>
            </a>
          </div>

          {/* Mail app fallback */}
          <div className="text-center pt-1">
            <a
              href={gmailUrl}
              className="text-[11px] text-slate-400 hover:text-slate-200 underline decoration-slate-600 transition"
            >
              Prefer desktop mail app (Outlook / Apple Mail)? Click here to open via mailto
            </a>
          </div>
        </div>

        {/* Booking Details Summary */}
        <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80 space-y-2 text-xs">
          <div className="flex justify-between py-1 border-b border-slate-800/60">
            <span className="text-slate-400">Mentor:</span>
            <span className="text-white font-bold">{activeMentor.name} (+91 {mentorPhone})</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-800/60">
            <span className="text-slate-400">Scheduled Date &amp; Time:</span>
            <span className="text-white font-semibold">{selectedDate} at {selectedTime}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-800/60">
            <span className="text-slate-400">Topic:</span>
            <span className="text-white font-semibold truncate max-w-[220px]">{topic}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-400">Student:</span>
            <span className="text-white font-semibold">{studentName} ({studentEmail})</span>
          </div>
        </div>

        {/* Navigation Action Buttons */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <a
            href={`/mentor/${activeMentor.id}`}
            className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition text-center flex items-center justify-center gap-2"
          >
            <MessageSquare size={15} />
            <span>Open Mentorship Chat Room</span>
          </a>

          <a
            href="/mentor/sessions"
            className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition text-center flex items-center justify-center gap-2"
          >
            <span>View My Sessions</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleBook} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-4 text-slate-200">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>Schedule Mentorship with {activeMentor.name}</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Verified Mentor
            </span>
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Booking requests are sent directly to the mentor via WhatsApp and Gmail.
          </p>
        </div>
      </div>

      {/* Mentor Contact Preview */}
      <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <MessageCircle size={14} className="text-emerald-400" />
          <span>WhatsApp: <strong className="text-white">+91 {mentorPhone}</strong></span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <Mail size={14} className="text-blue-400" />
          <span>Gmail: <strong className="text-white">{mentorEmail}</strong></span>
        </div>
      </div>

      {/* Session Topic */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Session Topic</label>
        <select
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
        >
          <option value="1-on-1 Career Strategy & Technical Guidance">1-on-1 Career Strategy & Technical Guidance</option>
          <option value="Full Stack Development & System Design Review">Full Stack Development & System Design Review</option>
          <option value="Mock Technical Coding Interview">Mock Technical Coding Interview</option>
          <option value="Resume, Portfolio & Project Critique">Resume, Portfolio & Project Critique</option>
          <option value="DSA & Algorithm Problem Solving">DSA & Algorithm Problem Solving</option>
        </select>
      </div>

      {/* Date & Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
            <Calendar size={13} className="text-blue-400" /> Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            required
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
            <Clock size={13} className="text-blue-400" /> Time Slot
          </label>
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="10:00 AM">10:00 AM IST</option>
            <option value="02:00 PM">02:00 PM IST</option>
            <option value="06:00 PM">06:00 PM IST</option>
            <option value="08:00 PM">08:00 PM IST</option>
          </select>
        </div>
      </div>

      {/* Student Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Your Name</label>
          <input
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            required
            placeholder="Student Name"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Your Email</label>
          <input
            type="email"
            value={studentEmail}
            onChange={(e) => setStudentEmail(e.target.value)}
            required
            placeholder="student@example.com"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Student Phone (optional) */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Your WhatsApp / Phone (Optional for mentor contact)</label>
        <input
          type="tel"
          value={studentPhone}
          onChange={(e) => setStudentPhone(e.target.value)}
          placeholder="e.g. 9876543210"
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Note for Mentor */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Note or Question for {activeMentor.name}</label>
        <textarea
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Briefly describe what you'd like guidance on..."
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={isBooking}
        className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl transition shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 disabled:opacity-60"
      >
        {isBooking ? (
          <>
            <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Booking & Preparing WhatsApp / Gmail Notification...</span>
          </>
        ) : (
          <>
            <Send size={15} />
            <span>Confirm Booking &amp; Redirect to WhatsApp &amp; Gmail</span>
          </>
        )}
      </button>

      <p className="text-[10px] text-center text-slate-500">
        Book pannavudanae automatic-ah mentor Lakshanapriya WhatsApp (+91 {mentorPhone}) la &quot;*Book for mentor session*&quot; message oda redirect aagum, and Gmail ({mentorEmail}) compose redirect aagi request send aagum.
      </p>
    </form>
  );
};
