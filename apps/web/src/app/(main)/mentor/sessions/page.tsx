'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { mentorService, MOCK_MENTORS } from '@career-bridge/services';
import { MentorSession, SessionStatus } from '@career-bridge/types';

export default function MentorSessionsPage() {
  const [sessions, setSessions] = useState<MentorSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mentorService.getMySessions().then((res) => {
      if (res && res.length > 0) {
        setSessions(res);
      } else {
        // Fallback default sample session so user can test the live realtime room immediately
        setSessions([
          {
            id: 'session-live-01',
            mentorId: 'mentor-001',
            userId: 'current-user',
            status: SessionStatus.SCHEDULED,
            scheduledAt: new Date(Date.now() + 1800000).toISOString(),
            duration: 45,
            topic: 'System Design & Distributed Scalability Review',
            meetingUrl: '/mentor/mentor-001',
          },
          {
            id: 'session-live-02',
            mentorId: 'mentor-002',
            userId: 'current-user',
            status: SessionStatus.SCHEDULED,
            scheduledAt: new Date(Date.now() + 86400000).toISOString(),
            duration: 60,
            topic: 'Cloud Infrastructure & DevOps Mock Interview',
            meetingUrl: '/mentor/mentor-002',
          }
        ]);
      }
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-white p-4 sm:p-8 pb-24">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Mentorship Sessions</h1>
            <p className="text-slate-400 text-sm mt-1">Manage your active 1-on-1 mentorship bookings and launch realtime rooms</p>
          </div>
          <Link
            href="/mentor"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-bold text-white transition flex items-center gap-2 shadow-lg shadow-blue-600/20 w-fit"
          >
            <span>🔍</span> Find More Mentors
          </Link>
        </div>

        {/* Sessions List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-32 bg-slate-900 border border-slate-800 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
            <span className="text-5xl">📅</span>
            <h3 className="text-xl font-bold text-white">No Scheduled Sessions</h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              You haven't scheduled any 1-on-1 mentorship sessions yet. Explore industry leaders and reserve your slot.
            </p>
            <Link
              href="/mentor"
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-2xl text-sm font-bold transition shadow-lg shadow-blue-600/20"
            >
              Explore Verified Mentors
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => {
              const mentorInfo = MOCK_MENTORS.find(m => m.id === session.mentorId) || MOCK_MENTORS[0];
              const phone = mentorInfo.phone || '7092036790';
              const email = mentorInfo.email || 'lakshanapriya0801@gmail.com';
              const cleanPhone = phone.replace(/\D/g, '');
              const waNumber = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
              const scheduledFormatted = new Date(session.scheduledAt).toLocaleDateString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div
                  key={session.id}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={mentorInfo.avatar}
                      alt={mentorInfo.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-700 shrink-0"
                    />
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-white text-lg">{mentorInfo.name}</h3>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                          {session.status}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 font-semibold border border-blue-500/20">
                          📅 {scheduledFormatted}
                        </span>
                      </div>
                      <p className="text-xs text-blue-400 font-semibold">{session.topic}</p>
                      <p className="text-xs text-slate-400">
                        {mentorInfo.title} @ {mentorInfo.company} · {session.duration} mins
                      </p>

                      {/* Mentor Contact Channels */}
                      <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                        <a
                          href={`https://wa.me/${waNumber}?text=${encodeURIComponent(`*Book for mentor session*\n\nHello ${mentorInfo.name}, regarding our CareerBridge mentorship session on "${session.topic}" scheduled for ${scheduledFormatted}.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 hover:bg-emerald-900/60 transition flex items-center gap-1 font-medium"
                        >
                          <span>💬</span> WhatsApp: +91 {phone}
                        </a>
                        <a
                          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(`Book for mentor session: ${session.topic}`)}&body=${encodeURIComponent(`*Book for mentor session*\n\nDear ${mentorInfo.name},\n\nRegarding mentorship session on "${session.topic}" scheduled for ${scheduledFormatted}.\n\nWarm regards,\nStudent`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded-lg bg-blue-950/60 text-blue-400 border border-blue-800/60 hover:bg-blue-900/60 transition flex items-center gap-1 font-medium"
                        >
                          <span>✉️</span> Gmail: {email}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                    <a
                      href={`https://wa.me/${waNumber}?text=${encodeURIComponent(`*Book for mentor session*\n\nHello ${mentorInfo.name}, following up on our mentor session booking.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2.5 bg-emerald-700/80 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5"
                    >
                      <span>💬</span> WhatsApp (*Book for mentor session*)
                    </a>
                    <Link
                      href={`/mentor/${mentorInfo.id}`}
                      className="flex-1 md:flex-initial px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/20 transition flex items-center justify-center gap-1.5"
                    >
                      <span>👤</span> Mentor Profile & Chat
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
