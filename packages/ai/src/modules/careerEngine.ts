import { CareerRecommendation, AlternativeRole } from '@career-bridge/types';

export type Recommendation = CareerRecommendation;

export interface RoleMetadata {
  domain: string;
  salaryRange: string;
  futureScope: string;
  aiImpact: number;
  demandScore: number;
  strengths: string[];
  weaknesses: string[];
  reasoningTemplate: string;
}

export const ROLE_PROFILES: Record<string, RoleMetadata> = {
  // ── Software & Application Development ──
  'Full-Stack Developer': {
    domain: 'Software & Application Development',
    salaryRange: '₹6L–₹18L / $80k–$140k',
    futureScope: 'Excellent — High demand for versatile engineers who can ship end-to-end features.',
    aiImpact: 14,
    demandScore: 98,
    strengths: ['React & Node.js', 'API Architecture', 'Database Design', 'System Integration'],
    weaknesses: ['Deep Low-level Optimization', 'UI Micro-animations'],
    reasoningTemplate: 'Your strong balanced thinking across UI aesthetics, backend business logic, and API workflows makes you a natural Full-Stack engineer.'
  },
  'Software Developer': {
    domain: 'Software & Application Development',
    salaryRange: '₹6L–₹16L / $80k–$135k',
    futureScope: 'High — Core software engineering fundamentals remain crucial across all digital industries.',
    aiImpact: 15,
    demandScore: 97,
    strengths: ['Data Structures & Algorithms', 'Clean Code Architecture', 'Object-Oriented Design', 'Problem Solving'],
    weaknesses: ['DevOps Tooling', 'Visual Design'],
    reasoningTemplate: 'Your methodical problem-solving style and love for logical problem decomposition aligns with core software development.'
  },
  'Frontend Developer': {
    domain: 'Software & Application Development',
    salaryRange: '₹5L–₹15L / $75k–$130k',
    futureScope: 'Strong — Modern web applications demand rich interactive user interfaces and responsive performance.',
    aiImpact: 18,
    demandScore: 94,
    strengths: ['React/Next.js', 'CSS & Tailwind', 'State Management', 'Browser Performance'],
    weaknesses: ['Database Administration', 'Distributed Systems'],
    reasoningTemplate: 'Your keen eye for visual responsiveness, layout hierarchy, and user-facing interactions makes you an exceptional Frontend Developer.'
  },
  'Backend Developer': {
    domain: 'Software & Application Development',
    salaryRange: '₹6L–₹20L / $85k–$145k',
    futureScope: 'Outstanding — Server-side scalability, secure microservices, and fast data processing power every platform.',
    aiImpact: 12,
    demandScore: 96,
    strengths: ['REST & GraphQL APIs', 'SQL/NoSQL Databases', 'Caching & Message Queues', 'Security & Idempotency'],
    weaknesses: ['Visual Styling', 'User Research'],
    reasoningTemplate: 'Your instinct for scalability, API stability, and backend data flows positions you perfectly for server-side engineering.'
  },
  'Mobile App Developer': {
    domain: 'Software & Application Development',
    salaryRange: '₹6L–₹17L / $80k–$135k',
    futureScope: 'Strong — Mobile-first user bases continue to dominate consumer products, fintech, and social apps.',
    aiImpact: 16,
    demandScore: 93,
    strengths: ['Flutter / React Native', 'Offline Caching', 'Mobile UX Patterns', 'App Store Deployment'],
    weaknesses: ['Cloud Infrastructure', 'Web SEO'],
    reasoningTemplate: 'Your interest in portable on-device experiences and responsive touch interfaces makes you a great Mobile App Developer.'
  },
  'Game Developer': {
    domain: 'Software & Application Development',
    salaryRange: '₹5L–₹18L / $75k–$140k',
    futureScope: 'Growing — Gaming, interactive 3D simulations, and virtual physics engines continue rapid expansion.',
    aiImpact: 12,
    demandScore: 91,
    strengths: ['Unity / Unreal Engine', 'C# / C++', '3D Math & Physics', 'Game Loop Optimization'],
    weaknesses: ['Enterprise CRUD Apps', 'Business Reporting'],
    reasoningTemplate: 'Your curiosity for interactive virtual worlds, collision physics, and real-time animation mechanics drives your Game Development aptitude.'
  },
  'QA / Software Tester': {
    domain: 'Software & Application Development',
    salaryRange: '₹4.5L–₹13L / $65k–$115k',
    futureScope: 'Stable — Automated test suites, CI/CD regression verification, and edge-case testing ensure product reliability.',
    aiImpact: 20,
    demandScore: 89,
    strengths: ['Test Automation (Cypress/Playwright)', 'Edge Case Detection', 'Regression Suites', 'Performance Benchmarks'],
    weaknesses: ['System Architecture', 'UI Prototyping'],
    reasoningTemplate: 'Your detail-oriented mindset that constantly spots glitches, edge-cases, and breaking scenarios makes you an outstanding QA Engineer.'
  },

  // ── Data & Artificial Intelligence ──
  'AI/ML Engineer': {
    domain: 'Data & Artificial Intelligence',
    salaryRange: '₹10L–₹30L / $100k–$180k',
    futureScope: 'Hyper-growth — Machine learning and deep neural networks are transforming every digital ecosystem.',
    aiImpact: 5,
    demandScore: 99,
    strengths: ['PyTorch / TensorFlow', 'Neural Network Architectures', 'Model Optimization', 'Mathematics & Linear Algebra'],
    weaknesses: ['Frontend Styling', 'Corporate Bureaucracy'],
    reasoningTemplate: 'Your analytical brilliance, appetite for algorithmic models, and fascination with intelligent systems makes you an AI/ML Engineer.'
  },
  'Data Scientist': {
    domain: 'Data & Artificial Intelligence',
    salaryRange: '₹8L–₹25L / $90k–$160k',
    futureScope: 'Very High — Companies rely on data science models to extract predictive signals from large datasets.',
    aiImpact: 10,
    demandScore: 96,
    strengths: ['Statistical Modeling', 'Python/R & Pandas', 'Data Storytelling', 'Feature Engineering'],
    weaknesses: ['Low-level Systems Programming', 'Graphic Design'],
    reasoningTemplate: 'Your natural intuition for data patterns, statistical distributions, and quantitative problem solving marks you as a Data Scientist.'
  },
  'Data Analyst': {
    domain: 'Data & Artificial Intelligence',
    salaryRange: '₹5L–₹14L / $70k–$120k',
    futureScope: 'High — Business leaders make high-stakes decisions through actionable dashboard metrics and SQL queries.',
    aiImpact: 18,
    demandScore: 93,
    strengths: ['SQL Mastery', 'Power BI / Tableau', 'Exploratory Data Analysis', 'KPI Tracking'],
    weaknesses: ['Deep Learning', 'Backend API Coding'],
    reasoningTemplate: 'Your ability to find the story behind numbers and organize messy data into clear actionable insights fits Data Analytics.'
  },
  'Business Intelligence Analyst': {
    domain: 'Data & Artificial Intelligence',
    salaryRange: '₹6L–₹16L / $75k–$130k',
    futureScope: 'Strong — Enterprises need dedicated BI pipelines to connect operational databases to executive cockpits.',
    aiImpact: 15,
    demandScore: 92,
    strengths: ['Data Warehousing', 'Executive Dashboards', 'Business Metrics', 'Dimensional Modeling'],
    weaknesses: ['Mobile Coding', 'Cybersecurity Hardening'],
    reasoningTemplate: 'Your blend of commercial curiosity and data modeling enables you to bridge business strategy with technical analytics.'
  },
  'Data Engineer': {
    domain: 'Data & Artificial Intelligence',
    salaryRange: '₹8L–₹24L / $90k–$160k',
    futureScope: 'Exceptional — Data infrastructure, streaming Kafka pipelines, and lakehouses are prerequisites for all modern AI.',
    aiImpact: 8,
    demandScore: 97,
    strengths: ['Apache Spark & Kafka', 'ETL/ELT Pipelines', 'Cloud Data Warehouses', 'Distributed Storage'],
    weaknesses: ['UI Layouts', 'Public Speaking'],
    reasoningTemplate: 'Your interest in reliable data plumbing, automated pipelines, and massive scale databases aligns with Data Engineering.'
  },
  'Prompt Engineer': {
    domain: 'Data & Artificial Intelligence',
    salaryRange: '₹6L–₹18L / $75k–$140k',
    futureScope: 'Emerging & Fast — Generative AI workflows, zero-shot framing, and model evaluation need specialized steering.',
    aiImpact: 22,
    demandScore: 88,
    strengths: ['LLM In-context Learning', 'RAG Context Optimization', 'Evaluation Frameworks', 'Language Precision'],
    weaknesses: ['Deep Math & Calculus', 'Network Protocols'],
    reasoningTemplate: 'Your linguistic clarity, creative curiosity, and structured prompt steering makes you adept at Prompt Engineering.'
  },

  // ── Cybersecurity & Infrastructure ──
  'Cybersecurity Analyst': {
    domain: 'Cybersecurity & Infrastructure',
    salaryRange: '₹6L–₹20L / $85k–$150k',
    futureScope: 'Critical & Permanent — Global digital infrastructure requires continuous proactive threat prevention.',
    aiImpact: 8,
    demandScore: 96,
    strengths: ['Vulnerability Assessment', 'Threat Modeling', 'Network Security', 'Security Policies'],
    weaknesses: ['Frontend Animation', 'Sales Strategy'],
    reasoningTemplate: 'Your vigilant curiosity, interest in finding system vulnerabilities, and urge to defend users fits Cybersecurity.'
  },
  'Penetration Tester': {
    domain: 'Cybersecurity & Infrastructure',
    salaryRange: '₹7L–₹22L / $90k–$160k',
    futureScope: 'High — Ethical hacking teams uncover zero-day flaws before malicious bad actors exploit them.',
    aiImpact: 10,
    demandScore: 94,
    strengths: ['Ethical Hacking Tools', 'Web & API Exploitation', 'Reverse Engineering', 'Burp Suite & Metasploit'],
    weaknesses: ['Product Management', 'Corporate Accounting'],
    reasoningTemplate: 'Your rebellious problem-solving style that loves discovering how to bypass security traps makes you a great Penetration Tester.'
  },
  'Cloud Engineer': {
    domain: 'Cybersecurity & Infrastructure',
    salaryRange: '₹7L–₹22L / $90k–$155k',
    futureScope: 'Essential — Nearly all modern applications run on multi-cloud providers (AWS, GCP, Azure).',
    aiImpact: 10,
    demandScore: 96,
    strengths: ['AWS / Azure / GCP', 'Infrastructure as Code (Terraform)', 'Cloud Networking', 'High Availability'],
    weaknesses: ['UI Prototyping', 'Content Writing'],
    reasoningTemplate: 'Your curiosity for distributed servers, high-availability architecture, and global cloud infrastructure fits Cloud Engineering.'
  },
  'DevOps Engineer': {
    domain: 'Cybersecurity & Infrastructure',
    salaryRange: '₹8L–₹24L / $95k–$160k',
    futureScope: 'Top Tier — Seamless CI/CD delivery pipelines, container orchestration, and zero-downtime deploys are mandatory.',
    aiImpact: 9,
    demandScore: 97,
    strengths: ['Docker & Kubernetes', 'CI/CD Automation', 'Linux Administration', 'Monitoring & Observability'],
    weaknesses: ['User Experience Research', 'Visual Graphic Art'],
    reasoningTemplate: 'Your passion for automation, eliminating repetitive manual work, and managing production releases fits DevOps Engineering.'
  },
  'Network Engineer': {
    domain: 'Cybersecurity & Infrastructure',
    salaryRange: '₹5L–₹16L / $70k–$130k',
    futureScope: 'Stable — Core TCP/IP routing, switching, firewalls, and 5G connectivity underpin all internet services.',
    aiImpact: 14,
    demandScore: 90,
    strengths: ['TCP/IP & Subnetting', 'Routing Protocols (BGP/OSPF)', 'Firewalls & VPNs', 'Packet Analysis'],
    weaknesses: ['Frontend Frameworks', 'UI Aesthetics'],
    reasoningTemplate: 'Your foundational understanding of packet routing, latency, and interconnected hardware networks points to Network Engineering.'
  },
  'System Administrator': {
    domain: 'Cybersecurity & Infrastructure',
    salaryRange: '₹4.5L–₹14L / $65k–$120k',
    futureScope: 'Solid — Maintaining server fleets, OS patches, user permissions, and reliable backup schedules.',
    aiImpact: 17,
    demandScore: 88,
    strengths: ['Linux / Windows Server', 'Shell Scripting', 'Identity Management (Active Directory)', 'Backup Recovery'],
    weaknesses: ['Mobile Development', 'Product Marketing'],
    reasoningTemplate: 'Your structured discipline in maintaining server uptime, user permissions, and resilient environments fits System Administration.'
  },
  'SOC Analyst': {
    domain: 'Cybersecurity & Infrastructure',
    salaryRange: '₹5L–₹16L / $75k–$135k',
    futureScope: 'High — 24/7 Security Operations Centers monitor, detect, and neutralize cyber attacks in real time.',
    aiImpact: 12,
    demandScore: 93,
    strengths: ['SIEM Tools (Splunk/Sentinel)', 'Incident Response', 'Malware Analysis', 'Log Investigation'],
    weaknesses: ['Software Feature Coding', 'Graphic Design'],
    reasoningTemplate: 'Your calm focus under pressure and detective-like investigative instinct for anomalous logs makes you a prime SOC Analyst.'
  },

  // ── Design & Digital Experience ──
  'UI/UX Designer': {
    domain: 'Design & Digital Experience',
    salaryRange: '₹5L–₹16L / $70k–$130k',
    futureScope: 'High — Human-centric empathy, intuitive flows, and clean interfaces differentiate great software.',
    aiImpact: 20,
    demandScore: 92,
    strengths: ['Figma & Prototyping', 'User Research & Wireframes', 'Design Systems', 'Visual Hierarchy'],
    weaknesses: ['Database Optimization', 'Server Deployment'],
    reasoningTemplate: 'Your sensitivity to visual harmony, user frustration points, and intuitive digital interfaces makes you a natural UI/UX Designer.'
  },
  'Product Designer': {
    domain: 'Design & Digital Experience',
    salaryRange: '₹7L–₹20L / $85k–$150k',
    futureScope: 'Very High — Combines visual design with deep business model awareness and product conversion strategy.',
    aiImpact: 16,
    demandScore: 94,
    strengths: ['End-to-End Product Design', 'UX Strategy', 'Usability Testing', 'Cross-functional Collaboration'],
    weaknesses: ['Low-level Firmware', 'Network Protocol Engineering'],
    reasoningTemplate: 'Your holistic approach connecting aesthetics, user journeys, and real commercial business value makes you an ideal Product Designer.'
  },
  'Web Designer': {
    domain: 'Design & Digital Experience',
    salaryRange: '₹4L–₹12L / $60k–$110k',
    futureScope: 'Stable — Creative websites, landing pages, and interactive digital branding for global businesses.',
    aiImpact: 24,
    demandScore: 86,
    strengths: ['Responsive Layouts', 'HTML/CSS/Webflow', 'Typography & Contrast', 'Branding Aesthetics'],
    weaknesses: ['Data Algorithms', 'Security Firewalls'],
    reasoningTemplate: 'Your passion for modern typography, responsive visual presentation, and creative layouts fits Web Design.'
  },
  'Graphic Designer': {
    domain: 'Design & Digital Experience',
    salaryRange: '₹3.5L–₹10L / $50k–$95k',
    futureScope: 'Moderate — Visual identity, marketing collateral, brand guidelines, and visual storytelling.',
    aiImpact: 28,
    demandScore: 82,
    strengths: ['Adobe Illustrator/Photoshop', 'Color Harmony', 'Visual Storytelling', 'Brand Guidelines'],
    weaknesses: ['Backend Coding', 'Cloud DevOps'],
    reasoningTemplate: 'Your expressive visual imagination and instinct for artistic composition positions you in Graphic Design.'
  },
  'Technical Writer': {
    domain: 'Design & Digital Experience',
    salaryRange: '₹5L–₹15L / $70k–$125k',
    futureScope: 'High — As software complexity grows, clear developer documentation and user guides are vital.',
    aiImpact: 15,
    demandScore: 89,
    strengths: ['Developer Documentation', 'Simplifying Complexity', 'API Reference Docs', 'User Guides'],
    weaknesses: ['Manual Circuit Soldering', 'Graphics Rendering'],
    reasoningTemplate: 'Your superpower of breaking down complicated engineering topics into crystal-clear prose makes you a Technical Writer.'
  },

  // ── Business, Management & Emerging Roles ──
  'Product Manager': {
    domain: 'Business, Management & Emerging Roles',
    salaryRange: '₹12L–₹35L / $95k–$160k',
    futureScope: 'Excellent — Leads product strategy, user discovery, and roadmap execution across engineering and design.',
    aiImpact: 10,
    demandScore: 95,
    strengths: ['Roadmap Prioritization (RICE)', 'User Empathy & Research', 'Stakeholder Communication', 'GTM Strategy'],
    weaknesses: ['Deep Hardware Debugging', 'Manual QA Testing'],
    reasoningTemplate: 'Your strategic mindset, communication prowess, and ability to coordinate vision with execution makes you an outstanding Product Manager.'
  },
  'Business Analyst': {
    domain: 'Business, Management & Emerging Roles',
    salaryRange: '₹6L–₹18L / $75k–$130k',
    futureScope: 'High — Bridges client requirements with technical engineering specifications and workflow diagrams.',
    aiImpact: 14,
    demandScore: 92,
    strengths: ['Requirements Gathering (BRD/PRD)', 'Process Flowcharts', 'Cost-Benefit Analysis', 'Stakeholder Alignment'],
    weaknesses: ['Hands-on Code Compilation', 'CSS Styling'],
    reasoningTemplate: 'Your talent for analyzing workflows, calculating business impact, and organizing team deliverables fits Business Analysis.'
  },
  'Project Coordinator': {
    domain: 'Business, Management & Emerging Roles',
    salaryRange: '₹4.5L–₹12L / $60k–$105k',
    futureScope: 'Stable — Keeps software sprints on schedule, monitors deliverables, and resolves organizational bottlenecks.',
    aiImpact: 18,
    demandScore: 87,
    strengths: ['Agile / Scrum Coordination', 'Resource Scheduling', 'Risk Tracking', 'Team Motivation'],
    weaknesses: ['Algorithm Design', 'Database Querying'],
    reasoningTemplate: 'Your organized attention to milestones, timelines, and facilitating smooth team collaboration fits Project Coordination.'
  },
  'IT Consultant': {
    domain: 'Business, Management & Emerging Roles',
    salaryRange: '₹8L–₹22L / $85k–$150k',
    futureScope: 'Strong — Advises global organizations on digital transformation, technology adoption, and cloud migrations.',
    aiImpact: 12,
    demandScore: 91,
    strengths: ['Technology Strategy', 'Client Presentations', 'Digital Transformation', 'Vendor Evaluation'],
    weaknesses: ['Deep CSS Tuning', 'Pixel Design'],
    reasoningTemplate: 'Your big-picture perspective and ability to recommend optimal tech solutions to real-world businesses fits IT Consulting.'
  },
  'Technical Support Engineer': {
    domain: 'Business, Management & Emerging Roles',
    salaryRange: '₹4L–₹11L / $55k–$95k',
    futureScope: 'Moderate — Troubleshoots software incidents, guides enterprise clients, and resolves technical bottlenecks.',
    aiImpact: 20,
    demandScore: 86,
    strengths: ['Live Troubleshooting', 'Customer Empathy', 'Log Investigation', 'SLA Adherence'],
    weaknesses: ['Machine Learning Modeling', 'Graphic Branding'],
    reasoningTemplate: 'Your patient diagnostic skills and knack for solving end-user computer issues fits Technical Support Engineering.'
  },
  'RPA Developer': {
    domain: 'Business, Management & Emerging Roles',
    salaryRange: '₹5L–₹16L / $70k–$125k',
    futureScope: 'Steady — Automates mundane enterprise workflows across legacy ERPs using bots and automation tools.',
    aiImpact: 16,
    demandScore: 88,
    strengths: ['UiPath / Automation Anywhere', 'Process Automation', 'Scripting', 'Workflow Optimization'],
    weaknesses: ['3D Game Physics', 'Creative Graphic Design'],
    reasoningTemplate: 'Your frustration with repetitive manual tasks and enthusiasm for automated software bots aligns with RPA Development.'
  },
  'IoT Engineer': {
    domain: 'Business, Management & Emerging Roles',
    salaryRange: '₹6L–₹19L / $80k–$140k',
    futureScope: 'Rapidly Growing — Connects smart physical sensors, industrial telematics, and microcontrollers to the cloud.',
    aiImpact: 8,
    demandScore: 93,
    strengths: ['Embedded C/C++', 'Microcontrollers (ESP32/Arduino)', 'MQTT & Protocols', 'Cloud IoT Telemetry'],
    weaknesses: ['Web Marketing', 'Corporate Finance'],
    reasoningTemplate: 'Your excitement for physical hardware sensors, smart devices, and wireless telemetry makes you an ideal IoT Engineer.'
  },
  'Robotics Engineer': {
    domain: 'Business, Management & Emerging Roles',
    salaryRange: '₹7L–₹22L / $85k–$150k',
    futureScope: 'High — Integrates sensors, computer vision, motor controllers, and autonomous robotics for modern industries.',
    aiImpact: 6,
    demandScore: 95,
    strengths: ['ROS (Robot Operating System)', 'Kinematics & Control Loops', 'Embedded Systems', 'Sensor Integration'],
    weaknesses: ['Web Frontend Design', 'Business Reporting'],
    reasoningTemplate: 'Your fascination with autonomous machines, mechatronics, and real-time robotic control systems fits Robotics Engineering.'
  },
  'AR/VR Developer': {
    domain: 'Business, Management & Emerging Roles',
    salaryRange: '₹6L–₹20L / $80k–$145k',
    futureScope: 'High — Spatial computing, interactive headsets, and immersive 3D simulations are expanding rapidly.',
    aiImpact: 10,
    demandScore: 92,
    strengths: ['Unity / Unreal Engine', 'Spatial Computing', '3D Interaction Design', 'Shader Optimization'],
    weaknesses: ['Accounting Software', 'Relational DB Tuning'],
    reasoningTemplate: 'Your passion for futuristic spatial computing, virtual immersion, and 3D user interactions drives your AR/VR development capability.'
  },
  'Research Engineer': {
    domain: 'Business, Management & Emerging Roles',
    salaryRange: '₹9L–₹28L / $95k–$170k',
    futureScope: 'Elite & Lasting — Pushes the frontiers of scientific computing, novel algorithms, and foundational tech breakthroughs.',
    aiImpact: 4,
    demandScore: 96,
    strengths: ['Algorithmic Innovation', 'Experimental Rigor', 'Paper Writing & Prototyping', 'Deep Computer Science'],
    weaknesses: ['Fast UI Feature Hacking', 'Sales Pitches'],
    reasoningTemplate: 'Your intellectual rigor, deep curiosity for fundamental mechanisms, and love for experimentation marks you as a Research Engineer.'
  }
};

// ── Scoring Algorithm ─────────────────────────────────────────────────────────
export function scoreAssessment(
  track: 'first_year' | 'fresher' | 'professional' | 'student',
  answers: Record<number, string>
): { primaryRole: string; primaryConfidence: number; sortedScores: Array<{ role: string; score: number; confidence: number }> } {
  const scores: Record<string, number> = {};

  // Initialize all target roles with base score
  Object.keys(ROLE_PROFILES).forEach(role => {
    scores[role] = 0;
  });

  const answerEntries = Object.entries(answers);
  const totalAnswers = answerEntries.length;

  // Keyword / Heuristic role mappings to ensure every answer boosts matching profiles
  answerEntries.forEach(([qIdStr, ans]) => {
    const text = String(ans || '').toLowerCase();

    // 1. Software & Web / Mobile / Game
    if (text.includes('visual design') || text.includes('colors') || text.includes('frontend') || text.includes('clean code') || text.includes('layout')) {
      scores['Frontend Developer'] = (scores['Frontend Developer'] || 0) + 3;
      scores['UI/UX Designer'] = (scores['UI/UX Designer'] || 0) + 3;
      scores['Web Designer'] = (scores['Web Designer'] || 0) + 2;
    }
    if (text.includes('fast') || text.includes('recommendation') || text.includes('backend') || text.includes('database') || text.includes('server') || text.includes('redis')) {
      scores['Backend Developer'] = (scores['Backend Developer'] || 0) + 3;
      scores['Full-Stack Developer'] = (scores['Full-Stack Developer'] || 0) + 3;
      scores['Cloud Engineer'] = (scores['Cloud Engineer'] || 0) + 2;
    }
    if (text.includes('app') || text.includes('mobile') || text.includes('phone') || text.includes('touchscreen') || text.includes('flutter')) {
      scores['Mobile App Developer'] = (scores['Mobile App Developer'] || 0) + 4;
      scores['Full-Stack Developer'] = (scores['Full-Stack Developer'] || 0) + 2;
    }
    if (text.includes('game') || text.includes('3d') || text.includes('mesh') || text.includes('shader') || text.includes('virtual world') || text.includes('virtual reality')) {
      scores['Game Developer'] = (scores['Game Developer'] || 0) + 4;
      scores['AR/VR Developer'] = (scores['AR/VR Developer'] || 0) + 4;
    }
    if (text.includes('bug') || text.includes('glitch') || text.includes('test') || text.includes('qa') || text.includes('unit test') || text.includes('edge case')) {
      scores['QA / Software Tester'] = (scores['QA / Software Tester'] || 0) + 4;
      scores['Software Developer'] = (scores['Software Developer'] || 0) + 2;
    }

    // 2. Data & AI
    if (text.includes('ai') || text.includes('machine learning') || text.includes('neural') || text.includes('model') || text.includes('prompt')) {
      scores['AI/ML Engineer'] = (scores['AI/ML Engineer'] || 0) + 4;
      scores['Data Scientist'] = (scores['Data Scientist'] || 0) + 3;
      scores['Prompt Engineer'] = (scores['Prompt Engineer'] || 0) + 3;
      scores['Research Engineer'] = (scores['Research Engineer'] || 0) + 2;
    }
    if (text.includes('data') || text.includes('chart') || text.includes('spreadsheet') || text.includes('trend') || text.includes('kpi') || text.includes('statistics')) {
      scores['Data Analyst'] = (scores['Data Analyst'] || 0) + 4;
      scores['Data Scientist'] = (scores['Data Scientist'] || 0) + 3;
      scores['Business Intelligence Analyst'] = (scores['Business Intelligence Analyst'] || 0) + 3;
      scores['Data Engineer'] = (scores['Data Engineer'] || 0) + 2;
    }
    if (text.includes('pipeline') || text.includes('kafka') || text.includes('etl') || text.includes('storage') || text.includes('organize 5,000 photos')) {
      scores['Data Engineer'] = (scores['Data Engineer'] || 0) + 4;
      scores['Cloud Engineer'] = (scores['Cloud Engineer'] || 0) + 2;
    }

    // 3. Cyber & Infrastructure
    if (text.includes('phishing') || text.includes('password') || text.includes('security') || text.includes('hack') || text.includes('firewall') || text.includes('breach')) {
      scores['Cybersecurity Analyst'] = (scores['Cybersecurity Analyst'] || 0) + 4;
      scores['Penetration Tester'] = (scores['Penetration Tester'] || 0) + 4;
      scores['SOC Analyst'] = (scores['SOC Analyst'] || 0) + 3;
    }
    if (text.includes('cloud') || text.includes('devops') || text.includes('docker') || text.includes('container') || text.includes('kubernetes') || text.includes('deploy')) {
      scores['Cloud Engineer'] = (scores['Cloud Engineer'] || 0) + 4;
      scores['DevOps Engineer'] = (scores['DevOps Engineer'] || 0) + 4;
      scores['System Administrator'] = (scores['System Administrator'] || 0) + 2;
    }
    if (text.includes('network') || text.includes('router') || text.includes('traffic') || text.includes('telecom')) {
      scores['Network Engineer'] = (scores['Network Engineer'] || 0) + 4;
      scores['System Administrator'] = (scores['System Administrator'] || 0) + 2;
    }

    // 4. Design & Digital Experience
    if (text.includes('figma') || text.includes('contrast') || text.includes('wcag') || text.includes('accessibility') || text.includes('user flow') || text.includes('drop-off')) {
      scores['UI/UX Designer'] = (scores['UI/UX Designer'] || 0) + 4;
      scores['Product Designer'] = (scores['Product Designer'] || 0) + 4;
      scores['Web Designer'] = (scores['Web Designer'] || 0) + 2;
    }
    if (text.includes('documentation') || text.includes('explain') || text.includes('writing') || text.includes('guide')) {
      scores['Technical Writer'] = (scores['Technical Writer'] || 0) + 4;
      scores['Product Manager'] = (scores['Product Manager'] || 0) + 2;
    }

    // 5. Business, Management & Emerging
    if (text.includes('business') || text.includes('startup') || text.includes('strategy') || text.includes('product manager') || text.includes('rice') || text.includes('stakeholder')) {
      scores['Product Manager'] = (scores['Product Manager'] || 0) + 4;
      scores['Business Analyst'] = (scores['Business Analyst'] || 0) + 4;
      scores['IT Consultant'] = (scores['IT Consultant'] || 0) + 3;
      scores['Project Coordinator'] = (scores['Project Coordinator'] || 0) + 3;
    }
    if (text.includes('robot') || text.includes('sensor') || text.includes('iot') || text.includes('drone') || text.includes('hardware') || text.includes('motor')) {
      scores['Robotics Engineer'] = (scores['Robotics Engineer'] || 0) + 4;
      scores['IoT Engineer'] = (scores['IoT Engineer'] || 0) + 4;
      scores['RPA Developer'] = (scores['RPA Developer'] || 0) + 2;
    }
    if (text.includes('automation') || text.includes('script') || text.includes('repetitive manual')) {
      scores['RPA Developer'] = (scores['RPA Developer'] || 0) + 4;
      scores['DevOps Engineer'] = (scores['DevOps Engineer'] || 0) + 3;
    }
    if (text.includes('hash set') || text.includes('stack') || text.includes('algorithm') || text.includes('time complexity') || text.includes('debugging')) {
      scores['Software Developer'] = (scores['Software Developer'] || 0) + 3;
      scores['Backend Developer'] = (scores['Backend Developer'] || 0) + 3;
      scores['Full-Stack Developer'] = (scores['Full-Stack Developer'] || 0) + 3;
    }
  });

  // Default baseline booster if user skipped immediately
  if (totalAnswers === 0) {
    if (track === 'first_year') {
      scores['Full-Stack Developer'] = 15;
      scores['Frontend Developer'] = 12;
      scores['Data Analyst'] = 10;
      scores['UI/UX Designer'] = 8;
    } else {
      scores['Full-Stack Developer'] = 16;
      scores['Backend Developer'] = 14;
      scores['Cloud Engineer'] = 11;
      scores['AI/ML Engineer'] = 9;
    }
  }

  // Sort roles descending by score
  const sorted = Object.entries(scores)
    .sort((a, b) => b[1] - a[1]);

  const maxScore = sorted[0]?.[1] || 1;

  const sortedScores = sorted.map(([role, score], idx) => {
    // Top role gets between 92% - 97%
    // 2nd gets between 85% - 90%
    // 3rd gets between 78% - 84%
    let conf: number;
    if (idx === 0) {
      conf = Math.min(97, Math.max(91, Math.round(91 + (score / Math.max(1, maxScore)) * 6)));
    } else if (idx === 1) {
      conf = Math.min(89, Math.max(83, Math.round(83 + (score / Math.max(1, maxScore)) * 6)));
    } else if (idx === 2) {
      conf = Math.min(83, Math.max(77, Math.round(77 + (score / Math.max(1, maxScore)) * 6)));
    } else {
      conf = Math.max(50, Math.round(55 + (score / Math.max(1, maxScore)) * 25));
    }
    return { role, score, confidence: conf };
  });

  const primary = sortedScores[0];
  return {
    primaryRole: primary.role,
    primaryConfidence: primary.confidence,
    sortedScores
  };
}

// ── Public API ────────────────────────────────────────────────────────────────
export const getCareerRecommendation = (
  roleType: 'first_year' | 'fresher' | 'student' | 'professional' | string,
  answers: Record<number, string>
): CareerRecommendation => {
  const normTrack =
    roleType === 'first_year'
      ? 'first_year'
      : roleType === 'fresher'
      ? 'fresher'
      : roleType === 'professional'
      ? 'fresher'
      : 'first_year';

  const { primaryRole, primaryConfidence, sortedScores } = scoreAssessment(normTrack, answers);

  const meta = ROLE_PROFILES[primaryRole] ?? ROLE_PROFILES['Full-Stack Developer'];

  // Identify next 2 closest related roles with percentages
  const closeRoles: AlternativeRole[] = sortedScores.slice(1, 3).map(item => {
    const rMeta = ROLE_PROFILES[item.role] ?? ROLE_PROFILES['Software Developer'];
    return {
      role: item.role,
      confidence: item.confidence,
      domain: rMeta.domain,
      reasoning: rMeta.reasoningTemplate
    };
  });

  return {
    role: primaryRole,
    confidence: primaryConfidence,
    reasoning: meta.reasoningTemplate,
    strengths: meta.strengths,
    weaknesses: meta.weaknesses,
    salaryRange: meta.salaryRange,
    futureScope: meta.futureScope,
    aiImpact: meta.aiImpact,
    demandScore: meta.demandScore,
    closeRoles,
    studentTrack: normTrack as 'first_year' | 'fresher'
  };
};

export const getRecommendationForRole = (
  roleName: string,
  track: 'first_year' | 'fresher' | 'professional' = 'fresher'
): CareerRecommendation => {
  const meta = ROLE_PROFILES[roleName] ?? ROLE_PROFILES['Full-Stack Developer'];
  const otherRoles = Object.keys(ROLE_PROFILES)
    .filter(r => r !== roleName && ROLE_PROFILES[r].domain === meta.domain)
    .slice(0, 2);
  const closeRoles: AlternativeRole[] = (otherRoles.length >= 2 ? otherRoles : ['Frontend Developer', 'Backend Developer'].filter(r => r !== roleName)).slice(0, 2).map((r, i) => {
    const rMeta = ROLE_PROFILES[r] ?? ROLE_PROFILES['Software Developer'];
    return {
      role: r,
      confidence: 88 - i * 4,
      domain: rMeta.domain,
      reasoning: rMeta.reasoningTemplate,
    };
  });

  return {
    role: roleName,
    confidence: 96,
    reasoning: meta.reasoningTemplate,
    strengths: meta.strengths,
    weaknesses: meta.weaknesses,
    salaryRange: meta.salaryRange,
    futureScope: meta.futureScope,
    aiImpact: meta.aiImpact,
    demandScore: meta.demandScore,
    closeRoles,
    studentTrack: track as any,
  };
};

export const careerEngine = { getCareerRecommendation, getRecommendationForRole, ROLE_PROFILES };
