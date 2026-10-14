'use client';

import React from 'react';
import { ResumeFormData } from '../useResumeStore';

interface Props {
  data: ResumeFormData;
}

const DEFAULT_SUMMARY =
  'UX Designer dedicated to achieving meaningful outcomes, enthusiastic about embracing dynamic challenges and utilizing creativity to create intuitive user experiences. Proven expertise in project management, user-focused problem-solving, and effective collaboration across teams. Proficient in employing cutting-edge tools and methodologies to enhance processes and boost user satisfaction.';

const DEFAULT_EXP = [
  {
    id: 'sample-1',
    role: 'Instant Chartz App, Morcelle Program',
    company: '',
    startDate: 'Feb 2021',
    endDate: 'Dec 2022',
    achievements: [
      'Led development of an advanced automation system, achieving a 15% increase in operational efficiency.',
      'Streamlined manufacturing processes, reducing production costs by 10%.',
      'Implemented preventive maintenance strategies, resulting in a 20% decrease in equipment downtime.',
    ],
  },
  {
    id: 'sample-2',
    role: 'System UX Engineer, XarrowAI Industries',
    company: '',
    startDate: 'Feb 2021',
    endDate: 'Dec 2022',
    achievements: [
      'Designed and optimized a robotic control system, realizing a 12% performance improvement.',
      'Coordinated testing and validation, ensuring compliance with industry standards.',
      'Provided technical expertise, contributing to a 15% reduction in system failures.',
    ],
  },
];

const DEFAULT_EDU = [
  {
    id: 'edu-1',
    degree: 'UX Industrial Basics and General Application',
    field: '',
    institution: 'University of Engineering UX Cohort',
    year: 'Aug 2016 – Oct 2019',
    gpa: '',
    bullets: [
      'Major in Automotive Technology.',
      'Thesis on "Technological Advancements within the current Mechatronics Industry".',
    ],
  },
  {
    id: 'edu-2',
    degree: 'Bachelor of Design in Process Engineering',
    field: '',
    institution: 'Engineering University',
    year: 'May 2014 – May 2016',
    gpa: '',
    bullets: [
      'Relevant coursework in Structural Design and Project Management.',
    ],
  },
];

const DEFAULT_SKILLS = [
  'Prototyping Tools',
  'Interaction Design',
  'Accessibility',
  'User Research',
  'Visual Design',
  'Responsive Design',
  'Information Architecture',
  'Usability Heuristics',
  'User Testing Tools',
];

export default function CanvaMinimalistTemplate({ data }: Props) {
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
    awards,
  } = data;

  const userSkills = skills
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  const skillList = userSkills.length > 0 ? userSkills : DEFAULT_SKILLS;

  const rawActiveExp = experience.filter(e => e.company || e.role);
  const activeExp = rawActiveExp.length > 0 ? rawActiveExp : DEFAULT_EXP;

  const rawActiveEdu = education.filter(e => e.institution || e.degree);
  const activeEdu = rawActiveEdu.length > 0 ? rawActiveEdu : DEFAULT_EDU;

  const activeProjects = projects?.filter(p => p.name) || [];
  const activeCerts = certifications?.filter(c => c.name) || [];

  const displaySummary = summary || DEFAULT_SUMMARY;
  const displayLanguages = languages || (rawActiveExp.length === 0 ? 'English, French, Mandarin' : '');
  const displayAwards =
    awards ||
    (rawActiveExp.length === 0
      ? 'Most Innovative Employee of the Year (2021), Overall Best Employee Division Two (2024), Onboarding Project Lead (2023)'
      : '');

  return (
    <div
      className="bg-white text-black w-full max-w-[800px] mx-auto p-10 md:p-14 font-sans leading-normal selection:bg-slate-200 shadow-xl"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      {/* ── HEADER (Canva EAHAZbx5QPY Centered Style) ── */}
      <header className="text-center">
        {/* Full Name */}
        <h1 className="text-2xl md:text-[28px] font-black tracking-[0.22em] uppercase text-black mb-1.5">
          {p.fullName || 'DANIEL GALLEGO'}
        </h1>

        {/* Role Subtitle */}
        <p className="text-xs md:text-[13px] font-bold tracking-[0.25em] uppercase text-gray-800 mb-3.5">
          {targetRole || 'UX DESIGNER'}
        </p>

        {/* Contact Row */}
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-[11px] text-gray-700 tracking-wide">
          <span className="inline-flex items-center gap-1.5">
            <svg className="w-3 h-3 text-black shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.25 1.02l-2.2 2.2z" />
            </svg>
            <span>{p.phone || '+123-456-7890'}</span>
          </span>

          <span className="inline-flex items-center gap-1.5">
            <svg className="w-3 h-3 text-black shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
            <span>{p.email || 'hello@reallygreatsite.com'}</span>
          </span>

          <span className="inline-flex items-center gap-1.5">
            <svg className="w-3 h-3 text-black shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z" />
            </svg>
            <span>{p.location || '123 Anywhere St., Any City'}</span>
          </span>

          {p.linkedin && (
            <span className="inline-flex items-center gap-1.5">
              <svg className="w-3 h-3 text-black shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
              </svg>
              <span>{p.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</span>
            </span>
          )}

          {p.portfolio && (
            <span className="inline-flex items-center gap-1.5">
              <svg className="w-3 h-3 text-black shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41a7.984 7.984 0 0 1 4.9 7.41c0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
              <span>{p.portfolio.replace(/^https?:\/\/(www\.)?/, '')}</span>
            </span>
          )}
        </div>

        {/* Clean Canva-style Solid Horizontal Divider */}
        <hr className="border-t-[1.5px] border-black mt-4 mb-6" />
      </header>

      {/* ── 1. ABOUT ME ── */}
      <section className="mb-6">
        <h2 className="text-[12px] font-black uppercase tracking-[0.2em] text-black mb-2">
          ABOUT ME
        </h2>
        <p className="text-[11.5px] leading-relaxed text-gray-800 text-justify">
          {displaySummary}
        </p>
      </section>

      {/* ── 2. EDUCATION ── */}
      <section className="mb-6">
        <h2 className="text-[12px] font-black uppercase tracking-[0.2em] text-black mb-2.5">
          EDUCATION
        </h2>
        <div className="space-y-3.5">
          {activeEdu.map((edu: any) => (
            <div key={edu.id}>
              <div className="flex justify-between items-baseline mb-0.5">
                <span className="text-[12px] font-bold text-black">
                  {edu.degree}
                  {edu.field ? ` in ${edu.field}` : ''}
                </span>
                {edu.year && (
                  <span className="text-[11px] font-medium text-gray-700 whitespace-nowrap ml-4">
                    {edu.year}
                  </span>
                )}
              </div>
              <div className="text-[11.5px] text-gray-800 font-medium mb-1">
                {edu.institution}
                {edu.gpa && (
                  <span className="text-gray-600 font-normal"> · GPA: {edu.gpa}</span>
                )}
              </div>
              {edu.bullets && edu.bullets.length > 0 && (
                <ul className="list-disc list-outside ml-4 space-y-0.5 text-[11px] leading-relaxed text-gray-800">
                  {edu.bullets.map((b: string, i: number) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. PROFESSIONAL EXPERIENCE ── */}
      <section className="mb-6">
        <h2 className="text-[12px] font-black uppercase tracking-[0.2em] text-black mb-2.5">
          PROFESSIONAL EXPERIENCE
        </h2>
        <div className="space-y-4">
          {activeExp.map(exp => (
            <div key={exp.id}>
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-[12px] font-bold text-black">
                  {exp.role}
                  {exp.company ? `, ${exp.company}` : ''}
                </span>
                {(exp.startDate || exp.endDate) && (
                  <span className="text-[11px] font-medium text-gray-700 whitespace-nowrap ml-4">
                    {exp.startDate}
                    {exp.startDate && ' – '}
                    {exp.endDate || (exp.startDate ? 'Present' : '')}
                  </span>
                )}
              </div>

              {exp.achievements.filter(Boolean).length > 0 && (
                <ul className="list-disc list-outside ml-4 space-y-1 text-[11px] leading-relaxed text-gray-800">
                  {exp.achievements
                    .filter(Boolean)
                    .map((ach, i) => (
                      <li key={i}>{ach}</li>
                    ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. TECHNICAL SKILLS (Canva 3-Column Layout) ── */}
      <section className="mb-6">
        <h2 className="text-[12px] font-black uppercase tracking-[0.2em] text-black mb-2.5">
          TECHNICAL SKILLS
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-1.5 text-[11px] text-gray-800">
          {skillList.map((skill, idx) => (
            <div key={idx} className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-black rounded-full shrink-0" />
              <span className="font-medium text-gray-900">{skill}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. KEY PROJECTS (If present) ── */}
      {activeProjects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-[12px] font-black uppercase tracking-[0.2em] text-black mb-2.5">
            KEY PROJECTS
          </h2>
          <div className="space-y-3">
            {activeProjects.map(proj => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline mb-0.5">
                  <span className="text-[12px] font-bold text-black">{proj.name}</span>
                  {proj.link && (
                    <span className="text-[10.5px] text-gray-600 underline truncate max-w-[200px]">
                      {proj.link.replace(/^https?:\/\//, '')}
                    </span>
                  )}
                </div>
                {proj.description && (
                  <p className="text-[11px] leading-relaxed text-gray-800 mb-0.5">
                    {proj.description}
                  </p>
                )}
                {proj.tech && (
                  <p className="text-[10.5px] text-gray-600 italic">
                    Technologies: {proj.tech}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── 6. ADDITIONAL INFORMATION ── */}
      {(activeCerts.length > 0 || displayLanguages || displayAwards) && (
        <section className="mb-2">
          <h2 className="text-[12px] font-black uppercase tracking-[0.2em] text-black mb-2">
            ADDITIONAL INFORMATION
          </h2>
          <ul className="list-disc list-outside ml-4 space-y-1.5 text-[11px] leading-relaxed text-gray-800">
            {displayLanguages && (
              <li>
                <strong className="text-black font-bold">Languages:</strong> {displayLanguages}
              </li>
            )}
            {activeCerts.length > 0 ? (
              <li>
                <strong className="text-black font-bold">Certifications:</strong>{' '}
                {activeCerts.map((c, i) => (
                  <span key={c.id}>
                    {c.name}
                    {c.issuer ? ` (${c.issuer}${c.year ? `, ${c.year}` : ''})` : c.year ? ` (${c.year})` : ''}
                    {i < activeCerts.length - 1 ? '; ' : ''}
                  </span>
                ))}
              </li>
            ) : rawActiveExp.length === 0 ? (
              <li>
                <strong className="text-black font-bold">Certifications:</strong>{' '}
                Professional Design Engineer (PDE) License, Project Management Tech (PMT)
              </li>
            ) : null}
            {displayAwards && (
              <li>
                <strong className="text-black font-bold">Awards / Activities:</strong> {displayAwards}
              </li>
            )}
          </ul>
        </section>
      )}
    </div>
  );
}
