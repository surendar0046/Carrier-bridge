import express from 'express';

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'career-bridge-orchestration', timestamp: new Date().toISOString() });
});

// Service registry
const services: Record<string, { url: string; healthy: boolean; lastCheck: string }> = {
  gateway: { url: 'http://localhost:4000', healthy: true, lastCheck: new Date().toISOString() },
};

app.get('/services', (_req, res) => res.json(services));

const PORT = process.env['PORT'] || 4001;
app.listen(PORT, () => console.log(`Orchestration service running on port ${PORT}`));
