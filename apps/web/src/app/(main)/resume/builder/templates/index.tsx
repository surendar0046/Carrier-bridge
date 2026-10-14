'use client';

import React from 'react';
import { ResumeFormData, ResumeTemplateId } from '../useResumeStore';
import CanvaMinimalistTemplate from './CanvaMinimalistTemplate';
import ModernTemplate from './ModernTemplate';
import ClassicTemplate from './ClassicTemplate';
import CompactAtsTemplate from './CompactAtsTemplate';

export interface TemplateDefinition {
  id: ResumeTemplateId;
  name: string;
  subtitle: string;
  description: string;
  badge?: string;
  accent: string;
  previewBg: string;
  icon: string;
}

export const TEMPLATES: TemplateDefinition[] = [
  {
    id: 'canva-minimalist',
    name: 'Canva Minimalist Pro',
    subtitle: 'Black & White Clean (Dina Maher Style)',
    description: 'High-contrast monochrome layout with centered uppercase header, horizontal rule, 3-column skills, and ATS-friendly hierarchy.',
    badge: 'Canva Template',
    accent: 'border-black text-black',
    previewBg: 'bg-white',
    icon: '🖤',
  },
  {
    id: 'modern',
    name: 'Modern Tech',
    subtitle: 'Sapphire Accent & Badges',
    description: 'Contemporary tech resume with colored accents, skill tags, and crisp modern typography for engineers and product roles.',
    badge: 'Popular',
    accent: 'border-blue-500 text-blue-600',
    previewBg: 'bg-blue-50/50',
    icon: '⚡',
  },
  {
    id: 'classic',
    name: 'Classic Executive',
    subtitle: 'Traditional Serif Layout',
    description: 'Timeless Ivy League styling with elegant serif fonts, formal section rules, and conservative formatting.',
    badge: 'Classic',
    accent: 'border-slate-800 text-slate-800',
    previewBg: 'bg-amber-50/30',
    icon: '🏛️',
  },
  {
    id: 'compact-ats',
    name: 'Compact ATS Pro',
    subtitle: 'Ultra-Dense Single Page',
    description: 'Maximum density format designed to fit extensive experience onto 1 page while scoring 95%+ on enterprise ATS parsers.',
    badge: '99% ATS',
    accent: 'border-emerald-600 text-emerald-700',
    previewBg: 'bg-emerald-50/30',
    icon: '🎯',
  },
];

export function ResumeTemplateRenderer({
  data,
  templateId,
}: {
  data: ResumeFormData;
  templateId?: ResumeTemplateId;
}) {
  const activeId = templateId || data.template || 'canva-minimalist';

  switch (activeId) {
    case 'canva-minimalist':
      return <CanvaMinimalistTemplate data={data} />;
    case 'modern':
      return <ModernTemplate data={data} />;
    case 'classic':
      return <ClassicTemplate data={data} />;
    case 'compact-ats':
      return <CompactAtsTemplate data={data} />;
    default:
      return <CanvaMinimalistTemplate data={data} />;
  }
}

export { CanvaMinimalistTemplate, ModernTemplate, ClassicTemplate, CompactAtsTemplate };
