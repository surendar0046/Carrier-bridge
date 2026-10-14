'use client';
import { useState } from 'react';
import { useResumeStore, ResumeFormData, ResumeTemplateId } from './useResumeStore';
import RoleCombobox from './RoleCombobox';
import { useUserStore } from '@career-bridge/store';
import AnalysisPanel, { AnalysisResult } from './AnalysisPanel';
import PreviewModal from './PreviewModal';
import { TEMPLATES } from './templates';

const AI_URL = '/api/resume/analyze';

const inp = 'w-full bg-white border border-slate-300 hover:border-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-all';
const label = 'block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider';

function Section({ title, icon, badge, children }: { title: string; icon: string; badge?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
          <span>{icon}</span>{title}
        </h2>
        {badge && (
          <span className="text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-200 px-2.5 py-0.5 rounded-full">
            {badge}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

function buildPayload(f: ResumeFormData) {
  return {
    personalInfo: f.personalInfo,
    summary: f.summary,
    experience: f.experience.map(e => ({
      company: e.company, role: e.role, startDate: e.startDate,
      endDate: e.endDate, achievements: e.achievements.filter(Boolean),
    })),
    education: f.education.map(e => ({
      institution: e.institution, degree: e.degree, field: e.field, year: e.year, gpa: e.gpa,
    })),
    skills: f.skills.split(',').map(s => s.trim()).filter(Boolean),
    projects: f.projects.map(p => ({
      name: p.name, description: p.description,
      tech: p.tech.split(',').map(s => s.trim()).filter(Boolean), link: p.link,
    })),
    certifications: f.certifications.map(c => ({ name: c.name, issuer: c.issuer, year: c.year })),
    targetRole: f.targetRole,
  };
}

export default function ResumeBuilderPage() {
  const r = useResumeStore();
  const { profile } = useUserStore();
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(false);

  const importFromProfile = () => {
    if (!profile) return;
    r.setForm(prev => ({
      ...prev,
      personalInfo: {
        fullName: profile.name || prev.personalInfo.fullName,
        email: profile.email || prev.personalInfo.email,
        phone: profile.phone || prev.personalInfo.phone,
        location: profile.location || prev.personalInfo.location,
        linkedin: profile.linkedinUrl || prev.personalInfo.linkedin,
        portfolio: profile.githubUrl || prev.personalInfo.portfolio,
      },
      skills: profile.skills?.join(', ') || prev.skills,
      experience: profile.experience?.map((exp: any) => ({
        id: Math.random().toString(),
        company: exp.company,
        role: exp.role || exp.title || '',
        startDate: exp.startDate || '',
        endDate: exp.endDate || '',
        achievements: [exp.description || ''],
      })) || prev.experience,
      education: profile.education?.map((edu: any) => ({
        id: Math.random().toString(),
        institution: edu.institution || edu.school || '',
        degree: edu.degree,
        field: edu.field,
        year: edu.endYear ? edu.endYear.toString() : (edu.startYear ? edu.startYear.toString() : ''),
        gpa: edu.grade || '',
      })) || prev.education,
      certifications: profile.certifications?.map((c: any) => ({
        id: Math.random().toString(),
        name: c.name,
        issuer: c.issuer,
        year: c.issueDate ? (c.issueDate.includes('-') ? c.issueDate.split('-')[0] : c.issueDate.toString()) : '',
      })) || prev.certifications,
    }));
  };

  const analyze = async () => {
    setLoading(true); setError('');
    try {
      const res = await fetch(AI_URL, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload(r.form)),
      });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.message || 'Analysis failed');
      setAnalysis(json.data);
    } catch (e: any) {
      setError(e.message || 'Could not reach AI service. Is it running on port 5000?');
    } finally { setLoading(false); }
  };

  const { form: f } = r;
  const currentTemplate = f.template || 'canva-minimalist';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {preview && (
        <PreviewModal
          data={f}
          onClose={() => setPreview(false)}
          onTemplateChange={(t) => r.setTemplate(t)}
        />
      )}

      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => window.history.back()} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-900 transition-colors">
             ←
          </button>
          <div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-blue-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
              ResumeAI Builder
            </h1>
            <p className="text-slate-400 text-xs mt-0.5">Build → Preview → Analyze with AI</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={importFromProfile} className="hidden md:flex px-5 py-2 border border-slate-300 hover:border-blue-500 text-slate-600 hover:text-blue-600 text-sm font-bold rounded-xl transition-colors items-center gap-2">
            📥 Import Profile
          </button>
          <button onClick={() => setPreview(true)} className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl transition-all shadow-md flex items-center gap-2 active:scale-95">
            👁 Preview Template ({TEMPLATES.find(t => t.id === currentTemplate)?.name.split(' ')[0]})
          </button>
          <button onClick={analyze} disabled={loading}
            className="px-5 py-2 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 disabled:opacity-50 text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20">
            {loading ? '⏳ Analyzing…' : '✨ Analyze with AI'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mx-6 mt-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
          ⚠ {error}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-0 min-h-[calc(100vh-73px)]">
        {/* ── LEFT: Builder Form ── */}
        <div className="p-6 space-y-6 overflow-y-auto border-r border-slate-200">

          {/* ── Choose Resume Template Section ── */}
          <Section title="Resume Template Style" icon="🎨" badge="4 Layouts Available">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {TEMPLATES.map(t => {
                const isSelected = currentTemplate === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => r.setTemplate(t.id)}
                    className={`relative p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20 shadow-md'
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xl">{t.icon}</span>
                        {t.badge && (
                          <span
                            className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
                              t.id === 'canva-minimalist'
                                ? 'bg-black text-white'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {t.badge}
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-xs text-slate-900 leading-tight mb-0.5">
                        {t.name}
                      </h4>
                      <p className="text-[10px] text-slate-500 line-clamp-2">
                        {t.subtitle}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className={`text-[10px] font-bold ${isSelected ? 'text-blue-600' : 'text-slate-400'}`}>
                        {isSelected ? '✓ Selected' : 'Select'}
                      </span>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-blue-600" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span>
                Active layout: <strong className="text-slate-800">{TEMPLATES.find(t => t.id === currentTemplate)?.name}</strong>
              </span>
              <button
                type="button"
                onClick={() => setPreview(true)}
                className="text-blue-600 hover:underline font-bold text-xs flex items-center gap-1"
              >
                👁 Live Preview Template →
              </button>
            </div>
          </Section>

          {/* Target Role */}
          <Section title="Target Role" icon="🎯">
            <RoleCombobox
              value={f.targetRole}
              onChange={(role) => r.setForm(prev => ({ ...prev, targetRole: role }))}
              variant="light"
              placeholder="Search role or type your own (e.g. UX Designer, Software Engineer)..."
            />
            {f.targetRole && (
              <p className="mt-2 text-xs text-slate-500">
                Selected: <span className="font-semibold text-blue-600">{f.targetRole}</span>
              </p>
            )}
          </Section>

          {/* Personal Info */}
          <Section title="Personal Information" icon="👤">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                ['fullName', 'Full Name', 'Daniel Gallego'],
                ['email', 'Email', 'hello@reallygreatsite.com'],
                ['phone', 'Phone', '+123-456-7890'],
                ['location', 'Location', '123 Anywhere St., Any City'],
                ['linkedin', 'LinkedIn URL', 'linkedin.com/in/daniel'],
                ['portfolio', 'Portfolio / GitHub', 'reallygreatsite.com'],
              ].map(([key, lbl, ph]) => (
                <div key={key}>
                  <label className={label}>{lbl}</label>
                  <input className={inp} placeholder={ph}
                    value={(f.personalInfo as any)[key]}
                    onChange={e => r.setPersonal(key, e.target.value)} />
                </div>
              ))}
            </div>
          </Section>

          {/* Summary */}
          <Section title="Professional Summary" icon="💬">
            <textarea rows={4} className={inp + ' resize-none'} placeholder="Write 2–3 sentences about your expertise, key skills, and career goals…"
              value={f.summary} onChange={e => r.setForm(prev => ({ ...prev, summary: e.target.value }))} />
          </Section>

          {/* Experience */}
          <Section title="Work Experience" icon="💼">
            <div className="space-y-6">
              {f.experience.map((exp, ei) => (
                <div key={exp.id} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-slate-400">POSITION {ei + 1}</span>
                    {f.experience.length > 1 && (
                      <button onClick={() => r.removeExp(exp.id)} className="text-xs text-red-400 hover:text-red-300">✕ Remove</button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div><label className={label}>Job Title</label><input className={inp} placeholder="Software Engineer" value={exp.role} onChange={e => r.setExp(exp.id, 'role', e.target.value)} /></div>
                    <div><label className={label}>Company</label><input className={inp} placeholder="Acme Corp" value={exp.company} onChange={e => r.setExp(exp.id, 'company', e.target.value)} /></div>
                    <div><label className={label}>Start Date</label><input className={inp} placeholder="Jan 2022" value={exp.startDate} onChange={e => r.setExp(exp.id, 'startDate', e.target.value)} /></div>
                    <div><label className={label}>End Date</label><input className={inp} placeholder="Present" value={exp.endDate} onChange={e => r.setExp(exp.id, 'endDate', e.target.value)} /></div>
                  </div>
                  <label className={label}>Achievements / Bullets</label>
                  <div className="space-y-2">
                    {exp.achievements.map((a, ai) => (
                      <div key={ai} className="flex gap-2">
                        <span className="text-slate-500 mt-2.5 text-sm">•</span>
                        <input className={inp + ' flex-1'} placeholder="Reduced API latency by 40% using Redis caching"
                          value={a} onChange={e => r.setAchievement(exp.id, ai, e.target.value)} />
                        {exp.achievements.length > 1 && (
                          <button onClick={() => r.removeAchievement(exp.id, ai)} className="text-slate-400 hover:text-red-500 text-sm">✕</button>
                        )}
                      </div>
                    ))}
                    <button onClick={() => r.addAchievement(exp.id)} className="text-xs text-blue-400 hover:text-blue-300 mt-1">+ Add bullet</button>
                  </div>
                </div>
              ))}
              <button onClick={r.addExp} className="w-full py-2.5 border border-dashed border-slate-300 hover:border-blue-500 rounded-xl text-sm text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                + Add Experience
              </button>
            </div>
          </Section>

          {/* Education */}
          <Section title="Education" icon="🎓">
            <div className="space-y-4">
              {f.education.map((edu, ei) => (
                <div key={edu.id} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <div className="flex justify-between mb-3">
                    <span className="text-xs font-bold text-slate-400">EDUCATION {ei + 1}</span>
                    {f.education.length > 1 && <button onClick={() => r.removeEdu(edu.id)} className="text-xs text-red-500 hover:text-red-600">✕ Remove</button>}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2"><label className={label}>Institution</label><input className={inp} placeholder="MIT" value={edu.institution} onChange={e => r.setEdu(edu.id, 'institution', e.target.value)} /></div>
                    <div><label className={label}>Degree</label><input className={inp} placeholder="B.Sc." value={edu.degree} onChange={e => r.setEdu(edu.id, 'degree', e.target.value)} /></div>
                    <div><label className={label}>Field of Study</label><input className={inp} placeholder="Computer Science" value={edu.field} onChange={e => r.setEdu(edu.id, 'field', e.target.value)} /></div>
                    <div><label className={label}>Year</label><input className={inp} placeholder="2022" value={edu.year} onChange={e => r.setEdu(edu.id, 'year', e.target.value)} /></div>
                    <div><label className={label}>GPA (optional)</label><input className={inp} placeholder="3.8/4.0" value={edu.gpa} onChange={e => r.setEdu(edu.id, 'gpa', e.target.value)} /></div>
                  </div>
                </div>
              ))}
              <button onClick={r.addEdu} className="w-full py-2.5 border border-dashed border-slate-300 hover:border-blue-500 rounded-xl text-sm text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                + Add Education
              </button>
            </div>
          </Section>

          {/* Skills */}
          <Section title="Skills" icon="⚡">
            <label className={label}>Comma-separated list</label>
            <textarea rows={3} className={inp + ' resize-none'} placeholder="React, TypeScript, Node.js, PostgreSQL, Docker, AWS…"
              value={f.skills} onChange={e => r.setForm(prev => ({ ...prev, skills: e.target.value }))} />
          </Section>

          {/* Projects */}
          <Section title="Projects" icon="🚀">
            <div className="space-y-4">
              {f.projects.map((proj, pi) => (
                <div key={proj.id} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <div className="flex justify-between mb-3">
                    <span className="text-xs font-bold text-slate-400">PROJECT {pi + 1}</span>
                    <button onClick={() => r.removeProject(proj.id)} className="text-xs text-red-500 hover:text-red-600">✕ Remove</button>
                  </div>
                  <div className="space-y-3">
                    <div><label className={label}>Project Name</label><input className={inp} placeholder="ResumeAI" value={proj.name} onChange={e => r.setProject(proj.id, 'name', e.target.value)} /></div>
                    <div><label className={label}>Description</label><input className={inp} placeholder="Built an AI-powered resume builder…" value={proj.description} onChange={e => r.setProject(proj.id, 'description', e.target.value)} /></div>
                    <div><label className={label}>Technologies (comma-separated)</label><input className={inp} placeholder="React, Node.js, OpenAI" value={proj.tech} onChange={e => r.setProject(proj.id, 'tech', e.target.value)} /></div>
                    <div><label className={label}>Link (optional)</label><input className={inp} placeholder="github.com/jane/resumeai" value={proj.link} onChange={e => r.setProject(proj.id, 'link', e.target.value)} /></div>
                  </div>
                </div>
              ))}
              <button onClick={r.addProject} className="w-full py-2.5 border border-dashed border-slate-300 hover:border-blue-500 rounded-xl text-sm text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                + Add Project
              </button>
            </div>
          </Section>

          {/* Certifications */}
          <Section title="Certifications" icon="🏆">
            <div className="space-y-3">
              {f.certifications.map((cert, ci) => (
                <div key={cert.id} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <div className="flex justify-between mb-3">
                    <span className="text-xs font-bold text-slate-400">CERT {ci + 1}</span>
                    <button onClick={() => r.removeCert(cert.id)} className="text-xs text-red-500 hover:text-red-600">✕ Remove</button>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-3"><label className={label}>Certification Name</label><input className={inp} placeholder="AWS Certified Solutions Architect" value={cert.name} onChange={e => r.setCert(cert.id, 'name', e.target.value)} /></div>
                    <div className="col-span-2"><label className={label}>Issuer</label><input className={inp} placeholder="Amazon Web Services" value={cert.issuer} onChange={e => r.setCert(cert.id, 'issuer', e.target.value)} /></div>
                    <div><label className={label}>Year</label><input className={inp} placeholder="2024" value={cert.year} onChange={e => r.setCert(cert.id, 'year', e.target.value)} /></div>
                  </div>
                </div>
              ))}
              <button onClick={r.addCert} className="w-full py-2.5 border border-dashed border-slate-300 hover:border-blue-500 rounded-xl text-sm text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                + Add Certification
              </button>
            </div>
          </Section>

          {/* Additional Information (Languages & Awards — featured in Canva template) */}
          <Section title="Additional Information" icon="🌐" badge="Languages & Awards">
            <div className="space-y-4">
              <div>
                <label className={label}>Languages Spoken</label>
                <input
                  className={inp}
                  placeholder="e.g. English, French, Mandarin, Spanish"
                  value={f.languages || ''}
                  onChange={e => r.setForm(prev => ({ ...prev, languages: e.target.value }))}
                />
                <p className="text-[11px] text-slate-400 mt-1">Comma-separated languages for global roles.</p>
              </div>

              <div>
                <label className={label}>Awards, Honors & Leadership Activities</label>
                <textarea
                  rows={2}
                  className={inp + ' resize-none'}
                  placeholder="e.g. Most Innovative Project 2024, Smart India Hackathon Finalist, Dean's List (2022-2023)"
                  value={f.awards || ''}
                  onChange={e => r.setForm(prev => ({ ...prev, awards: e.target.value }))}
                />
              </div>
            </div>
          </Section>
        </div>

        {/* ── RIGHT: Analysis Panel ── */}
        <div className="bg-slate-100 p-6 overflow-y-auto">
          <h2 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2">
            <span>🤖</span> AI Analysis
            {analysis && <span className="ml-auto text-xs text-slate-400 font-normal">Updated just now</span>}
          </h2>
          <AnalysisPanel result={analysis} loading={loading} />
        </div>
      </div>
    </div>
  );
}
