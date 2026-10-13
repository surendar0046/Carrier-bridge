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

  const roleParam     = (searchParams.get('role')        || '').toLowerCase().trim();

  // ── 1. Keyword / query filter ───────────────────────────────────────────────
  if (rawQuery) {
    const terms = rawQuery.replace(/[-_]/g, ' ').split(/\s+/).filter(Boolean);
    jobs = jobs.filter(j => {
      const hay = [j.title, j.company, j.location, ...(j.skills || []), j.description || '']
        .join(' ')
        .toLowerCase()
        .replace(/[-_]/g, ' ');
      return terms.every(t => hay.includes(t));
    });
  }

  // ── 2. Role filter or Title / category match filter ─────────────────────────
  if (roleParam) {
    // Break into base tokens and search across title and skills
    const roleTokens = roleParam.replace(/[-_]/g, ' ').split(/\s+/).filter(w => w.length > 2);
    jobs = jobs.filter(j => {
      const hay = [j.title, ...(j.skills || []), j.description || '']
        .join(' ')
        .toLowerCase()
        .replace(/[-_]/g, ' ');
      // If role contains fullstack/devops etc. check primary keywords
      if (roleParam.includes('full') || roleParam.includes('stack')) {
        return hay.includes('full stack') || hay.includes('fullstack') || hay.includes('mern') || hay.includes('react') || hay.includes('software');
      }
      if (roleParam.includes('devops') || roleParam.includes('cloud')) {
        return hay.includes('devops') || hay.includes('cloud') || hay.includes('sre') || hay.includes('docker') || hay.includes('kubernetes') || hay.includes('aws');
      }
      if (roleParam.includes('data')) {
        return hay.includes('data') || hay.includes('analytics') || hay.includes('sql') || hay.includes('machine learning');
      }
      if (roleParam.includes('ai') || roleParam.includes('ml')) {
        return hay.includes('ai') || hay.includes('ml') || hay.includes('machine learning') || hay.includes('deep learning') || hay.includes('nlp');
      }
      if (roleParam.includes('cyber') || roleParam.includes('security')) {
        return hay.includes('security') || hay.includes('cyber') || hay.includes('soc') || hay.includes('penetration');
      }
      return roleTokens.some(t => hay.includes(t));
    });
  } else if (titleFilter) {
    const kwds = titleFilter.split(',').map(k => k.trim().toLowerCase()).filter(Boolean);
    if (kwds.length > 0) {
      jobs = jobs.filter(j => {
        const hay = [j.title, ...(j.skills || []), j.description || ''].join(' ').toLowerCase();
        return kwds.some(k => hay.includes(k));
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
