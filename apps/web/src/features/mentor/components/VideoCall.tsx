'use client';
import React, { useState } from 'react';

interface VideoCallProps {
  mentorName: string;
}

export const VideoCall: React.FC<VideoCallProps> = ({ mentorName }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden h-[500px] flex flex-col justify-between relative shadow-2xl">
      {/* Video Stream Placeholder */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-blue-500/40 mx-auto flex items-center justify-center text-4xl shadow-xl animate-pulse">
            👨‍🏫
          </div>
          <h3 className="text-lg font-bold text-white">Live Session with {mentorName}</h3>
          <p className="text-xs text-slate-400">Encrypted 1-on-1 WebRTC Video Connection</p>
        </div>
      </div>

      {/* Top Bar */}
      <div className="relative z-10 p-4 bg-gradient-to-b from-slate-950/80 to-transparent flex items-center justify-between text-xs text-slate-300">
        <span className="font-semibold">🔴 Live (00:14:22)</span>
        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 font-bold rounded-full">HD Quality</span>
      </div>

      {/* Control Bar */}
      <div className="relative z-10 p-6 bg-slate-900/90 backdrop-blur-md border-t border-slate-800/80 flex items-center justify-center gap-4">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg transition ${
            isMuted ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
          }`}
        >
          {isMuted ? '🔇' : '🎙️'}
        </button>
        <button
          onClick={() => setIsVideoOff(!isVideoOff)}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg transition ${
            isVideoOff ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
          }`}
        >
          {isVideoOff ? '📹' : '🎥'}
        </button>
        <button className="px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-2xl shadow-lg shadow-rose-600/30 transition">
          Leave Meeting
        </button>
      </div>
    </div>
  );
};
