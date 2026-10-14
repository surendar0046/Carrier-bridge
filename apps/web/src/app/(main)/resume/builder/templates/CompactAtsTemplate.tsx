'use client';

import React from 'react';
import { ResumeFormData } from '../useResumeStore';

interface Props {
  data: ResumeFormData;
}

export default function CompactAtsTemplate({ data }: Props) {
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
    <div className="bg-white text-black w-full max-w-[800px] mx-auto p-8 md:p-12 font-sans text-[12px] leading-snug">
      {/* Header */}
      <header className="border-b border-black pb-2 mb-3">
        <h1 className="text-2xl font-bold uppercase tracking-wide text-black">
          {p.fullName || 'Candidate Name'}
        </h1>
        {targetRole && (
          <p className="text-[12px] font-semibold text-gray-800">{targetRole}</p>
        )}
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-gray-700 mt-1">
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>| {p.phone}</span>}
          {p.location && <span>| {p.location}</span>}
          {p.linkedin && <span>| {p.linkedin.replace(/^https?:\/\//, '')}</span>}
          {p.portfolio && <span>| {p.portfolio.replace(/^https?:\/\//, '')}</span>}
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className="mb-3">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-black border-b border-gray-300 pb-0.5 mb-1">
            Summary
          </h2>
          <p className="text-[11.5px] leading-normal text-gray-900">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {activeExp.length > 0 && (
        <section className="mb-3">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-black border-b border-gray-300 pb-0.5 mb-1.5">
            Experience
          </h2>
          <div className="space-y-2.5">
            {activeExp.map(exp => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline font-bold text-[11.5px]">
                  <span>{exp.role} — {exp.company}</span>
                  <span className="text-[10.5px] text-gray-600 font-normal">
                    {exp.startDate}{exp.startDate && ' - '}{exp.endDate || (exp.startDate ? 'Present' : '')}
                  </span>
                </div>
                {exp.achievements.filter(Boolean).length > 0 && (
                  <ul className="list-disc list-outside ml-4 mt-0.5 space-y-0.5 text-[11px] text-gray-800">
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
        <section className="mb-3">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-black border-b border-gray-300 pb-0.5 mb-1">
            Education
          </h2>
          <div className="space-y-1">
            {activeEdu.map(edu => (
              <div key={edu.id} className="flex justify-between items-baseline text-[11px]">
                <span>
                  <strong>{edu.institution}</strong> — {edu.degree} {edu.field && `in ${edu.field}`}
                  {edu.gpa && ` (GPA: ${edu.gpa})`}
                </span>
                <span className="text-gray-600 text-[10.5px]">{edu.year}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skillList.length > 0 && (
        <section className="mb-3">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-black border-b border-gray-300 pb-0.5 mb-1">
            Technical Skills
          </h2>
          <p className="text-[11px] text-gray-900 leading-normal">
            {skillList.join(', ')}
          </p>
        </section>
      )}

      {/* Projects */}
      {activeProjects.length > 0 && (
        <section className="mb-3">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-black border-b border-gray-300 pb-0.5 mb-1">
            Projects
          </h2>
          <div className="space-y-1.5 text-[11px]">
            {activeProjects.map(proj => (
              <div key={proj.id}>
                <div className="font-bold">{proj.name} {proj.link && <span className="font-normal text-gray-600 text-[10px]">({proj.link})</span>}</div>
                {proj.description && <p className="text-gray-800">{proj.description}</p>}
                {proj.tech && <p className="text-gray-600 text-[10px]">Stack: {proj.tech}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications & Languages */}
      {(activeCerts.length > 0 || languages) && (
        <section className="mb-1">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-black border-b border-gray-300 pb-0.5 mb-1">
            Additional Information
          </h2>
          <div className="text-[11px] text-gray-800 space-y-0.5">
            {activeCerts.length > 0 && (
              <div>
                <strong>Certifications:</strong> {activeCerts.map(c => `${c.name} (${c.issuer})`).join('; ')}
              </div>
            )}
            {languages && <div><strong>Languages:</strong> {languages}</div>}
          </div>
        </section>
      )}
    </div>
  );
}
