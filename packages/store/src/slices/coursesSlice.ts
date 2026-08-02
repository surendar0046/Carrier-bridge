import { create } from 'zustand';
import { Course, LearningPath, SkillRoadmap } from '@career-bridge/types';

interface CoursesState {
  courses: Course[];
  enrolledCourses: Course[];
  selectedCourse: Course | null;
  learningPaths: LearningPath[];
  roadmaps: SkillRoadmap[];
  activeRoadmap: SkillRoadmap | null;
  isLoading: boolean;
  error: string | null;

  fetchCourses: (category?: string) => Promise<void>;
  fetchEnrolledCourses: () => Promise<void>;
  enrollCourse: (courseId: string) => Promise<boolean>;
  selectCourse: (course: Course | null) => void;
  fetchSkillRoadmap: (role: string) => Promise<void>;
  updateProgress: (courseId: string, lessonId: string) => Promise<void>;
}

export const useCoursesStore = create<CoursesState>()((set, get) => ({
  courses: [],
  enrolledCourses: [],
  selectedCourse: null,
  learningPaths: [],
  roadmaps: [],
  activeRoadmap: null,
  isLoading: false,
  error: null,

  fetchCourses: async (category) => {
    set({ isLoading: true, error: null });
    try {
      const mockCourses: Course[] = [
        {
          id: 'c-101',
          title: 'Full Stack Web Development Architecture',
          category: 'Web Development',
          provider: 'Career Bridge Academy',
          rating: 4.9,
          studentsCount: 14200,
          duration: '24 Hours',
          level: 'Intermediate',
          image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
          description: 'Master Next.js, React Native, Node.js Microservices, and Cloud Native Deployments.',
          modulesCount: 12,
          progress: 45,
        },
        {
          id: 'c-102',
          title: 'AI Engineering & LLM Application Mastery',
          category: 'AI & Data Science',
          provider: 'Niral AI Institute',
          rating: 4.95,
          studentsCount: 8900,
          duration: '18 Hours',
          level: 'Advanced',
          image: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=600&auto=format&fit=crop&q=80',
          description: 'Build RAG pipelines, fine-tune models, and deploy scalable LLM agents with Python & LangChain.',
          modulesCount: 8,
          progress: 10,
        },
        {
          id: 'c-103',
          title: 'System Design for High-Scale Enterprise Systems',
          category: 'Software Engineering',
          provider: 'Architects Guild',
          rating: 4.88,
          studentsCount: 11500,
          duration: '30 Hours',
          level: 'Advanced',
          image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80',
          description: 'Learn distributed caching, event-driven architectures, database sharding, and resilience patterns.',
          modulesCount: 15,
          progress: 0,
        },
      ];
      const filtered = category ? mockCourses.filter(c => c.category === category) : mockCourses;
      set({ courses: filtered, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  fetchEnrolledCourses: async () => {
    try {
      const courses = get().courses.filter(c => (c.progress ?? 0) > 0);
      set({ enrolledCourses: courses });
    } catch {}
  },

  enrollCourse: async (courseId) => {
    try {
      const course = get().courses.find(c => c.id === courseId);
      if (course) {
        const updated = { ...course, progress: 1 };
        set(state => ({
          enrolledCourses: [...state.enrolledCourses.filter(c => c.id !== courseId), updated],
        }));
      }
      return true;
    } catch {
      return false;
    }
  },

  selectCourse: (course) => set({ selectedCourse: course }),

  fetchSkillRoadmap: async (role) => {
    set({ isLoading: true });
    try {
      const mockRoadmap: SkillRoadmap = {
        id: `rm-${role.toLowerCase().replace(/\s+/g, '-')}`,
        roleTitle: role,
        targetSalary: '$120,000 - $160,000',
        matchPercentage: 88,
        skillsCount: 14,
        completedSkills: 9,
        nodes: [
          { id: 'node-1', title: 'JavaScript / TypeScript Deep Dive', status: 'completed', category: 'Fundamentals' },
          { id: 'node-2', title: 'React & Next.js App Router', status: 'completed', category: 'Frontend' },
          { id: 'node-3', title: 'Node.js & Microservices Architecture', status: 'in-progress', category: 'Backend' },
          { id: 'node-4', title: 'PostgreSQL & Distributed Caching', status: 'in-progress', category: 'Database' },
          { id: 'node-5', title: 'System Design & Distributed Systems', status: 'locked', category: 'Architecture' },
        ],
      };
      set({ activeRoadmap: mockRoadmap, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  updateProgress: async (courseId, lessonId) => {
    set(state => ({
      courses: state.courses.map(c => c.id === courseId ? { ...c, progress: Math.min(100, (c.progress || 0) + 15) } : c),
      enrolledCourses: state.enrolledCourses.map(c => c.id === courseId ? { ...c, progress: Math.min(100, (c.progress || 0) + 15) } : c),
    }));
  },
}));
