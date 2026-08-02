import { httpClient } from '@career-bridge/services';
import { ApiResponse } from '@career-bridge/types';
import { env } from '@career-bridge/config';

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  actionType?: string;
}

export interface AIContext {
  userId: string;
  currentPage?: string;
  recentActions?: string[];
  skillProfile?: string[];
  careerGoal?: string;
}

const MOCK_RESPONSES: Record<string, string> = {
  default: "Great question! Based on your profile, I recommend focusing on system design skills next. Would you like me to create a personalized study plan?",
  job: "I found 5 jobs matching your skills. The top match is **Frontend Developer at TechNova** with a 92% match score. Want me to help you apply?",
  resume: "Your resume scores **78/100** on ATS. Key improvements: add more quantified achievements, include keywords like 'TypeScript' and 'REST APIs'.",
  interview: "Let's practice! Here's your first question: **'Explain the virtual DOM in React and how reconciliation works.'** Take your time and answer when ready.",
  skills: "Based on your current skill set, your top skill gaps for a Senior Developer role are: **System Design**, **Cloud (AWS/GCP)**, and **Kubernetes**. Want a roadmap?",
  mentor: "I matched you with **Priya Sharma** (Google, 4.9★) and **Arjun Mehta** (Microsoft, 4.8★). Both have openings this week. Shall I book a session?",
};

const getAIResponse = (message: string): string => {
  const lower = message.toLowerCase();
  if (lower.includes('job') || lower.includes('apply')) return MOCK_RESPONSES.job;
  if (lower.includes('resume') || lower.includes('ats')) return MOCK_RESPONSES.resume;
  if (lower.includes('interview') || lower.includes('practice')) return MOCK_RESPONSES.interview;
  if (lower.includes('skill') || lower.includes('learn')) return MOCK_RESPONSES.skills;
  if (lower.includes('mentor') || lower.includes('guide')) return MOCK_RESPONSES.mentor;
  return MOCK_RESPONSES.default;
};

const USE_MOCK = env.useMock;

export const aiService = {
  async sendMessage(message: string, context?: AIContext): Promise<AIMessage> {
    try {
      if (USE_MOCK) throw new Error('Mock mode enabled');
      const res = await httpClient.post<ApiResponse<AIMessage>>('/ai/chat', { message, context });
      if (res.data?.success && res.data?.data) {
        return res.data.data;
      }
      throw new Error('API returned unsuccessful response');
    } catch (err) {
      console.warn('AI Service: Falling back to local intelligence', err);
      await new Promise((r) => setTimeout(r, 800));
      return {
        id: `msg-fallback-${Date.now()}`,
        role: 'assistant',
        content: getAIResponse(message) + "\n\n*(Note: Running in local simulation mode)*",
        timestamp: new Date().toISOString(),
      };
    }
  },

  async getSkillGapAnalysis(userId: string): Promise<{ gaps: string[]; recommendations: string[] }> {
    if (USE_MOCK) {
      return {
        gaps: ['System Design', 'Cloud Architecture', 'Kubernetes', 'CI/CD'],
        recommendations: ['Take System Design course', 'Get AWS certification', 'Practice on real projects'],
      };
    }
    const res = await httpClient.get<ApiResponse<any>>(`/ai/skill-gap/${userId}`);
    return res.data.data;
  },

  async getCareerPathAnalysis(userId: string): Promise<{ paths: any[]; recommended: string }> {
    if (USE_MOCK) {
      return {
        paths: [
          { role: 'Senior Frontend Developer', probability: 85, timeframe: '1-2 years' },
          { role: 'Full Stack Engineer', probability: 72, timeframe: '2-3 years' },
          { role: 'Engineering Manager', probability: 45, timeframe: '4-6 years' },
        ],
        recommended: 'Senior Frontend Developer',
      };
    }
    const res = await httpClient.get<ApiResponse<any>>(`/ai/career-path/${userId}`);
    return res.data.data;
  },

  async getResumeAnalysis(resumeId: string): Promise<{ score: number; suggestions: string[] }> {
    if (USE_MOCK) {
      return {
        score: 78,
        suggestions: [
          'Add quantified impact (e.g., "Improved performance by 40%")',
          'Include more TypeScript and REST API keywords',
          'Shorten to 1 page for fresher profiles',
        ],
      };
    }
    const res = await httpClient.post<ApiResponse<any>>('/ai/resume-analyze', { resumeId });
    return res.data.data;
  },
};
