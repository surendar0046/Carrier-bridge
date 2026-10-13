import { NextRequest, NextResponse } from 'next/server';
import { Mentor } from '@career-bridge/types';

const LAKSHANAPRIYA_MENTOR: Mentor = {
  id: 'mentor-lakshanapriya',
  userId: 'user-m-lakshanapriya',
  name: 'Lakshanapriya',
  email: 'lakshanapriya0801@gmail.com',
  phone: '7092036790',
  whatsapp: '7092036790',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=faces',
  title: 'Senior Technical Mentor & Career Coach',
  company: 'CareerBridge Mentorship Network',
  expertise: ['Full Stack Development', 'Career Strategy', 'System Design', 'React & Node.js', 'Interview Preparation'],
  bio: 'Expert technical mentor with extensive experience coaching students and junior engineers. Available for 1-on-1 technical mock interviews, career strategy, and project reviews.',
  rating: 4.98,
  reviewCount: 164,
  totalSessions: 320,
  hourlyRate: 1500,
  currency: 'INR',
  availability: [],
  languages: ['English', 'Tamil', 'Hindi'],
  isVerified: true,
  responseTime: '< 30 mins',
};

export async function GET(req: NextRequest) {
  return NextResponse.json({
    success: true,
    items: [LAKSHANAPRIYA_MENTOR],
    source: 'verified-mentor',
  });
}
