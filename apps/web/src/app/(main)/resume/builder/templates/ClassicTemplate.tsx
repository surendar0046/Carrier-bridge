'use client';

import React from 'react';
import { ResumeFormData } from '../useResumeStore';

interface Props {
  data: ResumeFormData;
}

export default function ClassicTemplate({ data }: Props) {
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
    <div
      className="bg-white text-gray-900 w-full max-w-[800px] mx-auto p-10 md:p-14 font-serif leading-relaxed text-[13px]"
      style={{ fontFamily: 'Georgia, Cambria, "Times New Roman", Times, serif' }}
    >
      {/* Header */}
      <header className="border-b border-gray-900 pb-3 mb-4 text-center">
        <h1 className="text-2xl md:text-3xl font-bold tracking-normal uppercase text-gray-900">
          {p.fullName || 'Your Name'}
        </h1>
        {targetRole && (
          <p className="text-xs uppercase tracking-widest text-gray-600 mt-0.5 font-sans font-semibold">
            {targetRole}
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-2 text-xs text-gray-700 font-sans">
          {p.location && <span>{p.location}</span>}
          {p.phone && <span>• {p.phone}</span>}
          {p.email && <span>• {p.email}</span>}
          {p.linkedin && <span>• {p.linkedin.replace(/^https?:\/\//, '')}</span>}
          {p.portfolio && <span>• {p.portfolio.replace(/^https?:\/\//, '')}</span>}
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest border-b border-gray-400 pb-0.5 mb-1.5 font-sans text-gray-800">
            Professional Summary
          </h2>
          <p className="text-gray-800 text-[12.5px] leading-relaxed text-justify">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {activeExp.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest border-b border-gray-400 pb-0.5 mb-2 font-sans text-gray-800">
            Professional Experience
          </h2>
          <div className="space-y-3">
            {activeExp.map(exp => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline font-sans text-xs">
                  <span className="font-bold text-gray-900">{exp.role}</span>
                  <span className="text-gray-600 italic">
                    {exp.startDate}{exp.startDate && ' – '}{exp.endDate || (exp.startDate ? 'Present' : '')}
                  </span>
                </div>
                <div className="text-gray-700 italic text-xs mb-1">{exp.company}</div>
                {exp.achievements.filter(Boolean).length > 0 && (
                  <ul className="list-disc list-outside ml-4 space-y-0.5 text-[12px] text-gray-800">
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
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest border-b border-gray-400 pb-0.5 mb-2 font-sans text-gray-800">
            Education
          </h2>
          <div className="space-y-2">
            {activeEdu.map(edu => (
              <div key={edu.id} className="flex justify-between items-baseline text-xs">
                <div>
                  <strong className="font-bold">{edu.degree} {edu.field && `in ${edu.field}`}</strong>
                  <span className="text-gray-700">, {edu.institution}</span>
                  {edu.gpa && <span className="text-gray-600"> (GPA: {edu.gpa})</span>}
                </div>
                <span className="text-gray-600 font-sans">{edu.year}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skillList.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest border-b border-gray-400 pb-0.5 mb-2 font-sans text-gray-800">
            Skills & Competencies
          </h2>
          <p className="text-xs leading-relaxed text-gray-800">
            <strong>Key Competencies:</strong> {skillList.join(' • ')}
          </p>
        </section>
      )}

      {/* Projects */}
      {activeProjects.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest border-b border-gray-400 pb-0.5 mb-2 font-sans text-gray-800">
            Key Projects
          </h2>
          <div className="space-y-2">
            {activeProjects.map(proj => (
              <div key={proj.id} className="text-xs">
                <div className="flex justify-between">
                  <strong>{proj.name}</strong>
                  {proj.link && <span className="text-gray-600 font-sans">{proj.link}</span>}
                </div>
                {proj.description && <p className="text-gray-800 mt-0.5">{proj.description}</p>}
                {proj.tech && <p className="text-gray-600 italic text-[11px]">Technologies: {proj.tech}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications & Languages */}
      {(activeCerts.length > 0 || languages) && (
        <section className="mb-2">
          <h2 className="text-xs font-bold uppercase tracking-widest border-b border-gray-400 pb-0.5 mb-1.5 font-sans text-gray-800">
            Certifications & Other Information
          </h2>
          <div className="space-y-1 text-xs text-gray-800">
            {activeCerts.length > 0 && (
              <p>
                <strong>Certifications:</strong>{' '}
                {activeCerts.map((c, i) => (
                  <span key={c.id}>
                    {c.name} ({c.issuer}{c.year ? `, ${c.year}` : ''}){i < activeCerts.length - 1 ? '; ' : ''}
                  </span>
                ))}
              </p>
            )}
            {languages && (
              <p>
                <strong>Languages:</strong> {languages}
              </p>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
