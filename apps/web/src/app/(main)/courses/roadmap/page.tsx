'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { 
  CheckCircle2, 
  Circle, 
  Lock, 
  Zap, 
  BookOpen, 
  Trophy, 
  ArrowRight, 
  Clock, 
  Target,
  Sparkles,
  PlayCircle,
  FileText
} from 'lucide-react';
import { roadmapService } from '@career-bridge/services';
const { generatePersonalizedRoadmap } = roadmapService;
import { SkillRoadmap, RoadmapNode } from '@career-bridge/types';
import { cn } from '@career-bridge/utils';

export default function RoadmapPage() {
  const [roadmap, setRoadmap] = useState<SkillRoadmap | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    // In a real app, fetch this based on user's recommended role
    const rdm = generatePersonalizedRoadmap("Full Stack Developer");
    setRoadmap(rdm);
  }, []);

  if (!roadmap) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center" ref={containerRef}>
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-hidden pb-24" ref={containerRef}>
      {/* Header Section */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.1),transparent)]" />
        <div className="max-w-4xl mx-auto relative z-10 text-center space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-bold"
          >
            <Sparkles size={16} />
            <span>AI-Powered Learning Path</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tight"
          >
            Your Path to <br />
            <span className="text-gradient">{roadmap.targetRole}</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-xl max-w-2xl mx-auto"
          >
            {roadmap.description}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-8 pt-8"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-blue-400">
                <Clock size={24} />
              </div>
              <div className="text-left">
                <div className="text-xl font-bold">{roadmap.estimatedDuration} Days</div>
                <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">Est. Duration</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-emerald-400">
                <Target size={24} />
              </div>
              <div className="text-left">
                <div className="text-xl font-bold">{roadmap.nodes.length} Milestones</div>
                <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">Learning Phases</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-violet-400">
                <Trophy size={24} />
              </div>
              <div className="text-left">
                <div className="text-xl font-bold">Industry Ready</div>
                <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">Target Outcome</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Roadmap Visualization */}
      <section className="max-w-5xl mx-auto px-6 relative">
        {/* Connection Line */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 bg-slate-800 hidden md:block">
          <motion.div 
            className="absolute top-0 left-0 right-0 bg-gradient-to-b from-blue-600 to-violet-600 origin-top shadow-[0_0_15px_rgba(37,99,235,0.5)]"
            style={{ scaleY }}
          />
        </div>

        <div className="space-y-24 relative z-10">
          {roadmap.nodes.map((node, index) => {
            const isLeft = index % 2 === 0;
            const isCompleted = node.status === 'completed';
            const isInProgress = node.status === 'in_progress';
            const isAvailable = node.status === 'available';
            const isLocked = node.status === 'locked';

            return (
              <motion.div 
                key={node.id}
                initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className={cn(
                  "relative flex flex-col md:flex-row items-center gap-8",
                  isLeft ? "md:flex-row" : "md:flex-row-reverse"
                )}
              >
                {/* Connector Node */}
                <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-12 h-12 z-20 hidden md:block">
                  <div className={cn(
                    "w-full h-full rounded-full border-4 flex items-center justify-center transition-all duration-500",
                    isCompleted ? "bg-emerald-500 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.5)]" :
                    isInProgress ? "bg-blue-600 border-blue-400 animate-pulse shadow-[0_0_20px_rgba(37,99,235,0.5)]" :
                    isAvailable ? "bg-[#020617] border-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.2)]" :
                    "bg-[#020617] border-slate-700"
                  )}>
                    {isCompleted ? <CheckCircle2 size={24} className="text-white" /> :
                     isInProgress ? <Zap size={24} className="text-white" /> :
                     isLocked ? <Lock size={20} className="text-slate-500" /> :
                     <Circle size={20} className="text-blue-500" />}
                  </div>
                </div>

                {/* Content Card */}
                <div className={cn(
                  "w-full md:w-[45%] group",
                  isLeft ? "md:text-right" : "md:text-left"
                )}>
                  <div className={cn(
                    "glass-card p-8 transition-all duration-500 hover:scale-[1.02]",
                    isInProgress ? "border-blue-500/50 bg-blue-500/5" : "hover:border-white/20"
                  )}>
                    <div className={cn(
                      "flex items-center gap-4 mb-4",
                      isLeft ? "md:flex-row-reverse" : "md:flex-row"
                    )}>
                      <div className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Phase {index + 1}
                      </div>
                      <div className={cn(
                        "text-xs font-bold uppercase tracking-tighter",
                        node.level === 'BEGINNER' ? "text-blue-400" :
                        node.level === 'INTERMEDIATE' ? "text-violet-400" :
                        "text-rose-400"
                      )}>
                        {node.level}
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">
                      {node.skill}
                    </h3>

                    <div className={cn(
                      "space-y-4",
                      isLeft ? "md:items-end" : "md:items-start"
                    )}>
                      <div className="flex flex-wrap gap-2">
                        {node.courses?.map(course => (
                          <div key={course} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/50 rounded-lg text-xs text-slate-300 border border-white/5">
                            <PlayCircle size={14} className="text-blue-500" />
                            {course}
                          </div>
                        ))}
                      </div>

                      {node.projects && node.projects.length > 0 && (
                        <div className="pt-2">
                          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Hands-on Project</div>
                          {node.projects.map(project => (
                            <div key={project} className="flex items-center gap-2 text-sm text-slate-200">
                              <FileText size={16} className="text-violet-400" />
                              {project}
                            </div>
                          ))}
                        </div>
                      )}

                      <button className={cn(
                        "mt-6 px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2",
                        isLocked ? "bg-slate-800 text-slate-500 cursor-not-allowed" : 
                        isCompleted ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" :
                        "bg-blue-600 text-white shadow-lg shadow-blue-500/20 hover:scale-105"
                      )}>
                        {isCompleted ? "View Achievement" : isInProgress ? "Continue Learning" : isLocked ? "Locked" : "Start Now"}
                        {!isLocked && <ArrowRight size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Empty space for alignment */}
                <div className="hidden md:block w-[45%]" />
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Footer / CTA */}
      <section className="max-w-4xl mx-auto px-6 pt-32 text-center">
        <div className="glass-card p-12 relative overflow-hidden border-t-4 border-t-violet-600">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Trophy size={160} />
          </div>
          <h2 className="text-4xl font-bold mb-4">You're on your way!</h2>
          <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
            This roadmap is dynamic. As you complete lessons and projects, we'll adjust the difficulty and recommendations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary py-4 px-10">Start First Lesson</button>
            <button className="px-10 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold hover:bg-white/10 transition-all">
              Download PDF Path
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
