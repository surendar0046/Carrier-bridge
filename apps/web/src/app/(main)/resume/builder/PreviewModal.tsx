'use client';
import { ResumeFormData } from './useResumeStore';

interface Props { data: ResumeFormData; onClose: () => void }

export default function PreviewModal({ data, onClose }: Props) {
  const { personalInfo: p, summary, experience, education, skills, projects, certifications, targetRole } = data;
  const skillList = skills.split(',').map(s => s.trim()).filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white text-gray-900 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl">
        {/* Toolbar */}
        <div className="sticky top-0 bg-slate-800 text-white px-6 py-3 flex justify-between items-center rounded-t-2xl">
          <span className="font-bold text-sm">📄 Resume Preview — {targetRole}</span>
          <div className="flex gap-3">
            <button onClick={() => window.print()} className="text-xs bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-lg transition-colors">
              🖨️ Print / PDF
            </button>
            <button onClick={onClose} className="text-xs bg-slate-700 hover:bg-slate-600 px-4 py-1.5 rounded-lg transition-colors">
              ✕ Close
            </button>
          </div>
        </div>

        {/* Resume Content */}
        <div id="resume-print-content" className="p-10 font-serif text-[13px] leading-relaxed print:p-0">
          {/* Header */}
          <div className="border-b-2 border-gray-800 pb-4 mb-4">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{p.fullName || 'Your Name'}</h1>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-gray-600 text-xs">
              {p.email && <span>✉ {p.email}</span>}
              {p.phone && <span>📱 {p.phone}</span>}
              {p.location && <span>📍 {p.location}</span>}
              {p.linkedin && <span>🔗 {p.linkedin}</span>}
              {p.portfolio && <span>🌐 {p.portfolio}</span>}
            </div>
          </div>

          {/* Summary */}
          {summary && (
            <section className="mb-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Professional Summary</h2>
              <p className="text-gray-700">{summary}</p>
            </section>
          )}

          {/* Experience */}
          {experience.filter(e => e.company || e.role).length > 0 && (
            <section className="mb-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Experience</h2>
              {experience.filter(e => e.company || e.role).map(exp => (
                <div key={exp.id} className="mb-3">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-gray-900">{exp.role}</span>
                    <span className="text-gray-500 text-xs">{exp.startDate}{exp.startDate && ' – '}{exp.endDate || (exp.startDate ? 'Present' : '')}</span>
                  </div>
                  <div className="text-gray-600 italic">{exp.company}</div>
                  <ul className="mt-1 space-y-0.5">
                    {exp.achievements.filter(a => a).map((a, i) => (
                      <li key={i} className="flex gap-2 text-gray-700"><span>•</span>{a}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          )}

          {/* Education */}
          {education.filter(e => e.institution).length > 0 && (
            <section className="mb-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Education</h2>
              {education.filter(e => e.institution).map(edu => (
                <div key={edu.id} className="flex justify-between items-baseline mb-1">
                  <div>
                    <span className="font-bold">{edu.degree} {edu.field && `in ${edu.field}`}</span>
                    <span className="text-gray-600"> — {edu.institution}</span>
                    {edu.gpa && <span className="text-gray-500 text-xs"> · GPA: {edu.gpa}</span>}
                  </div>
                  <span className="text-gray-500 text-xs">{edu.year}</span>
                </div>
              ))}
            </section>
          )}

          {/* Skills */}
          {skillList.length > 0 && (
            <section className="mb-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {skillList.map(s => (
                  <span key={s} className="bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded text-xs border border-gray-200">{s}</span>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {projects.filter(p => p.name).length > 0 && (
            <section className="mb-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Projects</h2>
              {projects.filter(p => p.name).map(proj => (
                <div key={proj.id} className="mb-2">
                  <div className="flex gap-2 items-baseline">
                    <span className="font-bold">{proj.name}</span>
                    {proj.link && <a href={proj.link} className="text-blue-600 text-xs">{proj.link}</a>}
                  </div>
                  {proj.description && <p className="text-gray-700">{proj.description}</p>}
                  {proj.tech && <p className="text-gray-500 text-xs mt-0.5">Tech: {proj.tech}</p>}
                </div>
              ))}
            </section>
          )}

          {/* Certifications */}
          {certifications.filter(c => c.name).length > 0 && (
            <section className="mb-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Certifications</h2>
              {certifications.filter(c => c.name).map(cert => (
                <div key={cert.id} className="flex justify-between">
                  <span>{cert.name} — <span className="text-gray-600">{cert.issuer}</span></span>
                  <span className="text-gray-500 text-xs">{cert.year}</span>
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
