export { authService } from './modules/authService';
export { mapAuthError } from './modules/authErrors';
export { userService } from './modules/userService';
export { jobService, MOCK_JOBS } from './modules/jobService';
export { 
  mentorService, 
  MOCK_MENTORS, 
  SIVAABINESH_MENTOR,
  SURENDAR_MENTOR,
  CHANDHRU_MENTOR,
  AKILAN_MENTOR,
  LOGESHWARAN_MENTOR,
  MONIKA_MENTOR,
  KOWSHIKA_MENTOR,
  LAKSHANAPRIYA_MENTOR, 
  buildMentorWhatsAppLink, 
  buildMentorGmailLink, 
  buildMentorWebGmailLink 
} from './modules/mentorService';
export { courseService, MOCK_COURSES } from './modules/courseService';
export { resumeService } from './modules/resumeService';
export { chatService } from './modules/chatService';
export { gamificationService, MOCK_GAMIFICATION, MOCK_LEADERBOARD } from './modules/gamificationService';
export { roadmapService } from './modules/roadmapService';
export { realTimeJobService } from './modules/realTimeJobService';
export { 
  practiceProgressService,
  type StudentPracticeProgress,
  type CategoryProgress,
  type WeeklyAssessmentProgress,
  type PracticeSessionRecord,
  type PracticeCategory
} from './modules/practiceProgressService';
export { httpClient } from './client/httpClient';
export { onboardingService } from './modules/onboardingService';
export { env } from '@career-bridge/config';
