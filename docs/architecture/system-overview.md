# Career Bridge Architecture Overview

Career Bridge is a modern monorepo platform designed for real-time career advancement, job matching, ATS resume optimization, 1-on-1 mentorship, and AI-driven skill acquisition.

## Core Microservices & Apps
- `apps/web`: Next.js 14 App Router Web Application
- `apps/mobile`: React Native / Expo Cross-Platform Mobile Application
- `backend/gateway`: Express Node.js Stitch Gateway & WebSocket Hub
- `backend/intelligence`: Python FastAPI ML Recommendation Engine
- `packages/`: Shared UI component system, Zustand state stores, service clients, and utility libraries
