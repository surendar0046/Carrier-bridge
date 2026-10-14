'use client';
import { useState } from 'react';

export interface Experience {
  id: string; company: string; role: string;
  startDate: string; endDate: string; achievements: string[];
}
export interface Education {
  id: string; institution: string; degree: string;
  field: string; year: string; gpa: string;
}
export interface Project {
  id: string; name: string; description: string;
  tech: string; link: string;
}
export interface Certification {
  id: string; name: string; issuer: string; year: string;
}
export type ResumeTemplateId = 'canva-minimalist' | 'modern' | 'classic' | 'compact-ats';

export interface ResumeFormData {
  personalInfo: { fullName: string; email: string; phone: string; location: string; linkedin: string; portfolio: string };
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string;
  projects: Project[];
  certifications: Certification[];
  targetRole: string;
  template?: ResumeTemplateId;
  languages?: string;
  awards?: string;
}

const uid = () => Math.random().toString(36).slice(2, 9);

const INITIAL: ResumeFormData = {
  personalInfo: { fullName: '', email: '', phone: '', location: '', linkedin: '', portfolio: '' },
  summary: '',
  experience: [{ id: uid(), company: '', role: '', startDate: '', endDate: '', achievements: [''] }],
  education: [{ id: uid(), institution: '', degree: '', field: '', year: '', gpa: '' }],
  skills: '',
  projects: [],
  certifications: [],
  targetRole: 'Software Engineer',
  template: 'canva-minimalist',
  languages: '',
  awards: '',
};

// ─── All Tech Career Roles ────────────────────────────────────────────────────
export const ROLES = [
  // ── Software Engineering ──────────────────────────────────────────────────
  'Software Engineer',
  'Senior Software Engineer',
  'Staff Software Engineer',
  'Principal Software Engineer',
  'Frontend Developer',
  'Senior Frontend Developer',
  'Backend Developer',
  'Senior Backend Developer',
  'Full Stack Developer',
  'Senior Full Stack Engineer',
  'Mobile Developer (iOS)',
  'Mobile Developer (Android)',
  'React Native Developer',
  'Flutter Developer',
  'Embedded Systems Engineer',
  'Firmware Engineer',
  'Game Developer',
  'Graphics Engineer',
  'Blockchain Developer',
  'Smart Contract Developer',
  'Web3 Developer',

  // ── Cloud & Infrastructure ────────────────────────────────────────────────
  'Cloud Engineer',
  'Cloud Architect',
  'Cloud Solutions Architect',
  'AWS Cloud Engineer',
  'Azure Cloud Engineer',
  'GCP Cloud Engineer',
  'Site Reliability Engineer (SRE)',
  'DevOps Engineer',
  'Senior DevOps Engineer',
  'Platform Engineer',
  'Infrastructure Engineer',
  'Systems Administrator',
  'Linux Administrator',
  'Network Engineer',
  'Network Administrator',
  'Storage Engineer',
  'Kubernetes Engineer',
  'Terraform / IaC Engineer',

  // ── Cybersecurity ─────────────────────────────────────────────────────────
  'Cybersecurity Analyst',
  'SOC Analyst (Tier 1)',
  'SOC Analyst (Tier 2)',
  'SOC Analyst (Tier 3)',
  'Cloud Security Engineer',
  'Application Security Engineer',
  'Network Security Engineer',
  'Penetration Tester',
  'Ethical Hacker',
  'Red Team Engineer',
  'Blue Team Engineer',
  'Threat Intelligence Analyst',
  'Incident Response Analyst',
  'Malware Analyst',
  'Security Architect',
  'CISO / Security Director',
  'GRC Analyst',
  'Compliance Analyst',
  'Identity & Access Management (IAM) Engineer',
  'SIEM Engineer',
  'Vulnerability Assessment Analyst',
  'Forensic Analyst',
  'Security Operations Manager',

  // ── Data & Analytics ──────────────────────────────────────────────────────
  'Data Scientist',
  'Senior Data Scientist',
  'Data Engineer',
  'Senior Data Engineer',
  'Data Analyst',
  'Business Intelligence Analyst',
  'BI Developer',
  'Analytics Engineer',
  'Data Architect',
  'Database Administrator (DBA)',
  'ETL Developer',
  'Data Warehouse Engineer',
  'Quantitative Analyst',
  'Statistical Analyst',
  'Decision Scientist',

  // ── AI & Machine Learning ─────────────────────────────────────────────────
  'ML Engineer',
  'Senior ML Engineer',
  'AI Engineer',
  'Deep Learning Engineer',
  'NLP Engineer',
  'Computer Vision Engineer',
  'MLOps Engineer',
  'Generative AI Engineer',
  'LLM Engineer',
  'AI Research Scientist',
  'Reinforcement Learning Engineer',
  'Robotics Engineer',
  'Speech / Audio ML Engineer',

  // ── Design & Product ──────────────────────────────────────────────────────
  'UX Designer',
  'UI Designer',
  'UI/UX Designer',
  'Product Designer',
  'Interaction Designer',
  'Visual Designer',
  'Motion Designer',
  'UX Researcher',
  'Design Systems Engineer',
  'Product Manager',
  'Senior Product Manager',
  'Technical Product Manager',
  'Product Analyst',
  'Growth Product Manager',

  // ── Quality Assurance & Testing ───────────────────────────────────────────
  'QA Engineer',
  'SDET (Software Dev Engineer in Test)',
  'Automation Test Engineer',
  'Performance Test Engineer',
  'Manual QA Tester',
  'QA Lead',

  // ── Management & Leadership ───────────────────────────────────────────────
  'Engineering Manager',
  'Director of Engineering',
  'VP of Engineering',
  'CTO',
  'Technical Lead',
  'Tech Lead / Architect',

  // ── Specialized & Emerging ────────────────────────────────────────────────
  'Solutions Architect',
  'Enterprise Architect',
  'Integration Engineer',
  'API Developer',
  'Developer Advocate',
  'Technical Writer',
  'Scrum Master',
  'Agile Coach',
  'IT Project Manager',
  'IT Support Specialist',
  'Help Desk Analyst',
];

export function useResumeStore() {
  const [form, setForm] = useState<ResumeFormData>(INITIAL);

  const setPersonal = (key: string, val: string) =>
    setForm(f => ({ ...f, personalInfo: { ...f.personalInfo, [key]: val } }));

  // Experience
  const addExp = () => setForm(f => ({ ...f, experience: [...f.experience, { id: uid(), company: '', role: '', startDate: '', endDate: '', achievements: [''] }] }));
  const removeExp = (id: string) => setForm(f => ({ ...f, experience: f.experience.filter(e => e.id !== id) }));
  const setExp = (id: string, key: string, val: string) =>
    setForm(f => ({ ...f, experience: f.experience.map(e => e.id === id ? { ...e, [key]: val } : e) }));
  const setAchievement = (expId: string, idx: number, val: string) =>
    setForm(f => ({ ...f, experience: f.experience.map(e => e.id === expId ? { ...e, achievements: e.achievements.map((a, i) => i === idx ? val : a) } : e) }));
  const addAchievement = (expId: string) =>
    setForm(f => ({ ...f, experience: f.experience.map(e => e.id === expId ? { ...e, achievements: [...e.achievements, ''] } : e) }));
  const removeAchievement = (expId: string, idx: number) =>
    setForm(f => ({ ...f, experience: f.experience.map(e => e.id === expId ? { ...e, achievements: e.achievements.filter((_, i) => i !== idx) } : e) }));

  // Education
  const addEdu = () => setForm(f => ({ ...f, education: [...f.education, { id: uid(), institution: '', degree: '', field: '', year: '', gpa: '' }] }));
  const removeEdu = (id: string) => setForm(f => ({ ...f, education: f.education.filter(e => e.id !== id) }));
  const setEdu = (id: string, key: string, val: string) =>
    setForm(f => ({ ...f, education: f.education.map(e => e.id === id ? { ...e, [key]: val } : e) }));

  // Projects
  const addProject = () => setForm(f => ({ ...f, projects: [...f.projects, { id: uid(), name: '', description: '', tech: '', link: '' }] }));
  const removeProject = (id: string) => setForm(f => ({ ...f, projects: f.projects.filter(p => p.id !== id) }));
  const setProject = (id: string, key: string, val: string) =>
    setForm(f => ({ ...f, projects: f.projects.map(p => p.id === id ? { ...p, [key]: val } : p) }));

  // Certifications
  const addCert = () => setForm(f => ({ ...f, certifications: [...f.certifications, { id: uid(), name: '', issuer: '', year: '' }] }));
  const removeCert = (id: string) => setForm(f => ({ ...f, certifications: f.certifications.filter(c => c.id !== id) }));
  const setCert = (id: string, key: string, val: string) =>
    setForm(f => ({ ...f, certifications: f.certifications.map(c => c.id === id ? { ...c, [key]: val } : c) }));

  const setTemplate = (template: ResumeTemplateId) =>
    setForm(f => ({ ...f, template }));

  return {
    form, setForm,
    setPersonal,
    setTemplate,
    addExp, removeExp, setExp, setAchievement, addAchievement, removeAchievement,
    addEdu, removeEdu, setEdu,
    addProject, removeProject, setProject,
    addCert, removeCert, setCert,
  };
}
