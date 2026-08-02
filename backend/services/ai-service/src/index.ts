import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import aiController from "./ai.controller";
import resumeController from "./resume.controller";

dotenv.config();

const app = express();

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:4000"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
}));

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

// ─── Request logging ─────────────────────────────────────────────────────────
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use("/api/ai", aiController);         // legacy optimizer
app.use("/api/resume", resumeController); // new resume proxy

// ─── Root health check ────────────────────────────────────────────────────────
app.get("/", (_req, res) => {
  res.json({
    service: "CareerBridge AI Service",
    version: "2.0.0",
    status: "running",
    endpoints: {
      "POST /api/resume/analyze": "Full AI resume analysis",
      "POST /api/resume/optimize": "Plain-text resume optimizer (legacy)",
      "GET  /api/resume/roles":   "Supported target roles",
      "GET  /api/resume/health":  "Service health",
      "POST /api/ai/optimize-resume": "Legacy ATS optimizer",
    },
  });
});

// ─── 404 handler ─────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: true, message: "Route not found" });
});

// ─── Global error handler ─────────────────────────────────────────────────────
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("[Global Error]", err);
  res.status(500).json({ error: true, message: "Internal server error" });
});

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 CareerBridge AI Service v2.0 running on http://localhost:${PORT}`);
  console.log(`📄 Resume API: http://localhost:${PORT}/api/resume`);
  console.log(`🤖 AI API:    http://localhost:${PORT}/api/ai\n`);
});
