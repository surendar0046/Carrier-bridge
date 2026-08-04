import { create } from 'zustand';

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  actionType?: string;
}

interface AIState {
  messages: AIMessage[];
  isThinking: boolean;
  isGenerating: boolean;
  sessionId: string;
  sendMessage: (content: string) => Promise<void>;
  askCopilot: (content: string) => Promise<void>;
  clearConversation: () => void;
  clearMessages: () => void;
}

const WELCOME_MESSAGE: AIMessage = {
  id: 'welcome',
  role: 'assistant',
  content: "👋 Hi! I'm **Niral AI** — your intelligent career & coding assistant.\n\nI can help you with **anything**:\n- 💼 Job searching, resumes & interview prep\n- 💻 Coding, debugging & code reviews (any language)\n- 🧠 General knowledge, explanations & research\n- 📊 Skill roadmaps, learning paths & career planning\n- ✍️ Writing, emails, cover letters & more\n\nJust ask me anything — I work like ChatGPT! 🚀",
  timestamp: new Date().toISOString(),
};

// Smart local fallback responses — used when the AI API is unavailable
const getPoliteResponse = (message: string): string => {
  const lower = message.toLowerCase();

  // Greetings
  if (/^(hi|hello|hey|good morning|good evening|good afternoon|howdy|sup|hola)/i.test(lower.trim())) {
    return "Hello! 😊 I'm **Niral AI** — your intelligent career & coding assistant.\n\nI can help you with:\n- 💼 Job searching, resumes & interview prep\n- 💻 Coding, debugging & code reviews (any language)\n- 🧠 General knowledge & research\n- 📊 Skill roadmaps & career planning\n\nWhat would you like to explore first?";
  }

  // Thank you
  if (/thank|thanks|thx|appreciate/i.test(lower)) {
    return "You're very welcome! 😊 Happy to help anytime.\n\nFeel free to ask me anything — coding, career advice, or any other question you have! 💪";
  }

  // How are you
  if (/how are you|how('s| is) it going|what's up/i.test(lower)) {
    return "I'm doing great, thank you for asking! 😊\n\nAlways ready to help. What's on your mind today?";
  }

  // Who are you
  if (/who are you|what are you|tell me about yourself|your name/i.test(lower)) {
    return "I'm **Niral AI** 🤖✨ — a full-featured AI assistant built into CareerBridge.\n\nI work like ChatGPT and can help with:\n- 💻 **Coding & debugging** — Any language, any framework\n- 💼 **Career advice** — Jobs, resumes, interviews\n- 🧠 **General knowledge** — Explain anything\n- 📝 **Writing** — Emails, cover letters, docs\n- 📊 **Analysis** — Data, algorithms, concepts\n\nWhat would you like help with?";
  }

  // Coding / debugging
  if (/code|debug|error|bug|function|class|array|loop|syntax|program|script|python|javascript|typescript|java|react|node|sql|api|fix|implement/i.test(lower)) {
    return "I'd love to help with your code! 💻\n\n⚠️ *Note: I'm currently running in offline mode — the AI API is temporarily unavailable.*\n\nOnce reconnected, I can:\n- 🐛 **Debug errors** — paste your error and I'll diagnose it\n- ✍️ **Write code** — any language or framework\n- 🔍 **Review code** — suggest improvements and optimizations\n- 📚 **Explain concepts** — algorithms, patterns, architecture\n\nPlease try again in a moment for a full AI-powered response!";
  }

  // Jobs
  if (/job|work|position|opening|hiring|career|employ|opportunity|apply|application/i.test(lower)) {
    return "Great question about jobs! 💼\n\nHere's how I can help with your job search:\n\n1. **AI-Matched Jobs** — Our system matches you with the best opportunities\n2. **Smart Filters** — Filter by Remote, Full-Time, Internship, or Contract\n3. **One-Click Apply** — Apply directly through our platform\n\n**Quick tip:** Keep your profile skills up-to-date for better match scores! 🎯";
  }

  // Resume
  if (/resume|cv|ats|curriculum vitae/i.test(lower)) {
    return "Let's make your resume shine! 📝✨\n\n**Pro tips for a strong resume:**\n- ✅ Add **quantified achievements** (e.g., \"Increased sales by 40%\")\n- ✅ Include **role-specific keywords** from job descriptions\n- ✅ Keep it to **1-2 pages** maximum\n- ✅ Use a **clean, ATS-friendly format**\n\nUse our **Resume Builder** or get an **ATS Score** from the Resume tab!";
  }

  // Interview
  if (/interview|prepare|practice|question|behavioral|technical/i.test(lower)) {
    return "Let's get you interview-ready! 🎯\n\n**Common Technical Questions:**\n- Explain the difference between `==` and `===`\n- What is a closure in JavaScript?\n- How does React's Virtual DOM work?\n- Explain RESTful API design principles\n\n**Behavioral Tips (STAR method):**\n- **S**ituation, **T**ask, **A**ction, **R**esult\n- Use specific numbers and outcomes\n\nWhat role are you interviewing for?";
  }

  // Skills
  if (/skill|learn|course|study|roadmap|gap|grow|development|training|certification/i.test(lower)) {
    return "Let's accelerate your skill growth! 📊🚀\n\n**Top In-Demand Skills for 2025-2026:**\n1. **AI/ML Engineering** — Highest demand\n2. **Cloud Computing** (AWS/Azure/GCP)\n3. **TypeScript & React** — Frontend gold standard\n4. **System Design** — Critical for senior roles\n5. **Data Engineering** — Growing fast\n\nVisit the **Skill Roadmap** section for a personalized learning path!";
  }

  // Mentor
  if (/mentor|guide|coach|advice|connect|network|professional/i.test(lower)) {
    return "Mentorship can be a game-changer! 🤝\n\n**Our Mentorship Program:**\n1. AI-Powered matching with industry experts\n2. Mentors from Google, Microsoft, Amazon & more\n3. Flexible 1-on-1 video sessions\n4. Engineering, Product, Design, Data Science & more\n\nVisit the **Mentorship** section to find your perfect mentor!";
  }

  // Help or capabilities
  if (/help|what can you do|feature|capable|assist/i.test(lower)) {
    return "Here's everything I can help with: 😊\n\n**💻 Coding & Tech**\n- Write & debug code in any language\n- Explain algorithms & data structures\n- Code reviews & optimization\n\n**💼 Career**\n- Job search & AI matching\n- Resume building & ATS scoring\n- Interview preparation\n\n**🧠 General AI**\n- Answer any question\n- Research & explanations\n- Writing & communication\n\nJust ask me anything! 🚀";
  }

  // API unavailable default
  return "⚠️ I'm currently in **offline mode** — the AI API is temporarily unavailable.\n\nI can still help with basic career questions! For full AI capabilities (coding help, debugging, detailed analysis), please try again in a moment.\n\n**What I can help with right now:**\n- 💼 Job searching tips\n- 📝 Resume advice\n- 🎯 Interview preparation\n- 📊 Skill development guidance";
};

export const useAIStore = create<AIState>()((set, get) => {
  const sendMessageHandler = async (content: string) => {
    const userMsg: AIMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    set((s) => ({ messages: [...s.messages, userMsg], isThinking: true, isGenerating: true }));

    try {
      const allMessages = [...get().messages, userMsg];
      const apiMessages = allMessages
        .filter((m) => m.id !== 'welcome' || m.role === 'assistant')
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch('/api/niral-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!res.ok) {
        throw new Error(`API returned ${res.status}`);
      }

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const assistantMsg: AIMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: data.content,
        timestamp: new Date().toISOString(),
      };

      set((s) => ({ messages: [...s.messages, assistantMsg], isThinking: false, isGenerating: false }));
    } catch (err: any) {
      console.warn('Niral AI: Groq API unavailable, using smart local responses', err);

      await new Promise((r) => setTimeout(r, 600));

      const fallbackMsg: AIMessage = {
        id: `ai-fallback-${Date.now()}`,
        role: 'assistant',
        content: getPoliteResponse(content),
        timestamp: new Date().toISOString(),
      };
      set((s) => ({ messages: [...s.messages, fallbackMsg], isThinking: false, isGenerating: false }));
    }
  };

  const clearHandler = () =>
    set({
      messages: [{ ...WELCOME_MESSAGE, id: 'welcome', timestamp: new Date().toISOString() }],
      sessionId: `session-${Date.now()}`,
    });

  return {
    messages: [WELCOME_MESSAGE],
    isThinking: false,
    isGenerating: false,
    sessionId: `session-${Date.now()}`,
    sendMessage: sendMessageHandler,
    askCopilot: sendMessageHandler,
    clearConversation: clearHandler,
    clearMessages: clearHandler,
  };
});
