import { useState } from 'react';

export const useResumeBuilder = () => {
  const [resumeData, setResumeData] = useState({
    name: 'Alex Morgan',
    role: 'Senior Full Stack Engineer',
    summary: 'Full Stack Architect specializing in React, Node, and AI Copilots.',
  });

  const updateResume = (field: string, value: string) => {
    setResumeData(prev => ({ ...prev, [field]: value }));
  };

  return { resumeData, updateResume };
};
