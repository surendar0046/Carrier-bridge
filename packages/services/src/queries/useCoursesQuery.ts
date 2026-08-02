import { useEffect, useState } from 'react';
import { courseService } from '../modules/courseService';
import { Course } from '@career-bridge/types';

export const useCoursesQuery = (category?: string) => {
  const [data, setData] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    courseService.getCourses(category)
      .then(res => {
        if (isMounted) {
          setData(res.items);
          setIsLoading(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          setError(err.message);
          setIsLoading(false);
        }
      });

    return () => { isMounted = false; };
  }, [category]);

  return { data, isLoading, error };
};
