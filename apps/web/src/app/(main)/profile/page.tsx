'use client';
import { useEffect, useState } from 'react';
import { useUserStore, useGamificationStore } from '@career-bridge/store';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  MapPin, 
  Mail, 
  Briefcase, 
  GraduationCap, 
  Award, 
  ChevronRight, 
  Save, 
  Edit3, 
  X,
  Plus,
  Trash2
} from 'lucide-react';
import { cn } from '@career-bridge/utils';

export default function ProfilePage() {
  const { profile, fetchProfile, updateProfile, isLoading, error } = useUserStore();
  const { profile: gam, fetchProfile: fetchGam } = useGamificationStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const [timedOut, setTimedOut] = useState(false);
  const router = useRouter();

  useEffect(() => { 
    fetchProfile(); 
    fetchGam(); 
    // 2.5s safety timeout latch so the user is never trapped in an infinite spinner
    const timer = setTimeout(() => setTimedOut(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  // Instant profile render: use cached profile if available or resilient member placeholder
  const effectiveProfile = profile || {
    id: 'cached-user',
    name: 'Career Bridge Member',
    email: 'member@careerbridge.com',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    bio: '',
    location: '',
    skills: ['Problem Solving', 'JavaScript', 'Communication'],
    experience: [],
    education: [],
    certifications: []
  };

  const user = effectiveProfile;

  useEffect(() => {
    if (profile && !isEditing) {
      setFormData({
        name: profile.name,
        role: profile.role || 'student',
        bio: profile.bio || '',
        location: profile.location || '',
        skills: profile.skills || [],
        experience: profile.experience || [],
        education: profile.education || [],
        certifications: profile.certifications || []
      });
    } else if (user && !formData) {
      setFormData({
        name: user.name,
        role: user.role || 'student',
        bio: user.bio || '',
        location: user.location || '',
        skills: user.skills || [],
        experience: user.experience || [],
        education: user.education || [],
        certifications: user.certifications || []
      });
    }
  }, [profile, isEditing]);

  const handleSave = async () => {
    try {
      if (formData?.role && typeof window !== 'undefined') {
        const emailLower = (profile?.email || user.email || '').toLowerCase().trim();
        localStorage.setItem(`cb_role_${emailLower}`, formData.role);
        localStorage.setItem('cb_active_mode', formData.role);
      }
      await updateProfile(formData);
      setIsEditing(false);
      // Navigate to respective dashboard
      const isPro = String(formData?.role || '').toLowerCase() === 'professional';
      router.push(isPro ? '/professional' : '/dashboard');
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  if (!user) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 pb-20">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Offline / Delayed Sync Notice Banner */}
        {!profile && (
          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-300 px-5 py-3.5 rounded-2xl flex items-center justify-between text-sm shadow-lg">
            <div className="flex items-center gap-3">
              <span className="text-base">⚠️</span>
              <span className="font-medium">Offline profile preview. Changes will automatically sync once connected.</span>
            </div>
            <button 
              onClick={() => { setTimedOut(false); fetchProfile(); }}
              className="px-3.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs font-bold rounded-xl transition-colors shrink-0 ml-4"
            >
              ↻ Retry Sync
            </button>
          </div>
        )}

        {/* Header & Mode Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight">Profile</h1>
            <p className="text-slate-500 text-sm font-medium">Manage your professional identity</p>
          </div>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-2xl font-bold transition-all",
              isEditing ? "bg-slate-800 text-slate-300 hover:bg-slate-700" : "bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:scale-105"
            )}
          >
            {isEditing ? <><X size={18} /> Cancel</> : <><Edit3 size={18} /> Edit Profile</>}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Avatar & Basic Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass-card p-8 flex flex-col items-center text-center">
              <div className="relative group mb-6">
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-32 h-32 rounded-[2.5rem] object-cover border-4 border-white/5 shadow-2xl" 
                />
                <button className="absolute inset-0 bg-black/40 rounded-[2.5rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="text-white" size={24} />
                </button>
              </div>
              
              {!isEditing ? (
                <>
                  <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
                  <p className="text-blue-400 font-bold text-sm uppercase tracking-widest mb-4">{user.role}</p>
                  <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                    {user.bio || "No bio added yet. Tell us about yourself!"}
                  </p>
                  
                  <div className="w-full space-y-3 pt-6 border-t border-white/5">
                    <div className="flex items-center gap-3 text-slate-400 text-sm font-medium">
                      <MapPin size={16} className="text-slate-600" />
                      {user.location || "Location not set"}
                    </div>
                    <div className="flex items-center gap-3 text-slate-400 text-sm font-medium">
                      <Mail size={16} className="text-slate-600" />
                      {user.email}
                    </div>
                  </div>
                </>
              ) : (
                <div className="w-full space-y-4">
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Full Name</label>
                    <input 
                      className="w-full glass px-4 py-3 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Bio</label>
                    <textarea 
                      className="w-full glass px-4 py-3 rounded-xl focus:outline-none focus:border-blue-500 transition-colors h-24 resize-none"
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Location</label>
                    <input 
                      className="w-full glass px-4 py-3 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5 text-left pt-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Account Role / Mode</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, role: 'student' })}
                        className={cn(
                          "py-2.5 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5",
                          (formData.role || user.role) === 'student'
                            ? "bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/30"
                            : "glass text-slate-400 border-white/5 hover:border-white/20"
                        )}
                      >
                        <span>🎓</span> Student
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, role: 'professional' })}
                        className={cn(
                          "py-2.5 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5",
                          (formData.role || user.role) === 'professional'
                            ? "bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30"
                            : "glass text-slate-400 border-white/5 hover:border-white/20"
                        )}
                      >
                        <span>💼</span> Professional
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Gamification Stats (Read Only) */}
            {gam && (
              <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2rem] p-8 shadow-xl shadow-indigo-500/20">
                <div className="flex justify-between items-center mb-6">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl backdrop-blur-md">🔥</div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-indigo-100 uppercase tracking-widest">Level</div>
                    <div className="text-2xl font-black">{gam.level}</div>
                  </div>
                </div>
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-xs font-bold">
                    <span>{gam.xp.toLocaleString()} XP</span>
                    <span>{gam.nextLevelXp.toLocaleString()} XP</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                    <div className="bg-white h-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" style={{ width: `${(gam.xp / gam.nextLevelXp) * 100}%` }} />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-indigo-100 font-bold text-sm">
                  <ChevronRight size={16} />
                  <span>{gam.streak} day streak</span>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Detailed Sections */}
          <div className="lg:col-span-2 space-y-6">
            
            <AnimatePresence mode="wait">
              {isEditing ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Skills Edit */}
                  <div className="glass-card p-8">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <Plus size={20} className="text-blue-400" />
                      Skills
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {formData?.skills?.map((skill: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl group">
                          {skill}
                          <button 
                            onClick={() => setFormData({...formData, skills: formData.skills.filter((_: any, i: number) => i !== idx)})}
                            className="hover:text-rose-400 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <form onSubmit={(e: any) => {
                      e.preventDefault();
                      const val = e.target.skill.value.trim();
                      if (val) {
                        setFormData({...formData, skills: [...formData.skills, val]});
                        e.target.reset();
                      }
                    }} className="flex gap-2">
                      <input name="skill" placeholder="Add a skill (e.g. React)" className="flex-1 glass px-4 py-2.5 rounded-xl text-sm focus:outline-none border-transparent focus:border-blue-500 transition-all" />
                      <button className="bg-blue-600 px-4 rounded-xl font-bold">Add</button>
                    </form>
                  </div>

                  {/* Education Edit */}
                  <div className="glass-card p-8">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold flex items-center gap-2">
                        <GraduationCap size={20} className="text-indigo-400" />
                        Education
                      </h3>
                      <button 
                        onClick={() => setFormData({
                          ...formData, 
                          education: [...formData.education, { id: Date.now().toString(), institution: '', degree: '', field: '', startYear: '', endYear: '' }]
                        })}
                        className="text-xs font-bold text-blue-400 flex items-center gap-1 hover:text-blue-300"
                      >
                        <Plus size={14} /> Add Entry
                      </button>
                    </div>
                    <div className="space-y-6">
                      {formData?.education?.map((edu: any, idx: number) => (
                        <div key={edu.id} className="p-6 rounded-2xl bg-white/5 border border-white/5 relative group">
                          <button 
                            onClick={() => setFormData({...formData, education: formData.education.filter((_: any, i: number) => i !== idx)})}
                            className="absolute top-4 right-4 text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2 space-y-1">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Institution</label>
                              <input 
                                className="w-full bg-slate-900 px-4 py-2.5 rounded-xl focus:outline-none"
                                value={edu.institution}
                                onChange={(e) => {
                                  const newEdu = [...formData.education];
                                  newEdu[idx].institution = e.target.value;
                                  setFormData({...formData, education: newEdu});
                                }}
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Degree</label>
                              <input 
                                className="w-full bg-slate-900 px-4 py-2.5 rounded-xl focus:outline-none"
                                value={edu.degree}
                                onChange={(e) => {
                                  const newEdu = [...formData.education];
                                  newEdu[idx].degree = e.target.value;
                                  setFormData({...formData, education: newEdu});
                                }}
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Field</label>
                              <input 
                                className="w-full bg-slate-900 px-4 py-2.5 rounded-xl focus:outline-none"
                                value={edu.field}
                                onChange={(e) => {
                                  const newEdu = [...formData.education];
                                  newEdu[idx].field = e.target.value;
                                  setFormData({...formData, education: newEdu});
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Experience Edit */}
                  <div className="glass-card p-8">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold flex items-center gap-2">
                        <Briefcase size={20} className="text-emerald-400" />
                        Experience
                      </h3>
                      <button 
                        onClick={() => setFormData({
                          ...formData, 
                          experience: [...formData.experience, { id: Date.now().toString(), company: '', role: '', startDate: '', endDate: '', description: '' }]
                        })}
                        className="text-xs font-bold text-blue-400 flex items-center gap-1 hover:text-blue-300"
                      >
                        <Plus size={14} /> Add Entry
                      </button>
                    </div>
                    <div className="space-y-6">
                      {formData?.experience?.map((exp: any, idx: number) => (
                        <div key={exp.id} className="p-6 rounded-2xl bg-white/5 border border-white/5 relative group">
                          <button 
                            onClick={() => setFormData({...formData, experience: formData.experience.filter((_: any, i: number) => i !== idx)})}
                            className="absolute top-4 right-4 text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Role</label>
                              <input 
                                className="w-full bg-slate-900 px-4 py-2.5 rounded-xl focus:outline-none"
                                value={exp.role}
                                onChange={(e) => {
                                  const newExp = [...formData.experience];
                                  newExp[idx].role = e.target.value;
                                  setFormData({...formData, experience: newExp});
                                }}
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Company</label>
                              <input 
                                className="w-full bg-slate-900 px-4 py-2.5 rounded-xl focus:outline-none"
                                value={exp.company}
                                onChange={(e) => {
                                  const newExp = [...formData.experience];
                                  newExp[idx].company = e.target.value;
                                  setFormData({...formData, experience: newExp});
                                }}
                              />
                            </div>
                            <div className="col-span-2 space-y-1">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Description</label>
                              <textarea 
                                className="w-full bg-slate-900 px-4 py-2.5 rounded-xl focus:outline-none h-20 resize-none"
                                value={exp.description}
                                onChange={(e) => {
                                  const newExp = [...formData.experience];
                                  newExp[idx].description = e.target.value;
                                  setFormData({...formData, experience: newExp});
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Save Button */}
                  <button 
                    onClick={handleSave}
                    disabled={isLoading}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-violet-600 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-blue-600/20"
                  >
                    {isLoading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={20} />}
                    Save Profile & Continue
                  </button>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Skills View */}
                  <div className="glass-card p-8">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <Award size={20} className="text-blue-400" />
                      Skills
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {user.skills?.map((skill) => (
                        <span key={skill} className="px-4 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-2xl font-bold text-sm">
                          {skill}
                        </span>
                      ))}
                      {!user.skills?.length && <p className="text-slate-500">No skills added yet.</p>}
                    </div>
                  </div>

                  {/* Education View */}
                  <div className="glass-card p-8">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <GraduationCap size={20} className="text-indigo-400" />
                      Education
                    </h3>
                    <div className="space-y-8">
                      {user.education?.map((edu) => (
                        <div key={edu.id} className="flex gap-6 relative">
                          <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-2xl border border-indigo-500/20 shrink-0">🎓</div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-lg font-bold truncate">{edu.institution}</h4>
                            <p className="text-slate-400 font-medium">{edu.degree} · {edu.field}</p>
                            <p className="text-slate-500 text-sm mt-1">{edu.startYear} – {edu.endYear || 'Present'}</p>
                          </div>
                        </div>
                      ))}
                      {!user.education?.length && <p className="text-slate-500">No education entries added yet.</p>}
                    </div>
                  </div>

                  {/* Experience View */}
                  <div className="glass-card p-8">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <Briefcase size={20} className="text-emerald-400" />
                      Experience
                    </h3>
                    <div className="space-y-8">
                      {user.experience?.map((exp) => (
                        <div key={exp.id} className="flex gap-6 relative">
                          <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-2xl border border-emerald-500/20 shrink-0">💼</div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-lg font-bold truncate">{exp.role}</h4>
                            <p className="text-slate-400 font-medium">{exp.company}</p>
                            <p className="text-slate-500 text-sm mt-1">{exp.startDate} – {exp.endDate || 'Present'}</p>
                            {exp.description && <p className="text-slate-400 text-sm mt-3 leading-relaxed">{exp.description}</p>}
                          </div>
                        </div>
                      ))}
                      {!user.experience?.length && <p className="text-slate-500">No experience entries added yet.</p>}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
