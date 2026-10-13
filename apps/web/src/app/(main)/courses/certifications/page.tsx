'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useStudentCareerMatch, getKeywordsForRole } from '@/hooks/useStudentCareerMatch';

// ── Free Certification Courses Dataset ────────────────────────────────────────
// Sources: GUVI, W3Schools, HCL TechBee, Google, Microsoft, AWS, Meta, Cisco,
//          freeCodeCamp, IBM, LinkedIn Learning, Coursera (audit), NPTEL, etc.

interface FreeCourse {
  id:           string;
  title:        string;
  provider:     string;
  providerLogo: string;
  platform:     string;         // GUVI, W3Schools, Coursera, etc.
  category:     string;
  roleTag:      string[];       // job roles this maps to
  level:        'Beginner' | 'Intermediate' | 'Advanced';
  duration:     string;         // e.g. "20 hrs" / "Self-paced"
  certificate:  boolean;        // gives free certificate
  rating:       number;
  students:     string;
  skills:       string[];
  url:          string;
  emoji:        string;
  highlight:    string;         // one-liner why it's great
  isNew?:       boolean;
  isPopular?:   boolean;
}

const COURSES: FreeCourse[] = [

  // ══════════════ MINDLUSTER ═════════════════════════════════════════════════
  {
    id: 'mindluster-cs',
    title: 'Computer Science Basics',
    provider: 'Mindluster',
    providerLogo: '💻',
    platform: 'Mindluster',
    category: 'Programming',
    roleTag: ['Software Engineer', 'Backend', 'Frontend'],
    level: 'Beginner',
    duration: '10 hrs',
    certificate: true,
    rating: 4.7,
    students: '1,00,000+',
    skills: ['Computer Science', 'Algorithms', 'Data Structures', 'Networking'],
    url: 'https://www.mindluster.com/certificate/102',
    emoji: '💻',
    highlight: '100% Free with certificate · Perfect starting point for CS',
    isPopular: true,
  },
  {
    id: 'mindluster-fullstack',
    title: 'Full Stack Web Development',
    provider: 'Mindluster',
    providerLogo: '🌐',
    platform: 'Mindluster',
    category: 'Web Development',
    roleTag: ['Frontend', 'Backend', 'Full Stack'],
    level: 'Beginner',
    duration: '25 hrs',
    certificate: true,
    rating: 4.6,
    students: '80,000+',
    skills: ['HTML', 'CSS', 'JavaScript', 'Node.js', 'React'],
    url: 'https://www.mindluster.com/certificate/114',
    emoji: '🌐',
    highlight: 'Build complete web apps from scratch for free',
    isPopular: true,
  },
  {
    id: 'mindluster-python',
    title: 'Data Analysis with Python',
    provider: 'Mindluster',
    providerLogo: '📊',
    platform: 'Mindluster',
    category: 'Data Science',
    roleTag: ['Data Science', 'Data Analyst', 'ML / AI'],
    level: 'Intermediate',
    duration: '15 hrs',
    certificate: true,
    rating: 4.7,
    students: '1,50,000+',
    skills: ['Python', 'Pandas', 'NumPy', 'Data Visualization'],
    url: 'https://www.mindluster.com/certificate/143',
    emoji: '📊',
    highlight: 'Practical data analysis skills for free',
  },

  // ══════════════ GOOGLE ════════════════════════════════════════════════════
  {
    id: 'google-it-support',
    title: 'Google IT Support Professional Certificate',
    provider: 'Google',
    providerLogo: '🟢',
    platform: 'Coursera (Free Audit)',
    category: 'IT / Cloud',
    roleTag: ['Cloud', 'DevOps', 'Software Engineer'],
    level: 'Beginner',
    duration: '6 Months',
    certificate: true,
    rating: 4.8,
    students: '3.5M+',
    skills: ['Networking', 'OS', 'Security', 'Cloud', 'Linux'],
    url: 'https://grow.google/intl/india/certificates/',
    emoji: '🟢',
    highlight: 'World\'s most enrolled IT cert · auditable free on Coursera',
    isPopular: true,
  },
  {
    id: 'google-cybersec',
    title: 'Google Cybersecurity Certificate',
    provider: 'Google',
    providerLogo: '🔒',
    platform: 'Coursera (Free Audit)',
    category: 'Cybersecurity',
    roleTag: ['Cybersecurity', 'SOC Analyst', 'Cloud Security'],
    level: 'Beginner',
    duration: '6 Months',
    certificate: true,
    rating: 4.8,
    students: '500K+',
    skills: ['SIEM', 'Network Security', 'Python', 'Linux', 'SQL', 'NIST'],
    url: 'https://grow.google/intl/india/certificates/',
    emoji: '🔒',
    highlight: 'Industry-recognized cybersecurity cert from Google · SOC job ready',
    isNew: true,
    isPopular: true,
  },
  {
    id: 'google-da',
    title: 'Google Data Analytics Certificate',
    provider: 'Google',
    providerLogo: '📊',
    platform: 'Coursera (Free Audit)',
    category: 'Data Science',
    roleTag: ['Data Analyst', 'Data Science'],
    level: 'Beginner',
    duration: '6 Months',
    certificate: true,
    rating: 4.8,
    students: '2M+',
    skills: ['SQL', 'R', 'Tableau', 'Excel', 'Data Cleaning', 'Visualization'],
    url: 'https://grow.google/intl/india/certificates/',
    emoji: '📊',
    highlight: 'Gold standard data analytics cert · audit free · job guarantee',
    isPopular: true,
  },
  {
    id: 'google-ux',
    title: 'Google UX Design Certificate',
    provider: 'Google',
    providerLogo: '🎨',
    platform: 'Coursera (Free Audit)',
    category: 'UI / UX Design',
    roleTag: ['UI / UX', 'Product Mgr'],
    level: 'Beginner',
    duration: '6 Months',
    certificate: true,
    rating: 4.8,
    students: '800K+',
    skills: ['Figma', 'Wireframing', 'Prototyping', 'User Research', 'Usability Testing'],
    url: 'https://grow.google/intl/india/certificates/',
    emoji: '🎨',
    highlight: 'Complete UX design training from scratch with Figma',
    isNew: true,
  },
  {
    id: 'google-pm',
    title: 'Google Project Management Certificate',
    provider: 'Google',
    providerLogo: '📋',
    platform: 'Coursera (Free Audit)',
    category: 'Product / PM',
    roleTag: ['Product Mgr'],
    level: 'Beginner',
    duration: '6 Months',
    certificate: true,
    rating: 4.8,
    students: '1.5M+',
    skills: ['Agile', 'Scrum', 'Project Planning', 'Stakeholder Mgmt', 'Risk Mgmt'],
    url: 'https://grow.google/intl/india/certificates/',
    emoji: '📋',
    highlight: 'PM fundamentals from Google — recognized by top companies',
  },
  {
    id: 'google-cloud-digital',
    title: 'Google Cloud Digital Leader',
    provider: 'Google Cloud',
    providerLogo: '☁️',
    platform: 'Google Cloud',
    category: 'Cloud',
    roleTag: ['Cloud', 'DevOps'],
    level: 'Beginner',
    duration: 'Self-paced',
    certificate: true,
    rating: 4.7,
    students: '200K+',
    skills: ['GCP', 'Cloud Concepts', 'AI/ML Cloud', 'Infrastructure'],
    url: 'https://cloud.google.com/training/badges',
    emoji: '☁️',
    highlight: 'Free Google Cloud skill badges and certifications',
    isNew: true,
  },

  // ══════════════ MICROSOFT ═════════════════════════════════════════════════
  {
    id: 'ms-az900',
    title: 'Microsoft Azure Fundamentals (AZ-900)',
    provider: 'Microsoft',
    providerLogo: '🔵',
    platform: 'Microsoft Learn',
    category: 'Cloud',
    roleTag: ['Cloud', 'DevOps', 'Azure'],
    level: 'Beginner',
    duration: '10 hrs',
    certificate: true,
    rating: 4.8,
    students: '2M+',
    skills: ['Azure', 'Cloud Concepts', 'Core Azure Services', 'Security'],
    url: 'https://learn.microsoft.com/en-us/certifications/azure-fundamentals/',
    emoji: '☁️',
    highlight: 'Free training on Microsoft Learn · widely recognized cloud cert',
    isPopular: true,
  },
  {
    id: 'ms-ai900',
    title: 'Microsoft Azure AI Fundamentals (AI-900)',
    provider: 'Microsoft',
    providerLogo: '🤖',
    platform: 'Microsoft Learn',
    category: 'AI / ML',
    roleTag: ['ML / AI', 'Cloud', 'GenAI / LLM'],
    level: 'Beginner',
    duration: '8 hrs',
    certificate: true,
    rating: 4.7,
    students: '500K+',
    skills: ['Azure AI', 'Cognitive Services', 'ML Fundamentals', 'LLMs'],
    url: 'https://learn.microsoft.com/en-us/certifications/azure-ai-fundamentals/',
    emoji: '🤖',
    highlight: 'Free AI fundamentals — learn Azure OpenAI and Copilot basics',
    isNew: true,
  },
  {
    id: 'ms-sc900',
    title: 'Microsoft Security Fundamentals (SC-900)',
    provider: 'Microsoft',
    providerLogo: '🔐',
    platform: 'Microsoft Learn',
    category: 'Cybersecurity',
    roleTag: ['Cybersecurity', 'Cloud Security', 'IAM'],
    level: 'Beginner',
    duration: '8 hrs',
    certificate: true,
    rating: 4.7,
    students: '300K+',
    skills: ['Microsoft Security', 'Compliance', 'Identity', 'Azure AD'],
    url: 'https://learn.microsoft.com/en-us/certifications/security-compliance-and-identity-fundamentals/',
    emoji: '🛡️',
    highlight: 'Free Microsoft security cert — essential for IAM & cloud security roles',
    isPopular: true,
  },

  // ══════════════ AWS ═══════════════════════════════════════════════════════
  {
    id: 'aws-cloud-practitioner',
    title: 'AWS Cloud Practitioner Essentials',
    provider: 'Amazon Web Services',
    providerLogo: '☁️',
    platform: 'AWS Skill Builder',
    category: 'Cloud',
    roleTag: ['Cloud', 'DevOps', 'AWS'],
    level: 'Beginner',
    duration: '6 hrs',
    certificate: true,
    rating: 4.8,
    students: '5M+',
    skills: ['AWS Core Services', 'Cloud Concepts', 'Security', 'Pricing'],
    url: 'https://aws.amazon.com/training/digital/',
    emoji: '🟠',
    highlight: 'Official AWS free course — perfect prep for CLF-C02 exam',
    isPopular: true,
  },
  {
    id: 'aws-ml',
    title: 'Machine Learning Foundations on AWS',
    provider: 'Amazon Web Services',
    providerLogo: '🤖',
    platform: 'AWS Skill Builder',
    category: 'AI / ML',
    roleTag: ['ML / AI', 'Cloud', 'MLOps'],
    level: 'Beginner',
    duration: '8 hrs',
    certificate: true,
    rating: 4.6,
    students: '800K+',
    skills: ['SageMaker', 'ML Concepts', 'AWS AI Services', 'Python'],
    url: 'https://aws.amazon.com/training/learn-about/machine-learning/',
    emoji: '🤖',
    highlight: 'Free AWS ML fundamentals with SageMaker hands-on labs',
    isNew: true,
  },

  // ══════════════ CISCO ═════════════════════════════════════════════════════
  {
    id: 'cisco-ccna-intro',
    title: 'Networking Essentials (CCNA Prep)',
    provider: 'Cisco Networking Academy',
    providerLogo: '🌐',
    platform: 'Cisco NetAcad',
    category: 'Networking',
    roleTag: ['Cybersecurity', 'DevOps', 'Cloud'],
    level: 'Beginner',
    duration: '70 hrs',
    certificate: true,
    rating: 4.7,
    students: '1M+',
    skills: ['TCP/IP', 'Routing', 'Switching', 'VLANs', 'Network Security'],
    url: 'https://www.netacad.com/courses/networking',
    emoji: '🔌',
    highlight: 'Free CCNA preparation from Cisco — globally recognized',
    isPopular: true,
  },
  {
    id: 'cisco-cybersec',
    title: 'Introduction to Cybersecurity',
    provider: 'Cisco Networking Academy',
    providerLogo: '🔐',
    platform: 'Cisco NetAcad',
    category: 'Cybersecurity',
    roleTag: ['Cybersecurity', 'SOC Analyst'],
    level: 'Beginner',
    duration: '15 hrs',
    certificate: true,
    rating: 4.7,
    students: '2M+',
    skills: ['Cyber Threats', 'Network Security', 'Privacy', 'Ethical Hacking Basics'],
    url: 'https://www.netacad.com/courses/cybersecurity/introduction-cybersecurity',
    emoji: '🛡️',
    highlight: 'World\'s most enrolled free cybersecurity intro course',
    isPopular: true,
  },

  // ══════════════ IBM ═══════════════════════════════════════════════════════
  {
    id: 'ibm-datascience',
    title: 'IBM Data Science Professional Certificate',
    provider: 'IBM',
    providerLogo: '📊',
    platform: 'Coursera (Free Audit)',
    category: 'Data Science',
    roleTag: ['Data Science', 'ML / AI', 'Data Analyst'],
    level: 'Beginner',
    duration: '11 Months',
    certificate: true,
    rating: 4.6,
    students: '1.5M+',
    skills: ['Python', 'SQL', 'Data Visualization', 'ML', 'Jupyter', 'Spark'],
    url: 'https://www.coursera.org/professional-certificates/ibm-data-science',
    emoji: '🔷',
    highlight: 'IBM-backed data science cert — audit all courses for free',
    isPopular: true,
  },
  {
    id: 'ibm-cybersec',
    title: 'IBM Cybersecurity Analyst Professional',
    provider: 'IBM',
    providerLogo: '🔐',
    platform: 'Coursera (Free Audit)',
    category: 'Cybersecurity',
    roleTag: ['Cybersecurity', 'SOC Analyst', 'SIEM'],
    level: 'Intermediate',
    duration: '8 Months',
    certificate: true,
    rating: 4.6,
    students: '400K+',
    skills: ['SIEM', 'Threat Intelligence', 'Incident Response', 'Network Security'],
    url: 'https://www.coursera.org/professional-certificates/ibm-cybersecurity-analyst',
    emoji: '🔒',
    highlight: 'IBM cert for SOC Analyst roles — industry-recognized globally',
    isNew: true,
  },

  // ══════════════ META ══════════════════════════════════════════════════════
  {
    id: 'meta-frontend',
    title: 'Meta Front-End Developer Certificate',
    provider: 'Meta',
    providerLogo: '🟦',
    platform: 'Coursera (Free Audit)',
    category: 'Web Development',
    roleTag: ['Frontend', 'Full Stack'],
    level: 'Beginner',
    duration: '7 Months',
    certificate: true,
    rating: 4.8,
    students: '800K+',
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'UI Testing', 'Git'],
    url: 'https://www.coursera.org/professional-certificates/meta-front-end-developer',
    emoji: '⚛️',
    highlight: 'Official Meta / Facebook React certification — audit free',
    isPopular: true,
  },
  {
    id: 'meta-backend',
    title: 'Meta Back-End Developer Certificate',
    provider: 'Meta',
    providerLogo: '🟦',
    platform: 'Coursera (Free Audit)',
    category: 'Web Development',
    roleTag: ['Backend', 'Full Stack'],
    level: 'Intermediate',
    duration: '8 Months',
    certificate: true,
    rating: 4.7,
    students: '400K+',
    skills: ['Python', 'Django', 'REST APIs', 'MySQL', 'Version Control'],
    url: 'https://www.coursera.org/professional-certificates/meta-back-end-developer',
    emoji: '⚙️',
    highlight: 'Build production-grade backends — official Meta certificate',
    isNew: true,
  },

  // ══════════════ freeCodeCamp ══════════════════════════════════════════════
  {
    id: 'fcc-responsive',
    title: 'Responsive Web Design Certification',
    provider: 'freeCodeCamp',
    providerLogo: '🏕️',
    platform: 'freeCodeCamp',
    category: 'Web Development',
    roleTag: ['Frontend', 'UI / UX'],
    level: 'Beginner',
    duration: '300 hrs',
    certificate: true,
    rating: 4.8,
    students: '10M+',
    skills: ['HTML5', 'CSS3', 'Flexbox', 'Grid', 'Accessibility', 'Responsive Design'],
    url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/',
    emoji: '🏕️',
    highlight: '100% free · no ads · project-based · 300 hrs of content',
    isPopular: true,
  },
  {
    id: 'fcc-js-algorithms',
    title: 'JavaScript Algorithms & Data Structures',
    provider: 'freeCodeCamp',
    providerLogo: '🟨',
    platform: 'freeCodeCamp',
    category: 'Programming',
    roleTag: ['Software Engineer', 'Frontend', 'Backend'],
    level: 'Intermediate',
    duration: '300 hrs',
    certificate: true,
    rating: 4.8,
    students: '8M+',
    skills: ['JavaScript', 'Algorithms', 'Data Structures', 'OOP', 'Regex'],
    url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures-v8/',
    emoji: '🔢',
    highlight: 'Completely free DSA certification — great for interview prep',
    isPopular: true,
  },
  {
    id: 'fcc-data-analysis',
    title: 'Data Analysis with Python',
    provider: 'freeCodeCamp',
    providerLogo: '📊',
    platform: 'freeCodeCamp',
    category: 'Data Science',
    roleTag: ['Data Analyst', 'Data Science'],
    level: 'Intermediate',
    duration: '300 hrs',
    certificate: true,
    rating: 4.7,
    students: '1M+',
    skills: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Jupyter'],
    url: 'https://www.freecodecamp.org/learn/data-analysis-with-python/',
    emoji: '📊',
    highlight: 'Project-based data analysis with real-world datasets — 100% free',
  },
  {
    id: 'fcc-ml',
    title: 'Machine Learning with Python',
    provider: 'freeCodeCamp',
    providerLogo: '🤖',
    platform: 'freeCodeCamp',
    category: 'AI / ML',
    roleTag: ['ML / AI', 'Data Science'],
    level: 'Intermediate',
    duration: '300 hrs',
    certificate: true,
    rating: 4.7,
    students: '800K+',
    skills: ['Python', 'TensorFlow', 'Neural Networks', 'NLP', 'Reinforcement Learning'],
    url: 'https://www.freecodecamp.org/learn/machine-learning-with-python/',
    emoji: '🤖',
    highlight: 'TensorFlow-based ML cert using real Netflix/Amazon datasets',
  },

  // ══════════════ NPTEL (IIT/IISc) ══════════════════════════════════════════
  {
    id: 'nptel-python',
    title: 'Programming in Python (IIT Bombay)',
    provider: 'NPTEL – IIT Bombay',
    providerLogo: '🎓',
    platform: 'NPTEL / SWAYAM',
    category: 'Programming',
    roleTag: ['Software Engineer', 'Data Science', 'ML / AI'],
    level: 'Beginner',
    duration: '12 Weeks',
    certificate: true,
    rating: 4.9,
    students: '5,00,000+',
    skills: ['Python', 'Algorithms', 'Data Structures', 'OOP'],
    url: 'https://nptel.ac.in/courses/106106182',
    emoji: '🎓',
    highlight: 'IIT Bombay faculty · NPTEL certificate with proctored exam',
    isPopular: true,
  },
  {
    id: 'nptel-dbms',
    title: 'Database Management System (IIT Madras)',
    provider: 'NPTEL – IIT Madras',
    providerLogo: '🗄️',
    platform: 'NPTEL / SWAYAM',
    category: 'Data Engineering',
    roleTag: ['Backend', 'Data Engineer', 'Data Analyst'],
    level: 'Intermediate',
    duration: '12 Weeks',
    certificate: true,
    rating: 4.8,
    students: '2,00,000+',
    skills: ['SQL', 'ER Diagrams', 'Normalization', 'Transactions', 'NoSQL'],
    url: 'https://nptel.ac.in/courses/106106093',
    emoji: '🗄️',
    highlight: 'IIT Madras DBMS — certificate recognized by all top companies',
  },
  {
    id: 'nptel-ml',
    title: 'Introduction to Machine Learning (IIT Kharagpur)',
    provider: 'NPTEL – IIT Kharagpur',
    providerLogo: '🤖',
    platform: 'NPTEL / SWAYAM',
    category: 'AI / ML',
    roleTag: ['ML / AI', 'Data Science'],
    level: 'Intermediate',
    duration: '8 Weeks',
    certificate: true,
    rating: 4.8,
    students: '3,00,000+',
    skills: ['ML Algorithms', 'Linear Algebra', 'Statistics', 'Python', 'scikit-learn'],
    url: 'https://nptel.ac.in/courses/106105152',
    emoji: '🤖',
    highlight: 'IIT Kharagpur ML — highest-rated ML course in India',
    isPopular: true,
  },
  {
    id: 'nptel-os',
    title: 'Operating Systems (IIT Bombay)',
    provider: 'NPTEL – IIT Bombay',
    providerLogo: '💻',
    platform: 'NPTEL / SWAYAM',
    category: 'System Design',
    roleTag: ['Software Engineer', 'DevOps', 'Cloud'],
    level: 'Intermediate',
    duration: '12 Weeks',
    certificate: true,
    rating: 4.8,
    students: '1,50,000+',
    skills: ['OS Concepts', 'Processes', 'Memory', 'File Systems', 'Linux'],
    url: 'https://nptel.ac.in/courses/106105055',
    emoji: '💻',
    highlight: 'IIT Bombay OS — required knowledge for FAANG interviews',
  },

  // ══════════════ LinkedIn Learning ══════════════════════════════════════════
  {
    id: 'li-career-essentials-genai',
    title: 'Career Essentials in Generative AI',
    provider: 'Microsoft + LinkedIn',
    providerLogo: '🧠',
    platform: 'LinkedIn Learning',
    category: 'AI / ML',
    roleTag: ['GenAI / LLM', 'ML / AI', 'Software Engineer'],
    level: 'Beginner',
    duration: '4 hrs',
    certificate: true,
    rating: 4.7,
    students: '500K+',
    skills: ['Generative AI', 'LLMs', 'ChatGPT', 'Prompt Engineering', 'Copilot'],
    url: 'https://www.linkedin.com/learning/paths/career-essentials-in-generative-ai-by-microsoft-and-linkedin',
    emoji: '🧠',
    highlight: '100% free · LinkedIn certificate · 4 hours · GenAI for everyone',
    isNew: true,
    isPopular: true,
  },
  {
    id: 'li-cybersec-essentials',
    title: 'Career Essentials in Cybersecurity',
    provider: 'Microsoft + LinkedIn',
    providerLogo: '🔐',
    platform: 'LinkedIn Learning',
    category: 'Cybersecurity',
    roleTag: ['Cybersecurity', 'SOC Analyst', 'Cloud Security'],
    level: 'Beginner',
    duration: '8 hrs',
    certificate: true,
    rating: 4.7,
    students: '300K+',
    skills: ['Cybersecurity Basics', 'Threat Detection', 'Security Operations', 'Compliance'],
    url: 'https://www.linkedin.com/learning/paths/career-essentials-in-cybersecurity-by-microsoft-and-linkedin',
    emoji: '🛡️',
    highlight: '100% free Microsoft x LinkedIn cybersecurity certificate',
    isNew: true,
    isPopular: true,
  },
  {
    id: 'li-software-dev',
    title: 'Career Essentials in Software Development',
    provider: 'Microsoft + LinkedIn',
    providerLogo: '💻',
    platform: 'LinkedIn Learning',
    category: 'Programming',
    roleTag: ['Software Engineer', 'Frontend', 'Backend'],
    level: 'Beginner',
    duration: '5 hrs',
    certificate: true,
    rating: 4.7,
    students: '400K+',
    skills: ['Programming Fundamentals', 'GitHub', 'CI/CD', 'Testing'],
    url: 'https://www.linkedin.com/learning/paths/career-essentials-in-software-development-by-microsoft-and-linkedin',
    emoji: '💻',
    highlight: '100% free · perfect for beginners entering software development',
    isNew: true,
  },
];

// ── Platform color themes ──────────────────────────────────────────────────────
const PLATFORM_THEME: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  'Mindluster':             { bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', text: 'text-indigo-400', dot: 'bg-indigo-400' },
  'Coursera (Free Audit)': { bg: 'bg-sky-500/10',    border: 'border-sky-500/20',    text: 'text-sky-400',    dot: 'bg-sky-400' },
  'Microsoft Learn':       { bg: 'bg-blue-500/10',   border: 'border-blue-500/20',   text: 'text-blue-400',   dot: 'bg-blue-400' },
  'AWS Skill Builder':     { bg: 'bg-amber-500/10',  border: 'border-amber-500/20',  text: 'text-amber-400',  dot: 'bg-amber-400' },
  'Google Cloud':          { bg: 'bg-emerald-500/10',border: 'border-emerald-500/20',text: 'text-emerald-400',dot: 'bg-emerald-400' },
  'Cisco NetAcad':         { bg: 'bg-teal-500/10',   border: 'border-teal-500/20',   text: 'text-teal-400',   dot: 'bg-teal-400' },
  'freeCodeCamp':          { bg: 'bg-green-500/10',  border: 'border-green-500/20',  text: 'text-green-400',  dot: 'bg-green-400' },
  'NPTEL / SWAYAM':        { bg: 'bg-violet-500/10', border: 'border-violet-500/20', text: 'text-violet-400', dot: 'bg-violet-400' },
  'LinkedIn Learning':     { bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', text: 'text-indigo-400', dot: 'bg-indigo-400' },
};

// ── All categories for filter ──────────────────────────────────────────────────
const ALL_CATEGORIES = [
  'All', 'Web Development', 'Programming', 'AI / ML', 'Data Science',
  'Data Engineering', 'Cybersecurity', 'Cloud', 'UI / UX Design', 'Networking',
  'Product / PM', 'Tech Career', 'System Design',
];

// ── All platforms for filter ───────────────────────────────────────────────────
const ALL_PLATFORMS = [
  'All Platforms', 'Mindluster', 'Coursera (Free Audit)',
  'Microsoft Learn', 'AWS Skill Builder', 'freeCodeCamp', 'NPTEL / SWAYAM',
  'Cisco NetAcad', 'Google Cloud', 'LinkedIn Learning',
];

// ── Level filter ──────────────────────────────────────────────────────────────
const LEVELS = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];

// ─────────────────────────────────────────────────────────────────────────────
export default function FreeCertificationsPage() {
  const {
    hasCompletedQuiz,
    primaryRole,
    primaryConfidence,
    closeRoles,
    activeRole,
    setActiveRole,
    resetFilter,
  } = useStudentCareerMatch();

  const [search,       setSearch]       = useState('');
  const [category,     setCategory]     = useState('All');
  const [platform,     setPlatform]     = useState('All Platforms');
  const [level,        setLevel]        = useState('All Levels');
  const [showNew,      setShowNew]      = useState(false);
  const [showPopular,  setShowPopular]  = useState(false);

  const activeRoleKeywords = useMemo(() => {
    if (!hasCompletedQuiz || !activeRole || search.trim()) return [];
    return getKeywordsForRole(activeRole).map(k => k.toLowerCase());
  }, [hasCompletedQuiz, activeRole, search]);

  const filtered = useMemo(() => {
    return COURSES.filter(c => {
      const matchSearch = !search || [c.title, c.provider, ...c.skills, ...c.roleTag, c.category].join(' ').toLowerCase().includes(search.toLowerCase());
      
      let matchActiveRole = true;
      if (activeRoleKeywords.length > 0) {
        const hay = [c.title, c.category, ...c.skills, ...c.roleTag].join(' ').toLowerCase();
        matchActiveRole = activeRoleKeywords.some(kw => hay.includes(kw));
      }

      const matchCategory = category === 'All' || c.category === category;
      const matchPlatform = platform === 'All Platforms' || c.platform === platform;
      const matchLevel    = level === 'All Levels' || c.level === level;
      const matchNew      = !showNew || c.isNew;
      const matchPopular  = !showPopular || c.isPopular;
      return matchSearch && matchActiveRole && matchCategory && matchPlatform && matchLevel && matchNew && matchPopular;
    });
  }, [search, activeRoleKeywords, category, platform, level, showNew, showPopular]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="relative bg-gradient-to-b from-slate-900 to-slate-950 border-b border-white/5 px-6 pt-12 pb-10 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-3xl" />
          <div className="absolute top-0 right-1/3 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl" />
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              100% Free · Industry Certified
            </span>
            <span className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
              🇮🇳 India Focused
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
            Free Certification <br />
            <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent">
              Courses for Every Role
            </span>
          </h1>
          <p className="text-slate-400 text-lg font-medium mb-8 max-w-3xl">
            Curated free certifications from <strong className="text-white">Google, Microsoft, AWS, IBM, Meta, Mindluster, freeCodeCamp, NPTEL</strong> and more — perfect for students and working professionals.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-6 mb-10">
            {[
              { val: `${COURSES.length}+`,  label: 'Free Courses' },
              { val: '11+',    label: 'Platforms' },
              { val: '100%',   label: 'Certificate Included' },
              { val: '30+',    label: 'Job Roles Covered' },
            ].map(s => (
              <div key={s.label} className="flex flex-col">
                <span className="text-2xl font-black text-white">{s.val}</span>
                <span className="text-xs text-slate-500 font-medium">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="relative max-w-2xl">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg">🔍</span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by role, skill or course name (e.g. Cloud Security, React, SOC Analyst)..."
              className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-blue-500/50 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all text-sm"
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* ── AI Tailored Certifications Banner (Quiz Matched) ──────────── */}
        {hasCompletedQuiz && (primaryRole || activeRole) && (
          <div className="mb-8 p-5 md:p-6 rounded-3xl bg-gradient-to-r from-violet-900/30 via-indigo-900/20 to-blue-900/30 border border-violet-500/30 shadow-2xl shadow-violet-950/50 backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-violet-500/20 border border-violet-400/40 text-violet-300 text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-violet-400 animate-ping" />
                    AI Certification Track
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">
                    Free Certifications Recommended for Your Quiz Profile
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2 flex-wrap">
                  <span>Free Certifications for</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-300 to-blue-400 font-extrabold underline decoration-violet-500/40 underline-offset-4">
                    {activeRole || primaryRole}
                  </span>
                  {activeRole === primaryRole && primaryConfidence ? (
                    <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold">
                      {primaryConfidence}% Match
                    </span>
                  ) : null}
                </h2>
                <p className="text-xs text-slate-300">
                  Showing recognized certifications to build job-ready credentials. Switch tracks or type in search to view all.
                </p>
              </div>

              <div className="text-right self-start md:self-auto">
                <span className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-white/10 text-xs font-bold text-slate-300">
                  {filtered.length} Recommended Courses
                </span>
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
                    setCategory('All');
                    setSearch('');
                    setActiveRole(primaryRole);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                    activeRole === primaryRole
                      ? 'bg-violet-600 border-violet-400 text-white shadow-lg shadow-violet-600/30'
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
                    setCategory('All');
                    setSearch('');
                    setActiveRole(cr.role);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                    activeRole === cr.role
                      ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-600/30'
                      : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:border-blue-500/50 hover:text-blue-200'
                  }`}
                >
                  <span>⇄ #{idx + 2} {cr.role}</span>
                  <span className="text-[10px] opacity-80">({cr.confidence}%)</span>
                </button>
              ))}

              {/* Reset to see all certifications */}
              <button
                onClick={() => {
                  resetFilter();
                  setCategory('All');
                  setSearch('');
                }}
                className={`ml-auto px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  !activeRole
                    ? 'bg-white/10 border-white/30 text-white'
                    : 'bg-transparent border-slate-700 text-slate-400 hover:text-white hover:border-slate-500'
                }`}
              >
                🌐 View All Certifications
              </button>
            </div>
          </div>
        )}

        {/* ── Platform Pills ─────────────────────────────────────────────── */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
          {ALL_PLATFORMS.map(p => {
            const theme = PLATFORM_THEME[p] || { bg: 'bg-slate-900', border: 'border-slate-800', text: 'text-slate-400', dot: 'bg-slate-400' };
            const active = platform === p;
            return (
              <button
                key={p}
                onClick={() => setPlatform(p)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition-all flex-shrink-0 ${
                  active
                    ? `${theme.bg} ${theme.border} ${theme.text} shadow-lg`
                    : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300'
                }`}
              >
                {active && <span className={`w-1.5 h-1.5 rounded-full ${theme.dot}`} />}
                {p}
              </button>
            );
          })}
        </div>

        {/* ── Category + Level + Toggles ─────────────────────────────────── */}
        <div className="flex flex-wrap gap-3 mb-8 items-center">
          {/* Category */}
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-300 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-blue-500/50 cursor-pointer"
          >
            {ALL_CATEGORIES.map(c => <option key={c} value={c} className="bg-slate-900">{c}</option>)}
          </select>

          {/* Level */}
          <select
            value={level}
            onChange={e => setLevel(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-300 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-blue-500/50 cursor-pointer"
          >
            {LEVELS.map(l => <option key={l} value={l} className="bg-slate-900">{l}</option>)}
          </select>

          {/* New */}
          <button
            onClick={() => setShowNew(p => !p)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
              showNew ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300'
            }`}
          >
            🆕 New
          </button>

          {/* Popular */}
          <button
            onClick={() => setShowPopular(p => !p)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
              showPopular ? 'bg-amber-500/10 border-amber-500 text-amber-400' : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300'
            }`}
          >
            🔥 Popular
          </button>

          <span className="ml-auto text-xs text-slate-500 font-medium">
            <span className="text-white font-bold">{filtered.length}</span> courses found
          </span>
        </div>

        {/* ── Featured Banner ────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            { emoji: '💡', label: 'Mindluster + NPTEL', sub: 'Completely free · certificate included', color: 'from-orange-600/20 to-amber-600/20 border-orange-500/20' },
            { emoji: '🌐', label: 'Google + Microsoft', sub: 'Gold standard global certifications', color: 'from-blue-600/20 to-cyan-600/20 border-blue-500/20' },
            { emoji: '💻', label: 'freeCodeCamp', sub: '100% free · no payment ever needed', color: 'from-emerald-600/20 to-green-600/20 border-emerald-500/20' },
          ].map(b => (
            <div key={b.label} className={`bg-gradient-to-r ${b.color} border rounded-2xl p-5 flex items-center gap-4`}>
              <span className="text-3xl">{b.emoji}</span>
              <div>
                <div className="font-black text-sm text-white">{b.label}</div>
                <div className="text-xs text-slate-400 mt-0.5">{b.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Course Grid ────────────────────────────────────────────────── */}
        {filtered.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-white/10 rounded-2xl">
            <div className="text-5xl mb-4 opacity-40">🎓</div>
            <h3 className="text-xl font-black text-white mb-2">No courses found</h3>
            <p className="text-slate-500 font-medium">Try a different search term or clear filters.</p>
            <button
              onClick={() => { setSearch(''); setCategory('All'); setPlatform('All Platforms'); setLevel('All Levels'); setShowNew(false); setShowPopular(false); }}
              className="mt-4 text-blue-400 hover:text-blue-300 font-black text-xs uppercase tracking-widest transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}

        {/* ── Footer tip ────────────────────────────────────────────────── */}
        <div className="mt-12 p-6 bg-gradient-to-r from-slate-900 to-slate-800/50 border border-white/5 rounded-2xl flex items-start gap-5">
          <span className="text-3xl flex-shrink-0">💡</span>
          <div>
            <h3 className="font-black text-white text-base mb-1">How to get free certificates</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Most Coursera courses can be <strong className="text-white">audited for free</strong> (click "Audit" instead of enroll). 
              Mindluster and freeCodeCamp are completely free. Microsoft Learn badges are free. 
              NPTEL gives verifiable certificates after a paid proctored exam (₹1000–₹3000). 
              LinkedIn Learning offers a <strong className="text-white">1-month free trial</strong> for Microsoft certificates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Course Card ───────────────────────────────────────────────────────────────
function CourseCard({ course }: { course: FreeCourse }) {
  const theme = PLATFORM_THEME[course.platform] || {
    bg: 'bg-slate-800', border: 'border-slate-700', text: 'text-slate-400', dot: 'bg-slate-400',
  };
  const levelColors: Record<string, string> = {
    Beginner:     'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Intermediate: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    Advanced:     'bg-violet-500/10 text-violet-400 border-violet-500/20',
  };

  return (
    <a
      href={course.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col bg-white/[0.03] border border-white/8 rounded-2xl overflow-hidden hover:border-blue-500/40 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-300 group relative"
    >
      {/* Top gradient bar */}
      <div className={`h-1.5 w-full ${theme.dot} bg-gradient-to-r opacity-70`} />

      {/* Badges */}
      <div className="absolute top-4 right-4 flex flex-col gap-1.5 items-end z-10">
        {course.isNew     && <span className="text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-lg">🆕 New</span>}
        {course.isPopular && <span className="text-[9px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-lg">🔥 Popular</span>}
      </div>

      <div className="p-5 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className={`w-12 h-12 rounded-xl ${theme.bg} border ${theme.border} flex items-center justify-center text-2xl flex-shrink-0`}>
            {course.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className={`inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${theme.bg} ${theme.border} border ${theme.text} mb-2`}>
              <span className={`w-1 h-1 rounded-full ${theme.dot}`} />
              {course.platform}
            </div>
            <h3 className="font-bold text-white text-sm leading-tight group-hover:text-blue-400 transition-colors line-clamp-2">
              {course.title}
            </h3>
            <p className="text-slate-500 text-xs mt-0.5 font-medium">{course.provider}</p>
          </div>
        </div>

        {/* Highlight */}
        <p className="text-slate-400 text-xs leading-relaxed mb-4 font-medium line-clamp-2">
          {course.highlight}
        </p>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {course.skills.slice(0, 4).map(s => (
            <span key={s} className="text-[10px] font-bold bg-white/5 text-slate-500 px-2 py-1 rounded-lg border border-white/5">
              {s}
            </span>
          ))}
        </div>

        {/* Role tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {course.roleTag.slice(0, 2).map(r => (
            <span key={r} className="text-[9px] font-black uppercase tracking-wider bg-blue-500/5 text-blue-500/80 border border-blue-500/10 px-2 py-0.5 rounded-lg">
              {r}
            </span>
          ))}
        </div>

        <div className="mt-auto">
          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-3 text-xs mb-4 pt-3 border-t border-white/5">
            <span className={`px-2 py-1 rounded-lg border text-[10px] font-black uppercase ${levelColors[course.level] || ''}`}>
              {course.level}
            </span>
            <span className="text-slate-500 font-medium">⏱ {course.duration}</span>
            <span className="text-slate-500 font-medium">👥 {course.students}</span>
            <span className="flex items-center gap-0.5 text-amber-400 font-bold ml-auto">
              ★ {course.rating}
            </span>
          </div>

          {/* CTA */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1.5 rounded-lg">
                🆓 Free
              </span>
              {course.certificate && (
                <span className="text-[10px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1.5 rounded-lg">
                  🏆 Certificate
                </span>
              )}
            </div>
            <span className="text-xs font-black text-blue-400 group-hover:text-blue-300 transition-colors flex items-center gap-1">
              Enroll Free ↗
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}
