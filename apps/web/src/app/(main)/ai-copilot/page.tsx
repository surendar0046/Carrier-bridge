'use client';
import { useEffect, useRef, useState } from 'react';
import { useAIStore } from '@career-bridge/store';

const SUGGESTIONS = ['Help me find a job', 'Review my resume', 'Prepare for interview', 'Analyze my skill gaps', 'Match me with a mentor'];

/* ── Helpers: dynamic CDN script loader ───────────────────────────────────── */
const loadScript = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return resolve();

    // Already fully loaded — resolve immediately
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
    if (existing) {
      if (existing.getAttribute('data-loaded') === 'true') {
        resolve();
      } else {
        // Script tag exists but may still be loading — wait for it
        existing.addEventListener('load', () => resolve(), { once: true });
        existing.addEventListener('error', (e) => reject(e), { once: true });
      }
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => {
      script.setAttribute('data-loaded', 'true');
      resolve();
    };
    script.onerror = (err) => reject(err);
    document.head.appendChild(script);
  });
};

/* ── PDF parser via pdf.js CDN ────────────────────────────────────────────── */
const parsePDF = async (arrayBuffer: ArrayBuffer): Promise<string> => {
  await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js');

  // Try all known global variable names for pdf.js CDN builds
  const pdfjsLib: any =
    (window as any)['pdfjs-dist/build/pdf'] ||
    (window as any).pdfjsLib ||
    (window as any).PDFJS;

  if (!pdfjsLib || !pdfjsLib.getDocument) {
    throw new Error('PDF.js did not initialise correctly. Please refresh and try again.');
  }

  pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
  const pdf = await loadingTask.promise;

  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    // Join text items, respecting line breaks via transform differences
    const items = textContent.items as any[];
    const lineText = items.map((item) => item.str).join(' ');
    fullText += lineText + '\n';
  }
  return fullText.trim();
};

/* ── DOCX parser via mammoth CDN ──────────────────────────────────────────── */
const parseDOCX = async (arrayBuffer: ArrayBuffer): Promise<string> => {
  await loadScript('https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js');

  const mammoth = (window as any).mammoth;
  if (!mammoth || !mammoth.extractRawText) {
    throw new Error('Mammoth.js did not initialise correctly. Please refresh and try again.');
  }

  const result = await mammoth.extractRawText({ arrayBuffer });
  return (result.value as string).trim();
};

/* ── Inline bold text renderer ────────────────────────────────────────────── */
function InlineContent({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**')
          ? <strong key={i} className="font-bold text-white">{part.slice(2, -2)}</strong>
          : <span key={i}>{part}</span>
      )}
    </>
  );
}

/* ── Full message renderer with bullets & numbered lists ──────────────────── */
function MessageContent({ content }: { content: string }) {
  const lines = content.split('\n');
  return (
    <div className="space-y-1.5 text-sm leading-relaxed">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} className="h-1" />;

        const numberedMatch = trimmed.match(/^(\d+)[.)]\s+(.+)/);
        if (numberedMatch) {
          return (
            <div key={i} className="flex gap-2">
              <span className="font-bold text-blue-400 min-w-[1.2rem]">{numberedMatch[1]}.</span>
              <span><InlineContent text={numberedMatch[2]} /></span>
            </div>
          );
        }

        const bulletMatch = trimmed.match(/^[-•*]\s+(.+)/);
        if (bulletMatch) {
          return (
            <div key={i} className="flex gap-2">
              <span className="text-blue-400 mt-0.5">▸</span>
              <span><InlineContent text={bulletMatch[1]} /></span>
            </div>
          );
        }

        return <p key={i}><InlineContent text={trimmed} /></p>;
      })}
    </div>
  );
}

/* ── Main page ────────────────────────────────────────────────────────────── */
export default function NiralAIPage() {
  const { messages, isThinking, sendMessage, clearConversation } = useAIStore();
  const [input, setInput] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [attachedFile, setAttachedFile] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleSend = async () => {
    const msg = input.trim();
    if (!msg) return;
    setInput('');
    setAttachedFile(null);
    // Reset textarea height
    if (inputRef.current) inputRef.current.style.height = 'auto';
    inputRef.current?.focus();
    await sendMessage(msg);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsing(true);
    setAttachedFile(file.name);

    try {
      let extractedText = '';

      if (file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt')) {
        // Plain text — use native FileReader, no external library needed
        extractedText = await file.text();

      } else if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        const arrayBuffer = await file.arrayBuffer();
        extractedText = await parsePDF(arrayBuffer);

      } else if (
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.name.toLowerCase().endsWith('.docx')
      ) {
        const arrayBuffer = await file.arrayBuffer();
        extractedText = await parseDOCX(arrayBuffer);

      } else {
        throw new Error(`Unsupported format "${file.name.split('.').pop()?.toUpperCase()}". Please upload a PDF, DOCX, or TXT file.`);
      }

      if (!extractedText.trim()) {
        throw new Error('No readable text found in this file. It may be image-based or protected.');
      }

      // Prepend a clear context header so Niral AI knows what to analyse
      const resumeContext = `Please analyse my resume from the file "${file.name}":\n\n${extractedText}`;
      setInput(resumeContext);

      // Auto-resize textarea
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.style.height = 'auto';
          inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 128)}px`;
        }
        inputRef.current?.focus();
      }, 50);

    } catch (err: any) {
      console.error('[Niral AI] File parsing error:', err);
      setInput(`❌ Could not read "${file.name}": ${err.message}`);
      setAttachedFile(null);
    } finally {
      setIsParsing(false);
      // Reset so the same file can be re-uploaded
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="niral-ai-container flex flex-col h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="niral-ai-header border-b border-slate-800 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-xl shadow-lg shadow-blue-500/30">
            ✨
          </div>
          <div>
            <h1 className="font-bold text-white text-lg leading-none">Niral AI</h1>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs text-slate-400">Online · Career Intelligence</span>
            </div>
          </div>
        </div>
        <button
          onClick={clearConversation}
          className="text-xs text-slate-500 hover:text-slate-300 transition-colors px-3 py-1.5 border border-slate-800 hover:border-slate-600 rounded-lg"
        >
          Clear chat
        </button>
      </div>

      {/* Messages */}
      <div className="niral-ai-messages flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-3`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-base shrink-0 mt-1 shadow-md shadow-blue-500/20">
                ✨
              </div>
            )}
            <div className={`max-w-[78%] rounded-2xl px-5 py-3.5 ${
              msg.role === 'user'
                ? 'niral-ai-user-bubble bg-blue-600 text-white rounded-br-sm text-sm leading-relaxed'
                : 'niral-ai-assistant-bubble bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-sm'
            }`}>
              {msg.role === 'assistant'
                ? <MessageContent content={msg.content} />
                : <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              }
            </div>
          </div>
        ))}

        {/* Thinking indicator */}
        {isThinking && (
          <div className="flex justify-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-base shrink-0">
              ✨
            </div>
            <div className="niral-ai-thinking-bubble bg-slate-900 border border-slate-800 rounded-2xl rounded-bl-sm px-5 py-4 flex items-center gap-1.5">
              <span className="text-xs text-slate-400 mr-1">Niral AI is thinking</span>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      <div className="niral-ai-suggestions px-4 md:px-8 pb-3 flex gap-2 overflow-x-auto scrollbar-hide shrink-0">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => { setInput(s); setAttachedFile(null); inputRef.current?.focus(); }}
            className="flex-shrink-0 text-xs px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-full text-slate-300 hover:border-blue-500 hover:text-blue-400 transition-colors whitespace-nowrap"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Attached file badge */}
      {attachedFile && (
        <div className="px-4 md:px-8 pb-2 shrink-0">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 rounded-lg text-xs text-blue-400">
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="truncate max-w-[200px]">{attachedFile}</span>
            <button
              onClick={() => { setAttachedFile(null); setInput(''); }}
              className="ml-1 text-blue-400/60 hover:text-blue-300 transition-colors"
            >✕</button>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="niral-ai-input-container border-t border-slate-800 px-4 md:px-8 py-4 shrink-0">
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Niral AI anything about your career..."
              rows={1}
              className="niral-ai-textarea w-full bg-slate-900 border border-slate-700 rounded-xl pl-4 pr-12 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors resize-none text-sm leading-relaxed max-h-32 overflow-y-auto"
              disabled={isThinking || isParsing}
              style={{ height: 'auto' }}
              onInput={(e) => {
                const el = e.currentTarget;
                el.style.height = 'auto';
                el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
              }}
            />
            <div className="absolute right-2 bottom-2 flex items-center gap-1">
              <label className="p-1.5 text-slate-500 hover:text-blue-400 hover:bg-slate-800 rounded-lg cursor-pointer transition-all active:scale-90">
                <input
                  type="file"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    
                    setInput(`Reading ${file.name}...`);
                    
                    try {
                      let extractedText = '';
                      
                      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
                        extractedText = await file.text();
                      } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
                        const arrayBuffer = await file.arrayBuffer();
                        extractedText = await parsePDF(arrayBuffer);
                      } else if (
                        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
                        file.name.endsWith('.docx')
                      ) {
                        const arrayBuffer = await file.arrayBuffer();
                        extractedText = await parseDOCX(arrayBuffer);
                      } else {
                        throw new Error('Unsupported file format. Please upload a .pdf, .docx, or .txt file.');
                      }
                      
                      if (!extractedText.trim()) {
                        throw new Error('Could not extract any text from the file.');
                      }
                      
                      setInput(`Analyzing resume: ${file.name}\n\nExtracted Text:\n${extractedText.trim()}`);
                    } catch (err: any) {
                      console.error('File parsing error:', err);
                      setInput(`Error reading ${file.name}: ${err.message || 'Unknown error'}`);
                    }
                  }}
                  accept=".pdf,.doc,.docx,.txt"
                />
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </label>
            </div>
          </div>
          <button
            onClick={handleSend}
            disabled={isThinking || !input.trim()}
            className="niral-ai-send-btn px-5 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl font-bold transition-all text-lg shrink-0 shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30 active:scale-95"
          >
            {isThinking ? (
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : '→'}
          </button>
        </div>
        <p className="text-[10px] text-slate-600 mt-2 text-center">Press Enter to send · Shift+Enter for new line · Upload Resume to analyze</p>
      </div>
    </div>
  );
}
