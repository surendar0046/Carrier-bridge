# 🌉 Career Bridge - AI-Powered Career Operating System

Career Bridge is an enterprise-grade monorepo platform connecting job seekers with intelligent job matching, live 1-on-1 mentorship, ATS resume optimization, dynamic skill roadmaps, and an interactive AI copilot.

## 🚀 Quick Start
```bash
# Install dependencies across all monorepo workspaces
pnpm install

# Start Next.js web app & API Gateway
pnpm run dev
```

## 🏗️ Architecture Stack
- **Frontend**: Next.js 14, React Native (Expo), Tailwind CSS, Lucide Icons
- **Backend**: Express Node.js Gateway, Python FastAPI ML Intelligence
- **Database & Cache**: PostgreSQL (with transactional SQL migrations), Redis (caching)
- **State & Services**: Zustand, React Query, WebSockets, RxJS
- **Infrastructure**: Docker Compose, Terraform, Kubernetes

---

## 🎯 Assessment & Career Recommendation System

The assessment system automatically ingests question datasets, serves them from PostgreSQL (cached in Redis), records student attempts and answers securely, evaluates multi-dimensional fit deterministically, and provides career track recommendations with skill gaps.

### 📁 Dataset File Format (`/data/assessment_questions.json`)
Questions are stored in `/data/assessment_questions.json` and validated with strict **Zod schemas**:
```json
[
  {
    "id": "q_eng_tech_001",
    "audience": "engineering",             // "12th" | "engineering"
    "section": "technical",                // "interest" | "aptitude" | "scenario" | "skill" | "technical"
    "question": "What is the average time complexity of searching a balanced BST?",
    "options": [
      { "key": "A", "text": "O(1)" },
      { "key": "B", "text": "O(log n)" },
      { "key": "C", "text": "O(n)" },
      { "key": "D", "text": "O(n log n)" }
    ],
    "correct_answer": "B",                 // Required for "aptitude" and "technical"
    "difficulty": "medium",               // "easy" | "medium" | "hard"
    "explanation": "A balanced BST maintains height O(log n).",
    "domain_weights": {
      "A": {},
      "B": { "software_development": 3, "data_science": 2 },
      "C": {},
      "D": {}
    }
  }
]
```

### ⌨️ CLI Commands
| Command | Description |
| :--- | :--- |
| `pnpm db:import:assessment --dry-run` | Validates dataset rows with Zod without writing to PostgreSQL |
| `pnpm db:import:assessment` | Idempotent UPSERT into PostgreSQL, soft-deactivates removed questions, invalidates Redis cache |
| `pnpm db:verify:assessment` | Runs database integrity checks (row counts, foreign keys, weight coverage, 0-100 score bounds) |
| `pnpm test:assessment` | Runs pure scoring unit tests and full end-to-end simulation tests via Vitest |

### ➕ How to Add or Modify Questions
1. Open [`data/assessment_questions.json`](file:///d:/Niral-Final/career-bridge/data/assessment_questions.json).
2. Add your new question object with a unique alphanumeric `id` or modify existing question text/weights (0 to 3).
3. Validate locally:
   ```bash
   pnpm db:import:assessment --dry-run
   ```
4. Import into PostgreSQL:
   ```bash
   pnpm db:import:assessment
   ```
   *Note: If questions are removed from the JSON file, they are automatically soft-deactivated (`is_active = false`), preserving old student attempt history.*

### 🔌 API Endpoints
- **`GET /api/assessment/questions?audience=engineering`**: Public/Cached questions list (strips `correct_answer` for security).
- **`POST /api/assessment/attempts`**: Starts a new assessment attempt session for the authenticated student.
- **`POST /api/assessment/attempts/:id/responses`**: Records answers (single or batch) with ownership check.
- **`POST /api/assessment/attempts/:id/complete`**: Evaluates deterministic scores, returns top 3 career tracks and skill gaps.
- **`GET /api/assessment/results/me`**: Returns the student's latest recommendation and history.

---

## 🧭 3-Stage Post-Login Onboarding System

Every verified-email student lands on a tailored onboarding flow splitting them into three targeted journeys before entering the dashboard with their customized roadmaps and courses.

### 📊 System Architecture & Flowchart

```mermaid
flowchart TD
    A[Student Verified Login] --> B{Completed Onboarding?}
    B -- No --> C[/onboarding: Stage Picker]
    B -- Yes --> D[/dashboard: Personalized Hub]
    
    C --> E[12th Standard]
    C --> F[1st & 2nd Year College]
    C --> G[3rd & 4th Year College]
    
    E --> E1[Screen 2: /onboarding/school<br/>7 Discovery Questions + Under-18 Consent]
    F --> F1[Screen 3: /onboarding/early<br/>6 Domain Fixing Questions]
    G --> G1[Screen 4: /onboarding/final<br/>8 Backwards Placement Questions]
    
    E1 --> H[Pure Recommendation Engine<br/>packages/ai/onboardingEngine.ts]
    F1 --> H
    G1 --> H
    
    H --> I[Reliability Signals Check<br/>Speed, Uniformity & Contradiction]
    I -- Failed --> J[Review Answers Prompt]
    I -- Passed --> K[Database Persistence<br/>onboarding_responses & onboarding_results]
    
    K --> D
    D --> L[Suggested For You Card<br/>With Reasons & Edit Answers Link]
    D --> M[Curated Courses Loaded<br/>Python, Web, Java, Cloud]
    D --> N[Optional: Verify Your Fit<br/>Skill Assessment Link]
```

### 📚 Data-Driven Question Banks
Questions are defined in [`apps/web/src/data/onboardingQuestions.ts`](file:///d:/Niral-Final/career-bridge/apps/web/src/data/onboardingQuestions.ts) and can be modified or seeded directly:

| Stage | Path | Purpose | Output |
| :--- | :--- | :--- | :--- |
| **12th Standard** | `/onboarding/school` | Branch discovery & pre-college preparation | Top 2 suggested branches (e.g., CSE, AI/DS) + Starting Work Path + Verified BLS/SIA citations |
| **1st & 2nd Year** | `/onboarding/early` | Domain fixing & fundamental projects | Primary domain + Alternate domain + Beginner-to-intermediate roadmap |
| **3rd & 4th Year** | `/onboarding/final` | Placement readiness & company prep | Backwards weekly sprint plan from placement month + Company-type templates |

### ⚙️ How to Edit Questions and Recommendation Rules
1. **Questions**: Edit [`apps/web/src/data/onboardingQuestions.ts`](file:///d:/Niral-Final/career-bridge/apps/web/src/data/onboardingQuestions.ts). Update questions, options, icons, or add new ones without component code changes.
2. **Rules & Weights**: Edit [`packages/ai/src/modules/onboardingRules.ts`](file:///d:/Niral-Final/career-bridge/packages/ai/src/modules/onboardingRules.ts).
   - Adjust `BRANCH_CATALOG` weights and verified citations (e.g. BLS, IEEE, IEA).
   - Adjust `DOMAIN_CATALOG` skill lists, beginner modules, and roadmaps.
   - Adjust `COMPANY_TYPE_TEMPLATES` for Product, IT Services, Startups, Core, and PSU tracks.
3. **Engine Evaluation**: Pure deterministic functions live in [`packages/ai/src/modules/onboardingEngine.ts`](file:///d:/Niral-Final/career-bridge/packages/ai/src/modules/onboardingEngine.ts).

### ⌨️ CLI Commands & Verification
```bash
# Run the 20-step automated verification suite testing all 3 journeys, guards & persistence
pnpm verify:onboarding

# Run Gateway unit & integration test suites
pnpm --filter @career-bridge/gateway test

# Start the web development server
pnpm dev
```

