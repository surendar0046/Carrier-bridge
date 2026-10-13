import { httpClient } from '../client/httpClient';
import { Mentor, MentorSession, SessionStatus } from '@career-bridge/types';
import { ApiResponse, PaginatedResponse } from '@career-bridge/types';
import { env } from '@career-bridge/config';

export const SIVAABINESH_MENTOR: Mentor = {
  id: 'mentor-sivaabinesh',
  userId: 'user-m-sivaabinesh',
  name: 'Sivaabinesh',
  email: 'sivaabinesh096@gmail.com',
  phone: '9342397141',
  whatsapp: '9342397141',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=faces',
  title: 'Full Stack Engineer & Cloud Architect',
  company: 'CareerBridge Mentorship Network',
  expertise: ['Full Stack Development', 'React & Next.js', 'Cloud Architecture', 'System Design', 'Interview Prep'],
  bio: 'Expert full-stack developer and cloud architect dedicated to helping students bridge the gap between academic theory and high-scale production systems.',
  rating: 4.96,
  reviewCount: 142,
  totalSessions: 285,
  hourlyRate: 1500,
  currency: 'INR',
  availability: [
    { dayOfWeek: 1, startTime: '17:00', endTime: '21:00' },
    { dayOfWeek: 2, startTime: '17:00', endTime: '21:00' },
    { dayOfWeek: 3, startTime: '17:00', endTime: '21:00' },
    { dayOfWeek: 4, startTime: '17:00', endTime: '21:00' },
    { dayOfWeek: 5, startTime: '17:00', endTime: '21:00' },
    { dayOfWeek: 6, startTime: '10:00', endTime: '18:00' },
    { dayOfWeek: 0, startTime: '10:00', endTime: '18:00' },
  ],
  languages: ['English', 'Tamil'],
  isVerified: true,
  responseTime: '< 30 mins',
};

export const SURENDAR_MENTOR: Mentor = {
  id: 'mentor-surendar',
  userId: 'user-m-surendar',
  name: 'Surendar',
  email: 'surendarg0046@gmail.com',
  phone: '9787835726',
  whatsapp: '9787835726',
  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=faces',
  title: 'AI/ML Specialist & Data Systems Architect',
  company: 'CareerBridge Mentorship Network',
  expertise: ['AI & Machine Learning', 'Python & PyTorch', 'Data Engineering', 'Deep Learning', 'Algorithm Design'],
  bio: 'Specialized AI/ML researcher and engineer mentoring students in building practical predictive models, neural architectures, and data engineering pipelines.',
  rating: 4.98,
  reviewCount: 158,
  totalSessions: 310,
  hourlyRate: 1500,
  currency: 'INR',
  availability: [
    { dayOfWeek: 1, startTime: '17:00', endTime: '21:00' },
    { dayOfWeek: 2, startTime: '17:00', endTime: '21:00' },
    { dayOfWeek: 3, startTime: '17:00', endTime: '21:00' },
    { dayOfWeek: 4, startTime: '17:00', endTime: '21:00' },
    { dayOfWeek: 5, startTime: '17:00', endTime: '21:00' },
    { dayOfWeek: 6, startTime: '10:00', endTime: '18:00' },
    { dayOfWeek: 0, startTime: '10:00', endTime: '18:00' },
  ],
  languages: ['English', 'Tamil'],
  isVerified: true,
  responseTime: '< 30 mins',
};

export const CHANDHRU_MENTOR: Mentor = {
  id: 'mentor-chandhru',
  userId: 'user-m-chandhru',
  name: 'Chandhru',
  email: 'chandhruramesh@gmail.com',
  phone: '8870595506',
  whatsapp: '8870595506',
  avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop&crop=faces',
  title: 'DevOps Engineer & Cloud Infrastructure Lead',
  company: 'CareerBridge Mentorship Network',
  expertise: ['DevOps & CI/CD', 'Docker & Kubernetes', 'AWS / Cloud Infrastructure', 'Linux & Networking'],
  bio: 'Cloud infrastructure and automation expert guiding engineers in container orchestration, microservices deployment, and robust continuous integration.',
  rating: 4.94,
  reviewCount: 120,
  totalSessions: 240,
  hourlyRate: 1400,
  currency: 'INR',
  availability: [
    { dayOfWeek: 1, startTime: '17:00', endTime: '21:00' },
    { dayOfWeek: 2, startTime: '17:00', endTime: '21:00' },
    { dayOfWeek: 3, startTime: '17:00', endTime: '21:00' },
    { dayOfWeek: 4, startTime: '17:00', endTime: '21:00' },
    { dayOfWeek: 5, startTime: '17:00', endTime: '21:00' },
    { dayOfWeek: 6, startTime: '10:00', endTime: '18:00' },
    { dayOfWeek: 0, startTime: '10:00', endTime: '18:00' },
  ],
  languages: ['English', 'Tamil'],
  isVerified: true,
  responseTime: '< 30 mins',
};

export const AKILAN_MENTOR: Mentor = {
  id: 'mentor-akilan',
  userId: 'user-m-akilan',
  name: 'Akilan',
  email: 'akilan123@gmail.com',
  phone: '6384020057',
  whatsapp: '6384020057',
  avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&crop=faces',
  title: 'Cybersecurity Analyst & Penetration Tester',
  company: 'CareerBridge Mentorship Network',
  expertise: ['Cybersecurity', 'Penetration Testing', 'Network Security', 'SOC Operations', 'Ethical Hacking'],
  bio: 'Hands-on cybersecurity consultant mentoring students in threat modeling, vulnerability analysis, web security audits, and defensive operations.',
  rating: 4.95,
  reviewCount: 134,
  totalSessions: 260,
  hourlyRate: 1500,
  currency: 'INR',
  availability: [
    { dayOfWeek: 1, startTime: '17:00', endTime: '21:00' },
    { dayOfWeek: 2, startTime: '17:00', endTime: '21:00' },
    { dayOfWeek: 3, startTime: '17:00', endTime: '21:00' },
    { dayOfWeek: 4, startTime: '17:00', endTime: '21:00' },
    { dayOfWeek: 5, startTime: '17:00', endTime: '21:00' },
    { dayOfWeek: 6, startTime: '10:00', endTime: '18:00' },
    { dayOfWeek: 0, startTime: '10:00', endTime: '18:00' },
  ],
  languages: ['English', 'Tamil'],
  isVerified: true,
  responseTime: '< 30 mins',
};

export const LOGESHWARAN_MENTOR: Mentor = {
  id: 'mentor-logeshwaran',
  userId: 'user-m-logeshwaran',
  name: 'Logeshwaran',
  email: 'logeshwarang234@gmail.com',
  phone: '6374706481',
  whatsapp: '6374706481',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=faces',
  title: 'Backend Engineer & High-Scale Database Architect',
  company: 'CareerBridge Mentorship Network',
  expertise: ['Backend Development', 'Node.js & Go', 'PostgreSQL & Redis', 'Microservices', 'API Design'],
  bio: 'Backend performance specialist passionate about coaching developers on distributed systems, transaction management, and low-latency API architecture.',
  rating: 4.97,
  reviewCount: 149,
  totalSessions: 290,
  hourlyRate: 1500,
  currency: 'INR',
  availability: [
    { dayOfWeek: 1, startTime: '17:00', endTime: '21:00' },
    { dayOfWeek: 2, startTime: '17:00', endTime: '21:00' },
    { dayOfWeek: 3, startTime: '17:00', endTime: '21:00' },
    { dayOfWeek: 4, startTime: '17:00', endTime: '21:00' },
    { dayOfWeek: 5, startTime: '17:00', endTime: '21:00' },
    { dayOfWeek: 6, startTime: '10:00', endTime: '18:00' },
    { dayOfWeek: 0, startTime: '10:00', endTime: '18:00' },
  ],
  languages: ['English', 'Tamil'],
  isVerified: true,
  responseTime: '< 30 mins',
};

export const MONIKA_MENTOR: Mentor = {
  id: 'mentor-monika',
  userId: 'user-m-monika',
  name: 'Monika',
  email: 'monikarj096@gmail.com',
  phone: '7826814282',
  whatsapp: '7826814282',
  avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=faces',
  title: 'Lead UI/UX Designer & Frontend Engineer',
  company: 'CareerBridge Mentorship Network',
  expertise: ['UI/UX Design', 'Design Systems', 'Frontend Engineering', 'Figma & TailwindCSS', 'Product Design'],
  bio: 'Product designer and frontend architect helping students create pixel-perfect interfaces, master typography and design tokens, and build intuitive user experiences.',
  rating: 4.99,
  reviewCount: 175,
  totalSessions: 340,
  hourlyRate: 1400,
  currency: 'INR',
  availability: [
    { dayOfWeek: 1, startTime: '17:00', endTime: '21:00' },
    { dayOfWeek: 2, startTime: '17:00', endTime: '21:00' },
    { dayOfWeek: 3, startTime: '17:00', endTime: '21:00' },
    { dayOfWeek: 4, startTime: '17:00', endTime: '21:00' },
    { dayOfWeek: 5, startTime: '17:00', endTime: '21:00' },
    { dayOfWeek: 6, startTime: '10:00', endTime: '18:00' },
    { dayOfWeek: 0, startTime: '10:00', endTime: '18:00' },
  ],
  languages: ['English', 'Tamil'],
  isVerified: true,
  responseTime: '< 30 mins',
};

export const KOWSHIKA_MENTOR: Mentor = {
  id: 'mentor-kowshika',
  userId: 'user-m-kowshika',
  name: 'Kowshika',
  email: 'kowshikaarumugam2005@gmail.com',
  phone: '9787545597',
  whatsapp: '9787545597',
  avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=faces',
  title: 'Mobile App Developer & QA Automation Specialist',
  company: 'CareerBridge Mentorship Network',
  expertise: ['Mobile App Development', 'Flutter & React Native', 'QA & Automation Testing', 'Agile Workflows'],
  bio: 'Cross-platform mobile engineer and testing specialist coaching learners on mobile architecture, test automation suites, and app store deployment.',
  rating: 4.96,
  reviewCount: 130,
  totalSessions: 255,
  hourlyRate: 1400,
  currency: 'INR',
  availability: [
    { dayOfWeek: 1, startTime: '17:00', endTime: '21:00' },
    { dayOfWeek: 2, startTime: '17:00', endTime: '21:00' },
    { dayOfWeek: 3, startTime: '17:00', endTime: '21:00' },
    { dayOfWeek: 4, startTime: '17:00', endTime: '21:00' },
    { dayOfWeek: 5, startTime: '17:00', endTime: '21:00' },
    { dayOfWeek: 6, startTime: '10:00', endTime: '18:00' },
    { dayOfWeek: 0, startTime: '10:00', endTime: '18:00' },
  ],
  languages: ['English', 'Tamil'],
  isVerified: true,
  responseTime: '< 30 mins',
};

export const LAKSHANAPRIYA_MENTOR: Mentor = {
  id: 'mentor-lakshanapriya',
  userId: 'user-m-lakshanapriya',
  name: 'Lakshanapriya',
  email: 'lakshanapriya0801@gmail.com',
  phone: '7092036790',
  whatsapp: '7092036790',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=faces',
  title: 'Senior Technical Mentor & Career Coach',
  company: 'CareerBridge Mentorship Network',
  expertise: ['Full Stack Development', 'Career Strategy', 'System Design', 'React & Node.js', 'Interview Preparation'],
  bio: 'Expert technical mentor with extensive experience coaching students and junior engineers. Available for 1-on-1 technical mock interviews, career strategy, and project reviews.',
  rating: 4.98,
  reviewCount: 164,
  totalSessions: 320,
  hourlyRate: 1500,
  currency: 'INR',
  availability: [
    { dayOfWeek: 1, startTime: '17:00', endTime: '21:00' },
    { dayOfWeek: 2, startTime: '17:00', endTime: '21:00' },
    { dayOfWeek: 3, startTime: '17:00', endTime: '21:00' },
    { dayOfWeek: 4, startTime: '17:00', endTime: '21:00' },
    { dayOfWeek: 5, startTime: '17:00', endTime: '21:00' },
    { dayOfWeek: 6, startTime: '10:00', endTime: '18:00' },
    { dayOfWeek: 0, startTime: '10:00', endTime: '18:00' },
  ],
  languages: ['English', 'Tamil', 'Hindi'],
  linkedinUrl: 'https://linkedin.com/in/lakshanapriya',
  isVerified: true,
  responseTime: '< 30 mins',
};

export const MOCK_MENTORS: Mentor[] = [
  SIVAABINESH_MENTOR,
  SURENDAR_MENTOR,
  CHANDHRU_MENTOR,
  AKILAN_MENTOR,
  LOGESHWARAN_MENTOR,
  MONIKA_MENTOR,
  KOWSHIKA_MENTOR,
  LAKSHANAPRIYA_MENTOR,
];

export function buildMentorWhatsAppLink(
  mentor: Mentor,
  session: {
    studentName?: string;
    scheduledAt: string;
    topic: string;
    duration?: number;
    meetingUrl?: string;
    notes?: string;
  }
): string {
  const number = (mentor.whatsapp || mentor.phone || '7092036790').replace(/\D/g, '');
  const cleanNumber = number.startsWith('91') ? number : number.length === 10 ? `91${number}` : number;

  const dateStr = new Date(session.scheduledAt).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const timeStr = new Date(session.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const text =
    `*Book for mentor session*\n\n` +
    `Hello ${mentor.name},\n` +
    `I would like to book a 1-on-1 mentorship session with you on CareerBridge.\n\n` +
    `📌 *Session Details:*\n` +
    `• Student: ${session.studentName || 'Student'}\n` +
    `• Date: ${dateStr}\n` +
    `• Time: ${timeStr}\n` +
    `• Topic: ${session.topic}\n` +
    `• Duration: ${session.duration || 45} mins\n` +
    (session.notes ? `• Note: "${session.notes}"\n` : '') +
    `\nPlease confirm this mentor session booking. Thank you!`;

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
}

export function buildMentorGmailLink(
  mentor: Mentor,
  session: {
    studentName?: string;
    studentEmail?: string;
    scheduledAt: string;
    topic: string;
    duration?: number;
    meetingUrl?: string;
    notes?: string;
  }
): string {
  const email = mentor.email || 'lakshanapriya0801@gmail.com';
  const subject = `Book for mentor session: ${session.topic} (${session.studentName || 'Student'})`;
  const body =
    `Dear ${mentor.name},\n\n` +
    `Book for mentor session request from CareerBridge:\n\n` +
    `Student: ${session.studentName || 'Student'} (${session.studentEmail || 'No email provided'})\n` +
    `Topic: ${session.topic}\n` +
    `Scheduled Date & Time: ${new Date(session.scheduledAt).toLocaleString()}\n` +
    `Duration: ${session.duration || 45} minutes\n` +
    (session.notes ? `Student Note: "${session.notes}"\n` : '') +
    `\nPlease confirm this mentorship session booking.\n\n` +
    `Warm regards,\n` +
    `${session.studentName || 'Student'}`;

  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function buildMentorWebGmailLink(
  mentor: Mentor,
  session: {
    studentName?: string;
    studentEmail?: string;
    scheduledAt: string;
    topic: string;
    duration?: number;
    meetingUrl?: string;
    notes?: string;
  }
): string {
  const email = mentor.email || 'lakshanapriya0801@gmail.com';
  const subject = `Book for mentor session: ${session.topic} (${session.studentName || 'Student'})`;
  const body =
    `Dear ${mentor.name},\n\n` +
    `Book for mentor session request from CareerBridge:\n\n` +
    `Student: ${session.studentName || 'Student'} (${session.studentEmail || 'No email provided'})\n` +
    `Topic: ${session.topic}\n` +
    `Scheduled Date & Time: ${new Date(session.scheduledAt).toLocaleString()}\n` +
    `Duration: ${session.duration || 45} minutes\n` +
    (session.notes ? `Student Note: "${session.notes}"\n` : '') +
    `\nPlease confirm this mentorship session booking.\n\n` +
    `Warm regards,\n` +
    `${session.studentName || 'Student'}`;

  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

const USE_MOCK = env.useMock;
const SESSIONS_STORAGE_KEY = 'cb_booked_mentor_sessions';

export const mentorService = {
  async getMentors(topic?: string): Promise<PaginatedResponse<Mentor>> {
    try {
      if (USE_MOCK) throw new Error('Mock mode enabled');
      const res = await httpClient.get<ApiResponse<PaginatedResponse<Mentor>>>('/mentors', { params: { topic } });
      if (res.data?.data?.items && res.data.data.items.length > 0) {
        const list = [...res.data.data.items];
        // Ensure all our primary mentors exist in list
        for (const m of MOCK_MENTORS) {
          if (!list.some((existing) => existing.id === m.id || existing.name.toLowerCase() === m.name.toLowerCase())) {
            list.push(m);
          }
        }
        return { ...res.data.data, items: list };
      }
      throw new Error('API returned empty or invalid data');
    } catch (err) {
      const items = topic
        ? MOCK_MENTORS.filter((m) =>
            m.expertise.some((e) => e.toLowerCase().includes(topic.toLowerCase())) ||
            m.title.toLowerCase().includes(topic.toLowerCase()) ||
            m.name.toLowerCase().includes(topic.toLowerCase())
          )
        : MOCK_MENTORS;
      return { items, meta: { page: 1, limit: items.length, total: items.length, totalPages: 1 } };
    }
  },

  async getMentorById(id: string): Promise<Mentor | null> {
    const cleanId = (id || '').toLowerCase().replace('mentor-', '').trim();
    const found = MOCK_MENTORS.find((m) =>
      m.id.toLowerCase() === (id || '').toLowerCase() ||
      m.name.toLowerCase() === cleanId ||
      m.id.toLowerCase().includes(cleanId) ||
      cleanId.includes(m.name.toLowerCase())
    );
    if (found) return found;

    try {
      if (USE_MOCK) return null;
      const res = await httpClient.get<ApiResponse<Mentor>>(`/mentors/${id}`);
      return res.data?.data ?? null;
    } catch (err) {
      return null;
    }
  },

  async bookSession(payload: {
    mentorId: string;
    scheduledAt: string;
    duration: number;
    topic: string;
    studentName?: string;
    studentEmail?: string;
    studentPhone?: string;
    notes?: string;
  }): Promise<MentorSession> {
    const meetingUrl = `/mentor/${payload.mentorId}`;
    const newSession: MentorSession = {
      id: `session-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      mentorId: payload.mentorId,
      userId: 'user-001',
      status: SessionStatus.SCHEDULED,
      scheduledAt: payload.scheduledAt,
      duration: payload.duration || 45,
      topic: payload.topic,
      notes: payload.notes,
      meetingUrl,
      studentName: payload.studentName || 'Student',
      studentEmail: payload.studentEmail || 'student@careerbridge.com',
      studentPhone: payload.studentPhone,
      whatsappNotified: true,
      emailNotified: true,
    };

    // Persist to localStorage
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(SESSIONS_STORAGE_KEY);
        const existing: MentorSession[] = stored ? JSON.parse(stored) : [];
        existing.unshift(newSession);
        localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(existing));
        window.dispatchEvent(new CustomEvent('cb-mentor-session-booked', { detail: newSession }));
      } catch (e) {
        console.warn('Failed to save session to localStorage:', e);
      }
    }

    try {
      if (!USE_MOCK) {
        await httpClient.post<ApiResponse<MentorSession>>('/mentors/sessions', payload);
      }
    } catch {}

    return newSession;
  },

  async getMySessions(): Promise<MentorSession[]> {
    let localSessions: MentorSession[] = [];
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(SESSIONS_STORAGE_KEY);
        if (stored) {
          localSessions = JSON.parse(stored);
        }
      } catch {}
    }

    const defaultSessions: MentorSession[] = [
      {
        id: 'session-live-lakshanapriya',
        mentorId: 'mentor-lakshanapriya',
        userId: 'user-001',
        status: SessionStatus.SCHEDULED,
        scheduledAt: new Date(Date.now() + 1800000).toISOString(),
        duration: 45,
        topic: '1-on-1 Full Stack & Career Strategy Mentorship',
        meetingUrl: '/mentor/mentor-lakshanapriya',
        studentName: 'Student',
        studentEmail: 'student@careerbridge.com',
        whatsappNotified: true,
        emailNotified: true,
      },
    ];

    // Combine local user booked sessions + defaults, removing duplicate IDs
    const combined = [...localSessions];
    for (const def of defaultSessions) {
      if (!combined.some((s) => s.id === def.id)) {
        combined.push(def);
      }
    }

    return combined;
  },
};

