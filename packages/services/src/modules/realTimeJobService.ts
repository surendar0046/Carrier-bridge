import axios from 'axios';
import { env } from '@career-bridge/config';
import { Job, JobType } from '@career-bridge/types';

export const realTimeJobService = {
  async searchJobs(query: string = 'Software Developer in India', page: number = 1): Promise<Job[]> {
    const options = {
      method: 'GET',
      url: `https://${env.rapidApi.host}/search`,
      params: {
        query: query,
        page: page.toString(),
        num_pages: '1'
      },
      headers: {
        'x-rapidapi-key': env.rapidApi.key,
        'x-rapidapi-host': env.rapidApi.host
      }
    };

    try {
      const response = await axios.request(options);
      const data = response.data.data || [];
      
      return data.map((j: any) => ({
        id: j.job_id,
        title: j.job_title,
        company: j.employer_name,
        companyLogo: j.employer_logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(j.employer_name)}&background=random`,
        location: `${j.job_city || ''} ${j.job_country || ''}`.trim() || 'Remote',
        type: this.mapJobType(j.job_employment_type),
        salary: {
          min: j.job_min_salary || 0,
          max: j.job_max_salary || 0,
          currency: j.job_salary_currency || 'USD',
          period: j.job_salary_period || 'year'
        },
        description: j.job_description,
        requirements: [],
        skills: [],
        postedAt: j.job_posted_at_datetime_utc || new Date().toISOString(),
        applicants: 0,
        matchScore: Math.floor(Math.random() * 30) + 70, // Mock match score
        isRemote: j.job_is_remote || false,
        isFeatured: false,
        applyUrl: j.job_apply_link
      }));
    } catch (error) {
      console.error('RapidAPI JSearch Error:', error);
      return [];
    }
  },

  mapJobType(type: string): JobType {
    const t = type?.toLowerCase() || '';
    if (t.includes('full')) return JobType.FULL_TIME;
    if (t.includes('part')) return JobType.PART_TIME;
    if (t.includes('contract')) return JobType.CONTRACT;
    if (t.includes('intern')) return JobType.INTERNSHIP;
    return JobType.FULL_TIME;
  }
};
