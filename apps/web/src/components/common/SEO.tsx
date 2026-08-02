import React from 'react';
import Head from 'next/head';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title = 'Career Bridge - AI-Powered Career Operating System',
  description = 'Accelerate your career with real-time job matching, AI copilot, 1-on-1 mentorship, ATS optimization, and personalized learning paths.',
  keywords = 'career, jobs, ai copilot, mentorship, ats resume, fullstack, learning path',
}) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
    </Head>
  );
};
