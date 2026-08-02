import express from "express";
import { optimizeResume } from "./resume.optimizer";

const router = express.Router();

router.post("/optimize-resume", async (req, res) => {
  const result = await optimizeResume(req.body);
  res.json(result);
});

export default router;
