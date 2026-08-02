import { RoadmapPhase, RoleRoadmap } from '@career-bridge/types';

export const ROLE_ROADMAPS: Record<string, RoleRoadmap> = {
  'Full Stack Developer': {
    emoji: '⚡', duration: '6–9 months', salary: '₹6L–₹18L', demand: 98,
    phases: [
      { id: 1, title: 'Web Foundations', duration: 'Weeks 1–5', accent: 'emerald', skills: ['HTML5 & CSS3', 'JavaScript ES6+', 'Responsive Design', 'Git & GitHub'], projects: ['Personal Portfolio', 'Responsive Landing Page'], tools: ['VS Code', 'Chrome DevTools', 'GitHub Pages'], milestone: 'Deploy your first live website' },
      { id: 2, title: 'Frontend Mastery', duration: 'Weeks 6–13', accent: 'blue', skills: ['React.js', 'TypeScript', 'State Management (Zustand)', 'REST APIs & Fetch'], projects: ['Weather Dashboard', 'E-commerce Product UI'], tools: ['Vite', 'Postman', 'React DevTools'], milestone: 'Ship a React app with live API data' },
      { id: 3, title: 'Backend Engineering', duration: 'Weeks 14–22', accent: 'violet', skills: ['Node.js & Express', 'PostgreSQL / MongoDB', 'JWT Authentication', 'REST & GraphQL APIs'], projects: ['Auth-enabled Blog API', 'Real-time Chat Backend'], tools: ['Insomnia', 'Docker', 'PlanetScale'], milestone: 'Build and secure a full REST API' },
      { id: 4, title: 'Full Stack & Deploy', duration: 'Weeks 23–30', accent: 'amber', skills: ['Next.js App Router', 'CI/CD Pipelines', 'AWS / Vercel Deploy', 'Performance & SEO'], projects: ['Full Stack SaaS App', 'AI-integrated Tool'], tools: ['Vercel', 'GitHub Actions', 'Sentry'], milestone: 'Launch a production full stack product' },
    ]
  },
  'AI / ML Engineer': {
    emoji: '🤖', duration: '8–12 months', salary: '₹10L–₹30L', demand: 99,
    phases: [
      { id: 1, title: 'Math & Python Core', duration: 'Weeks 1–6', accent: 'blue', skills: ['Python Programming', 'Linear Algebra & Calculus', 'Statistics & Probability', 'Numpy & Pandas'], projects: ['Data Analysis on Kaggle Dataset', 'Statistical Report Notebook'], tools: ['Jupyter', 'Google Colab', 'Kaggle'], milestone: 'Analyze a real dataset end-to-end' },
      { id: 2, title: 'Machine Learning', duration: 'Weeks 7–16', accent: 'violet', skills: ['Scikit-learn', 'Supervised & Unsupervised Learning', 'Feature Engineering', 'Model Evaluation & Tuning'], projects: ['House Price Predictor', 'Customer Churn Classifier'], tools: ['Scikit-learn', 'Matplotlib', 'MLflow'], milestone: 'Train and evaluate an ML model' },
      { id: 3, title: 'Deep Learning & NLP', duration: 'Weeks 17–28', accent: 'pink', skills: ['PyTorch / TensorFlow', 'CNNs & RNNs', 'Transformers & Attention', 'LLM Fine-tuning Basics'], projects: ['Image Classifier', 'Sentiment Analysis Model'], tools: ['HuggingFace', 'Weights & Biases', 'CUDA'], milestone: 'Fine-tune a pre-trained transformer model' },
      { id: 4, title: 'MLOps & Deployment', duration: 'Weeks 29–40', accent: 'emerald', skills: ['FastAPI for ML', 'Docker & Kubernetes', 'Model Monitoring', 'Cloud AI (GCP Vertex / AWS SageMaker)'], projects: ['AI API with Auto-scaling', 'End-to-end ML Pipeline'], tools: ['DVC', 'Airflow', 'GCP Vertex AI'], milestone: 'Deploy a production ML model with monitoring' },
    ]
  },
  'Product Designer (UI/UX)': {
    emoji: '🎨', duration: '5–8 months', salary: '₹5L–₹16L', demand: 90,
    phases: [
      { id: 1, title: 'Design Foundations', duration: 'Weeks 1–4', accent: 'pink', skills: ['Design Principles', 'Color Theory & Typography', 'Figma Basics', 'Wireframing'], projects: ['Mood Board Collection', 'App Wireframe Sketches'], tools: ['Figma', 'Notion', 'Coolors'], milestone: 'Complete 3 wireframes in Figma' },
      { id: 2, title: 'UI Design', duration: 'Weeks 5–13', accent: 'violet', skills: ['UI Component Design', 'Auto Layout & Variants', 'Design Systems', 'Micro-interactions'], projects: ['Mobile App UI Kit', 'Dashboard UI Design'], tools: ['Figma', 'Lottie', 'Icons8'], milestone: 'Publish a shareable Figma design system' },
      { id: 3, title: 'UX Research', duration: 'Weeks 14–22', accent: 'blue', skills: ['User Interviews', 'Usability Testing', 'Information Architecture', 'Journey Mapping'], projects: ['UX Case Study (end-to-end)', 'Heuristic Evaluation Report'], tools: ['Maze', 'Hotjar', 'Miro'], milestone: 'Conduct and document a user research study' },
      { id: 4, title: 'Portfolio & Handoff', duration: 'Weeks 23–30', accent: 'emerald', skills: ['Prototyping & Animations', 'Dev Handoff (Zeplin)', 'Portfolio Building', 'Presentation Skills'], projects: ['3-case-study Portfolio Site', 'Interactive Prototype'], tools: ['Webflow', 'Zeplin', 'Framer'], milestone: 'Launch a portfolio with 3 UX case studies' },
    ]
  },
  'Data Scientist': {
    emoji: '📊', duration: '7–10 months', salary: '₹8L–₹25L', demand: 96,
    phases: [
      { id: 1, title: 'Foundations', duration: 'Weeks 1–5', accent: 'blue', skills: ['Python & R Basics', 'SQL Mastery', 'Statistics & Distributions', 'Pandas & Numpy'], projects: ['SQL Business Analysis', 'EDA on Public Dataset'], tools: ['Jupyter', 'DBeaver', 'Kaggle'], milestone: 'Complete an EDA report with insights' },
      { id: 2, title: 'Analytics & Viz', duration: 'Weeks 6–14', accent: 'amber', skills: ['Data Visualization', 'Storytelling with Data', 'Tableau / Power BI', 'A/B Testing'], projects: ['Sales Performance Dashboard', 'A/B Test Report'], tools: ['Tableau', 'Seaborn', 'Plotly'], milestone: 'Build an interactive analytics dashboard' },
      { id: 3, title: 'Machine Learning', duration: 'Weeks 15–26', accent: 'violet', skills: ['Regression & Classification', 'Clustering & Anomaly Detection', 'NLP Basics', 'XGBoost & Ensembles'], projects: ['Churn Prediction Model', 'Topic Modelling on Reviews'], tools: ['Scikit-learn', 'SHAP', 'MLflow'], milestone: 'Deploy a model with explainability report' },
      { id: 4, title: 'Production & Scale', duration: 'Weeks 27–36', accent: 'emerald', skills: ['Data Pipelines (Airflow)', 'Cloud Data Warehouses', 'dbt & ETL', 'Business Communication'], projects: ['End-to-end Data Product', 'Executive Slide Deck'], tools: ['BigQuery', 'dbt', 'Looker'], milestone: 'Own a data product from ingestion to insights' },
    ]
  },
  'Product Manager': {
    emoji: '🧭', duration: '4–6 months', salary: '₹12L–₹35L', demand: 92,
    phases: [
      { id: 1, title: 'PM Fundamentals', duration: 'Weeks 1–4', accent: 'blue', skills: ['Product Thinking', 'User Personas', 'Jobs-to-be-Done', 'PRD Writing'], projects: ['PRD for a Mobile App Feature', 'Persona Research Document'], tools: ['Notion', 'Miro', 'Loom'], milestone: 'Write your first complete PRD' },
      { id: 2, title: 'Discovery & Strategy', duration: 'Weeks 5–12', accent: 'violet', skills: ['OKRs & KPIs', 'Competitive Analysis', 'Roadmap Planning', 'Prioritization (RICE, MoSCoW)'], projects: ['3-month Product Roadmap', 'Competitive Analysis Deck'], tools: ['ProductPlan', 'Figma', 'Amplitude'], milestone: 'Present a validated 3-month roadmap' },
      { id: 3, title: 'Execution & Analytics', duration: 'Weeks 13–20', accent: 'emerald', skills: ['Agile & Scrum', 'Sprint Planning', 'Data Analysis for PMs', 'A/B Testing'], projects: ['2-sprint Agile Simulation', 'Feature Impact Analysis'], tools: ['Jira', 'Mixpanel', 'Looker'], milestone: 'Run a complete agile sprint cycle' },
      { id: 4, title: 'Leadership & Launch', duration: 'Weeks 21–26', accent: 'amber', skills: ['GTM Strategy', 'Stakeholder Communication', 'PM Interviews', 'AI for PMs'], projects: ['Product Launch Plan', 'Interview Case Studies Portfolio'], tools: ['Notion AI', 'Figma', 'ChatGPT'], milestone: 'Land your first PM interview offer' },
    ]
  },
  'Backend Developer': {
    emoji: '⚙️', duration: '5–8 months', salary: '₹6L–₹20L', demand: 95,
    phases: [
      { id: 1, title: 'Core Programming', duration: 'Weeks 1–5', accent: 'emerald', skills: ['Python or Node.js', 'Data Structures & Algorithms', 'Git Workflow', 'Linux & CLI'], projects: ['CLI Todo App', 'Sorting Algorithm Visualizer'], tools: ['VS Code', 'GitHub', 'Ubuntu WSL'], milestone: 'Solve 30 DSA problems on LeetCode' },
      { id: 2, title: 'APIs & Databases', duration: 'Weeks 6–14', accent: 'blue', skills: ['REST API Design', 'SQL (PostgreSQL)', 'NoSQL (MongoDB)', 'ORM (Prisma/SQLAlchemy)'], projects: ['Blog CRUD API', 'E-commerce Backend'], tools: ['Postman', 'TablePlus', 'Insomnia'], milestone: 'Build a secured REST API with auth' },
      { id: 3, title: 'Scalability & Security', duration: 'Weeks 15–23', accent: 'violet', skills: ['Redis Caching', 'Message Queues (RabbitMQ)', 'JWT & OAuth2', 'Rate Limiting & Security Headers'], projects: ['Rate-limited API Gateway', 'Event-driven Notification System'], tools: ['Redis', 'RabbitMQ', 'Helmet.js'], milestone: 'Handle 1000 RPS on your API' },
      { id: 4, title: 'DevOps & Cloud', duration: 'Weeks 24–32', accent: 'amber', skills: ['Docker & Compose', 'CI/CD with GitHub Actions', 'AWS EC2 / Lambda', 'Monitoring (Grafana)'], projects: ['Dockerized Microservice', 'Cloud-deployed API'], tools: ['Docker', 'AWS', 'Grafana'], milestone: 'Deploy a containerized service to cloud' },
    ]
  },
  'CTO / Technical Lead': {
    emoji: '🚀', duration: '6–9 months', salary: '₹40L–₹1Cr+', demand: 96,
    phases: [
      { id: 1, title: 'Architecture Mastery', duration: 'Months 1–2', accent: 'blue', skills: ['System Design at Scale', 'Microservices vs Monolith', 'Event-Driven Architecture', 'API Gateway Patterns'], projects: ['Design a Twitter-scale System', 'Architecture Decision Record (ADR)'], tools: ['draw.io', 'Confluence', 'Miro'], milestone: 'Complete 5 system design mock interviews' },
      { id: 2, title: 'Engineering Leadership', duration: 'Months 3–4', accent: 'violet', skills: ['1-on-1s & Team Health', 'Hiring & Onboarding', 'Tech Debt Management', 'OKRs for Eng Teams'], projects: ['30-60-90 Day Team Plan', 'Tech Radar for Your Org'], tools: ['Notion', 'Linear', 'Lattice'], milestone: 'Mentor 2 junior engineers to promotion' },
      { id: 3, title: 'Strategy & Vision', duration: 'Months 5–6', accent: 'emerald', skills: ['Build vs Buy Decisions', 'Vendor Evaluation', 'Board Communication', 'AI/ML Strategy for Products'], projects: ['3-Year Technology Roadmap', 'AI Integration Strategy Deck'], tools: ['Notion AI', 'Figma', 'Perplexity'], milestone: 'Present a tech vision to executive stakeholders' },
      { id: 4, title: 'Execution at Scale', duration: 'Months 7–9', accent: 'amber', skills: ['FinOps & Cloud Cost', 'SLA/SLO/SLI Frameworks', 'Incident Management', 'Platform Engineering'], projects: ['Incident Runbook', 'Cost Optimization Report'], tools: ['PagerDuty', 'DataDog', 'Terraform'], milestone: 'Achieve 99.9% uptime SLA across systems' },
    ]
  },
  'Cloud / Solutions Architect': {
    emoji: '☁️', duration: '6–9 months', salary: '₹25L–₹60L', demand: 94,
    phases: [
      { id: 1, title: 'Cloud Fundamentals', duration: 'Months 1–2', accent: 'blue', skills: ['AWS / GCP / Azure Core Services', 'Networking & VPCs', 'IAM & Security', 'Storage & Databases'], projects: ['Deploy a 3-tier Web App on AWS', 'Networking Lab (VPC, Subnets, SGs)'], tools: ['AWS Console', 'Terraform', 'CloudFormation'], milestone: 'Pass AWS Solutions Architect Associate' },
      { id: 2, title: 'Infrastructure as Code', duration: 'Months 3–4', accent: 'emerald', skills: ['Terraform', 'Ansible', 'Kubernetes Basics', 'Helm Charts'], projects: ['Full IaC Environment', 'K8s Cluster on EKS'], tools: ['Terraform', 'kubectl', 'Helm'], milestone: 'Provision complete infra via IaC' },
      { id: 3, title: 'Scalability & Resilience', duration: 'Months 5–6', accent: 'violet', skills: ['Auto-scaling & Load Balancing', 'Multi-region Architecture', 'Disaster Recovery', 'Cost Optimization'], projects: ['Multi-region Failover Design', 'FinOps Audit Report'], tools: ['AWS Cost Explorer', 'Chaos Monkey', 'Route53'], milestone: 'Design a disaster recovery plan' },
      { id: 4, title: 'Advanced & Certifications', duration: 'Months 7–9', accent: 'amber', skills: ['Serverless Architecture', 'Data Lakes & Lakehouses', 'AI/ML on Cloud', 'Well-Architected Review'], projects: ['Serverless Event Pipeline', 'Cloud Architecture Portfolio'], tools: ['Lambda', 'Step Functions', 'Glue'], milestone: 'Pass AWS Solutions Architect Professional' },
    ]
  },
  'Head of Product': {
    emoji: '🎯', duration: '5–7 months', salary: '₹25L–₹80L', demand: 93,
    phases: [
      { id: 1, title: 'Strategic Product Thinking', duration: 'Months 1–2', accent: 'blue', skills: ['Product Strategy Frameworks', 'Market Sizing (TAM/SAM/SOM)', 'Porter\'s 5 Forces', 'Competitive Landscape Analysis'], projects: ['Market Opportunity Report', 'Strategy Memo for a Real Product'], tools: ['Notion', 'Crunchbase', 'SimilarWeb'], milestone: 'Define a go-to-market strategy' },
      { id: 2, title: 'Team & Org Leadership', duration: 'Months 2–3', accent: 'violet', skills: ['Managing PMs', 'Cross-functional Alignment', 'Exec Stakeholder Management', 'Product Culture Building'], projects: ['PM Team Handbook', 'Quarterly Business Review Deck'], tools: ['Notion', 'Linear', 'Dovetail'], milestone: 'Lead a cross-functional product review' },
      { id: 3, title: 'Data-Driven Product', duration: 'Months 4–5', accent: 'emerald', skills: ['North Star Metrics', 'Experiment Design', 'Product Analytics', 'Retention & Growth Loops'], projects: ['Retention Analysis Dashboard', 'Growth Experiment Backlog'], tools: ['Amplitude', 'Mixpanel', 'Looker'], milestone: 'Improve a key metric by 15% via experiments' },
      { id: 4, title: 'AI & Future Product', duration: 'Months 6–7', accent: 'amber', skills: ['AI Product Strategy', 'LLM Integration in Products', 'Ethics in AI Products', 'Platform Thinking'], projects: ['AI Feature Roadmap', 'Platform Extensibility Design'], tools: ['OpenAI API', 'Notion AI', 'Segment'], milestone: 'Ship an AI-powered product feature' },
    ]
  },
  'Engineering Manager': {
    emoji: '👥', duration: '4–6 months', salary: '₹20L–₹55L', demand: 93,
    phases: [
      { id: 1, title: 'People Management', duration: 'Months 1–2', accent: 'blue', skills: ['Effective 1-on-1s', 'Feedback Frameworks (SBI)', 'Hiring & Interviewing', 'Performance Reviews'], projects: ['Team Charter Document', 'Individual Development Plans (IDPs)'], tools: ['Notion', 'Lattice', 'Loom'], milestone: 'Conduct structured 1-on-1s for 4 weeks' },
      { id: 2, title: 'Delivery & Process', duration: 'Months 2–3', accent: 'emerald', skills: ['Agile & Scrum at Scale', 'Sprint Health Metrics', 'Incident Management', 'On-call Rotations'], projects: ['Sprint Dashboard', 'Incident Post-mortem Template'], tools: ['Jira', 'Linear', 'PagerDuty'], milestone: 'Run a blameless post-mortem' },
      { id: 3, title: 'Technical Credibility', duration: 'Months 4–5', accent: 'violet', skills: ['Architecture Reviews', 'Code Review Culture', 'Tech Debt Prioritization', 'Build vs Buy'], projects: ['Tech Debt Audit', 'Architecture Review Checklist'], tools: ['GitHub', 'SonarQube', 'draw.io'], milestone: 'Implement a code review improvement initiative' },
      { id: 4, title: 'Strategy & Growth', duration: 'Month 6', accent: 'amber', skills: ['Roadmap Alignment with Product', 'OKR Setting for Teams', 'Headcount Planning', 'Manager Career Ladder'], projects: ['6-month Team Roadmap', 'Career Ladder Doc'], tools: ['Notion', 'Lattice', 'Workday'], milestone: 'Set and align team OKRs with company goals' },
    ]
  },
  'Design Director / UX Lead': {
    emoji: '✨', duration: '5–7 months', salary: '₹20L–₹50L', demand: 88,
    phases: [
      { id: 1, title: 'Design Leadership', duration: 'Months 1–2', accent: 'pink', skills: ['Design Org Structure', 'Hiring Designers', 'Critique Culture', 'Design Principles at Scale'], projects: ['Design Team Handbook', 'Design Principles Deck'], tools: ['Notion', 'Figma', 'Loom'], milestone: 'Run a structured design critique session' },
      { id: 2, title: 'Systems & Standards', duration: 'Months 2–3', accent: 'violet', skills: ['Enterprise Design Systems', 'Figma Organization at Scale', 'Accessibility (WCAG)', 'Brand Governance'], projects: ['Design System v1.0', 'Accessibility Audit Report'], tools: ['Figma', 'Storybook', 'Zeroheight'], milestone: 'Launch a versioned design system' },
      { id: 3, title: 'Research & Strategy', duration: 'Months 4–5', accent: 'blue', skills: ['Research Operations', 'Qual & Quant Methods', 'UX Metrics (HEART)', 'Design Strategy'], projects: ['Research Repository', 'UX Scorecard'], tools: ['Dovetail', 'Maze', 'Optimal Workshop'], milestone: 'Establish a research ops practice' },
      { id: 4, title: 'Executive Presence', duration: 'Months 6–7', accent: 'amber', skills: ['Design ROI Communication', 'C-suite Storytelling', 'AI in Design Workflow', 'Cross-org Influence'], projects: ['Annual Design Report', 'AI Tools Adoption Plan'], tools: ['Midjourney', 'Runway', 'Figma AI'], milestone: 'Present design impact to the C-suite' },
    ]
  },
  'AI / Data Architect': {
    emoji: '🧠', duration: '7–10 months', salary: '₹25L–₹70L', demand: 97,
    phases: [
      { id: 1, title: 'Data Engineering', duration: 'Months 1–2', accent: 'blue', skills: ['Data Modelling (Kimball/Vault)', 'dbt & SQL Transformations', 'Airflow / Dagster Pipelines', 'Data Warehouses (BigQuery, Snowflake)'], projects: ['End-to-end dbt Project', 'Airflow DAG Pipeline'], tools: ['dbt', 'Airflow', 'BigQuery'], milestone: 'Build a production data pipeline' },
      { id: 2, title: 'ML Platform', duration: 'Months 3–4', accent: 'violet', skills: ['Feature Stores', 'Model Registry', 'Experiment Tracking', 'MLOps Lifecycle'], projects: ['ML Platform Design', 'Model Versioning System'], tools: ['MLflow', 'Feast', 'Weights & Biases'], milestone: 'Implement end-to-end MLOps' },
      { id: 3, title: 'LLM & GenAI', duration: 'Months 5–7', accent: 'pink', skills: ['LLM APIs (OpenAI/Anthropic)', 'RAG Architecture', 'Vector Databases', 'Prompt Engineering & Fine-tuning'], projects: ['RAG Knowledge Base', 'LLM-powered Internal Tool'], tools: ['LangChain', 'Pinecone', 'OpenAI'], milestone: 'Build a production RAG application' },
      { id: 4, title: 'Enterprise AI Architecture', duration: 'Months 8–10', accent: 'amber', skills: ['AI Governance & Ethics', 'Data Mesh Architecture', 'AI Cost Optimization', 'Stakeholder Alignment'], projects: ['AI Strategy Whitepaper', 'Data Mesh Org Design'], tools: ['Collibra', 'Alation', 'DataHub'], milestone: 'Design an enterprise-wide AI data strategy' },
    ]
  },
  'VP Engineering / GM': {
    emoji: '🏆', duration: '5–7 months', salary: '₹30L–₹80L', demand: 92,
    phases: [
      { id: 1, title: 'Business Acumen', duration: 'Months 1–2', accent: 'amber', skills: ['P&L Management', 'Budgeting & Headcount', 'Business Models', 'Financial Metrics (ARR, CAC, LTV)'], projects: ['Department Budget Plan', 'Business Case for a Tech Investment'], tools: ['Excel / Google Sheets', 'Tableau', 'Notion'], milestone: 'Model a 12-month department budget' },
      { id: 2, title: 'Organizational Design', duration: 'Months 2–3', accent: 'blue', skills: ['Team Topologies', 'Span of Control', 'Levelling Frameworks', 'Compensation Philosophy'], projects: ['Org Design Proposal', 'Levelling & Compensation Framework'], tools: ['Notion', 'Workday', 'Lattice'], milestone: 'Design a scalable org structure' },
      { id: 3, title: 'Strategy & Execution', duration: 'Months 4–5', accent: 'violet', skills: ['OKRs at Org Level', 'Quarterly Business Reviews', 'Dependency & Risk Management', 'Cross-org Alignment'], projects: ['QBR Presentation', 'Company-wide OKR Tree'], tools: ['Notion', 'Miro', 'Asana'], milestone: 'Drive org-wide OKR alignment' },
      { id: 4, title: 'Exec Leadership', duration: 'Months 6–7', accent: 'emerald', skills: ['Board Communication', 'Investor Relations Basics', 'Acquisitions & Partnerships', 'AI Transformation Strategy'], projects: ['Board Deck', 'AI Adoption 3-year Roadmap'], tools: ['Notion AI', 'Pitch', 'Beautiful.ai'], milestone: 'Present a technology vision to the board' },
    ]
  },
};

export const ACCENT_COLORS: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  emerald: { bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.25)', text: '#10b981', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  blue:    { bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.25)', text: '#3b82f6', badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  violet:  { bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.25)', text: '#8b5cf6', badge: 'bg-violet-500/10 text-violet-400 border-violet-500/20' },
  amber:   { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.25)', text: '#f59e0b', badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  pink:    { bg: 'rgba(236,72,153,0.08)', border: 'rgba(236,72,153,0.25)', text: '#ec4899', badge: 'bg-pink-500/10 text-pink-400 border-pink-500/20' },
};
