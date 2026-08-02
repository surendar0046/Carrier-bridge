import { CourseLevel } from '../common/enums';

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  image?: string;
  provider?: string;
  instructor?: string;
  level?: CourseLevel | string;
  duration?: string | number;
  lessonsCount?: number;
  modulesCount?: number;
  studentsCount?: number;
  enrolledCount?: number;
  rating?: number;
  reviewCount?: number;
  skills?: string[];
  category?: string;
  price?: number;
  currency?: string;
  isFree?: boolean;
  isCertified?: boolean;
  progress?: number;
  curriculum?: CourseCurriculum[];
  createdAt?: string;
}

export interface CourseCurriculum {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'article' | 'quiz' | 'project';
  duration: number;
  isPreview: boolean;
  isCompleted?: boolean;
}

export interface CourseEnrollment {
  id: string;
  courseId: string;
  userId: string;
  enrolledAt: string;
  completedAt?: string;
  progress: number;
  certificateUrl?: string;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  courses: Course[];
  skills: string[];
}

export interface SkillRoadmap {
  id: string;
  title?: string;
  roleTitle?: string;
  targetSalary?: string;
  matchPercentage?: number;
  skillsCount?: number;
  completedSkills?: number;
  description?: string;
  targetRole?: string;
  nodes: RoadmapNode[];
  estimatedDuration?: number;
}

export interface RoadmapNode {
  id: string;
  skill?: string;
  title?: string;
  category?: string;
  level?: CourseLevel | string;
  status: 'completed' | 'in_progress' | 'locked' | 'available' | string;
  courses?: string[];
  dependsOn?: string[];
  projects?: string[];
  position?: { x: number; y: number };
}
