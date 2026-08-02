import { useEffect, useState } from 'react';
import { jobService } from '../modules/jobService';
import { Job, JobFilter } from '@career-bridge/types';

export const useJobsQuery = (filters?: JobFilter) => {
  const [data, setData] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    jobService.getJobs(filters)
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
  }, [JSON.stringify(filters)]);

  return { data, isLoading, error };
};
