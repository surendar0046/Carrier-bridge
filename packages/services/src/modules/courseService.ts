import { httpClient } from '../client/httpClient';
import { Course, CourseEnrollment, SkillRoadmap, CourseLevel } from '@career-bridge/types';
import { ApiResponse, PaginatedResponse } from '@career-bridge/types';
import { env } from '@career-bridge/config';

export const MOCK_COURSES: Course[] = [
  {
    id: 'course-001',
    title: 'Complete React & Next.js Masterclass',
    description: 'From beginner to advanced — build production-ready apps with React 18 and Next.js 14.',
    thumbnail: 'https://ui-avatars.com/api/?name=React&background=61dafb&color=000&size=200',
    instructor: 'Rahul Verma',
    level: CourseLevel.INTERMEDIATE,
    duration: 3600,
    lessonsCount: 142,
    enrolledCount: 12500,
    rating: 4.8,
    reviewCount: 2100,
    skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
    category: 'Web Development',
    price: 1999,
    currency: 'INR',
    isFree: false,
    isCertified: true,
    curriculum: [
      { id: 'mod-1', title: 'React Fundamentals', lessons: [] },
      { id: 'mod-2', title: 'Hooks Deep Dive', lessons: [] },
      { id: 'mod-3', title: 'Next.js App Router', lessons: [] },
    ],
    createdAt: '2026-01-10T00:00:00Z',
  },
  {
    id: 'course-002',
    title: 'Python for Data Science & ML',
    description: 'Master pandas, scikit-learn, and build real ML models from scratch.',
    thumbnail: 'https://ui-avatars.com/api/?name=Python&background=306998&color=fff&size=200',
    instructor: 'Ananya Krishnan',
    level: CourseLevel.BEGINNER,
    duration: 2800,
    lessonsCount: 98,
    enrolledCount: 18900,
    rating: 4.7,
    reviewCount: 3400,
    skills: ['Python', 'pandas', 'scikit-learn', 'Matplotlib', 'NumPy'],
    category: 'Data Science',
    price: 0,
    currency: 'INR',
    isFree: true,
    isCertified: true,
    curriculum: [
      { id: 'mod-1', title: 'Python Basics', lessons: [] },
      { id: 'mod-2', title: 'Data Manipulation', lessons: [] },
      { id: 'mod-3', title: 'Machine Learning', lessons: [] },
    ],
    createdAt: '2026-02-05T00:00:00Z',
  },
  {
    id: 'course-003',
    title: 'System Design for Engineers',
    description: 'Design scalable distributed systems like Netflix, Uber, and WhatsApp.',
    thumbnail: 'https://ui-avatars.com/api/?name=SysDesign&background=22c55e&color=fff&size=200',
    instructor: 'Kiran Patel',
    level: CourseLevel.ADVANCED,
    duration: 1800,
    lessonsCount: 60,
    enrolledCount: 8700,
    rating: 4.9,
    reviewCount: 980,
    skills: ['System Design', 'Microservices', 'Databases', 'Caching', 'Load Balancing'],
    category: 'Engineering',
    price: 2499,
    currency: 'INR',
    isFree: false,
    isCertified: true,
    curriculum: [
      { id: 'mod-1', title: 'Scalability Basics', lessons: [] },
      { id: 'mod-2', title: 'Database Design', lessons: [] },
    ],
    createdAt: '2026-03-01T00:00:00Z',
  },
];

export const MOCK_ROADMAP: SkillRoadmap = {
  id: 'roadmap-001',
  title: 'Full Stack Developer Roadmap',
  description: 'Structured path from beginner to full-stack engineer ready for top companies.',
  targetRole: 'Full Stack Developer',
  estimatedDuration: 180,
  nodes: [
    { id: 'n1', skill: 'HTML & CSS', level: CourseLevel.BEGINNER, status: 'completed', courses: ['course-001'], dependsOn: [], position: { x: 100, y: 50 } },
    { id: 'n2', skill: 'JavaScript', level: CourseLevel.BEGINNER, status: 'completed', courses: [], dependsOn: ['n1'], position: { x: 100, y: 150 } },
    { id: 'n3', skill: 'React', level: CourseLevel.INTERMEDIATE, status: 'in_progress', courses: ['course-001'], dependsOn: ['n2'], position: { x: 100, y: 250 } },
    { id: 'n4', skill: 'Node.js', level: CourseLevel.INTERMEDIATE, status: 'available', courses: [], dependsOn: ['n2'], position: { x: 300, y: 250 } },
    { id: 'n5', skill: 'PostgreSQL', level: CourseLevel.INTERMEDIATE, status: 'locked', courses: [], dependsOn: ['n4'], position: { x: 300, y: 350 } },
    { id: 'n6', skill: 'System Design', level: CourseLevel.ADVANCED, status: 'locked', courses: ['course-003'], dependsOn: ['n3', 'n5'], position: { x: 200, y: 450 } },
  ],
};

const USE_MOCK = env.useMock;

export const courseService = {
  async getCourses(category?: string): Promise<PaginatedResponse<Course>> {
    if (USE_MOCK) {
      const items = category ? MOCK_COURSES.filter(c => c.category === category) : MOCK_COURSES;
      return { items, meta: { page: 1, limit: 10, total: items.length, totalPages: 1 } };
    }
    const res = await httpClient.get<ApiResponse<PaginatedResponse<Course>>>('/courses', { params: { category } });
    return res.data.data;
  },

  async getCourseById(id: string): Promise<Course | null> {
    if (USE_MOCK) return MOCK_COURSES.find((c) => c.id === id) || null;
    const res = await httpClient.get<ApiResponse<Course>>(`/courses/${id}`);
    return res.data.data;
  },

  async enroll(courseId: string): Promise<CourseEnrollment> {
    if (USE_MOCK) {
      return {
        id: `enroll-${Date.now()}`,
        courseId,
        userId: 'user-001',
        enrolledAt: new Date().toISOString(),
        progress: 0,
      };
    }
    const res = await httpClient.post<ApiResponse<CourseEnrollment>>(`/courses/${courseId}/enroll`);
    return res.data.data;
  },

  async getRoadmap(userId?: string): Promise<SkillRoadmap> {
    if (USE_MOCK) return MOCK_ROADMAP;
    const res = await httpClient.get<ApiResponse<SkillRoadmap>>('/courses/roadmap');
    return res.data.data;
  },
};
