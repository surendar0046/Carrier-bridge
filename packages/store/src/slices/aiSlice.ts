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
  content: "👋 Hi there! I'm **Niral AI**, your personal career assistant.\n\nI'm here to help you with:\n- 💼 Job searching & applications\n- 📝 Resume reviews & ATS optimization\n- 🎯 Interview preparation & practice\n- 📊 Skill gap analysis & learning roadmaps\n- 🤝 Mentorship & networking\n\nHow can I help you today?",
  timestamp: new Date().toISOString(),
};

// Smart local fallback responses that are polite and contextual
const getPoliteResponse = (message: string): string => {
  const lower = message.toLowerCase();

  // Greetings
  if (/^(hi|hello|hey|good morning|good evening|good afternoon|howdy|sup|hola)/i.test(lower.trim())) {
    return "Hello! 😊 Welcome to **Niral AI**.\n\nI'm so glad you're here! I'm your dedicated career assistant, ready to help with anything career-related.\n\nHere's what I can do for you:\n1. **Find jobs** that match your skills\n2. **Review your resume** for ATS compatibility\n3. **Prepare you for interviews** with practice questions\n4. **Analyze skill gaps** and suggest learning paths\n5. **Connect you with mentors** in your field\n\nWhat would you like to explore first?";
  }

  // Thank you
  if (/thank|thanks|thx|appreciate/i.test(lower)) {
    return "You're very welcome! 😊 I'm always happy to help.\n\nIs there anything else I can assist you with? Whether it's about jobs, resumes, interviews, or career planning — I'm here for you! 💪";
  }

  // How are you
  if (/how are you|how('s| is) it going|what's up/i.test(lower)) {
    return "I'm doing great, thank you for asking! 😊\n\nI'm always energized and ready to help you with your career goals.\n\nWhat's on your mind today? I'd love to assist with job searching, resume building, interview prep, or anything else career-related!";
  }

  // Who are you
  if (/who are you|what are you|tell me about yourself|your name/i.test(lower)) {
    return "I'm **Niral AI** — your personal AI-powered career assistant! 🤖✨\n\nI was designed to help professionals like you navigate their career journey with confidence.\n\nHere's what I specialize in:\n- 🔍 **Job Matching** — Finding roles that fit your skills perfectly\n- 📝 **Resume Optimization** — Making your resume ATS-friendly\n- 🎯 **Interview Prep** — Practicing with real interview questions\n- 📊 **Skill Analysis** — Identifying gaps and recommending courses\n- 🤝 **Mentor Matching** — Connecting you with industry experts\n\nWhat would you like help with?";
  }

  // Jobs
  if (/job|work|position|opening|hiring|career|employ|opportunity|apply|application/i.test(lower)) {
    return "Great question about jobs! 💼\n\nHere's how I can help you with your job search:\n\n1. **AI-Matched Jobs** — Our system analyzes your profile and matches you with the best opportunities\n2. **Real-Time Search** — Browse live job listings from across the web\n3. **Smart Filters** — Filter by Remote, Full-Time, Internship, or Contract\n4. **One-Click Apply** — Apply directly through our platform\n\n**Quick tip:** Make sure your profile skills are up-to-date for better match scores! 🎯\n\nWould you like me to help you search for specific roles, or would you prefer to optimize your profile first?";
  }

  // Resume
  if (/resume|cv|ats|curriculum vitae/i.test(lower)) {
    return "Let's make your resume shine! 📝✨\n\nHere's what I recommend:\n\n1. **Use our Resume Builder** — Create a professional, ATS-optimized resume section by section\n2. **Get an ATS Score** — Paste your resume text to get an instant AI-powered score (0–100)\n3. **Keyword Analysis** — See which industry keywords you're missing\n\n**Pro tips for a strong resume:**\n- ✅ Add **quantified achievements** (e.g., \"Increased sales by 40%\")\n- ✅ Include **role-specific keywords** from job descriptions\n- ✅ Keep it to **1-2 pages** maximum\n- ✅ Use a **clean, ATS-friendly format**\n\nWould you like to build a new resume or analyze an existing one?";
  }

  // Interview
  if (/interview|prepare|practice|question|behavioral|technical/i.test(lower)) {
    return "Let's get you interview-ready! 🎯\n\nI can help you prepare in several ways:\n\n**Technical Interview Prep:**\n- Data Structures & Algorithms\n- System Design questions\n- Language-specific problems (React, Python, Java, etc.)\n\n**Behavioral Interview Prep:**\n- STAR method responses\n- Common HR questions\n- Situational judgment scenarios\n\n**Quick Practice Question:**\n> *\"Tell me about a challenging project you worked on and how you overcame obstacles.\"*\n\n**Tips for success:**\n- 🎤 Practice speaking your answers aloud\n- ⏱️ Keep answers under 2 minutes\n- 📊 Use specific numbers and results\n\nWhat type of interview would you like to practice for?";
  }

  // Skills
  if (/skill|learn|course|study|roadmap|gap|grow|development|training|certification/i.test(lower)) {
    return "Let's accelerate your skill growth! 📊🚀\n\nHere's what I suggest:\n\n**Top In-Demand Skills for 2025:**\n1. **AI/Machine Learning** — Very high demand across industries\n2. **Cloud Computing** (AWS/Azure/GCP) — Essential for modern development\n3. **System Design** — Key for senior roles\n4. **TypeScript/React** — Frontend gold standard\n5. **Data Engineering** — Growing rapidly\n\n**How to get started:**\n- 📋 Visit our **Skill Roadmap** to see a personalized learning path\n- 🎓 Check out the **Learning Center** for curated courses\n- 📝 Take the **Weekly Assessment** to track progress\n\nWould you like me to recommend a learning roadmap for a specific role?";
  }

  // Mentor
  if (/mentor|guide|coach|advice|connect|network|professional/i.test(lower)) {
    return "Mentorship can be a game-changer for your career! 🤝\n\nHere's how our mentorship program works:\n\n1. **AI-Powered Matching** — We match you with mentors based on your goals and interests\n2. **Expert Mentors** — Industry professionals from top companies (Google, Microsoft, Amazon, etc.)\n3. **Flexible Sessions** — Book 1-on-1 video calls at times that work for you\n4. **Diverse Expertise** — Engineering, Product, Design, Data Science, and more\n\n**Benefits of having a mentor:**\n- 🎯 Get insider industry insights\n- 📈 Accelerate your career growth\n- 🔗 Expand your professional network\n- 💡 Receive personalized advice\n\nWould you like me to find mentors in your field of interest?";
  }

  // Help
  if (/help|what can you do|feature|capable|assist/i.test(lower)) {
    return "I'd love to help! Here's everything I can do for you: 😊\n\n**🔍 Job Search**\n- Find AI-matched jobs based on your profile\n- Search real-time listings across the web\n\n**📝 Resume**\n- Build professional resumes with our smart builder\n- Get instant ATS score and optimization tips\n\n**🎯 Interview Prep**\n- Practice technical and behavioral questions\n- Get feedback on your answers\n\n**📊 Skills & Learning**\n- Identify skill gaps for your target role\n- Get personalized learning roadmaps\n\n**🤝 Mentorship**\n- Match with industry professionals\n- Book 1-on-1 coaching sessions\n\nJust tell me what area you'd like to focus on, and I'll guide you step by step! 💪";
  }

  // Default - polite and helpful
  return "That's a great question! 😊\n\nI'd love to help you with that. Could you tell me a bit more about what you're looking for?\n\nHere are some areas I can assist with:\n- 💼 **Job searching** — Finding the right opportunities\n- 📝 **Resume optimization** — Making your resume stand out\n- 🎯 **Interview preparation** — Getting ready for your big day\n- 📊 **Skill development** — Growing your professional skills\n- 🤝 **Mentorship** — Connecting with industry experts\n\nFeel free to ask me anything specific, and I'll do my best to provide helpful, actionable advice! 🚀";
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
