'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Mentor } from '@career-bridge/types';

interface MessageItem {
  id: string;
  sender: 'user' | 'mentor';
  text: string;
  timestamp: string;
}

interface ChatInterfaceProps {
  conversationId: string;
  mentor?: Mentor;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ conversationId, mentor }) => {
  const mentorName = mentor?.name || 'Mentor';
  const mentorTitle = mentor?.title || 'Senior Engineer';
  const mentorCompany = mentor?.company || 'Industry Expert';
  const mentorAvatar = mentor?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(mentorName)}&background=3b82f6&color=fff`;

  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: 'welcome-1',
      sender: 'mentor',
      text: `Hi there! 👋 I'm ${mentorName}, ${mentorTitle} @ ${mentorCompany}. Welcome to our live mentorship session! What questions or goals are you focusing on today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom whenever messages change or typing changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Voice TTS helper
  const speakText = (content: string) => {
    if (!voiceEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(content.replace(/[*#_`]/g, ''));
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  };

  // Web Speech Recognition (voice-to-text)
  const toggleListening = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your message.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setText((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };

      recognition.start();
    } catch (e) {
      console.warn('Speech recognition error:', e);
      setIsListening(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    const userMessage: MessageItem = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setText('');
    setIsTyping(true);

    try {
      // Map history for AI request
      const formattedHistory = newMessages.map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
      }));

      const res = await fetch('/api/mentor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: formattedHistory,
          mentor: mentor || {
            name: mentorName,
            title: mentorTitle,
            company: mentorCompany,
            expertise: ['Software Engineering', 'System Design', 'Career Growth'],
          },
        }),
      });

      const data = await res.json();
      const reply = data.reply || `That's a great question! At ${mentorCompany}, we focus heavily on breaking down problems methodically. Let's dig deeper into that.`;

      const mentorMessage: MessageItem = {
        id: `mentor-${Date.now()}`,
        sender: 'mentor',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, mentorMessage]);
      speakText(reply);
    } catch (err) {
      console.warn('Mentor response error, using fallback:', err);
      const fallbackMsg: MessageItem = {
        id: `mentor-fallback-${Date.now()}`,
        sender: 'mentor',
        text: `Thanks for sharing that! As a ${mentorTitle} at ${mentorCompany}, I recommend focusing on clear problem fundamentals and practical project experience. What specific target are you working toward?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl h-[540px] flex flex-col justify-between overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-3.5 sm:p-4 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={mentorAvatar}
              alt={mentorName}
              className="w-9 h-9 rounded-full object-cover border-2 border-emerald-500/50"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(mentorName)}&background=3b82f6&color=fff`;
              }}
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-900 rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white leading-tight">{mentorName}</span>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/30 px-1.5 py-0.2 rounded">
                Live
              </span>
            </div>
            <p className="text-[11px] text-slate-400">{mentorCompany} · Active Session</p>
          </div>
        </div>

        {/* Audio Output Toggle */}
        <button
          onClick={() => {
            const next = !voiceEnabled;
            setVoiceEnabled(next);
            if (!next && typeof window !== 'undefined' && window.speechSynthesis) {
              window.speechSynthesis.cancel();
            }
          }}
          title={voiceEnabled ? 'Mute mentor voice' : 'Enable mentor voice read-out'}
          className={`p-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
            voiceEnabled
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <span>{voiceEnabled ? '🔊 Voice On' : '🔇 Voice Off'}</span>
        </button>
      </div>

      {/* Messages Feed */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'mentor' && (
              <img
                src={mentorAvatar}
                alt={mentorName}
                className="w-7 h-7 rounded-full object-cover mb-1 border border-slate-700 shrink-0"
              />
            )}
            <div
              className={`max-w-[82%] sm:max-w-[78%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed space-y-1 shadow-md ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-sm'
                  : 'bg-slate-800 text-slate-200 border border-slate-700/80 rounded-bl-sm'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>
              <div
                className={`text-[9px] text-right ${
                  msg.sender === 'user' ? 'text-blue-200/80' : 'text-slate-400'
                }`}
              >
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {/* Live Typing Indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-slate-400 pl-1">
            <img
              src={mentorAvatar}
              alt={mentorName}
              className="w-6 h-6 rounded-full object-cover border border-slate-700 animate-pulse"
            />
            <div className="bg-slate-800 border border-slate-700 px-3.5 py-2 rounded-2xl rounded-bl-sm flex items-center gap-1.5 shadow-md">
              <span className="text-[11px] text-slate-300 font-medium">{mentorName} is replying</span>
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" />
            </div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
        <button
          type="button"
          onClick={toggleListening}
          title={isListening ? 'Stop listening' : 'Speak message'}
          className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm transition shrink-0 ${
            isListening
              ? 'bg-rose-600 text-white animate-pulse shadow-md shadow-rose-600/30'
              : 'bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          {isListening ? '🛑' : '🎙️'}
        </button>

        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`Ask ${mentorName} anything...`}
          className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
        />

        <button
          type="submit"
          disabled={!text.trim() || isTyping}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-semibold text-xs rounded-xl transition shadow-md shadow-blue-600/20 shrink-0"
        >
          Send
        </button>
      </form>
    </div>
  );
};
