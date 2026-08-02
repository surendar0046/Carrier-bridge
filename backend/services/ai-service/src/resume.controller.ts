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
