'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useAIStore } from '@career-bridge/store';

// ─── Simple Markdown Renderer ─────────────────────────────────────────────────
const MarkdownMessage: React.FC<{ content: string }> = ({ content }) => {
  const renderLine = (line: string, idx: number) => {
    // Code block handled at block level
    // Inline: **bold**, `code`, links
    const parts = line.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
    return (
      <span key={idx}>
        {parts.map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i} className="font-bold text-white">{part.slice(2, -2)}</strong>;
          }
          if (part.startsWith('`') && part.endsWith('`')) {
            return (
              <code key={i} className="bg-slate-700 text-emerald-300 px-1 py-0.5 rounded text-[10px] font-mono">
                {part.slice(1, -1)}
              </code>
            );
          }
          return part;
        })}
      </span>
    );
  };

  const renderContent = (text: string) => {
    const blocks: React.ReactNode[] = [];
    const lines = text.split('\n');
    let inCodeBlock = false;
    let codeLang = '';
    let codeLines: string[] = [];
    let key = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Code block open/close
      if (line.startsWith('```')) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeLang = line.slice(3).trim();
          codeLines = [];
        } else {
          inCodeBlock = false;
          blocks.push(
            <div key={key++} className="my-2 rounded-lg overflow-hidden border border-slate-600">
              {codeLang && (
                <div className="bg-slate-700 px-3 py-1 text-[10px] text-slate-400 font-mono uppercase tracking-wider border-b border-slate-600">
                  {codeLang}
                </div>
              )}
              <pre className="bg-slate-950 p-3 overflow-x-auto text-[11px] font-mono text-emerald-300 leading-relaxed">
                <code>{codeLines.join('\n')}</code>
              </pre>
            </div>
          );
          codeLines = [];
          codeLang = '';
        }
        continue;
      }

      if (inCodeBlock) {
        codeLines.push(line);
        continue;
      }

      // Horizontal rule
      if (/^---+$/.test(line.trim())) {
        blocks.push(<hr key={key++} className="border-slate-700 my-2" />);
        continue;
      }

      // Heading
      if (line.startsWith('### ')) {
        blocks.push(
          <h4 key={key++} className="font-bold text-blue-300 text-xs mt-2 mb-1">
            {renderLine(line.slice(4), 0)}
          </h4>
        );
        continue;
      }
      if (line.startsWith('## ')) {
        blocks.push(
          <h3 key={key++} className="font-bold text-blue-300 text-xs mt-2 mb-1">
            {renderLine(line.slice(3), 0)}
          </h3>
        );
        continue;
      }
      if (line.startsWith('# ')) {
        blocks.push(
          <h2 key={key++} className="font-bold text-white text-sm mt-2 mb-1">
            {renderLine(line.slice(2), 0)}
          </h2>
        );
        continue;
      }

      // Bullet points
      if (/^[-*•] /.test(line)) {
        blocks.push(
          <div key={key++} className="flex gap-1.5 items-start">
            <span className="text-blue-400 mt-0.5 leading-none">•</span>
            <span>{renderLine(line.replace(/^[-*•] /, ''), 0)}</span>
          </div>
        );
        continue;
      }

      // Numbered list
      const numMatch = line.match(/^(\d+)\. (.+)/);
      if (numMatch) {
        blocks.push(
          <div key={key++} className="flex gap-1.5 items-start">
            <span className="text-blue-400 font-bold min-w-[14px]">{numMatch[1]}.</span>
            <span>{renderLine(numMatch[2], 0)}</span>
          </div>
        );
        continue;
      }

      // Blockquote
      if (line.startsWith('> ')) {
        blocks.push(
          <div key={key++} className="border-l-2 border-blue-500 pl-2 my-1 text-slate-300 italic">
            {renderLine(line.slice(2), 0)}
          </div>
        );
        continue;
      }

      // Empty line
      if (line.trim() === '') {
        blocks.push(<div key={key++} className="h-1.5" />);
        continue;
      }

      // Normal paragraph
      blocks.push(
        <div key={key++} className="leading-relaxed">
          {renderLine(line, 0)}
        </div>
      );
    }

    return blocks;
  };

  return <div className="text-xs space-y-0.5">{renderContent(content)}</div>;
};

// ─── Conversation UI ──────────────────────────────────────────────────────────
export const ConversationUI: React.FC = () => {
  const { messages, askCopilot, isGenerating } = useAIStore();
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isGenerating) return;
    const text = input;
    setInput('');
    await askCopilot(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Quick prompt suggestions for new conversation
  const quickPrompts = [
    { icon: '💼', label: 'Find jobs for me', prompt: 'Find me the best job opportunities for a Full Stack Developer.' },
    { icon: '🐛', label: 'Debug my code', prompt: 'Help me debug my code. I will paste it below.' },
    { icon: '📝', label: 'Review my resume', prompt: 'Help me improve my resume and optimize it for ATS.' },
    { icon: '🎯', label: 'Interview prep', prompt: 'Give me common interview questions for a Software Engineer role.' },
  ];

  const isNewConversation = messages.filter(m => m.id !== 'welcome').length === 0;

  return (
    <div className="h-full flex flex-col p-3 gap-2">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 min-h-0">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-500 flex items-center justify-center text-white text-[10px] shrink-0 mt-0.5 mr-1.5">
                ✨
              </div>
            )}
            <div
              className={`max-w-[85%] p-3.5 rounded-2xl ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none text-sm font-medium leading-relaxed shadow-sm'
                  : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm'
              }`}
            >
              {msg.role === 'assistant' ? (
                <MarkdownMessage content={msg.content} />
              ) : (
                <span className="text-sm">{msg.content}</span>
              )}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isGenerating && (
          <div className="flex justify-start items-center gap-1.5">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-500 flex items-center justify-center text-white text-[10px] shrink-0">
              ✨
            </div>
            <div className="bg-white border border-slate-200 px-4 py-2.5 rounded-2xl rounded-bl-none shadow-sm">
              <div className="flex gap-1 items-center">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        {/* Quick prompts — show only for new conversations */}
        {isNewConversation && !isGenerating && (
          <div className="grid grid-cols-2 gap-2 mt-2">
            {quickPrompts.map((qp) => (
              <button
                key={qp.prompt}
                onClick={() => askCopilot(qp.prompt)}
                className="flex items-center gap-2 p-2.5 bg-white hover:bg-blue-50/50 border border-slate-200 hover:border-blue-400 rounded-xl text-left transition shadow-sm group"
              >
                <span className="text-base">{qp.icon}</span>
                <span className="text-xs text-slate-700 group-hover:text-blue-700 font-semibold leading-tight">
                  {qp.label}
                </span>
              </button>
            ))}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <form onSubmit={handleSend} className="flex flex-col gap-1.5 shrink-0">
        <div className="flex items-end gap-2 bg-white border border-slate-300 hover:border-slate-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/10 rounded-2xl transition px-3.5 py-2.5 shadow-sm">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything — code, career, or general questions..."
            rows={1}
            className="flex-1 bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none resize-none leading-relaxed max-h-24 overflow-y-auto"
            style={{ minHeight: '22px' }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isGenerating}
            className="shrink-0 w-8 h-8 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl transition flex items-center justify-center shadow-sm"
          >
            ↑
          </button>
        </div>
        <p className="text-[10px] text-slate-400 text-center font-medium">
          Shift+Enter for new line · Enter to send
        </p>
      </form>
    </div>
  );
};
