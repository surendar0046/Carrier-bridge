import { useCoursesStore } from '@career-bridge/store';

export const useCourses = () => {
  const store = useCoursesStore();
  return {
    courses: store.courses,
    enrolledCourses: store.enrolledCourses,
    isLoading: store.isLoading,
    fetchCourses: store.fetchCourses,
    enrollCourse: store.enrollCourse,
  };
};
