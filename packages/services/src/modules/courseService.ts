import { httpClient } from '../client/httpClient';
import { Course, CourseEnrollment, SkillRoadmap, CourseLevel } from '@career-bridge/types';
import { ApiResponse, PaginatedResponse } from '@career-bridge/types';
import { env } from '@career-bridge/config';

export const MOCK_COURSES: Course[] = [
  {
    id: 'course-001',
    title: 'Complete React & Next.js Masterclass',
    description: 'From beginner to advanced — build production-ready apps with React 18 and Next.js 14.',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
    instructor: 'Rahul Verma',
    level: CourseLevel.INTERMEDIATE,
    duration: 3600,
    lessonsCount: 12,
    enrolledCount: 12500,
    rating: 4.9,
    reviewCount: 2100,
    skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
    category: 'Web Development',
    price: 0,
    currency: 'INR',
    isFree: true,
    isCertified: true,
    curriculum: [
      {
        id: 'mod-1',
        title: 'React Fundamentals',
        lessons: [
          { id: 'c1-l1', title: 'Introduction to React 18', type: 'video', duration: 600, isPreview: true },
          { id: 'c1-l2', title: 'Understanding JSX & Elements', type: 'article', duration: 400, isPreview: true },
          { id: 'c1-l3', title: 'Components & Props', type: 'video', duration: 800, isPreview: false },
          { id: 'c1-l4', title: 'State and Lifecycle', type: 'video', duration: 1000, isPreview: false }
        ]
      },
      {
        id: 'mod-2',
        title: 'Hooks Deep Dive',
        lessons: [
          { id: 'c1-l5', title: 'useState and useEffect', type: 'video', duration: 1200, isPreview: false },
          { id: 'c1-l6', title: 'Custom Hooks pattern', type: 'video', duration: 900, isPreview: false },
          { id: 'c1-l7', title: 'useMemo & useCallback optimization', type: 'video', duration: 1100, isPreview: false }
        ]
      },
      {
        id: 'mod-3',
        title: 'Next.js App Router',
        lessons: [
          { id: 'c1-l8', title: 'App Router vs Pages Router', type: 'article', duration: 500, isPreview: true },
          { id: 'c1-l9', title: 'Server Components vs Client Components', type: 'video', duration: 1500, isPreview: false },
          { id: 'c1-l10', title: 'Data Fetching & Caching', type: 'video', duration: 1300, isPreview: false },
          { id: 'c1-l11', title: 'Static and Dynamic Rendering', type: 'video', duration: 1000, isPreview: false },
          { id: 'c1-l12', title: 'Deploying Next.js to Vercel', type: 'project', duration: 1800, isPreview: false }
        ]
      },
    ],
    createdAt: '2026-01-10T00:00:00Z',
  },
  {
    id: 'course-002',
    title: 'Python for Data Science & ML',
    description: 'Master pandas, scikit-learn, and build real ML models from scratch.',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=600&auto=format&fit=crop&q=80',
    instructor: 'Ananya Krishnan',
    level: CourseLevel.BEGINNER,
    duration: 2800,
    lessonsCount: 8,
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
      {
        id: 'mod-1',
        title: 'Python Basics',
        lessons: [
          { id: 'c2-l1', title: 'Introduction to Jupyter notebooks', type: 'video', duration: 500, isPreview: true },
          { id: 'c2-l2', title: 'Python List comprehensions & Dictionaries', type: 'video', duration: 700, isPreview: true },
          { id: 'c2-l3', title: 'Functions, args & kwargs', type: 'article', duration: 400, isPreview: false }
        ]
      },
      {
        id: 'mod-2',
        title: 'Data Manipulation',
        lessons: [
          { id: 'c2-l4', title: 'NumPy Arrays & Math operations', type: 'video', duration: 800, isPreview: false },
          { id: 'c2-l5', title: 'Pandas DataFrames & series', type: 'video', duration: 1200, isPreview: false },
          { id: 'c2-l6', title: 'Data Cleaning & handling missing values', type: 'video', duration: 1000, isPreview: false }
        ]
      },
      {
        id: 'mod-3',
        title: 'Machine Learning',
        lessons: [
          { id: 'c2-l7', title: 'Linear and Logistic Regression theory', type: 'video', duration: 1100, isPreview: false },
          { id: 'c2-l8', title: 'Building classification models with Scikit-learn', type: 'project', duration: 1600, isPreview: false }
        ]
      },
    ],
    createdAt: '2026-02-05T00:00:00Z',
  },
  {
    id: 'course-003',
    title: 'System Design for Engineers',
    description: 'Design scalable distributed systems like Netflix, Uber, and WhatsApp.',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80',
    instructor: 'Kiran Patel',
    level: CourseLevel.ADVANCED,
    duration: 1800,
    lessonsCount: 10,
    enrolledCount: 8700,
    rating: 4.9,
    reviewCount: 980,
    skills: ['System Design', 'Microservices', 'Databases', 'Caching', 'Load Balancing'],
    category: 'Engineering',
    price: 0,
    currency: 'INR',
    isFree: true,
    isCertified: true,
    curriculum: [
      {
        id: 'mod-1',
        title: 'Scalability Basics',
        lessons: [
          { id: 'c3-l1', title: 'Vertical vs Horizontal Scaling', type: 'video', duration: 600, isPreview: true },
          { id: 'c3-l2', title: 'Load Balancers & Round Robin routing', type: 'video', duration: 800, isPreview: true },
          { id: 'c3-l3', title: 'Caching strategies: Write-through & Write-back', type: 'video', duration: 1000, isPreview: false },
          { id: 'c3-l4', title: 'Content Delivery Networks (CDNs)', type: 'article', duration: 500, isPreview: false },
          { id: 'c3-l5', title: 'CAP Theorem deep dive', type: 'video', duration: 1200, isPreview: false }
        ]
      },
      {
        id: 'mod-2',
        title: 'Database Design',
        lessons: [
          { id: 'c3-l6', title: 'Relational vs NoSQL DB decisions', type: 'video', duration: 900, isPreview: false },
          { id: 'c3-l7', title: 'Database Sharding & Replication', type: 'video', duration: 1100, isPreview: false },
          { id: 'c3-l8', title: 'Consistent Hashing algorithm', type: 'video', duration: 1300, isPreview: false },
          { id: 'c3-l9', title: 'Message Queues: RabbitMQ vs Kafka', type: 'video', duration: 1200, isPreview: false },
          { id: 'c3-l10', title: 'Design a URL Shortener like Bitly', type: 'project', duration: 1500, isPreview: false }
        ]
      },
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

// Scopes enrollments in LocalStorage per user email
function getEnrollmentsKey(): string {
  if (typeof window === 'undefined') return '';
  try {
    const userStore = localStorage.getItem('career-bridge-user');
    if (userStore) {
      const parsed = JSON.parse(userStore);
      if (parsed?.state?.profile?.email) {
        return `cb_courses_${parsed.state.profile.email}`;
      }
    }
  } catch (e) {}
  return 'cb_courses_default';
}

export interface LocalEnrollment {
  courseId: string;
  progress: number;
  completedLessons: string[];
  enrolledAt: string;
}

export const courseService = {
  async getLocalEnrollments(): Promise<LocalEnrollment[]> {
    const key = getEnrollmentsKey();
    if (!key) return [];
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  async getCourses(category?: string): Promise<PaginatedResponse<Course>> {
    // Only return free courses
    let items = MOCK_COURSES.filter(c => c.isFree);
    if (category) {
      items = items.filter(c => c.category === category);
    }
    
    // Inject progress from LocalStorage if enrolled
    const enrollments = await this.getLocalEnrollments();
    const finalItems = items.map(c => {
      const enroll = enrollments.find(e => e.courseId === c.id);
      return enroll ? { ...c, progress: enroll.progress } : c;
    });

    return {
      items: finalItems,
      meta: { page: 1, limit: 10, total: finalItems.length, totalPages: 1 }
    };
  },

  async getCourseById(id: string): Promise<Course | null> {
    const c = MOCK_COURSES.find((c) => c.id === id);
    if (!c) return null;
    
    // Inject progress and completed checkmarks from LocalStorage
    const enrollments = await this.getLocalEnrollments();
    const enroll = enrollments.find(e => e.courseId === id);
    if (enroll) {
      const updatedCurriculum = c.curriculum?.map(mod => ({
        ...mod,
        lessons: mod.lessons.map(les => ({
          ...les,
          isCompleted: enroll.completedLessons?.includes(les.id) || false
        }))
      }));
      return { ...c, progress: enroll.progress, curriculum: updatedCurriculum };
    }
    return c;
  },

  async enroll(courseId: string): Promise<CourseEnrollment> {
    const key = getEnrollmentsKey();
    const enrollments = await this.getLocalEnrollments();
    if (!enrollments.some(e => e.courseId === courseId)) {
      enrollments.push({
        courseId,
        progress: 0,
        completedLessons: [],
        enrolledAt: new Date().toISOString()
      });
      if (key) localStorage.setItem(key, JSON.stringify(enrollments));
    }
    return {
      id: `enroll-${courseId}`,
      courseId,
      userId: 'current-user',
      enrolledAt: new Date().toISOString(),
      progress: 0
    };
  },

  async toggleLessonComplete(courseId: string, lessonId: string): Promise<number> {
    const key = getEnrollmentsKey();
    const enrollments = await this.getLocalEnrollments();
    const c = MOCK_COURSES.find(item => item.id === courseId);
    if (!c) return 0;
    
    // Total count of lessons
    const totalLessons = c.curriculum?.reduce((sum, mod) => sum + mod.lessons.length, 0) || 1;
    
    let newProgress = 0;
    const updated = enrollments.map(e => {
      if (e.courseId === courseId) {
        let completed = e.completedLessons || [];
        if (completed.includes(lessonId)) {
          completed = completed.filter(id => id !== lessonId);
        } else {
          completed = [...completed, lessonId];
        }
        // Round to nearest integer percentage
        newProgress = Math.round((completed.length / totalLessons) * 100);
        return {
          ...e,
          completedLessons: completed,
          progress: newProgress
        };
      }
      return e;
    });

    if (key) localStorage.setItem(key, JSON.stringify(updated));
    return newProgress;
  },

  async getRoadmap(userId?: string): Promise<SkillRoadmap> {
    if (USE_MOCK) return MOCK_ROADMAP;
    const res = await httpClient.get<ApiResponse<SkillRoadmap>>('/courses/roadmap');
    return res.data.data;
  },
};
