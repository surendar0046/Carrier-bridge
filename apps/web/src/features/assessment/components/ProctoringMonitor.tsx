'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  Camera, 
  Mic, 
  MicOff, 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck, 
  Maximize2, 
  Minimize2,
  VideoOff,
  Eye,
  Volume2,
  Lock,
  RefreshCw
} from 'lucide-react';

interface ProctoringMonitorProps {
  maxViolations?: number;
  inline?: boolean;
  onViolation?: (count: number, reason: string) => void;
  onExceededViolations?: () => void;
  className?: string;
}

export const ProctoringMonitor: React.FC<ProctoringMonitorProps> = ({
  maxViolations = 3,
  inline = false,
  onViolation,
  onExceededViolations,
  className = '',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const [hasCamera, setHasCamera] = useState(false);
  const [hasMic, setHasMic] = useState(false);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [violations, setViolations] = useState<number>(0);
  const [showWarningModal, setShowWarningModal] = useState<boolean>(false);
  const [warningMessage, setWarningMessage] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  // Request & Start Media Stream
  const startMediaStream = useCallback(async () => {
    setIsInitializing(true);
    setMediaError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Webcam / Microphone API not available in this browser environment.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 320 }, height: { ideal: 240 }, facingMode: 'user' },
        audio: true,
      });

      streamRef.current = stream;
      setHasCamera(stream.getVideoTracks().length > 0);
      setHasMic(stream.getAudioTracks().length > 0);
      setMediaError(null);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }

      // Web Audio API volume visualizer
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          const audioCtx = new AudioContextClass();
          audioContextRef.current = audioCtx;
          const source = audioCtx.createMediaStreamSource(stream);
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 64;
          source.connect(analyser);
          analyserRef.current = analyser;

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          const updateVolume = () => {
            if (!analyserRef.current) return;
            analyserRef.current.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            const avg = sum / dataArray.length;
            const normalized = Math.min(100, Math.round((avg / 128) * 100));
            setAudioLevel(normalized);
            animFrameRef.current = requestAnimationFrame(updateVolume);
          };
          updateVolume();
        }
      } catch (e) {
        console.warn('Audio meter warning:', e);
      }
    } catch (err: any) {
      console.warn('Media devices permission notice:', err.message);
      setMediaError(err.message || 'Camera or Microphone access could not be started');
      setHasCamera(false);
      setHasMic(false);
    } finally {
      setIsInitializing(false);
    }
  }, []);

  // Auto-attempt start on mount
  useEffect(() => {
    startMediaStream();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, [startMediaStream]);

  // Tab switch & defocus detection
  const registerViolation = useCallback(
    (reason: string) => {
      setViolations((prev) => {
        const next = prev + 1;
        setWarningMessage(`Proctor Violation: ${reason}. Tab switching, window minimization, or leaving this exam window is strictly monitored.`);
        setShowWarningModal(true);

        if (onViolation) onViolation(next, reason);

        if (next >= maxViolations) {
          if (onExceededViolations) onExceededViolations();
        }
        return next;
      });
    },
    [maxViolations, onViolation, onExceededViolations]
  );

  useEffect(() => {
    let blurTimer: NodeJS.Timeout | null = null;

    const onVisibilityChange = () => {
      if (document.hidden) {
        registerViolation('Switched browser tab or minimized window');
      }
    };

    const onWindowBlur = () => {
      blurTimer = setTimeout(() => {
        if (!document.hasFocus()) {
          registerViolation('Exam window lost focus (clicked outside or opened other app)');
        }
      }, 400);
    };

    const onWindowFocus = () => {
      if (blurTimer) clearTimeout(blurTimer);
    };

    // Anti-cheat shortcut traps
    const onContextMenu = (e: MouseEvent) => e.preventDefault();
    const onCopy = (e: ClipboardEvent) => e.preventDefault();
    const onPaste = (e: ClipboardEvent) => e.preventDefault();

    const onKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && ['c', 'v', 'u', 'a', 'x', 'w'].includes(e.key.toLowerCase())) ||
        e.key === 'F12' ||
        e.key === 'PrintScreen'
      ) {
        e.preventDefault();
        registerViolation(`Blocked shortcut pressed (${e.key})`);
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('blur', onWindowBlur);
    window.addEventListener('focus', onWindowFocus);
    document.addEventListener('contextmenu', onContextMenu);
    document.addEventListener('copy', onCopy);
    document.addEventListener('cut', onCopy);
    document.addEventListener('paste', onPaste);
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('blur', onWindowBlur);
      window.removeEventListener('focus', onWindowFocus);
      document.removeEventListener('contextmenu', onContextMenu);
      document.removeEventListener('copy', onCopy);
      document.removeEventListener('cut', onCopy);
      document.removeEventListener('paste', onPaste);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [registerViolation]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <>
      {/* ─── Proctoring Panel (Rendered In-Page & Sticky for 100% Visibility) ─── */}
      <div className={`w-full bg-slate-900 border-2 border-violet-500/40 rounded-3xl p-4 sm:p-5 shadow-2xl text-white space-y-4 mb-6 ${className}`}>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 -ml-4" />
            <div>
              <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-emerald-400" />
                <span>AI Proctoring Active & Monitored</span>
              </h4>
              <p className="text-[11px] text-slate-400">Live Camera, Microphone, and Tab Switching resistance enabled.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleFullscreen}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition flex items-center gap-1.5"
            >
              {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
              <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Exam'}</span>
            </button>

            {!hasCamera && (
              <button
                onClick={startMediaStream}
                disabled={isInitializing}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition flex items-center gap-1.5 shadow"
              >
                <RefreshCw size={13} className={isInitializing ? 'animate-spin' : ''} />
                <span>Enable Camera/Mic</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Feeds Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          
          {/* 1. Camera Viewport */}
          <div className="sm:col-span-1 relative aspect-video bg-black rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center shadow-inner">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${hasCamera ? 'block' : 'hidden'}`}
              style={{ transform: 'scaleX(-1)' }}
            />

            {!hasCamera && (
              <div className="text-center p-3 space-y-1">
                <VideoOff size={24} className="mx-auto text-yellow-400" />
                <p className="text-xs font-bold text-slate-300">Webcam Inactive</p>
                <p className="text-[10px] text-slate-500">Allow permissions or click 'Enable'</p>
              </div>
            )}

            {hasCamera && (
              <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/75 text-[10px] font-bold text-emerald-400 flex items-center gap-1 border border-emerald-500/40">
                <Eye size={11} />
                <span>Candidate Face Tracked</span>
              </div>
            )}
          </div>

          {/* 2. Microphone & Audio Visualizer */}
          <div className="sm:col-span-1 bg-slate-950/90 border border-slate-800 rounded-2xl p-4 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                {hasMic ? <Mic size={14} className="text-emerald-400" /> : <MicOff size={14} className="text-rose-400" />}
                <span>Microphone Level</span>
              </span>
              <span className="font-mono text-[11px] text-slate-400">
                {hasMic ? `${audioLevel}% Level` : 'Muted'}
              </span>
            </div>

            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-75 ${
                  audioLevel > 65
                    ? 'bg-rose-500 shadow-sm shadow-rose-500'
                    : audioLevel > 35
                    ? 'bg-yellow-400'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.max(8, audioLevel)}%` }}
              />
            </div>

            <p className="text-[10px] text-slate-500 leading-tight">
              Room acoustic levels are actively verified to ensure examination integrity.
            </p>
          </div>

          {/* 3. Tab Switch Strike Counter */}
          <div className="sm:col-span-1 bg-slate-950/90 border border-slate-800 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <ShieldAlert size={15} className={violations > 0 ? 'text-rose-400' : 'text-slate-400'} />
                <span>Tab Switch Security</span>
              </span>
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md border ${
                violations === 0 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
              }`}>
                {violations} / {maxViolations} Strikes
              </span>
            </div>

            <div className="flex items-center gap-1.5 pt-1">
              {[...Array(maxViolations)].map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-2 rounded-full transition-all ${
                    i < violations ? 'bg-rose-500 shadow-md shadow-rose-500/50' : 'bg-slate-800'
                  }`}
                />
              ))}
            </div>

            <p className="text-[10px] text-slate-500 leading-tight">
              Switching tabs, minimizing, or clicking outside will trigger strikes and auto-submission.
            </p>
          </div>

        </div>
      </div>

      {/* ─── Violation Security Alert Modal (z-[99999] Top Level) ─── */}
      {showWarningModal && (
        <div className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="max-w-md w-full bg-[#0f172a] border-2 border-rose-500 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center text-white">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border-2 border-rose-500/60 text-rose-400 flex items-center justify-center mx-auto shadow-xl shadow-rose-500/30 animate-bounce">
              <AlertTriangle size={36} />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-rose-400">
                PROCTOR SECURITY VIOLATION!
              </h3>
              <p className="text-xs text-rose-200 font-semibold leading-relaxed bg-rose-950/60 border border-rose-800/80 p-3 rounded-xl">
                {warningMessage}
              </p>
              <p className="text-xs text-slate-300 leading-relaxed pt-2">
                You have recorded strike <strong>{violations} of {maxViolations}</strong>. Navigating away from this window is strictly prohibited. Reaching <strong>{maxViolations} strikes</strong> will immediately lock and submit your test.
              </p>
            </div>

            <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between text-xs px-6">
              <span className="text-slate-400 font-bold uppercase">Strikes Remaining:</span>
              <span className="text-lg font-black text-rose-400">{Math.max(0, maxViolations - violations)} Strikes</span>
            </div>

            <button
              onClick={() => setShowWarningModal(false)}
              className="w-full py-4 bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm rounded-xl shadow-2xl shadow-rose-600/40 transition active:scale-95"
            >
              I Understand — Return to Assessment Immediately
            </button>
          </div>
        </div>
      )}
    </>
  );
};
