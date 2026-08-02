export interface Question {
  id: number;
  text: string;
  options: string[];
  category: string;
}

export const STUDENT_QUESTIONS: Question[] = [
  {
    id: 1,
    text: "When you look at a new app, what's the first thing you notice?",
    options: ["How beautiful and clean it looks", "How fast and smooth it works", "The logic behind its features", "How it helps people solve a problem"],
    category: "interests"
  },
  {
    id: 2,
    text: "You're given a complex LEGO set. How do you start?",
    options: ["Follow the manual step-by-step", "Look at the picture and try to replicate it", "Sort all pieces by color and size first", "Build something completely different and better"],
    category: "logical_thinking"
  },
  {
    id: 3,
    text: "Which of these sounds like a fun weekend project?",
    options: ["Designing a logo for a friend", "Writing a script to automate a task", "Organizing a community event", "Analyzing data to find trends"],
    category: "creativity"
  },
  {
    id: 4,
    text: "How do you feel about public speaking?",
    options: ["I love sharing my ideas with a crowd", "I'm okay if I'm well-prepared", "I prefer writing my thoughts down", "I'd rather let my work speak for itself"],
    category: "communication"
  },
  {
    id: 5,
    text: "When working in a group, you usually are the one who...",
    options: ["Comes up with the vision", "Gets the actual work done", "Keeps everyone organized and on track", "Resolves conflicts and helps others"],
    category: "leadership"
  },
  {
    id: 6,
    text: "Which subject always caught your attention in school?",
    options: ["Math or Physics", "Arts or Literature", "Computers or Technology", "Economics or Business"],
    category: "technical_mindset"
  },
  {
    id: 7,
    text: "If you could solve one global problem, what would it be?",
    options: ["Simplifying complex information", "Building sustainable technology", "Improving how people communicate", "Optimizing business efficiency"],
    category: "problem_solving"
  },
  {
    id: 8,
    text: "How do you handle a bug in a game or app?",
    options: ["Try to figure out why it happened", "Just restart and move on", "Report it with detail to the developer", "Think of a better way the feature should work"],
    category: "analytical_thinking"
  },
  {
    id: 9,
    text: "Do you enjoy sketching or organizing layouts?",
    options: ["Yes, I love visual harmony", "Sometimes, but I prefer the logic", "I prefer working with numbers", "I prefer talking to people"],
    category: "design_interest"
  },
  {
    id: 10,
    text: "What motivates you the most?",
    options: ["Creating something original", "Solving a difficult puzzle", "Leading a team to success", "Making an impact on society"],
    category: "motivation"
  },
  {
    id: 11,
    text: "How do you feel about Artificial Intelligence?",
    options: ["I want to know how it works internally", "I want to use it to create cool things", "I'm curious about its impact on business", "I'm worried about its ethical implications"],
    category: "ai_curiosity"
  },
  {
    id: 12,
    text: "Which work environment sounds best to you?",
    options: ["A high-growth, fast-paced startup", "A structured, stable corporation", "Working solo as a freelancer", "Leading my own company"],
    category: "work_environment"
  },
  {
    id: 13,
    text: "When you learn something new, you prefer...",
    options: ["Watching a visual demo", "Reading the technical documentation", "Just diving in and trying it", "Discussing it with a mentor"],
    category: "learning_style"
  },
  {
    id: 14,
    text: "How do you spend your free time online?",
    options: ["Watching tutorials or tech news", "Looking at design inspiration", "Reading about business and startups", "Gaming or social networking"],
    category: "habits"
  },
  {
    id: 15,
    text: "If you were to start a YouTube channel, it would be about...",
    options: ["Coding and technology", "Product reviews and business", "Creative arts and design", "Self-improvement and leadership"],
    category: "self_expression"
  }
];

export const PROFESSIONAL_QUESTIONS: Question[] = [
  {
    id: 1,
    text: "What is your primary area of expertise currently?",
    options: ["Software Development", "Design & Creative", "Management & Strategy", "Data & Analytics"],
    category: "domain"
  },
  {
    id: 2,
    text: "How do you approach a large, complex technical project?",
    options: ["Design the architecture first", "Break it into small, manageable tasks", "Define the business goals first", "Focus on the user experience first"],
    category: "architecture"
  },
  {
    id: 3,
    text: "What's your preferred management style?",
    options: ["Lead by example (hands-on)", "Empower and delegate (mentorship)", "Data-driven and objective", "Strategic and vision-oriented"],
    category: "management"
  },
  {
    id: 4,
    text: "How do you handle high-pressure deadlines?",
    options: ["Optimize workflows to speed up", "Communicate early and manage expectations", "Dive deep and work extra hours", "Re-prioritize the roadmap features"],
    category: "resilience"
  },
  {
    id: 5,
    text: "Which of these excites you most in a new tech stack?",
    options: ["Scalability and performance", "Developer experience and clean code", "Visual possibilities and UI polish", "Business integration and ROI"],
    category: "technical_confidence"
  },
  {
    id: 6,
    text: "When a team member is struggling, how do you help?",
    options: ["Give them a clear set of instructions", "Pair program/work with them", "Analyze why they are stuck and provide resources", "Coach them to find their own solution"],
    category: "people_handling"
  },
  {
    id: 7,
    text: "How do you measure the success of a product?",
    options: ["Code quality and uptime", "User engagement and satisfaction", "Revenue and market growth", "Innovation and industry impact"],
    category: "product_thinking"
  },
  {
    id: 8,
    text: "What's your stance on automation?",
    options: ["Automate everything possible", "Automate only repetitive tasks", "Prefer manual control for quality", "Focus on automating business logic"],
    category: "automation"
  },
  {
    id: 9,
    text: "Which role do you see yourself in 3 years?",
    options: ["CTO or Technical Lead", "Product Head or Founder", "Design Director", "Strategic Consultant"],
    category: "ambition"
  },
  {
    id: 10,
    text: "How do you stay updated with industry trends?",
    options: ["Reading deep-dive technical papers", "Networking with other professionals", "Experimenting with side projects", "Following industry thought leaders"],
    category: "learning_mindset"
  },
  {
    id: 11,
    text: "What is your biggest strength in a meeting?",
    options: ["Critical thinking and logic", "Creative ideas and visuals", "Facilitation and organization", "Decision making and clarity"],
    category: "soft_skills"
  },
  {
    id: 12,
    text: "How do you feel about shifting to a new domain?",
    options: ["Excited to learn from scratch", "Confident if I can apply my current skills", "Prefer to master my current domain", "Only if it aligns with a long-term goal"],
    category: "adaptability"
  },
  {
    id: 13,
    text: "What's your approach to 'Technical Debt'?",
    options: ["Refactor continuously", "Plan dedicated sprints to fix it", "Ignore it if the product is shipping", "Balance it against feature delivery"],
    category: "decision_making"
  },
  {
    id: 14,
    text: "How do you value 'Work-Life Balance'?",
    options: ["Crucial for long-term productivity", "Flexible depending on the project phase", "I live for my work", "I prefer a clear separation"],
    category: "culture"
  },
  {
    id: 15,
    text: "What would you do if you were given $1M for a startup?",
    options: ["Hire the best engineers", "Focus on marketing and sales", "Build a revolutionary UI/UX", "Spend time on deep R&D"],
    category: "innovation"
  }
];
