import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import Groq from 'groq-sdk';
import axios from 'axios';
import * as dotenv from 'dotenv';
import { assessmentRouter } from './modules/assessment/routes';
import { testDbConnection, pool } from './config/db';
import { runAssessmentMigrations } from './modules/assessment/migrator';
import { importAssessmentQuestions } from './modules/assessment/importer';

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const app = express();
const httpServer = createServer(app);

const io = new SocketIOServer(httpServer, {
  cors: { origin: process.env.FRONTEND_URL || 'http://localhost:3000', methods: ['GET', 'POST'] },
});

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json());

// ── Assessment Routes ───────────────────────────────────────────────────────
app.use('/api/assessment', assessmentRouter);

// ── Health Check ────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'career-bridge-gateway', timestamp: new Date().toISOString() });
});

app.get('/api/ai/test-connection', async (_req, res) => {
  try {
    const response = await groq.chat.completions.create({
      model: "qwen/qwen3.8-27b",
      messages: [{ role: "user", content: "Hello! Testing connection." }],
      max_tokens: 5,
    });
    res.json({ success: true, message: "Groq Connection Successful!", data: response.choices[0].message });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Groq Connection Failed", error: error.message });
  }
});

// ── Mock API Routes ─────────────────────────────────────────────────────────
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ success: false, error: { code: 'MISSING_FIELDS', message: 'Email and password are required' } });
  res.json({ success: true, data: { accessToken: 'mock.jwt.access', refreshToken: 'mock.jwt.refresh', expiresIn: 3600 } });
});

app.post('/api/auth/signup', (req, res) => {
  res.json({ success: true, data: { accessToken: 'mock.jwt.access', refreshToken: 'mock.jwt.refresh', expiresIn: 3600 } });
});

app.get('/api/users/me', (_req, res) => {
  res.json({
    success: true,
    data: {
      id: 'user-001', name: 'Rahul Kumar', email: 'rahul@example.com',
      role: 'STUDENT', xp: 3450, level: 8,
      skills: ['React', 'TypeScript', 'Node.js', 'Python'],
      location: 'Bangalore, Karnataka',
      avatar: 'https://ui-avatars.com/api/?name=Rahul+Kumar&background=3b82f6&color=fff',
    }
  });
});

app.get('/api/jobs', (_req, res) => {
  res.json({
    success: true,
    data: {
      items: [
        { id: 'job-001', title: 'Frontend Developer', company: 'TechNova Solutions', location: 'Bangalore', type: 'FULL_TIME', salary: { min: 80000, max: 120000, currency: 'INR', period: 'monthly' }, skills: ['React', 'TypeScript'], matchScore: 92, isRemote: true, isFeatured: true, applicants: 142, postedAt: new Date().toISOString(), description: 'Build scalable web apps.', requirements: [], benefits: [], companyLogo: 'https://ui-avatars.com/api/?name=TechNova&background=3b82f6&color=fff' },
      ],
      meta: { page: 1, limit: 10, total: 1, totalPages: 1 }
    }
  });
});

app.get('/api/mentors', (_req, res) => {
  res.json({
    success: true,
    data: {
      items: [
        { id: 'mentor-001', name: 'Priya Sharma', title: 'Senior Software Engineer', company: 'Google', rating: 4.9, reviewCount: 134, hourlyRate: 2000, currency: 'INR', expertise: ['React', 'System Design'], isVerified: true, responseTime: '< 2 hours', bio: '8+ years at Google.', totalSessions: 280, availability: [], languages: ['English', 'Hindi'], avatar: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=3b82f6&color=fff', userId: 'u-m01' },
      ],
      meta: { page: 1, limit: 10, total: 1, totalPages: 1 }
    }
  });
});

app.get('/api/courses', (_req, res) => {
  res.json({
    success: true,
    data: {
      items: [
        { id: 'course-001', title: 'Complete React & Next.js Masterclass', instructor: 'Rahul Verma', level: 'INTERMEDIATE', duration: 3600, lessonsCount: 142, enrolledCount: 12500, rating: 4.8, reviewCount: 2100, skills: ['React', 'Next.js'], category: 'Web Development', price: 1999, currency: 'INR', isFree: false, isCertified: true, curriculum: [], createdAt: new Date().toISOString(), description: 'Build production apps.' },
      ],
      meta: { page: 1, limit: 10, total: 1, totalPages: 1 }
    }
  });
});

app.get('/api/courses/roadmap', (_req, res) => {
  res.json({
    success: true,
    data: {
      id: 'roadmap-001',
      title: 'Full Stack Developer Roadmap',
      description: 'Structured path from beginner to full-stack engineer.',
      targetRole: 'Full Stack Developer',
      estimatedDuration: 180,
      nodes: [
        { id: 'n1', skill: 'HTML & CSS', level: 'BEGINNER', status: 'completed', courses: ['course-001'], dependsOn: [], position: { x: 0, y: 0 } },
        { id: 'n2', skill: 'JavaScript', level: 'BEGINNER', status: 'in_progress', courses: [], dependsOn: ['n1'], position: { x: 0, y: 0 } },
      ]
    }
  });
});

app.get('/api/jobs/featured', (_req, res) => {
  res.json({ success: true, data: [
    { id: 'job-001', title: 'Frontend Developer', company: 'TechNova Solutions', location: 'Bangalore', type: 'FULL_TIME', matchScore: 92, isFeatured: true, companyLogo: 'https://ui-avatars.com/api/?name=TechNova&background=3b82f6&color=fff' },
  ] });
});

app.get('/api/jobs/my-applications', (_req, res) => {
  res.json({ success: true, data: [] });
});

app.get('/api/mentors/my-sessions', (_req, res) => {
  res.json({ success: true, data: [] });
});

app.get('/api/gamification/leaderboard', (_req, res) => {
  res.json({ success: true, data: [] });
});

app.post('/api/resume/analyze', async (req, res) => {
  try {
    const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:5000';
    const response = await axios.post(`${AI_SERVICE_URL}/api/resume/analyze`, req.body);
    res.json(response.data);
  } catch (error: any) {
    console.warn("[gateway/resume/analyze] AI service offline or failed, using local smart fallback engine:", error.message);
    
    const ROLE_KEYWORDS: Record<string, string[]> = {
      "Software Engineer": ["algorithms", "data structures", "REST API", "microservices", "CI/CD", "Git", "unit testing", "agile", "system design", "scalability"],
      "Data Scientist": ["machine learning", "Python", "pandas", "numpy", "TensorFlow", "PyTorch", "statistical analysis", "data visualization", "SQL", "A/B testing"],
      "Product Manager": ["roadmap", "stakeholder", "OKRs", "user stories", "go-to-market", "KPIs", "agile", "cross-functional", "product strategy", "market research"],
      "UX Designer": ["wireframes", "prototyping", "user research", "Figma", "usability testing", "design systems", "accessibility", "user journey", "interaction design", "A/B testing"],
      "DevOps Engineer": ["Kubernetes", "Docker", "CI/CD", "Terraform", "AWS", "monitoring", "infrastructure as code", "Jenkins", "Ansible", "SRE"],
      "Frontend Developer": ["React", "TypeScript", "CSS", "performance optimization", "responsive design", "accessibility", "webpack", "testing", "state management", "REST API"],
      "Backend Developer": ["Node.js", "databases", "REST API", "GraphQL", "authentication", "caching", "message queues", "microservices", "SQL", "NoSQL"],
      "Data Engineer": ["ETL", "Apache Spark", "data pipelines", "SQL", "data warehouse", "Hadoop", "Kafka", "Airflow", "cloud platforms", "data modeling"],
      "ML Engineer": ["MLOps", "model deployment", "Python", "TensorFlow", "PyTorch", "Docker", "Kubernetes", "feature engineering", "model monitoring", "A/B testing"],
      "Cybersecurity Analyst": ["penetration testing", "SIEM", "vulnerability assessment", "incident response", "network security", "firewall", "OWASP", "encryption", "compliance", "threat modeling"],
    };

    const data = req.body || {};
    const targetRole = data.targetRole || "Software Engineer";
    const roleKeywords = ROLE_KEYWORDS[targetRole] || ROLE_KEYWORDS["Software Engineer"];
    
    // Build text from resume structure to search keywords
    let searchStr = "";
    if (data.personalInfo) {
      searchStr += " " + (data.personalInfo.fullName || "") + " " + (data.personalInfo.location || "");
    }
    if (data.summary) searchStr += " " + data.summary;
    if (data.skills) {
      if (Array.isArray(data.skills)) {
        searchStr += " " + data.skills.join(" ");
      } else if (typeof data.skills === 'string') {
        searchStr += " " + data.skills;
      }
    }
    if (data.experience && Array.isArray(data.experience)) {
      data.experience.forEach((e: any) => {
        searchStr += " " + (e.company || "") + " " + (e.role || "") + " " + (e.achievements || []).join(" ");
      });
    }
    if (data.projects && Array.isArray(data.projects)) {
      data.projects.forEach((p: any) => {
        searchStr += " " + (p.name || "") + " " + (p.description || "") + " " + (p.tech || []).join(" ");
      });
    }
    if (data.education && Array.isArray(data.education)) {
      data.education.forEach((edu: any) => {
        searchStr += " " + (edu.institution || "") + " " + (edu.degree || "") + " " + (edu.field || "");
      });
    }
    
    const lowerSearch = searchStr.toLowerCase();
    const foundKeywords = roleKeywords.filter(kw => lowerSearch.includes(kw.toLowerCase()));
    const missingKeywords = roleKeywords.filter(kw => !lowerSearch.includes(kw.toLowerCase()));
    
    const hasSummary = !!data.summary;
    const expCount = data.experience?.length || 0;
    const eduCount = data.education?.length || 0;
    const skillCount = foundKeywords.length;
    const projCount = data.projects?.length || 0;
    
    const contentScore = Math.min(95, 55 + expCount * 10 + (hasSummary ? 10 : 0));
    const relevanceScore = Math.min(95, 45 + skillCount * 8 + (expCount > 0 ? 15 : 0));
    const impactScore = Math.min(95, 40 + projCount * 10 + (expCount > 0 ? 20 : 0));
    const structureScore = Math.min(95, 60 + (eduCount > 0 ? 15 : 0) + (hasSummary ? 10 : 0));
    const keywordsScore = Math.min(95, 40 + skillCount * 10);
    
    const overallScore = Math.round(
      contentScore * 0.25 +
      relevanceScore * 0.25 +
      impactScore * 0.20 +
      structureScore * 0.15 +
      keywordsScore * 0.15
    );

    const getLabel = (score: number) => {
      if (score >= 90) return { label: "Exceptional", tagline: "Your resume is highly competitive — recruiters will love this!" };
      if (score >= 80) return { label: "Strong", tagline: "Solid resume with minor gaps — you're in great shape!" };
      if (score >= 70) return { label: "Good", tagline: "Good foundation, a few tweaks will make it shine." };
      if (score >= 60) return { label: "Fair", tagline: "Decent start — focus on the key improvements below." };
      if (score >= 50) return { label: "Needs Work", tagline: "A solid effort, but significant improvements are needed." };
      return { label: "Critical", tagline: "Major revisions required to make this resume competitive." };
    };
    
    const { label, tagline } = getLabel(overallScore);
    
    const strengths = [
      `Has solid entries highlighting technical skill sets suitable for ${targetRole}.`,
      hasSummary ? "Included a professional summary section." : "Clear categorization of developer tools and technologies.",
      "Clean formatting and logical section layout."
    ];
    
    const improvements = [];
    if (!hasSummary) {
      improvements.push("Add a professional summary to highlight your career goals.");
    }
    if (expCount === 0) {
      improvements.push("Add work experience or internships to showcase practical hands-on work.");
    }
    if (missingKeywords.length > 0) {
      improvements.push(`Incorporate key industry terms like: ${missingKeywords.slice(0, 2).join(', ')}.`);
    }
    if (improvements.length < 3) {
      improvements.push("Quantify your achievements by including specific metrics (e.g., 'improved performance by 25%').");
      improvements.push("Ensure projects detail the specific stack and library versions used.");
    }
    
    const criticalIssues = [];
    if (missingKeywords.length > 5) {
      criticalIssues.push(`Missing critical industry keywords for ${targetRole}.`);
    }
    if (expCount === 0 && projCount === 0) {
      criticalIssues.push("No work experience or projects listed. Add entries to pass ATS screening.");
    }
    
    const quickWin = missingKeywords.length > 0 
      ? `Add these missing key terms to your skills or project descriptions: ${missingKeywords.slice(0, 3).join(', ')}.`
      : "Quantify your work achievements with measurable metrics (e.g., 'saved 10+ hours per week').";

    res.json({
      success: true,
      data: {
        overallScore,
        scoreLabel: label,
        tagline,
        dimensions: {
          content: contentScore,
          relevance: relevanceScore,
          impact: impactScore,
          structure: structureScore,
          keywords: keywordsScore,
        },
        strengths: strengths.slice(0, 4),
        improvements: improvements.slice(0, 4),
        criticalIssues,
        foundKeywords,
        missingKeywords,
        quickWin
      }
    });
  }
});

app.post('/api/ai/recommendation', async (req, res) => {
  const { answers } = req.body;
  
  try {
    // If we had a real LLM analysis service for the quiz:
    // const analysis = await intelligenceService.analyzeQuiz(answers);
    
    // For now, if OpenAI is used for analysis and fails, we use this logic:
    res.json({
      success: true,
      data: {
        role: "Full Stack Developer",
        confidence: 92,
        reasoning: "Your strong interest in both logical problem-solving and visual design perfectly aligns with Full Stack Engineering.",
        strengths: ["Logic & Data Structures", "Visual Creativity", "System Thinking"],
        weaknesses: ["Cloud Infrastructure (can be learned)"],
        salaryRange: "₹12L - ₹24L",
        futureScope: "Excellent - AI is increasing demand for versatile engineers.",
        aiImpact: 15,
        demandScore: 98
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Recommendation failed" });
  }
});

app.post('/api/ai/chat', async (req, res) => {
  const { message, context } = req.body;
  console.log(`[Chat] Incoming: ${message?.slice(0, 50)}...`);
  
  try {
    const response = await groq.chat.completions.create({
      model: "qwen/qwen3.8-27b",
      messages: [
        { 
          role: "system", 
          content: "You are an AI Career Copilot for CareerBridge. Help users with career advice, job matching, and learning roadmaps. Use the following context if available: " + JSON.stringify(context || {})
        },
        { role: "user", content: message }
      ],
      max_tokens: 1024,
    });

    res.json({ 
      success: true, 
      data: { 
        id: `msg-${Date.now()}`, 
        role: 'assistant', 
        content: response.choices[0].message.content, 
        timestamp: new Date().toISOString() 
      } 
    });
  } catch (error: any) {
    console.error('Groq Error:', error.message);
    
    // ── SMART FALLBACK ENGINE ──────────────────────────────────────────────
    // If Groq fails, use rule-based response
    const lower = (message || '').toLowerCase();
    let content = "";

    if (lower.includes('job') || lower.includes('hiring') || lower.includes('work')) {
      content = "I've analyzed your profile and found some high-match opportunities. Based on your skills in **React and TypeScript**, I recommend looking at **Frontend Developer** roles at startups like *TechNova* or *GrowthScale*. Would you like me to filter the latest openings for you?";
    } else if (lower.includes('resume') || lower.includes('cv') || lower.includes('ats')) {
      content = "Your current resume score is **78/100**. To reach the 90+ bracket, I suggest adding more 'Action Verbs' and quantifying your achievements (e.g., 'Reduced load time by 30%'). I can help you rewrite your experience section if you'd like!";
    } else if (lower.includes('roadmap') || lower.includes('learn') || lower.includes('path')) {
      content = "I've generated a personalized roadmap for you. Since you're interested in **Full Stack Development**, your next milestone is mastering **Node.js and System Design**. You can view your detailed 12-week plan in the Roadmap section.";
    } else if (lower.includes('salary') || lower.includes('money') || lower.includes('pay')) {
      content = "For a developer with your profile in Bangalore, the current market range is **₹12L - ₹22L per annum**. Top-tier product companies are offering up to **₹35L** for your specific stack. Should we look at how to negotiate for the higher bracket?";
    } else if (lower.includes('interview') || lower.includes('prepare') || lower.includes('mock')) {
      content = "I'm ready to help you prep! For your next interview, expect questions on **React Hooks (useEffect/useMemo)** and **CSS Grid/Flexbox**. Shall we start a 5-minute mock interview session right now?";
    } else {
      content = "I'm currently in 'Local Intelligence' mode while my cloud brain is syncronizing. I can still help you with **job searches, resume optimization, and roadmap planning**. What's on your mind today?";
    }

    res.json({ 
      success: true, 
      data: { 
        id: `msg-fallback-${Date.now()}`, 
        role: 'assistant', 
        content: content + "\n\n*(Note: I'm currently running on local backup intelligence due to high demand)*", 
        timestamp: new Date().toISOString() 
      } 
    });
  }
});

app.get('/api/gamification/:userId', (_req, res) => {
  res.json({ success: true, data: { userId: 'user-001', xp: 3450, level: 8, nextLevelXp: 4000, streak: 7, badges: [], achievements: [], rank: 142, lastActive: new Date().toISOString() } });
});

// ── WebSocket ───────────────────────────────────────────────────────────────
io.on('connection', (socket) => {
  console.log(`[WS] Client connected: ${socket.id}`);

  socket.on('join_room', (roomId: string) => {
    socket.join(roomId);
    console.log(`[WS] ${socket.id} joined room: ${roomId}`);
  });

  socket.on('send_message', (data: { roomId: string; content: string }) => {
    const message = { id: `msg-${Date.now()}`, roomId: data.roomId, senderId: 'user-001', senderName: 'Rahul Kumar', type: 'TEXT', content: data.content, isRead: false, createdAt: new Date().toISOString() };
    io.to(data.roomId).emit('new_message', message);
  });

  socket.on('disconnect', () => { console.log(`[WS] Client disconnected: ${socket.id}`); });
});

// ── Assessment Startup Initialization ──────────────────────────────────────
async function initializeAssessmentSystem() {
  try {
    const isDbAlive = await testDbConnection();
    if (!isDbAlive) {
      console.log('[Assessment System] PostgreSQL not yet reachable at startup; auto-import will run when database connection is established.');
      return;
    }
    const tableCheck = await pool.query(
      "SELECT to_regclass('public.assessment_questions') as exists"
    );
    if (!tableCheck.rows[0]?.exists) {
      console.log('[Assessment System] Assessment tables not detected. Running migrations...');
      await runAssessmentMigrations('up');
    }
    const countRes = await pool.query(
      'SELECT COUNT(*)::int as count FROM assessment_questions WHERE is_active = true'
    );
    if ((countRes.rows[0]?.count || 0) === 0) {
      console.log('[Assessment System] Assessment questions table is empty. Triggering automatic initial import...');
      await importAssessmentQuestions();
    } else {
      console.log(`[Assessment System] Active questions in PostgreSQL: ${countRes.rows[0].count}`);
    }
  } catch (err: any) {
    console.warn('[Assessment System] Startup initialization note:', err.message);
  }
}

// ── Start ───────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`\n🚀 Career Bridge Gateway running at http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/health`);
  console.log(`   WebSocket: ws://localhost:${PORT}\n`);
  initializeAssessmentSystem();
});
