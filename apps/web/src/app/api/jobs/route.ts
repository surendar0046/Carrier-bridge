import { NextRequest, NextResponse } from 'next/server';
import { INDIA_JOBS } from './jobsData';

// ── /api/jobs — India Job Board ───────────────────────────────────────────────
// Serves from a curated, real-world job dataset with direct apply links.
// All jobs are India-based with live Naukri/LinkedIn/company links.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawQuery      = (searchParams.get('q')           || '').toLowerCase().trim();
  const titleFilter   = (searchParams.get('titleFilter') || '').toLowerCase();
  const page          = parseInt(searchParams.get('page')  || '1', 10);
  const limit         = parseInt(searchParams.get('limit') || '24', 10);
  const typeFilter    = (searchParams.get('type')  || '').toUpperCase();
  const remoteFilter  = searchParams.get('remote') === 'true';

  const sourceFilter  = searchParams.get('source') || '';

  let jobs = [...INDIA_JOBS].filter(j => j.applyUrl && j.applyUrl.startsWith('http'));

  // ── 0. Source filter ────────────────────────────────────────────────────────
  if (sourceFilter) {
    jobs = jobs.filter(j => j.source === sourceFilter.toLowerCase());
  }

  // ── 1. Keyword / query filter ───────────────────────────────────────────────
  if (rawQuery) {
    const terms = rawQuery.split(/\s+/).filter(Boolean);
    jobs = jobs.filter(j => {
      const hay = [j.title, j.company, j.location, ...(j.skills || []), j.description || '']
        .join(' ')
        .toLowerCase();
      return terms.every(t => hay.includes(t));
    });
  }

  // ── 2. Title / role match filter (from category matchKeywords) ─────────────
  if (titleFilter) {
    const kwds = titleFilter.split(',').map(k => k.trim()).filter(Boolean);
    if (kwds.length > 0) {
      jobs = jobs.filter(j => {
        const title = j.title.toLowerCase();
        const desc  = (j.description || '').toLowerCase();
        return kwds.some(k => title.includes(k) || desc.includes(k));
      });
    }
  }

  // ── 3. Type filter ──────────────────────────────────────────────────────────
  if (typeFilter) {
    jobs = jobs.filter(j => j.type === typeFilter);
  }

  // ── 4. Remote filter ────────────────────────────────────────────────────────
  if (remoteFilter) {
    jobs = jobs.filter(j => j.isRemote);
  }

  // ── Paginate ────────────────────────────────────────────────────────────────
  const total  = jobs.length;
  const offset = (page - 1) * limit;
  const paged  = jobs.slice(offset, offset + limit);

  return NextResponse.json({
    success:    true,
    jobs:       paged,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    query:      rawQuery,
  });
}
