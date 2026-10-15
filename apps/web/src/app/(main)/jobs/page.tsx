'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import { Job } from '@career-bridge/types';
import { INDIA_JOBS } from '@/app/api/jobs/jobsData';
import { useStudentCareerMatch, getKeywordsForRole } from '@/hooks/useStudentCareerMatch';

// ── Category presets — query sent to API + title keywords for filtering ────────
const CATEGORIES = [
  // Software Engineering
  { label: '💻 Software Eng',    query: 'Software Engineer',              matchKeywords: ['software engineer', 'software developer', 'sde', 'swe'] },
  { label: '🖥️ Frontend',        query: 'Frontend Developer',             matchKeywords: ['frontend', 'front-end', 'react developer', 'angular', 'vue'] },
  { label: '📝 Backend',         query: 'Backend Developer',              matchKeywords: ['backend', 'back-end', 'node', 'java developer', 'python developer', 'spring'] },
  { label: '📦 Full Stack',      query: 'Full Stack Developer',           matchKeywords: ['full stack', 'fullstack', 'mern', 'mean'] },
  { label: '📱 Mobile',          query: 'Mobile App Developer',           matchKeywords: ['mobile', 'android', 'ios', 'flutter', 'react native', 'kotlin', 'swift'] },

  // Cloud & Infrastructure
  { label: '☁️ Cloud Eng',       query: 'Cloud Engineer',                 matchKeywords: ['cloud engineer', 'cloud architect', 'cloud infrastructure', 'cloud platform'] },
  { label: '☁️ AWS',             query: 'AWS Cloud Engineer',             matchKeywords: ['aws', 'amazon web services', 'aws cloud', 'aws engineer'] },
  { label: '☁️ Azure',           query: 'Azure Cloud Engineer',           matchKeywords: ['azure', 'microsoft azure', 'azure cloud'] },
  { label: '☁️ GCP',             query: 'GCP Google Cloud Engineer',      matchKeywords: ['gcp', 'google cloud', 'google cloud platform'] },
  { label: '🚀 DevOps',          query: 'DevOps Engineer',                matchKeywords: ['devops', 'devsecops', 'platform engineer', 'sre', 'site reliability'] },
  { label: '🐳 Kubernetes',      query: 'Kubernetes DevOps Engineer',     matchKeywords: ['kubernetes', 'k8s', 'helm', 'openshift'] },

  // Cybersecurity — specific roles
  { label: '🔐 Cloud Security',  query: 'Cloud Security Engineer',        matchKeywords: ['cloud security', 'cloud security engineer', 'cloud security analyst', 'cspm', 'devsecops'] },
  { label: '🛡️ SOC Analyst',     query: 'SOC Analyst Security Operations',matchKeywords: ['soc analyst', 'soc engineer', 'security operations', 'security analyst', 'tier 1', 'tier 2'] },
  { label: '🔴 Pen Tester',      query: 'Penetration Tester Ethical Hacker', matchKeywords: ['penetration', 'pen test', 'ethical hacker', 'vapt', 'red team', 'offensive security'] },
  { label: '🔵 Blue Team',       query: 'Blue Team Incident Response',    matchKeywords: ['blue team', 'incident response', 'threat hunting', 'dfir', 'digital forensics'] },
  { label: '🔒 AppSec',          query: 'Application Security Engineer',  matchKeywords: ['application security', 'appsec', 'secure code', 'sast', 'dast', 'owasp'] },
  { label: '📋 GRC',             query: 'GRC Compliance Analyst',         matchKeywords: ['grc', 'compliance', 'risk management', 'iso 27001', 'governance', 'audit'] },
  { label: '🪪 IAM',             query: 'Identity Access Management IAM', matchKeywords: ['iam', 'identity', 'access management', 'okta', 'sso', 'active directory', 'ldap'] },
  { label: '📡 SIEM',            query: 'SIEM Splunk Security Engineer',  matchKeywords: ['siem', 'splunk', 'qradar', 'log management', 'detection engineering'] },
  { label: '🔐 Cybersecurity',   query: 'Cybersecurity Analyst',          matchKeywords: ['cybersecurity', 'cyber security', 'information security', 'infosec', 'network security'] },

  // Data & AI
  { label: '📊 Data Engineer',   query: 'Data Engineer',                  matchKeywords: ['data engineer', 'etl', 'data pipeline', 'spark', 'kafka'] },
  { label: '🔬 Data Science',    query: 'Data Scientist',                 matchKeywords: ['data scientist', 'data science', 'machine learning scientist'] },
  { label: '📈 Data Analyst',    query: 'Data Analyst',                   matchKeywords: ['data analyst', 'business analyst', 'bi analyst', 'analytics'] },
  { label: '🤖 ML / AI Eng',     query: 'Machine Learning Engineer',      matchKeywords: ['machine learning', 'ml engineer', 'ai engineer', 'deep learning', 'nlp', 'llm'] },
  { label: '🧠 GenAI / LLM',     query: 'Generative AI LLM Engineer',    matchKeywords: ['generative ai', 'llm', 'gpt', 'langchain', 'rag', 'prompt engineer'] },
  { label: '👁️ Computer Vision', query: 'Computer Vision Engineer',       matchKeywords: ['computer vision', 'image processing', 'opencv', 'yolo', 'object detection'] },
  { label: '🏭 MLOps',           query: 'MLOps Engineer',                 matchKeywords: ['mlops', 'model deployment', 'kubeflow', 'mlflow', 'model serving'] },

  // Specialized
  { label: '🎨 UI / UX',         query: 'UI UX Designer',                matchKeywords: ['ui', 'ux', 'user experience', 'product design', 'figma', 'interaction design'] },
  { label: '🔭 Product Mgr',     query: 'Product Manager',               matchKeywords: ['product manager', 'product management', 'product owner', 'program manager'] },
  { label: '🧪 QA / SDET',       query: 'QA Automation Engineer',        matchKeywords: ['qa', 'quality assurance', 'test engineer', 'sdet', 'automation testing', 'selenium'] },
  { label: '⛓️ Blockchain',      query: 'Blockchain Web3 Developer',     matchKeywords: ['blockchain', 'web3', 'solidity', 'smart contract', 'ethereum', 'nft', 'defi'] },
];

// ── India cities ──────────────────────────────────────────────────────────────
const CITIES = [
  '🇮🇳 All India', 'Bangalore', 'Mumbai', 'Delhi', 'Hyderabad',
  'Chennai', 'Pune', 'Noida', 'Gurugram', 'Kolkata', 'Ahmedabad',
  'Kochi', 'Jaipur', 'Indore', 'Remote',
];

// ── Job type badge colours ────────────────────────────────────────────────────
const TYPE_COLORS: Record<string, string> = {
  FULL_TIME:   'bg-blue-500/10 text-blue-400 border-blue-500/20',
  PART_TIME:   'bg-orange-500/10 text-orange-400 border-orange-500/20',
  CONTRACT:    'bg-violet-500/10 text-violet-400 border-violet-500/20',
  INTERNSHIP:  'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
};

// ── Source badge map ──────────────────────────────────────────────────────────
const SOURCE_BADGE: Record<string, { label: string; cls: string }> = {
  naukri:      { label: 'Naukri',      cls: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  linkedin:    { label: 'LinkedIn',    cls: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  company:     { label: 'Company',     cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  internshala: { label: 'Internshala', cls: 'bg-violet-500/10 text-violet-400 border-violet-500/20' },
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return '1 day ago';
  if (days < 7)  return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return `${Math.floor(days / 30)} months ago`;
}

function formatSalary(salary: any): string {
  if (!salary || (!salary.min && !salary.max)) return 'Competitive';
  const toL = (n: number) => n >= 100000
    ? `₹${(n / 100000).toFixed(1)}L`
    : `₹${(n / 1000).toFixed(0)}k`;
  if (salary.currency === 'INR') {
    const period = salary.period === 'monthly' ? '/mo' : '/yr';
    return salary.min && salary.max
      ? `${toL(salary.min)} – ${toL(salary.max)}${period}`
      : `${toL(salary.min || salary.max || 0)}${period}`;
  }
  return 'Competitive';
}

// ── Module-level jobs cache (persists across navigations, cleared on explicit search) ──
type JobsCache = { jobs: any[]; total: number; role: string | null; ts: number };
let _jobsCache: JobsCache | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function getCachedJobs(role: string | null): JobsCache | null {
  if (!_jobsCache) return null;
  if (Date.now() - _jobsCache.ts > CACHE_TTL_MS) { _jobsCache = null; return null; }
  if (_jobsCache.role !== role) return null;
  return _jobsCache;
}

// ─────────────────────────────────────────────────────────────────────────────
export default function JobsPage() {
  const {
    hasCompletedQuiz,
    primaryRole,
    primaryConfidence,
    closeRoles,
    activeRole,
    setActiveRole,
    resetFilter,
  } = useStudentCareerMatch();

  // Seed state from cache if available (instant re-visit)
  const cached = getCachedJobs(null);

  const [keyword,        setKeyword]        = useState('');
  const [city,           setCity]           = useState('🇮🇳 All India');
  const [activeCategory, setActiveCategory] = useState<typeof CATEGORIES[0] | null>(null);
  const [page,           setPage]           = useState(1);
  const [allJobs,        setAllJobs]        = useState<any[]>(() => cached?.jobs || INDIA_JOBS.slice(0, 24));
  const [totalCount,     setTotalCount]     = useState(() => cached?.total || INDIA_JOBS.length);
  const [typeFilter,     setTypeFilter]     = useState('');
  const [sourceFilter,   setSourceFilter]   = useState('');
  const [remoteOnly,     setRemoteOnly]     = useState(false);
  const [isLoading,      setIsLoading]      = useState(false);
  const [error,          setError]          = useState<string | null>(null);
  const [searched,       setSearched]       = useState(() => Boolean(cached));
  const [hasMore,        setHasMore]        = useState(true);
  // Prevent double-fetch on strict-mode double-mount
  const hasFetchedRef = useRef(false);

  // ── Fetch from /api/jobs ──────────────────────────────────────────────────
  const fetchJobs = useCallback(async (opts: {
    q?:           string;
    titleFilter?: string;
    role?:        string;
    page?:        number;
    append?:      boolean;
    source?:      string;
    type?:        string;
  } = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (opts.q)           params.set('q', opts.q);
      if (opts.titleFilter) params.set('titleFilter', opts.titleFilter);
      if (opts.role)        params.set('role', opts.role);
      
      const activeSource = opts.source !== undefined ? opts.source : sourceFilter;
      if (activeSource) params.set('source', activeSource);
      
      const activeType = opts.type !== undefined ? opts.type : typeFilter;
      if (activeType) params.set('type', activeType);

      params.set('page',  String(opts.page  || 1));
      params.set('limit', '24');

      const res  = await fetch(`/api/jobs?${params}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to load jobs');

      const jobs: any[] = data.jobs || [];
      if (opts.append) {
        setAllJobs(prev => {
          const ids   = new Set(prev.map((j: any) => j.id));
          const fresh = jobs.filter(j => !ids.has(j.id));
          setHasMore(fresh.length > 0);
          return [...prev, ...fresh];
        });
      } else {
        setAllJobs(jobs);
        setHasMore(jobs.length === 24);
        // Write to module-level cache for instant re-visit
        _jobsCache = { jobs, total: data.total || jobs.length, role: opts.role || null, ts: Date.now() };
      }
      setTotalCount(data.total || jobs.length);
    } catch (err: any) {
      setError(err.message || 'Could not load jobs');
    } finally {
      setIsLoading(false);
      setSearched(true);
    }
  }, [sourceFilter, typeFilter]);

  // ── Build query string ────────────────────────────────────────────────────
  const buildQuery = useCallback((kw: string, ct: string) => {
    const parts: string[] = [];
    if (kw.trim()) parts.push(kw.trim());
    if (ct && ct !== '🇮🇳 All India') parts.push(ct);
    return parts.join(' ');
  }, []);

  // ── doSearch ──────────────────────────────────────────────────────────────
  const doSearch = useCallback((
    resetPage = true, 
    cat?: typeof CATEGORIES[0] | null,
    customRole?: string | null,
    customType?: string,
    customKeyword?: string
  ) => {
    const activeCat = cat !== undefined ? cat : activeCategory;
    const kw = customKeyword !== undefined ? customKeyword : keyword;
    const effectiveRole = customRole !== undefined ? customRole : (!kw && !activeCat ? activeRole : null);
    const currentType = customType !== undefined ? customType : typeFilter;
    const pg = resetPage ? 1 : page;
    if (resetPage) { setAllJobs([]); setPage(1); setHasMore(true); }

    fetchJobs({
      q:           activeCat ? activeCat.query : (kw ? buildQuery(kw, city) : (effectiveRole || '')),
      titleFilter: activeCat?.matchKeywords?.join(',') || (effectiveRole ? getKeywordsForRole(effectiveRole).join(',') : ''),
      role:        effectiveRole || '',
      page:        pg,
      append:      !resetPage,
      source:      sourceFilter,
      type:        currentType,
    });
  }, [keyword, city, activeCategory, page, fetchJobs, buildQuery, sourceFilter, typeFilter, activeRole]);

  // Reactive load on activeRole change or initial mount
  useEffect(() => {
    // Skip re-fetching if we already have cached data and role hasn't changed
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    if (activeRole) {
      doSearch(true, null, activeRole, typeFilter, '');
    } else if (!cached) {
      doSearch(true, null, null, typeFilter, keyword);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeRole]);

  // Re-search when activeRole changes after initial load (user clicks role pill)
  const prevActiveRoleRef = useRef<string | null>(undefined as any);
  useEffect(() => {
    if (prevActiveRoleRef.current === undefined) {
      prevActiveRoleRef.current = activeRole;
      return;
    }
    if (prevActiveRoleRef.current === activeRole) return;
    prevActiveRoleRef.current = activeRole;
    hasFetchedRef.current = true; // keep guard on
    doSearch(true, null, activeRole, typeFilter, '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeRole]);

  // Category change
  const handleCategory = (cat: typeof CATEGORIES[0]) => {
    setActiveCategory(cat);
    setKeyword('');
    setTypeFilter('');
    setSourceFilter('');
    setRemoteOnly(false);
    doSearch(true, cat, null, '', '');
  };

  // Source change
  const handleSourceChange = (src: string) => {
    setSourceFilter(src);
    setAllJobs([]);
    setPage(1);
    setHasMore(true);
    fetchJobs({
      q:           activeCategory ? activeCategory.query : (keyword ? buildQuery(keyword, city) : (activeRole || '')),
      titleFilter: activeCategory?.matchKeywords?.join(',') || (activeRole ? getKeywordsForRole(activeRole).join(',') : ''),
      role:        activeCategory || keyword ? '' : (activeRole || ''),
      page:        1,
      append:      false,
      source:      src,
      type:        typeFilter,
    });
  };

  // Type change
  const handleTypeChange = (t: string) => {
    setTypeFilter(t);
    setAllJobs([]);
    setPage(1);
    setHasMore(true);
    fetchJobs({
      q:           activeCategory ? activeCategory.query : (keyword ? buildQuery(keyword, city) : (activeRole || '')),
      titleFilter: activeCategory?.matchKeywords?.join(',') || (activeRole ? getKeywordsForRole(activeRole).join(',') : ''),
      role:        activeCategory || keyword ? '' : (activeRole || ''),
      page:        1,
      append:      false,
      source:      sourceFilter,
      type:        t,
    });
  };

  // Load more
  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    doSearch(false);
  };

  // Front-end only filters
  let displayed = [...allJobs];
  if (remoteOnly) displayed = displayed.filter(j => j.isRemote);

  const activeCategoryLabel = activeCategory?.label || '';

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* ── Hero Header ──────────────────────────────────────────────────── */}
      <div className="relative bg-gradient-to-b from-slate-900 to-slate-950 border-b border-white/5 px-6 pt-12 pb-8">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              Live Jobs · India
            </span>
            <span className="text-[10px] text-slate-500 font-medium">Powered by Naukri · LinkedIn · Company Careers</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-3 leading-tight">
            Find Jobs in <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">India</span> 🇮🇳
          </h1>
          <p className="text-slate-400 text-lg font-medium mb-8 max-w-2xl">
            Curated job listings from Google, Amazon, Microsoft, Flipkart, Razorpay, Zomato and 50+ top Indian companies.
          </p>

          {/* Search bar */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-4xl">
            <div className="flex-1 relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg">🔍</span>
              <input
                type="text"
                value={keyword}
                onChange={e => { setKeyword(e.target.value); setActiveCategory(null); }}
                onKeyDown={e => e.key === 'Enter' && doSearch(true, null)}
                placeholder="Job title, skills (e.g. React Developer, SOC Analyst, ML Engineer)..."
                className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-blue-500/50 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all text-sm"
              />
            </div>
            <select
              value={city}
              onChange={e => { setCity(e.target.value); setActiveCategory(null); }}
              className="bg-white/5 border border-white/10 hover:border-white/20 text-slate-300 rounded-2xl px-4 py-4 text-sm focus:outline-none focus:border-blue-500/50 min-w-[160px] cursor-pointer"
            >
              {CITIES.map(c => <option key={c} value={c} className="bg-slate-900">{c}</option>)}
            </select>
            <button
              onClick={() => doSearch(true, null)}
              disabled={isLoading}
              className="px-10 py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20 active:scale-95 whitespace-nowrap"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Searching...
                </span>
              ) : 'Search Jobs'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* ── AI Tailored Recommendations Banner ──────────── */}
        {(primaryRole || activeRole) && (
          <div className="mb-8 p-5 md:p-6 rounded-3xl bg-gradient-to-r from-blue-900/30 via-indigo-900/20 to-purple-900/30 border border-blue-500/30 shadow-2xl shadow-blue-950/50 backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-300 text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                    AI Career Match
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">
                    Targeted Opportunities
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2 flex-wrap">
                  <span>Opportunities for</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-violet-400 font-extrabold underline decoration-blue-500/40 underline-offset-4">
                    {activeRole || primaryRole}
                  </span>
                  {activeRole === primaryRole && primaryConfidence ? (
                    <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold">
                      {primaryConfidence}% Match
                    </span>
                  ) : null}
                </h2>
                <p className="text-xs text-slate-300">
                  Showing job offers & internships matching {activeRole || primaryRole}. Tap an alternative role or search any role to explore more.
                </p>
              </div>

              {/* Quick Offer Type Tabs inside banner */}
              <div className="flex items-center gap-1 bg-slate-950/70 p-1.5 rounded-2xl border border-white/10 self-start md:self-auto">
                <button
                  onClick={() => handleTypeChange('')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    typeFilter === ''
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All Offers ({totalCount})
                </button>
                <button
                  onClick={() => handleTypeChange('FULL_TIME')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    typeFilter === 'FULL_TIME'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>💼 Jobs</span>
                </button>
                <button
                  onClick={() => handleTypeChange('INTERNSHIP')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    typeFilter === 'INTERNSHIP'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30'
                      : 'text-emerald-400 hover:text-emerald-300'
                  }`}
                >
                  <span>🎓 Interns</span>
                </button>
              </div>
            </div>

            {/* Role switchers pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mr-1">
                Your Matches:
              </span>

              {/* Top 1 Fit Role */}
              {primaryRole && (
                <button
                  onClick={() => {
                    setActiveCategory(null);
                    setKeyword('');
                    setActiveRole(primaryRole);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                    activeRole === primaryRole
                      ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-600/30'
                      : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white'
                  }`}
                >
                  <span>🌟 {primaryRole}</span>
                  <span className="text-[10px] opacity-80">({primaryConfidence}%)</span>
                </button>
              )}

              {/* Top 2 Close Matches */}
              {closeRoles.map((cr, idx) => (
                <button
                  key={cr.role}
                  onClick={() => {
                    setActiveCategory(null);
                    setKeyword('');
                    setActiveRole(cr.role);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                    activeRole === cr.role
                      ? 'bg-violet-600 border-violet-400 text-white shadow-lg shadow-violet-600/30'
                      : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:border-violet-500/50 hover:text-violet-200'
                  }`}
                >
                  <span>⇄ #{idx + 2} {cr.role}</span>
                  <span className="text-[10px] opacity-80">({cr.confidence}%)</span>
                </button>
              ))}

              {/* Reset to see all roles */}
              <button
                onClick={() => {
                  resetFilter();
                  setActiveCategory(null);
                  setKeyword('');
                  doSearch(true, null, null, typeFilter, '');
                }}
                className={`ml-auto px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  !activeRole
                    ? 'bg-white/10 border-white/30 text-white'
                    : 'bg-transparent border-slate-700 text-slate-400 hover:text-white hover:border-slate-500'
                }`}
              >
                🌐 View All Jobs
              </button>
            </div>
          </div>
        )}

        {/* ── Category Chips ──────────────────────────────────────────────── */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
          {/* All Roles chip */}
          <button
            onClick={() => { setActiveCategory(null); setKeyword(''); doSearch(true, null); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition-all flex-shrink-0 ${
              !activeCategory
                ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-200'
            }`}
          >
            🌐 All Roles
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat.query}
              onClick={() => handleCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition-all flex-shrink-0 ${
                activeCategory?.query === cat.query
                  ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* ── Active filter banner ─────────────────────────────────────────── */}
        {activeCategory && (
          <div className="flex items-center gap-3 mb-5 p-3 bg-blue-500/5 border border-blue-500/20 rounded-xl">
            <span className="text-blue-400 text-sm font-black">{activeCategoryLabel}</span>
            <span className="text-slate-500 text-xs">— filtered by: <span className="text-slate-300 font-semibold">{activeCategory.matchKeywords.slice(0, 3).join(', ')}</span></span>
            <button
              onClick={() => { setActiveCategory(null); doSearch(true, null); }}
              className="ml-auto text-slate-600 hover:text-slate-300 text-xs font-bold transition"
            >
              ✕ Clear
            </button>
          </div>
        )}

        {/* ── Branded Platform & Type Filter Bar ────────────────────────────── */}
        <div className="bg-slate-900/60 border border-white/5 rounded-3xl p-5 mb-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Left: Platform Selection */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Select Platform / Source</span>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: '', label: '🌐 All Sources', activeCls: 'bg-white/10 text-white border-white/20' },
                  { id: 'linkedin', label: '🔵 LinkedIn', activeCls: 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20' },
                  { id: 'naukri', label: '🟠 Naukri', activeCls: 'bg-orange-600 border-orange-500 text-white shadow-lg shadow-orange-500/20' },
                  { id: 'internshala', label: '🟣 Internshala', activeCls: 'bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-500/20' },
                  { id: 'company', label: '🟢 Company Careers', activeCls: 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' },
                ].map(p => (
                  <button
                    key={p.id}
                    onClick={() => handleSourceChange(p.id)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                      sourceFilter === p.id
                        ? p.activeCls
                        : 'bg-slate-950/40 border-white/5 text-slate-400 hover:border-white/20 hover:text-slate-200'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Job Type (Jobs vs Internships) */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Offer Type</span>
              <div className="flex gap-2 bg-slate-950/60 p-1.5 rounded-2xl border border-white/5">
                {[
                  { id: '', label: 'All Offers' },
                  { id: 'FULL_TIME', label: '💼 Jobs' },
                  { id: 'INTERNSHIP', label: '🎓 Internships' },
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => handleTypeChange(t.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                      typeFilter === t.id
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/5">
            {/* Stats */}
            <span className="text-xs text-slate-400 font-medium">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-3 h-3 text-blue-500" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Syncing live offers...
                </span>
              ) : (
                <>
                  Found <span className="text-white font-bold">{totalCount}</span> live listings
                  {sourceFilter && <span> on <span className="text-blue-400 font-bold capitalize">{sourceFilter}</span></span>}
                  {typeFilter && <span> of type <span className="text-emerald-400 font-bold">{typeFilter === 'FULL_TIME' ? 'Jobs' : 'Internships'}</span></span>}
                </>
              )}
            </span>

            {/* Remote Switch */}
            <div className="flex items-center gap-3 bg-slate-950/30 px-4 py-2 rounded-2xl border border-white/5">
              <label htmlFor="remote-toggle" className="text-xs font-semibold text-slate-400 cursor-pointer">🌐 Remote Only</label>
              <button
                id="remote-toggle"
                onClick={() => setRemoteOnly(p => !p)}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 outline-none focus:ring-1 focus:ring-blue-500/30 ${remoteOnly ? 'bg-blue-600' : 'bg-slate-800'}`}
              >
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-200 ease-in-out ${remoteOnly ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Error ────────────────────────────────────────────────────────── */}
        {error && (
          <div className="mb-8 p-5 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-4 text-red-400">
            <span className="text-2xl">⚠️</span>
            <div className="flex-1">
              <p className="font-bold text-sm">Failed to load jobs</p>
              <p className="text-xs text-red-400/70 mt-0.5">{error}</p>
            </div>
            <button onClick={() => doSearch(true)} className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-xs font-bold hover:bg-red-500/20 transition">
              Retry
            </button>
          </div>
        )}

        {/* ── Job Cards ────────────────────────────────────────────────────── */}
        <div className="space-y-4">
          {isLoading && allJobs.length === 0 ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white/3 border border-white/5 rounded-2xl p-6 animate-pulse">
                <div className="flex gap-5">
                  <div className="w-14 h-14 bg-slate-800/50 rounded-2xl flex-shrink-0" />
                  <div className="flex-1 space-y-3">
                    <div className="h-5 bg-slate-800/50 rounded-lg w-2/5" />
                    <div className="h-3.5 bg-slate-800/50 rounded w-1/4" />
                    <div className="h-3 bg-slate-800/50 rounded w-3/5" />
                    <div className="flex gap-2 mt-3">
                      {[1,2,3].map(j => <div key={j} className="h-6 w-20 bg-slate-800/50 rounded-lg" />)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : displayed.length > 0 ? (
            displayed.map(job => <JobCard key={job.id} job={job} />)
          ) : searched && !isLoading ? (
            <div className="text-center py-24 bg-white/2 border border-dashed border-white/10 rounded-2xl">
              <div className="text-6xl mb-6 opacity-40">🕵️‍♂️</div>
              <h3 className="text-xl font-black text-white mb-2">No Jobs Found</h3>
              <p className="text-slate-500 font-medium max-w-md mx-auto mb-6">
                Try a different search term or select a different category above.
              </p>
              <button
                onClick={() => { setKeyword(''); setActiveCategory(null); setCity('🇮🇳 All India'); doSearch(true, null); }}
                className="text-blue-400 hover:text-blue-300 font-black text-xs uppercase tracking-widest transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : null}
        </div>

        {/* ── Load More ────────────────────────────────────────────────────── */}
        {!isLoading && displayed.length > 0 && hasMore && (
          <div className="mt-10 text-center">
            <button
              onClick={loadMore}
              className="px-10 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-2xl font-black text-sm transition-all text-white"
            >
              Load More Jobs →
            </button>
            <p className="text-xs text-slate-600 mt-3">
              Showing {displayed.length} of {totalCount} India jobs · Naukri · LinkedIn · Company Careers
            </p>
          </div>
        )}
        {isLoading && allJobs.length > 0 && (
          <div className="mt-8 flex items-center justify-center gap-2 text-slate-500 text-sm">
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            Loading more jobs...
          </div>
        )}
      </div>
    </div>
  );
}

// ── Job Card ──────────────────────────────────────────────────────────────────
function JobCard({ job }: { job: any }) {
  const salary  = formatSalary(job.salary);
  const typeCls = TYPE_COLORS[job.type] || 'bg-slate-700 text-slate-300 border-slate-600';
  const src     = SOURCE_BADGE[job.source] || SOURCE_BADGE.company;

  return (
    <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/5 transition-all group relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-blue-500/10 transition-all duration-700 pointer-events-none" />
      {/* Featured */}
      {job.isFeatured && (
        <div className="absolute top-4 right-4 z-20">
          <span className="text-[9px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-1 rounded-lg">
            ⭐ Featured
          </span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start gap-5 relative z-10">
        {/* Logo */}
        <div className="flex-shrink-0">
          <img
            src={job.companyLogo || ''}
            alt={job.company}
            className="w-14 h-14 rounded-2xl bg-white shadow-xl object-contain p-1.5"
            onError={e => {
              (e.target as HTMLImageElement).src =
                `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company || 'Co')}&background=1e293b&color=94a3b8&bold=true&size=56`;
            }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 w-full">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3 mb-3">
            <div>
              <h2 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors leading-tight mb-1">
                {job.title}
              </h2>
              <p className="text-slate-400 font-semibold text-sm">
                {job.company}
                {job.location && <span className="text-slate-600 mx-1.5">·</span>}
                <span className="text-slate-500 font-medium">📍 {job.location}</span>
              </p>
            </div>
            <div className="flex-shrink-0 text-right">
              <div className="text-emerald-400 font-black text-base">{salary}</div>
              <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                {timeAgo(job.postedAt || new Date().toISOString())}
              </div>
            </div>
          </div>

          {/* Description */}
          {job.description && (
            <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed mb-4 font-medium">
              {job.description}
            </p>
          )}

          {/* Skills & Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            {(job.skills || []).slice(0, 5).map((skill: string) => (
              <span key={skill} className="text-[10px] font-bold bg-white/5 text-slate-400 px-2.5 py-1.5 rounded-xl border border-white/5">
                {skill}
              </span>
            ))}
            {job.type && (
              <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-xl border ${typeCls}`}>
                {String(job.type).replace('_', ' ')}
              </span>
            )}
            {job.isRemote && (
              <span className="text-[10px] font-black uppercase tracking-widest bg-indigo-500/10 text-indigo-400 px-2.5 py-1.5 rounded-xl border border-indigo-500/20">
                🌐 Remote
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-white/5 gap-3 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${src.cls}`}>
                {src.label}
              </span>
              {(job.benefits || []).slice(0, 2).map((b: string) => (
                <span key={b} className="text-[9px] font-bold text-slate-600 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800">
                  {b}
                </span>
              ))}
            </div>
            <a
              href={job.applyUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95 uppercase tracking-wide"
            >
              Apply on {src.label} ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
