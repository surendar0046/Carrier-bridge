'use client';
import Link from 'next/link';

const features = [
  { icon: '📝', title: 'Smart Builder', desc: 'Build your resume section by section — personal info, experience, skills, projects, and certifications with dynamic add/remove.' },
  { icon: '🎯', title: 'Role-Targeted', desc: 'Select from 10 target roles. The AI tailors its keyword analysis and feedback specifically for your chosen position.' },
  { icon: '🤖', title: 'AI Score (0–100)', desc: 'Get an instant score ring with a 5-dimension breakdown: Content, Relevance, Impact, Structure, and Keywords.' },
  { icon: '🔑', title: 'Keyword Gap Analysis', desc: 'See exactly which role-specific keywords your resume has (green) and which are missing (red).' },
  { icon: '⚡', title: 'Quick Win Tips', desc: 'Receive one high-impact, actionable tip you can implement immediately to boost your score.' },
  { icon: '🖨️', title: 'Print-Ready Preview', desc: 'Live preview in a clean, ATS-friendly white layout — print to PDF directly from your browser.' },
];

const roles = [
  'Software Engineer', 'Data Scientist', 'Product Manager', 'UX Designer',
  'DevOps Engineer', 'Frontend Developer', 'Backend Developer',
  'Data Engineer', 'ML Engineer', 'Cybersecurity Analyst',
];

export default function ResumePage() {
  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 pb-16">
      <div className="max-w-5xl mx-auto">

        {/* Hero */}
        <div className="text-center py-14 px-4">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-xs font-bold text-blue-400 mb-6">
            ✨ Powered by OpenRouter AI
          </div>
          <h1 className="text-5xl font-black mb-4 leading-tight">
            <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
              ResumeAI
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto mb-8">
            Build, preview, and get a real AI-powered score for your resume — tailored to your target role in seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/resume/builder"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 font-bold text-lg rounded-2xl transition-all shadow-2xl shadow-blue-600/30 hover:scale-105">
              🚀 Launch Resume Builder
            </Link>
            <Link href="/resume/ats-score"
              className="px-8 py-4 border border-slate-700 hover:border-blue-500 font-bold text-lg rounded-2xl transition-all hover:bg-white/5">
              📊 ATS Quick Check
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {features.map(f => (
            <div key={f.title} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/40 transition-colors group">
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform inline-block">{f.icon}</div>
              <h3 className="font-bold text-white mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Supported Roles */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
          <h2 className="font-bold text-white mb-4">🎯 Supported Target Roles</h2>
          <div className="flex flex-wrap gap-2">
            {roles.map(r => (
              <Link key={r} href="/resume/builder"
                className="px-4 py-2 bg-slate-800 hover:bg-blue-600/20 border border-slate-700 hover:border-blue-500/50 rounded-xl text-sm text-slate-300 hover:text-blue-300 transition-all">
                {r}
              </Link>
            ))}
          </div>
        </div>


      </div>
    </div>
  );
}
