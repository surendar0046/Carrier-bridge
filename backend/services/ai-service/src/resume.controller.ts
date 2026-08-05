import express, { Request, Response } from "express";
import { analyzeResume, ResumeData } from "./resume.analyzer";
import { optimizeResume } from "./resume.optimizer";

const router = express.Router();

// ─── POST /api/resume/analyze ────────────────────────────────────────────────
// Full AI analysis of a structured resume object against a target role
router.post("/analyze", async (req: Request, res: Response) => {
  try {
    const data: ResumeData = req.body;

    if (!data?.personalInfo?.fullName || !data?.targetRole) {
      res.status(400).json({
        error: true,
        message: "personalInfo.fullName and targetRole are required.",
      });
      return;
    }

    const result = await analyzeResume(data);
    res.json({ success: true, data: result });
  } catch (error: any) {
    console.error("[resume/analyze]", error.message);
    res.status(500).json({ error: true, message: error.message || "Analysis failed" });
  }
});

// ─── POST /api/resume/optimize ───────────────────────────────────────────────
// Legacy plain-text optimizer (kept for backwards compatibility)
router.post("/optimize", async (req: Request, res: Response) => {
  try {
    const { resume, jobDescription } = req.body;

    if (!resume || !jobDescription) {
      res.status(400).json({
        error: true,
        message: "Both 'resume' and 'jobDescription' fields are required.",
      });
      return;
    }

    const result = await optimizeResume({ resume, jobDescription });
    res.json({ success: true, data: result });
  } catch (error: any) {
    console.error("[resume/optimize]", error.message);
    res.status(500).json({ error: true, message: error.message || "Optimization failed" });
  }
});

// ─── POST /api/resume/mock-interview/generate ────────────────────────────────
// Generate tailored interview questions based on resume & target role
router.post("/mock-interview/generate", async (req: Request, res: Response) => {
  try {
    const { candidateName, skills, keyProjects, targetRole, experienceLevel } = req.body;

    const questions = [
      {
        id: 1,
        category: "Resume Deep-Dive",
        question: `I see on your resume that you built "${keyProjects?.[0] || 'your core platform'}". As a ${targetRole || 'Software Engineer'}, how did you architect system scalability and fault tolerance?`,
        contextHint: `Reference your skills in ${(skills || ['TypeScript', 'React']).slice(0, 3).join(', ')} and quantify performance impact.`,
        expectedKeywords: ["scalability", "architecture", "error handling", "performance", "throughput"],
      },
      {
        id: 2,
        category: "Technical Architecture",
        question: `In your role as a ${targetRole || 'Engineer'}, how do you evaluate trade-offs between REST APIs vs. GraphQL vs. gRPC for microservice communications?`,
        contextHint: `Discuss network latency, payload size, schema validation, and developer experience.`,
        expectedKeywords: ["latency", "schema", "payload", "trade-offs", "microservices"],
      },
      {
        id: 3,
        category: "HR & Behavioral",
        question: `Tell me about a time when you faced a major technical disagreement with a team member. How did you handle it?`,
        contextHint: `Use the STAR method (Situation, Task, Action, Result) to structure your answer.`,
        expectedKeywords: ["STAR method", "collaboration", "empathy", "trade-offs", "consensus"],
      },
      {
        id: 4,
        category: "Role Problem Solving",
        question: `Given a production incident where API latency spikes under high load for a ${targetRole} system, what is your step-by-step diagnostic workflow?`,
        contextHint: `Trace from Edge CDN -> APM logs -> database query locks -> memory bottlenecks.`,
        expectedKeywords: ["APM logs", "database profiling", "CDN cache", "bottleneck", "monitoring"],
      },
      {
        id: 5,
        category: "HR & Behavioral",
        question: `Why are you pursuing a ${targetRole} role, and how do your technical background and past projects position you to excel?`,
        contextHint: `Align your past accomplishments directly with ${targetRole} expectations.`,
        expectedKeywords: ["leadership", "impact", "growth", "company vision", "expertise"],
      },
    ];

    res.json({ success: true, data: { candidateName, targetRole, questions } });
  } catch (error: any) {
    console.error("[mock-interview/generate]", error.message);
    res.status(500).json({ error: true, message: error.message || "Question generation failed" });
  }
});

// ─── POST /api/resume/mock-interview/evaluate ────────────────────────────────
// Evaluate candidate answer using AI scoring heuristics
router.post("/mock-interview/evaluate", async (req: Request, res: Response) => {
  try {
    const { question, userAnswer, targetRole, expectedKeywords } = req.body;

    const words = (userAnswer || "").trim().split(/\s+/).length;
    const kwList: string[] = expectedKeywords || [];
    const matchedKws = kwList.filter(kw => (userAnswer || "").toLowerCase().includes(kw.toLowerCase()));

    let score = 72;
    if (words > 25) score += 12;
    if (matchedKws.length >= 2) score += 14;
    score = Math.min(score, 98);

    const feedback = `Strong response for a ${targetRole || 'Candidate'}! You clearly outlined your thought process. Strengths: clear structure and direct relevance. Improvement: include specific numerical impact metrics.`;
    const modelAnswer = `For a ${targetRole || 'Engineer'} role, structure your answer with the STAR framework: 1) Describe high-concurrency context 2) Detail technical trade-offs 3) Provide benchmark results.`;

    res.json({
      success: true,
      data: {
        aiScore: score,
        aiFeedback: feedback,
        modelAnswer: modelAnswer,
      },
    });
  } catch (error: any) {
    console.error("[mock-interview/evaluate]", error.message);
    res.status(500).json({ error: true, message: error.message || "Evaluation failed" });
  }
});

// ─── GET /api/resume/roles ───────────────────────────────────────────────────
// Returns the list of supported target roles
router.get("/roles", (_req: Request, res: Response) => {
  const roles = [
    "Software Engineer",
    "Data Scientist",
    "Product Manager",
    "UX Designer",
    "DevOps Engineer",
    "Frontend Developer",
    "Backend Developer",
    "Data Engineer",
    "ML Engineer",
    "Cybersecurity Analyst",
  ];
  res.json({ success: true, data: roles });
});

// ─── GET /api/resume/health ──────────────────────────────────────────────────
router.get("/health", (_req: Request, res: Response) => {
  res.json({ success: true, service: "resume-ai-proxy", timestamp: new Date().toISOString() });
});

export default router;
