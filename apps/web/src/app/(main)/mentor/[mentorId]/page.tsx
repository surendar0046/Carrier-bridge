'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { mentorService, LAKSHANAPRIYA_MENTOR } from '@career-bridge/services';
import { Mentor } from '@career-bridge/types';
import { MentorProfile } from '@/features/mentor/components/MentorProfile';
import { ChatInterface } from '@/features/mentor/components/ChatInterface';
import { SessionBooking } from '@/features/mentor/components/SessionBooking';
import { MessageCircle, Mail, Calendar, ShieldCheck, ArrowLeft } from 'lucide-react';

import { ALL_MENTORS } from '@/data/mentorsData';

export default function MentorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const mentorId = String(params?.mentorId || '');

  const [mentor, setMentor] = useState<Mentor>(ALL_MENTORS[0]);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'chat'>('profile');
  const [bookedSuccess, setBookedSuccess] = useState(false);

  useEffect(() => {
    const clean = mentorId.toLowerCase().replace('mentor-', '').trim();
    const localFound = ALL_MENTORS.find(
      (m) =>
        m.id.toLowerCase() === mentorId.toLowerCase() ||
        m.name.toLowerCase() === clean ||
        m.id.toLowerCase().includes(clean)
    );
    if (localFound) {
      setMentor(localFound);
      setLoading(false);
      return;
    }

    mentorService.getMentorById(mentorId).then((res) => {
      setMentor(res || ALL_MENTORS[0]);
      setLoading(false);
    }).catch(() => {
      setMentor(ALL_MENTORS[0]);
      setLoading(false);
    });
  }, [mentorId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] text-white p-6 sm:p-10 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const phone = mentor.phone || '7092036790';
  const email = mentor.email || 'lakshanapriya0801@gmail.com';
  const cleanPhone = phone.replace(/\D/g, '');
  const waNumber = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;

  return (
    <div className="min-h-screen bg-[#020617] text-white p-4 sm:p-8 pb-24">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Navigation Breadcrumb & Mode Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div className="flex items-center gap-3">
            <Link 
              href="/mentor" 
              className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition"
            >
              <ArrowLeft size={18} />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white">{mentor.name}</h1>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full font-bold">
                  Verified Mentor
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">{mentor.title} @ {mentor.company}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'profile' 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              👤 Profile & Booking
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'chat' 
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' 
                  : 'text-slate-400 hover:text-emerald-400'
              }`}
            >
              <MessageCircle size={14} />
              <span>Direct Chat</span>
            </button>
          </div>
        </div>

        {/* Contact Channels Banner */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-300">
          <div className="flex items-center gap-4">
            <a
              href={`https://wa.me/${waNumber}?text=${encodeURIComponent('*Book for mentor session*\n\nHello ' + mentor.name + ', I would like to book a mentorship session.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition font-medium"
            >
              <MessageCircle size={15} />
              <span>WhatsApp: +91 {phone}</span>
            </a>
            <span className="text-slate-700">•</span>
            <a
              href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent('Book for mentor session: Inquiry')}&body=${encodeURIComponent('*Book for mentor session*\n\nDear ' + mentor.name + ',\n\nI want to book a mentorship session.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition font-medium"
            >
              <Mail size={15} />
              <span>Gmail: {email}</span>
            </a>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            Direct 1-on-1 Mentorship Booking
          </span>
        </div>

        {/* Main Content Area */}
        {activeTab === 'profile' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <MentorProfile mentor={mentor} onBook={() => setShowBooking(true)} />
            </div>

            <div className="space-y-6">
              {showBooking ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-300">Reserve Your Slot</h3>
                    <button onClick={() => setShowBooking(false)} className="text-xs text-slate-500 hover:text-slate-300">✕ Cancel</button>
                  </div>
                  <SessionBooking 
                    mentorId={mentor.id} 
                    mentor={mentor}
                    onSuccess={() => {
                      setShowBooking(false);
                      setBookedSuccess(true);
                      setTimeout(() => setBookedSuccess(false), 5000);
                    }} 
                  />
                </div>
              ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
                  <h3 className="text-base font-bold text-white">Direct Mentoring Session</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Schedule 1-on-1 guidance with {mentor.name}. Requests are sent directly to the mentor via WhatsApp and Gmail.
                  </p>
                  
                  <button
                    onClick={() => setShowBooking(true)}
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/20 transition flex items-center justify-center gap-2"
                  >
                    <Calendar size={15} />
                    <span>Book 1-on-1 Mentorship Session</span>
                  </button>

                  <a
                    href={`https://wa.me/${waNumber}?text=${encodeURIComponent('*Book for mentor session*\n\nHello ' + mentor.name + ', I would like to book a mentorship session.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 bg-emerald-600/80 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={15} />
                    <span>WhatsApp (*Book for mentor session*)</span>
                  </a>

                  <a
                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent('Book for mentor session: Inquiry')}&body=${encodeURIComponent('*Book for mentor session*\n\nDear ' + mentor.name + ',\n\nI want to book a mentorship session.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition flex items-center justify-center gap-2"
                  >
                    <Mail size={15} />
                    <span>Send via Gmail ({email})</span>
                  </a>

                  {bookedSuccess && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs font-semibold text-center animate-fade-in">
                      ✓ Session booked! A confirmation email and calendar invite have been sent.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Text Chat Interface (No Video/Call/Mic) */
          <div className="max-w-3xl mx-auto">
            <ChatInterface 
              conversationId={`mentor-session-${mentor.id}`} 
              mentor={mentor} 
            />
          </div>
        )}

      </div>
    </div>
  );
}
