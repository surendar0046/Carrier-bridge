import { Job } from '@career-bridge/types';

// ── Client-side real-time job service ─────────────────────────────────────────
// Calls /api/jobs (Next.js proxy) — keeps API key secure on the server.
export const realTimeJobService = {
  async searchJobs(
    query: string = 'Software Engineer',
    page: number = 1,
    limit: number = 20,
    /** Comma-separated title match keywords — used for server-side pre-filtering */
    titleFilter: string = '',
  ): Promise<Job[]> {
    try {
      const params = new URLSearchParams({
        q:     query,
        page:  String(page),
        limit: String(limit),
      });
      if (titleFilter) params.set('titleFilter', titleFilter);

      const res = await fetch(`/api/jobs?${params.toString()}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Search failed');

      return (data.jobs || []) as Job[];
    } catch (error: any) {
      console.error('[realTimeJobService] searchJobs failed:', error.message);
      return [];
    }
  },
};
