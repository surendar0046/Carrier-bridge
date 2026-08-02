import { useEffect, useState } from 'react';
import { mentorService } from '../modules/mentorService';
import { Mentor } from '@career-bridge/types';

export const useMentorsQuery = (topic?: string) => {
  const [data, setData] = useState<Mentor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    mentorService.getMentors(topic)
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
  }, [topic]);

  return { data, isLoading, error };
};
