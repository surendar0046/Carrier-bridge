'use client';
import React, { useState } from 'react';

interface SessionBookingProps {
  mentorId: string;
  onSuccess: () => void;
}

export const SessionBooking: React.FC<SessionBookingProps> = ({ mentorId, onSuccess }) => {
  const [selectedDate, setSelectedDate] = useState('2026-08-05');
  const [selectedTime, setSelectedTime] = useState('10:00 AM');
  const [topic, setTopic] = useState('System Design & Architecture Review');
  const [isBooking, setIsBooking] = useState(false);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsBooking(true);
    setTimeout(() => {
      setIsBooking(false);
      onSuccess();
    }, 1000);
  };

  return (
    <form onSubmit={handleBook} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 text-slate-200">
      <h3 className="text-base font-bold text-white">Schedule 1-on-1 Mentorship</h3>

      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Session Topic</label>
        <select
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
        >
          <option value="System Design & Architecture Review">System Design & Architecture Review</option>
          <option value="Mock Technical Interview">Mock Technical Interview</option>
          <option value="Resume & Portfolio Strategy">Resume & Portfolio Strategy</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Time Slot</label>
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="10:00 AM">10:00 AM EST</option>
            <option value="02:00 PM">02:00 PM EST</option>
            <option value="06:00 PM">06:00 PM EST</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={isBooking}
        className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition shadow-lg shadow-blue-500/20"
      >
        {isBooking ? 'Confirming Session...' : 'Confirm & Reserve Slot'}
      </button>
    </form>
  );
};
