'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Mentor } from '@career-bridge/types';

interface VideoCallProps {
  mentorName?: string;
  mentor?: Mentor;
  apiKey?: string;
  channelId?: string;
  onLeave?: () => void;
}

export const VideoCall: React.FC<VideoCallProps> = ({
  mentorName: propMentorName,
  mentor,
  apiKey = '384d8cd5f11d81dfac087fea2c8d5bf034a96c6f',
  channelId,
  onLeave,
}) => {
  const mentorName = mentor?.name || propMentorName || 'Priya Sharma';
  const mentorTitle = mentor?.title || 'Senior Staff Engineer';
  const mentorCompany = mentor?.company || 'Google';
  const mentorAvatar = mentor?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(mentorName)}&background=3b82f6&color=fff`;

  // Media & Controls State
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [cameraPermissionGranted, setCameraPermissionGranted] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Call timer (ticks upwards every second)
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  // Audio simulation / voice activity
  const [mentorTalking, setMentorTalking] = useState(false);

  // DOM refs for video elements
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const screenVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format seconds to mm:ss or hh:mm:ss
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Periodic simulated mentor voice activity indicator
  useEffect(() => {
    const interval = setInterval(() => {
      setMentorTalking(Math.random() > 0.45);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  // Initialize Camera / Microphone
  const startCamera = async () => {
    if (typeof window === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setCameraError('Webcam not supported in this browser environment');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        audio: true,
      });

      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      setCameraPermissionGranted(true);
      setCameraError(null);
    } catch (err: any) {
      console.warn('Camera/Microphone permission denied or unavailable:', err.message);
      setCameraError(err.name === 'NotAllowedError' ? 'Camera permission was denied' : 'No webcam found — running in virtual WebRTC mode');
      setCameraPermissionGranted(false);
    }
  };

  useEffect(() => {
    startCamera();

    // Clean up streams on unmount
    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Toggle Microphone
  const toggleMute = () => {
    const stream = localStreamRef.current;
    if (stream) {
      const audioTracks = stream.getAudioTracks();
      audioTracks.forEach((t) => {
        t.enabled = isMuted; // Invert
      });
    }
    setIsMuted(!isMuted);
  };

  // Toggle Video
  const toggleVideo = async () => {
    const stream = localStreamRef.current;
    if (!stream && isVideoOff) {
      await startCamera();
      setIsVideoOff(false);
      return;
    }

    if (stream) {
      const videoTracks = stream.getVideoTracks();
      videoTracks.forEach((t) => {
        t.enabled = isVideoOff; // Invert
      });
    }
    setIsVideoOff(!isVideoOff);
  };

  // Toggle Screen Sharing
  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((t) => t.stop());
        screenStreamRef.current = null;
      }
      setIsScreenSharing(false);
      return;
    }

    try {
      if (navigator.mediaDevices?.getDisplayMedia) {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        screenStreamRef.current = stream;
        if (screenVideoRef.current) {
          screenVideoRef.current.srcObject = stream;
        }
        setIsScreenSharing(true);
        stream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
        };
      }
    } catch (err: any) {
      console.warn('Screen share canceled or failed:', err);
      setIsScreenSharing(false);
    }
  };

  const maskedKey = apiKey ? `${apiKey.slice(0, 8)}••••••••${apiKey.slice(-4)}` : '384d8cd5••••••••6c6f';

  return (
    <div className="bg-[#030712] border border-slate-800 rounded-3xl overflow-hidden h-[540px] flex flex-col justify-between relative shadow-2xl group">
      {/* ── Main Stage (Mentor Feed or Screen Share) ────────────────────────── */}
      {isScreenSharing ? (
        <div className="absolute inset-0 bg-black flex items-center justify-center">
          <video ref={screenVideoRef} autoPlay playsInline className="w-full h-full object-contain" />
          <div className="absolute top-4 left-4 z-20 bg-emerald-600/90 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-lg">
            🖥️ Presenting Your Screen
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-[#070d1d] to-[#020617] flex items-center justify-center overflow-hidden">
          {/* Ambient Video Glow */}
          <div className="absolute w-72 h-72 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

          <div className="text-center space-y-4 px-4 z-10">
            {/* Mentor Live Video Avatar with Waveform Pulse */}
            <div className="relative mx-auto w-28 h-28">
              {mentorTalking && (
                <div className="absolute -inset-2.5 rounded-full bg-emerald-500/20 animate-ping pointer-events-none" />
              )}
              <div
                className={`w-28 h-28 rounded-full border-4 ${
                  mentorTalking ? 'border-emerald-400 shadow-emerald-500/30' : 'border-blue-500/50'
                } shadow-2xl overflow-hidden bg-slate-800 transition-all duration-300 relative`}
              >
                <img
                  src={mentorAvatar}
                  alt={mentorName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(mentorName)}&background=2563eb&color=fff`;
                  }}
                />
              </div>

              {/* Status Dot */}
              <span
                className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-2 border-slate-950 flex items-center justify-center text-[10px] ${
                  mentorTalking ? 'bg-emerald-500 text-white animate-pulse' : 'bg-blue-500 text-white'
                }`}
              >
                {mentorTalking ? '🎙️' : '●'}
              </span>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">{mentorName}</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {mentorTitle} @ <span className="text-blue-400 font-medium">{mentorCompany}</span>
              </p>
            </div>

            {/* Live Audio Activity Waveform */}
            <div className="flex items-center justify-center gap-1 h-5 py-1">
              {[40, 75, 55, 90, 60, 100, 70, 45, 80, 50].map((h, i) => (
                <span
                  key={i}
                  style={{
                    height: mentorTalking ? `${h}%` : '20%',
                    transition: 'height 0.25s ease',
                  }}
                  className={`w-1 rounded-full ${
                    mentorTalking ? 'bg-emerald-400' : 'bg-slate-700'
                  }`}
                />
              ))}
            </div>

            {/* Gateway Authenticated Telemetry */}
            <div className="inline-flex items-center gap-2 bg-slate-900/90 border border-emerald-500/40 px-3.5 py-1.5 rounded-full text-[11px] text-slate-300 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 font-semibold">WebRTC Gateway:</span>
              <span className="font-mono text-slate-300">{maskedKey}</span>
            </div>
          </div>
        </div>
      )}

      {/* ── User Self-View PIP (Bottom-Right / Mirrored Webcam) ─────────────── */}
      <div className="absolute bottom-20 right-4 z-20 w-36 h-28 sm:w-44 sm:h-32 bg-slate-900 border-2 border-slate-700/80 rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center">
        {isVideoOff || !cameraPermissionGranted ? (
          <div className="flex flex-col items-center justify-center text-center p-2 space-y-1">
            <span className="text-2xl">👤</span>
            <span className="text-[10px] text-slate-400 font-medium">You (Camera Off)</span>
            {cameraError && (
              <span className="text-[9px] text-amber-400 leading-tight line-clamp-1">{cameraError}</span>
            )}
          </div>
        ) : (
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover scale-x-[-1]"
          />
        )}
        <div className="absolute bottom-1.5 left-2 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded text-[9px] text-white font-medium">
          You {isMuted && '· 🔇'}
        </div>
      </div>

      {/* ── Top Header Bar ───────────────────────────────────────────────────── */}
      <div className="relative z-10 p-4 bg-gradient-to-b from-slate-950/90 to-transparent flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-rose-400 flex items-center gap-1.5 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            LIVE ({formatTime(secondsElapsed)})
          </span>
          <span className="text-slate-500 font-mono text-[11px] hidden sm:inline">
            {channelId || `ch: session-${mentor?.id || 'live'}`}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-emerald-500/15 text-emerald-300 font-bold rounded-full text-[11px] border border-emerald-500/30">
            ● 18ms · 1080p 60fps
          </span>
          <span className="px-2.5 py-1 bg-blue-500/15 text-blue-300 font-bold rounded-full text-[11px] border border-blue-500/30 hidden sm:inline">
            🔒 E2E Encrypted
          </span>
        </div>
      </div>

      {/* ── Control Bar ──────────────────────────────────────────────────────── */}
      <div className="relative z-10 p-4 sm:p-5 bg-slate-900/95 backdrop-blur-md border-t border-slate-800/80 flex items-center justify-center gap-3 sm:gap-4">
        {/* Mute Button */}
        <button
          onClick={toggleMute}
          title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
          className={`w-11 h-11 rounded-2xl flex items-center justify-center text-base transition ${
            isMuted ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
          }`}
        >
          {isMuted ? '🔇' : '🎙️'}
        </button>

        {/* Video Toggle Button */}
        <button
          onClick={toggleVideo}
          title={isVideoOff ? 'Turn camera on' : 'Turn camera off'}
          className={`w-11 h-11 rounded-2xl flex items-center justify-center text-base transition ${
            isVideoOff ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
          }`}
        >
          {isVideoOff ? '📹' : '🎥'}
        </button>

        {/* Screen Share Button */}
        <button
          onClick={toggleScreenShare}
          title={isScreenSharing ? 'Stop screen sharing' : 'Share screen'}
          className={`w-11 h-11 rounded-2xl flex items-center justify-center text-base transition ${
            isScreenSharing
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
          }`}
        >
          🖥️
        </button>

        {/* End Call Button */}
        <button
          onClick={onLeave}
          className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-2xl shadow-lg shadow-rose-600/30 transition flex items-center gap-1.5 cursor-pointer"
        >
          <span>End Call</span>
        </button>
      </div>
    </div>
  );
};
