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
export interface ResumeFormData {
  personalInfo: { fullName: string; email: string; phone: string; location: string; linkedin: string; portfolio: string };
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string;
  projects: Project[];
  certifications: Certification[];
  targetRole: string;
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
};

export const ROLES = [
  'Software Engineer','Data Scientist','Product Manager','UX Designer',
  'DevOps Engineer','Frontend Developer','Backend Developer',
  'Data Engineer','ML Engineer','Cybersecurity Analyst',
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

  return {
    form, setForm,
    setPersonal,
    addExp, removeExp, setExp, setAchievement, addAchievement, removeAchievement,
    addEdu, removeEdu, setEdu,
    addProject, removeProject, setProject,
    addCert, removeCert, setCert,
  };
}
