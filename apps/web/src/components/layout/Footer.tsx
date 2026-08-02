import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-slate-950 border-t border-slate-800/80 text-slate-400 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
            CB
          </div>
          <span className="font-semibold text-slate-200">Career Bridge OS</span>
        </div>
        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} Career Bridge Inc. Powered by Niral AI Copilot. All rights reserved.
        </p>
        <div className="flex gap-6 text-xs text-slate-400">
          <a href="#" className="hover:text-white transition">Privacy Policy</a>
          <a href="#" className="hover:text-white transition">Terms of Service</a>
          <a href="#" className="hover:text-white transition">Security</a>
        </div>
      </div>
    </footer>
  );
};
