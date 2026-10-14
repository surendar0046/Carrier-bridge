'use client';

import React from 'react';
import { ResumeFormData } from '../useResumeStore';

interface Props {
  data: ResumeFormData;
}

export default function ModernTemplate({ data }: Props) {
  const {
    personalInfo: p,
    summary,
    experience,
    education,
    skills,
    projects,
    certifications,
    targetRole,
    languages,
  } = data;

  const skillList = skills
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  const activeExp = experience.filter(e => e.company || e.role);
  const activeEdu = education.filter(e => e.institution || e.degree);
  const activeProjects = projects?.filter(p => p.name) || [];
  const activeCerts = certifications?.filter(c => c.name) || [];

  return (
    <div className="bg-white text-slate-800 w-full max-w-[800px] mx-auto p-10 md:p-14 font-sans leading-normal">
      {/* Header */}
      <header className="border-b-2 border-blue-600 pb-5 mb-5">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              {p.fullName || 'Your Name'}
            </h1>
            <p className="text-sm font-bold text-blue-600 mt-1 uppercase tracking-wider">
              {targetRole || 'Software Engineer'}
            </p>
          </div>

          <div className="flex flex-col text-xs text-slate-600 space-y-1 md:text-right">
            {p.email && <span>✉ {p.email}</span>}
            {p.phone && <span>📱 {p.phone}</span>}
            {p.location && <span>📍 {p.location}</span>}
            <div className="flex gap-3 md:justify-end">
              {p.linkedin && <span className="text-blue-600">in/{p.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}</span>}
              {p.portfolio && <span className="text-blue-600">🌐 {p.portfolio.replace(/^https?:\/\//, '')}</span>}
            </div>
          </div>
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className="mb-5">
          <h2 className="text-xs font-black uppercase tracking-wider text-blue-700 mb-1.5 flex items-center gap-2">
            <span className="w-1.5 h-3 bg-blue-600 rounded-sm" /> Profile Summary
          </h2>
          <p className="text-xs leading-relaxed text-slate-700">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {activeExp.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-black uppercase tracking-wider text-blue-700 mb-2 flex items-center gap-2">
            <span className="w-1.5 h-3 bg-blue-600 rounded-sm" /> Work Experience
          </h2>
          <div className="space-y-3.5">
            {activeExp.map(exp => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-0.5">
                  <span className="text-xs font-bold text-slate-900">{exp.role}</span>
                  <span className="text-[11px] font-semibold text-slate-500">
                    {exp.startDate}{exp.startDate && ' – '}{exp.endDate || (exp.startDate ? 'Present' : '')}
                  </span>
                </div>
                <div className="text-[11px] font-medium text-blue-600 mb-1">{exp.company}</div>
                {exp.achievements.filter(Boolean).length > 0 && (
                  <ul className="list-disc list-outside ml-4 space-y-0.5 text-xs text-slate-700">
                    {exp.achievements.filter(Boolean).map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {activeEdu.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-black uppercase tracking-wider text-blue-700 mb-2 flex items-center gap-2">
            <span className="w-1.5 h-3 bg-blue-600 rounded-sm" /> Education
          </h2>
          <div className="space-y-2">
            {activeEdu.map(edu => (
              <div key={edu.id} className="flex justify-between items-baseline text-xs">
                <div>
                  <span className="font-bold text-slate-900">{edu.degree} {edu.field && `in ${edu.field}`}</span>
                  <span className="text-slate-600"> — {edu.institution}</span>
                  {edu.gpa && <span className="text-slate-500 text-[11px]"> · GPA: {edu.gpa}</span>}
                </div>
                <span className="text-[11px] text-slate-500 font-medium">{edu.year}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skillList.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-black uppercase tracking-wider text-blue-700 mb-2 flex items-center gap-2">
            <span className="w-1.5 h-3 bg-blue-600 rounded-sm" /> Core Skills
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {skillList.map((s, idx) => (
              <span
                key={idx}
                className="bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded text-[11px] font-semibold"
              >
                {s}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {activeProjects.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-black uppercase tracking-wider text-blue-700 mb-2 flex items-center gap-2">
            <span className="w-1.5 h-3 bg-blue-600 rounded-sm" /> Projects
          </h2>
          <div className="space-y-2.5">
            {activeProjects.map(proj => (
              <div key={proj.id} className="text-xs">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900">{proj.name}</span>
                  {proj.link && <span className="text-blue-600 text-[11px]">{proj.link}</span>}
                </div>
                {proj.description && <p className="text-slate-700 mt-0.5">{proj.description}</p>}
                {proj.tech && <p className="text-slate-500 text-[10.5px] mt-0.5">Tech: {proj.tech}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications & Languages */}
      {(activeCerts.length > 0 || languages) && (
        <section className="mb-2">
          <h2 className="text-xs font-black uppercase tracking-wider text-blue-700 mb-2 flex items-center gap-2">
            <span className="w-1.5 h-3 bg-blue-600 rounded-sm" /> Certifications & Details
          </h2>
          <div className="space-y-1 text-xs text-slate-700">
            {activeCerts.map(cert => (
              <div key={cert.id} className="flex justify-between">
                <span>🏆 <strong>{cert.name}</strong> {cert.issuer && `— ${cert.issuer}`}</span>
                <span className="text-slate-500 text-[11px]">{cert.year}</span>
              </div>
            ))}
            {languages && (
              <div className="pt-1">
                🗣️ <strong>Languages:</strong> {languages}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
