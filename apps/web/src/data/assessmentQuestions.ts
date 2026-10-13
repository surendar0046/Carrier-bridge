export interface Question {
  id: number;
  text: string;
  category: string;
  codeSnippet?: string;
  options: string[];
  roleMapping?: Record<number, string[]>; // Option index (0-3) -> associated job roles
}

export const TARGET_JOB_ROLES = {
  software: [
    'Software Developer',
    'Full-Stack Developer',
    'Frontend Developer',
    'Backend Developer',
    'Mobile App Developer',
    'Game Developer',
    'QA / Software Tester'
  ],
  dataAi: [
    'Data Analyst',
    'Data Scientist',
    'AI/ML Engineer',
    'Business Intelligence Analyst',
    'Data Engineer',
    'Prompt Engineer'
  ],
  cyberInfra: [
    'Cybersecurity Analyst',
    'Penetration Tester',
    'Network Engineer',
    'Cloud Engineer',
    'DevOps Engineer',
    'System Administrator',
    'SOC Analyst'
  ],
  designExp: [
    'UI/UX Designer',
    'Product Designer',
    'Web Designer',
    'Graphic Designer',
    'Technical Writer'
  ],
  businessEmerging: [
    'Business Analyst',
    'Product Manager',
    'Project Coordinator',
    'IT Consultant',
    'Technical Support Engineer',
    'RPA Developer',
    'IoT Engineer',
    'Robotics Engineer',
    'AR/VR Developer',
    'Research Engineer'
  ]
};

// ─────────────────────────────────────────────────────────────────────────────
// TRACK 1: 1st YEAR STUDENTS (AFTER 12th COMPLETED) - 20 MCQs
// Focused on: Way of Thinking, Problem Solving Style, Aptitude, Curiosity & Interests
// ─────────────────────────────────────────────────────────────────────────────
export const FIRST_YEAR_QUESTIONS: Question[] = [
  {
    id: 1,
    text: "When you open an app like Instagram or Swiggy, what is the first thing that catches your curiosity?",
    category: "curiosity",
    options: [
      "The visual design, colors, smooth animations, and button layouts",
      "How fast the feed loads and how recommendations instantly show up",
      "Wondering where user passwords and banking data are kept safe",
      "How the entire business model works to connect users and restaurants"
    ],
    roleMapping: {
      0: ['UI/UX Designer', 'Frontend Developer', 'Product Designer', 'Web Designer'],
      1: ['Backend Developer', 'Data Engineer', 'AI/ML Engineer', 'Full-Stack Developer'],
      2: ['Cybersecurity Analyst', 'SOC Analyst', 'Network Engineer', 'Penetration Tester'],
      3: ['Product Manager', 'Business Analyst', 'IT Consultant', 'Project Coordinator']
    }
  },
  {
    id: 2,
    text: "You are given a complex puzzle with 1,000 pieces. How do you naturally tackle it?",
    category: "problem_solving",
    options: [
      "I group similar colors and patterns visually before piecing them together",
      "I sort by edge and corner pieces systematically with a step-by-step strategy",
      "I look for recurring mathematical patterns and symmetries in the cutouts",
      "I build the main recognizable landmarks first, then assemble outward"
    ],
    roleMapping: {
      0: ['Graphic Designer', 'UI/UX Designer', 'Game Developer', 'AR/VR Developer'],
      1: ['Software Developer', 'Backend Developer', 'System Administrator', 'DevOps Engineer'],
      2: ['Data Scientist', 'Data Analyst', 'Research Engineer', 'AI/ML Engineer'],
      3: ['Full-Stack Developer', 'Product Designer', 'Project Coordinator', 'Mobile App Developer']
    }
  },
  {
    id: 3,
    text: "If you had a completely free weekend to create a digital project from scratch, you would choose:",
    category: "interests",
    options: [
      "Building a mobile game or 3D interactive virtual world",
      "Creating an AI tool that summarizes books or writes customized poems",
      "Designing a clean personal portfolio website or creative brand aesthetic",
      "Programming a smart home sensor or automation bot that turns lights on/off"
    ],
    roleMapping: {
      0: ['Game Developer', 'AR/VR Developer', 'Mobile App Developer', 'Software Developer'],
      1: ['AI/ML Engineer', 'Prompt Engineer', 'Data Scientist', 'Research Engineer'],
      2: ['Frontend Developer', 'Web Designer', 'UI/UX Designer', 'Graphic Designer'],
      3: ['IoT Engineer', 'Robotics Engineer', 'RPA Developer', 'Cloud Engineer']
    }
  },
  {
    id: 4,
    text: "You notice that whenever it rains heavily in your city, ride-booking fares triple. What's your reaction?",
    category: "data_mindset",
    options: [
      "I want to examine the supply vs demand data chart to calculate the surge formula",
      "I think about how the app server handles thousands of simultaneous booking spikes",
      "I think about how to redesign the surge alert screen so riders don't feel frustrated",
      "I think about the strategic business logic and surge compensation for drivers"
    ],
    roleMapping: {
      0: ['Data Analyst', 'Data Scientist', 'Business Intelligence Analyst', 'Data Engineer'],
      1: ['Backend Developer', 'Cloud Engineer', 'DevOps Engineer', 'System Administrator'],
      2: ['UI/UX Designer', 'Product Designer', 'Technical Writer'],
      3: ['Business Analyst', 'Product Manager', 'IT Consultant']
    }
  },
  {
    id: 5,
    text: "You receive an SMS claiming you won a ₹25,000 lottery with a suspicious short-link. Your immediate instinct:",
    category: "security_awareness",
    options: [
      "Curious to analyze the link URL and headers to see who created the phishing trap",
      "Immediately delete and warn family/friends about social engineering scams",
      "Wonder how telecom firewalls allow fraudulent spam messages to get delivered",
      "Think of developing an AI scam-detection app that auto-quarantines suspicious SMS"
    ],
    roleMapping: {
      0: ['Penetration Tester', 'Cybersecurity Analyst', 'SOC Analyst'],
      1: ['Technical Support Engineer', 'IT Consultant', 'Technical Writer'],
      2: ['Network Engineer', 'System Administrator', 'DevOps Engineer'],
      3: ['AI/ML Engineer', 'Mobile App Developer', 'Software Developer']
    }
  },
  {
    id: 6,
    text: "When your phone's battery drains very fast while running an app, what do you think is happening?",
    category: "technical_curiosity",
    options: [
      "The app probably has unoptimized background loops or memory leaks running",
      "The phone's operating system and hardware chips aren't managing power states well",
      "The app is continually querying servers or GPS sensors without efficient caching",
      "The app developers didn't do thorough automated performance testing before launch"
    ],
    roleMapping: {
      0: ['Software Developer', 'Mobile App Developer', 'Backend Developer'],
      1: ['Robotics Engineer', 'IoT Engineer', 'System Administrator'],
      2: ['Cloud Engineer', 'Network Engineer', 'Full-Stack Developer'],
      3: ['QA / Software Tester', 'DevOps Engineer', 'Project Coordinator']
    }
  },
  {
    id: 7,
    text: "Which school/college subject did you enjoy learning the most?",
    category: "academic_aptitude",
    options: [
      "Computer Science / Programming — logic, coding, and building algorithms",
      "Mathematics & Statistics — probability, geometry, and numerical patterns",
      "Physics & Electronics — circuits, mechanics, how hardware machines work",
      "English & Arts — creative writing, visual drawing, and storytelling"
    ],
    roleMapping: {
      0: ['Software Developer', 'Full-Stack Developer', 'Frontend Developer', 'Backend Developer'],
      1: ['Data Scientist', 'Data Analyst', 'AI/ML Engineer', 'Research Engineer'],
      2: ['Robotics Engineer', 'IoT Engineer', 'Network Engineer', 'System Administrator'],
      3: ['UI/UX Designer', 'Graphic Designer', 'Technical Writer', 'Prompt Engineer']
    }
  },
  {
    id: 8,
    text: "When you have to learn how a new gadget (like a smartwatch or drone) works, you usually:",
    category: "learning_style",
    options: [
      "Jump straight in, tap every setting and feature, and experiment intuitively",
      "Read the guide or watch a detailed teardown tutorial explaining its internals",
      "Test its limits to see under what conditions it fails or glitches",
      "Explore how it syncs with other devices and communicates over Bluetooth/Wi-Fi"
    ],
    roleMapping: {
      0: ['UI/UX Designer', 'Mobile App Developer', 'Game Developer'],
      1: ['Technical Writer', 'Research Engineer', 'IT Consultant'],
      2: ['QA / Software Tester', 'Penetration Tester', 'SOC Analyst'],
      3: ['Network Engineer', 'IoT Engineer', 'Cloud Engineer']
    }
  },
  {
    id: 9,
    text: "How do you feel about interacting with AI tools like ChatGPT or Gemini?",
    category: "ai_inclination",
    options: [
      "Fascinated by engineering clever prompts to make it generate exact outputs",
      "Curious about the underlying machine learning algorithms and neural networks",
      "Excited to integrate AI APIs into custom web and mobile applications",
      "Interested in the ethical questions, data privacy, and societal impact"
    ],
    roleMapping: {
      0: ['Prompt Engineer', 'Technical Writer', 'Product Manager'],
      1: ['AI/ML Engineer', 'Data Scientist', 'Research Engineer'],
      2: ['Full-Stack Developer', 'Software Developer', 'Mobile App Developer'],
      3: ['Cybersecurity Analyst', 'Business Analyst', 'IT Consultant']
    }
  },
  {
    id: 10,
    text: "In a group project with 4 classmates, which role do you naturally end up taking?",
    category: "team_dynamics",
    options: [
      "The Builder who actually codes the core engine and writes the logic",
      "The Designer who ensures the slides, posters, and demo look world-class",
      "The Coordinator who defines the timeline, keeps everyone on track, and presents",
      "The Reviewer who double-checks calculations, catches errors, and tests details"
    ],
    roleMapping: {
      0: ['Software Developer', 'Backend Developer', 'Full-Stack Developer'],
      1: ['UI/UX Designer', 'Graphic Designer', 'Web Designer'],
      2: ['Project Coordinator', 'Product Manager', 'Business Analyst'],
      3: ['QA / Software Tester', 'Data Analyst', 'SOC Analyst']
    }
  },
  {
    id: 11,
    text: "You are playing a video game and notice a character clip through a solid wall. What crosses your mind?",
    category: "analytical_mindset",
    options: [
      "That's a 3D bounding box collision mesh detection glitch in the game engine",
      "I wonder if I can exploit this glitch to skip levels or access secret areas",
      "The visual glitch ruins immersion — the 3D textures and lighting need polish",
      "The QA test team should have caught this edge-case during playtesting"
    ],
    roleMapping: {
      0: ['Game Developer', 'AR/VR Developer', 'Software Developer'],
      1: ['Penetration Tester', 'Cybersecurity Analyst', 'Security Researcher'],
      2: ['UI/UX Designer', 'Product Designer', 'Graphic Designer'],
      3: ['QA / Software Tester', 'Technical Support Engineer', 'DevOps Engineer']
    }
  },
  {
    id: 12,
    text: "If you had to organize 5,000 photos on your laptop, what is your preferred approach?",
    category: "data_organization",
    options: [
      "Write a quick script or rule to auto-sort them by year, event, and facial tags",
      "Create clean visual folders with aesthetic cover thumbnails and color tags",
      "Store them in an encrypted cloud drive with automated multi-device backup sync",
      "Build a database spreadsheet cataloging dates, locations, and descriptions"
    ],
    roleMapping: {
      0: ['Data Engineer', 'RPA Developer', 'Software Developer'],
      1: ['Graphic Designer', 'UI/UX Designer', 'Web Designer'],
      2: ['Cloud Engineer', 'System Administrator', 'DevOps Engineer'],
      3: ['Data Analyst', 'Business Intelligence Analyst', 'Database Administrator']
    }
  },
  {
    id: 13,
    text: "Which of these everyday tech challenges sounds most satisfying to conquer?",
    category: "satisfaction",
    options: [
      "Turning an idea from a paper napkin sketch into a functioning mobile/web app",
      "Finding an invisible error in 500 lines of code that fixes a system crash",
      "Discovering a hidden customer trend in a spreadsheet that boosts business profits",
      "Hardening a network so no outside hacker can breach company databases"
    ],
    roleMapping: {
      0: ['Frontend Developer', 'Full-Stack Developer', 'Mobile App Developer'],
      1: ['Backend Developer', 'Software Developer', 'QA / Software Tester'],
      2: ['Data Analyst', 'Business Analyst', 'Business Intelligence Analyst'],
      3: ['Cybersecurity Analyst', 'Network Engineer', 'Cloud Engineer']
    }
  },
  {
    id: 14,
    text: "How do you explain a complex concept (like how GPS works) to a younger sibling?",
    category: "communication",
    options: [
      "Draw visual diagrams showing satellites and triangle distances on paper",
      "Use an interactive storytelling analogy comparing it to lighthouses guiding ships",
      "Break it down into numbered logical facts: satellites, time signals, calculations",
      "Show them live on Google Maps by testing signal drops in a basement or tunnel"
    ],
    roleMapping: {
      0: ['UI/UX Designer', 'Graphic Designer', 'Web Designer'],
      1: ['Technical Writer', 'Product Manager', 'Prompt Engineer'],
      2: ['Data Scientist', 'Business Analyst', 'IT Consultant'],
      3: ['Technical Support Engineer', 'Network Engineer', 'QA / Software Tester']
    }
  },
  {
    id: 15,
    text: "If you were hired by an electric car company (like Tesla or Tata EV), which department would you join?",
    category: "emerging_tech",
    options: [
      "Autonomous Self-Driving: Computer vision neural nets and sensor perception",
      "Embedded Vehicle Control: Microcontrollers, battery sensors, and robotic motors",
      "Center Dashboard Display: Sleek touchscreen UI and mobile companion app",
      "Fleet Security & Cloud: Encrypted satellite telemetry and cloud OTA updates"
    ],
    roleMapping: {
      0: ['AI/ML Engineer', 'Research Engineer', 'Data Scientist'],
      1: ['Robotics Engineer', 'IoT Engineer', 'RPA Developer'],
      2: ['UI/UX Designer', 'Frontend Developer', 'Mobile App Developer'],
      3: ['Cloud Engineer', 'Cybersecurity Analyst', 'DevOps Engineer']
    }
  },
  {
    id: 16,
    text: "When you hear about a major company getting hacked and leaking user passwords, what question arises?",
    category: "security_mindset",
    options: [
      "Did they store passwords in plain text or use salted cryptographic hashing?",
      "Which network firewall port or employee credential did the attackers compromise?",
      "How will the security team detect the breach in their Security Operations Center?",
      "How can security training and policies prevent employee phishing mistakes?"
    ],
    roleMapping: {
      0: ['Backend Developer', 'Penetration Tester', 'Software Developer'],
      1: ['Network Engineer', 'Cloud Engineer', 'Cybersecurity Analyst'],
      2: ['SOC Analyst', 'System Administrator', 'DevOps Engineer'],
      3: ['IT Consultant', 'Technical Writer', 'Business Analyst']
    }
  },
  {
    id: 17,
    text: "What type of workspace environment excites you the most?",
    category: "work_style",
    options: [
      "A fast-paced software studio turning product ideas into live code sprints",
      "A high-tech lab experimenting with artificial intelligence models and robotics",
      "A creative design room filled with moodboards, color swatches, and Figma canvases",
      "A mission-critical command center monitoring cybersecurity defense and cloud servers"
    ],
    roleMapping: {
      0: ['Full-Stack Developer', 'Frontend Developer', 'Software Developer', 'Mobile App Developer'],
      1: ['AI/ML Engineer', 'Robotics Engineer', 'Research Engineer', 'Data Scientist'],
      2: ['Product Designer', 'UI/UX Designer', 'Web Designer', 'Graphic Designer'],
      3: ['Cloud Engineer', 'SOC Analyst', 'DevOps Engineer', 'Network Engineer']
    }
  },
  {
    id: 18,
    text: "When you see repetitive work (like copying 500 email IDs one by one), how do you react?",
    category: "automation_instinct",
    options: [
      "I refuse to do it manually — I'd find an automation tool or write a script",
      "I look for keyboard shortcuts or spreadsheet macros to do it 10x faster",
      "I wonder why the app doesn't have an export button and design a better UI",
      "I map out the end-to-end workflow to see if the process can be eliminated"
    ],
    roleMapping: {
      0: ['RPA Developer', 'DevOps Engineer', 'Software Developer'],
      1: ['Data Analyst', 'Data Engineer', 'Backend Developer'],
      2: ['UI/UX Designer', 'Product Designer', 'Frontend Developer'],
      3: ['Business Analyst', 'Product Manager', 'Project Coordinator']
    }
  },
  {
    id: 19,
    text: "Which of these futuristic technologies do you believe will change human life the most in 10 years?",
    category: "vision",
    options: [
      "Augmented & Virtual Reality replacing physical computer screens and phones",
      "Artificial General Intelligence assisting humans in science, coding, and medicine",
      "Autonomous robotics handling logistics, surgeries, and hazardous exploration",
      "Decentralized secure networks and quantum-proof cloud infrastructure"
    ],
    roleMapping: {
      0: ['AR/VR Developer', 'Game Developer', 'UI/UX Designer'],
      1: ['AI/ML Engineer', 'Data Scientist', 'Prompt Engineer', 'Research Engineer'],
      2: ['Robotics Engineer', 'IoT Engineer', 'RPA Developer'],
      3: ['Cloud Engineer', 'Cybersecurity Analyst', 'DevOps Engineer', 'Network Engineer']
    }
  },
  {
    id: 20,
    text: "When you graduate college 4 years from now, what achievement would make you proudest?",
    category: "aspiration",
    options: [
      "Having built a popular software or mobile app used by millions of people",
      "Leading an AI or data research project that discovered groundbreaking insights",
      "Protecting critical national or corporate infrastructure from cyber attacks",
      "Leading product strategy and cross-functional teams as an impactful tech manager"
    ],
    roleMapping: {
      0: ['Full-Stack Developer', 'Software Developer', 'Mobile App Developer', 'Frontend Developer'],
      1: ['AI/ML Engineer', 'Data Scientist', 'Data Engineer', 'Research Engineer'],
      2: ['Cybersecurity Analyst', 'Cloud Engineer', 'Penetration Tester', 'DevOps Engineer'],
      3: ['Product Manager', 'Business Analyst', 'IT Consultant', 'Project Coordinator']
    }
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// TRACK 2: COLLEGE FRESHERS (2nd, 3rd, 4th YEAR) - 20 MCQs
// Includes:
// • 2 Debugging Code Questions
// • 2 Beginner Level Code Questions
// • 2 Designing Related Questions
// • 2 Scenario-Based Questions
// • 12 Specialized Domain & Technical Questions
// ─────────────────────────────────────────────────────────────────────────────
export const FRESHER_QUESTIONS: Question[] = [
  // ── 2 DEBUGGING CODE QUESTIONS ──
  {
    id: 1,
    text: "[DEBUGGING 1] The function below is supposed to return active users, but it returns an empty array. What is the bug?",
    category: "debugging",
    codeSnippet: `async function getActiveUsers(users) {
  const active = [];
  users.forEach(async (user) => {
    const isOnline = await checkStatus(user.id);
    if (isOnline) active.push(user);
  });
  return active; // ⚠️ Returns [] before callbacks finish!
}`,
    options: [
      "forEach does not await asynchronous callback promises; Promise.all should be used",
      "The checkStatus function parameter user.id must be converted to an integer",
      "The active array is declared with const and cannot be mutated with push",
      "Arrow functions cannot be declared async inside array iteration methods"
    ],
    roleMapping: {
      0: ['Full-Stack Developer', 'Backend Developer', 'Software Developer'],
      1: ['QA / Software Tester', 'Frontend Developer'],
      2: ['Technical Support Engineer', 'Prompt Engineer'],
      3: ['IT Consultant', 'Business Analyst']
    }
  },
  {
    id: 2,
    text: "[DEBUGGING 2] The Python API endpoint below throws 'TypeError: can only concatenate str to str' on checkout. Where is the bug?",
    category: "debugging",
    codeSnippet: `def calculate_total(cart_items, tax_rate="0.08"):
    subtotal = sum(item['price'] * item['qty'] for item in cart_items)
    total = subtotal + (subtotal * tax_rate) # ⚠️ Bug here!
    return round(total, 2)`,
    options: [
      "tax_rate default parameter is a string ('0.08'); it must be cast to float before multiplication",
      "The sum generator expression needs square brackets to evaluate into a list first",
      "The round() function cannot accept floating point calculations as its first argument",
      "item['qty'] must be indexed using dot notation item.qty in Python dictionaries"
    ],
    roleMapping: {
      0: ['Backend Developer', 'Software Developer', 'QA / Software Tester'],
      1: ['Data Engineer', 'Data Analyst'],
      2: ['Frontend Developer', 'UI/UX Designer'],
      3: ['Business Analyst', 'Project Coordinator']
    }
  },

  // ── 2 BEGINNER LEVEL CODE QUESTIONS ──
  {
    id: 3,
    text: "[CODE LOGIC 1] You need to find if an array of N integers contains any duplicates. Which approach achieves O(N) time complexity?",
    category: "code_logic",
    codeSnippet: `// Example: nums = [1, 2, 3, 1] -> returns true
// Constraint: Time efficiency is prioritized over minimal memory`,
    options: [
      "Insert elements into a Hash Set while iterating and return true if element already exists (O(N) time, O(N) space)",
      "Use two nested loops comparing every element i with every element j (O(N²) time, O(1) space)",
      "Sort the array in-place with quicksort and check adjacent pairs (O(N log N) time, O(1) space)",
      "Perform binary search on every item against the remaining sub-array (O(N log N) time)"
    ],
    roleMapping: {
      0: ['Software Developer', 'Backend Developer', 'Full-Stack Developer'],
      1: ['QA / Software Tester', 'Technical Support Engineer'],
      2: ['Data Scientist', 'AI/ML Engineer'],
      3: ['Mobile App Developer', 'Game Developer']
    }
  },
  {
    id: 4,
    text: "[CODE LOGIC 2] Which data structure is ideal for implementing an 'Undo' operation in a text editor or browser back history?",
    category: "code_logic",
    codeSnippet: `// Sequence: Type 'A' -> Type 'B' -> Action: UNDO -> Current state: 'A'
// Order: Last In, First Out (LIFO)`,
    options: [
      "Stack (LIFO — push state on action, pop state on undo in O(1) time)",
      "Queue (FIFO — enqueue state on action, dequeue on undo)",
      "Binary Search Tree (O(log N) traversal lookup)",
      "Hash Table (Key-value pairing without temporal ordering)"
    ],
    roleMapping: {
      0: ['Software Developer', 'Frontend Developer', 'Mobile App Developer'],
      1: ['Backend Developer', 'System Administrator'],
      2: ['Data Analyst', 'Business Analyst'],
      3: ['DevOps Engineer', 'Cloud Engineer']
    }
  },

  // ── 2 DESIGNING RELATED QUESTIONS ──
  {
    id: 5,
    text: "[DESIGNING 1] According to UI/UX accessibility (WCAG AA), what is the minimum contrast ratio required for standard body text against background?",
    category: "design_ui",
    options: [
      "4.5:1 contrast ratio to ensure legibility for users with visual impairments",
      "2.0:1 contrast ratio is sufficient for modern OLED mobile screens",
      "7.0:1 contrast ratio is only required for bold decorative hero headers",
      "Contrast ratio does not matter if font weight is set to bold 700+"
    ],
    roleMapping: {
      0: ['UI/UX Designer', 'Web Designer', 'Product Designer', 'Frontend Developer'],
      1: ['Graphic Designer', 'Technical Writer'],
      2: ['Software Developer', 'Mobile App Developer'],
      3: ['QA / Software Tester', 'Business Analyst']
    }
  },
  {
    id: 6,
    text: "[DESIGNING 2] An e-commerce app has a 45% drop-off at the checkout screen. As a Product Designer, what is your primary UX diagnosis?",
    category: "design_ux",
    options: [
      "Friction in user flow: forced account registration, hidden delivery costs, and too many form fields",
      "The primary Buy button color is blue instead of vibrant gradient purple",
      "The product photos on the previous listing page are not 4K resolution",
      "The copyright footer in the checkout layout is taking up too much vertical space"
    ],
    roleMapping: {
      0: ['Product Designer', 'UI/UX Designer', 'Product Manager', 'Business Analyst'],
      1: ['Graphic Designer', 'Web Designer'],
      2: ['Frontend Developer', 'Full-Stack Developer'],
      3: ['QA / Software Tester', 'IT Consultant']
    }
  },

  // ── 2 SCENARIO BASED QUESTIONS ──
  {
    id: 7,
    text: "[SCENARIO 1] During a flash sale, your API server CPU hits 98% and response times spike to 12s because 50,000 users query product stock simultaneously. Best architectural solution:",
    category: "system_scenario",
    options: [
      "Implement a Redis In-Memory Cache with TTL for product stock and add an API Rate Limiter",
      "Increase database column widths and rewrite all SQL queries with stored procedures",
      "Ask frontend developers to disable pull-to-refresh on mobile apps",
      "Upgrade the server RAM manually during the live sale without touching software architecture"
    ],
    roleMapping: {
      0: ['Backend Developer', 'Cloud Engineer', 'DevOps Engineer', 'System Administrator'],
      1: ['Data Engineer', 'Software Developer'],
      2: ['Frontend Developer', 'Mobile App Developer'],
      3: ['Technical Support Engineer', 'IT Consultant']
    }
  },
  {
    id: 8,
    text: "[SCENARIO 2] An intern accidentally commits a database credentials file (.env) to a public GitHub repository. What is the immediate correct security response?",
    category: "security_scenario",
    options: [
      "Immediately rotate/invalidate all exposed DB passwords & API keys, purge Git history, and audit access logs",
      "Delete the repository file in the next git commit with a message 'remove env'",
      "Make the repository private and leave existing passwords unchanged",
      "Restart the database container so the password gets automatically encrypted"
    ],
    roleMapping: {
      0: ['DevOps Engineer', 'Cybersecurity Analyst', 'Cloud Engineer', 'Penetration Tester'],
      1: ['Software Developer', 'Backend Developer'],
      2: ['System Administrator', 'Network Engineer'],
      3: ['QA / Software Tester', 'Technical Support Engineer']
    }
  },

  // ── 12 TECHNICAL DOMAIN SPECIALIZATION QUESTIONS ──
  {
    id: 9,
    text: "In React.js, why is mutating state directly (e.g., state.items.push(newItem)) considered an anti-pattern?",
    category: "frontend_dev",
    options: [
      "React relies on shallow object reference equality (Object.is) to trigger re-renders; mutation bypasses virtual DOM diffing",
      "JavaScript arrays are immutable by language specification and throw runtime exceptions",
      "Direct mutation breaks CSS styling and flexbox layouts in the rendered browser DOM",
      "Mutating state causes HTTP headers to get stripped on client-side requests"
    ],
    roleMapping: {
      0: ['Frontend Developer', 'Full-Stack Developer', 'Web Designer'],
      1: ['Software Developer', 'Mobile App Developer'],
      2: ['UI/UX Designer', 'Product Designer'],
      3: ['QA / Software Tester', 'Technical Support Engineer']
    }
  },
  {
    id: 10,
    text: "When designing microservice architectures, what does API 'Idempotency' guarantee?",
    category: "backend_systems",
    options: [
      "Making multiple identical requests (e.g. payment retry) produces the exact same server state without duplicate charges",
      "All API endpoints must respond in strictly less than 100 milliseconds",
      "The database automatically creates composite foreign keys across services",
      "The API requires OAuth2 authentication on every HTTP GET request"
    ],
    roleMapping: {
      0: ['Backend Developer', 'Full-Stack Developer', 'Software Developer', 'Cloud Engineer'],
      1: ['DevOps Engineer', 'System Administrator'],
      2: ['QA / Software Tester', 'IT Consultant'],
      3: ['Business Analyst', 'Project Coordinator']
    }
  },
  {
    id: 11,
    text: "In Machine Learning, what is the fundamental trade-off illustrated by 'Overfitting'?",
    category: "data_ml",
    options: [
      "Model memorizes training data noise and achieves near 100% training accuracy but fails to generalize on unseen test data",
      "Model is too simple and has high bias on both training and test data",
      "Dataset has too many rows causing gradient descent to diverge into infinity",
      "Neural network has zero dropout layers causing memory leaks on the GPU"
    ],
    roleMapping: {
      0: ['Data Scientist', 'AI/ML Engineer', 'Research Engineer'],
      1: ['Data Analyst', 'Business Intelligence Analyst'],
      2: ['Data Engineer', 'Software Developer'],
      3: ['Prompt Engineer', 'Product Manager']
    }
  },
  {
    id: 12,
    text: "When building an AI assistant with Large Language Models (LLMs), when should you choose RAG (Retrieval-Augmented Generation) over Fine-Tuning?",
    category: "ai_engineering",
    options: [
      "When the model needs real-time, dynamic access to private proprietary documents without hallucinating or retraining weights",
      "When you want to teach the model a completely new human language grammar syntax",
      "When you have less than 100 KB of total storage on your local server",
      "When you want to eliminate API costs by running the model completely client-side in browser memory"
    ],
    roleMapping: {
      0: ['AI/ML Engineer', 'Prompt Engineer', 'Data Engineer', 'Research Engineer'],
      1: ['Data Scientist', 'Full-Stack Developer'],
      2: ['Backend Developer', 'Cloud Engineer'],
      3: ['Technical Writer', 'Product Manager']
    }
  },
  {
    id: 13,
    text: "What is the primary role of a SOC (Security Operations Center) Analyst during an active cyber intrusion?",
    category: "cybersecurity",
    options: [
      "Triage SIEM alert anomalies, isolate compromised endpoints, analyze malware telemetry, and contain threat lateral movement",
      "Reinstall the operating system on all office laptops without investigation",
      "Write marketing press releases about the company's cybersecurity certifications",
      "Change DNS records to point all employee email traffic to an external proxy"
    ],
    roleMapping: {
      0: ['SOC Analyst', 'Cybersecurity Analyst', 'Penetration Tester'],
      1: ['Network Engineer', 'System Administrator'],
      2: ['DevOps Engineer', 'Cloud Engineer'],
      3: ['Technical Support Engineer', 'IT Consultant']
    }
  },
  {
    id: 14,
    text: "In Cloud & DevOps practices, why are Docker containers preferred over traditional Virtual Machines (VMs)?",
    category: "cloud_devops",
    options: [
      "Containers share the host OS kernel and are lightweight, booting in seconds with minimal overhead compared to hypervisor VMs",
      "Containers do not require any operating system memory or CPU allocation",
      "Containers automatically write frontend JavaScript code for deployed web servers",
      "Virtual machines cannot be connected to cloud VPC networks"
    ],
    roleMapping: {
      0: ['DevOps Engineer', 'Cloud Engineer', 'System Administrator'],
      1: ['Backend Developer', 'Software Developer', 'Full-Stack Developer'],
      2: ['Network Engineer', 'SOC Analyst'],
      3: ['QA / Software Tester', 'Technical Support Engineer']
    }
  },
  {
    id: 15,
    text: "When developing cross-platform Mobile Apps (Flutter / React Native), how do you ensure seamless offline experience?",
    category: "mobile_dev",
    options: [
      "Use local persistent database (SQLite / WatermelonDB / Hive) with background bidirectional sync when network recovers",
      "Cache all API data directly in cookies and freeze the UI until internet is restored",
      "Show a full-screen blocking error popup whenever ping latency exceeds 50ms",
      "Disable all user input forms while offline to prevent local state changes"
    ],
    roleMapping: {
      0: ['Mobile App Developer', 'Software Developer', 'Frontend Developer'],
      1: ['Full-Stack Developer', 'Backend Developer'],
      2: ['UI/UX Designer', 'Product Designer'],
      3: ['QA / Software Tester', 'Technical Support Engineer']
    }
  },
  {
    id: 16,
    text: "In Software Quality Assurance (QA), what is the difference between Unit Testing and End-to-End (E2E) Testing?",
    category: "qa_testing",
    options: [
      "Unit tests verify isolated functions in milliseconds; E2E tests validate complete user journeys across frontend, backend, and DB",
      "Unit testing is performed only by clients; E2E testing is performed only by database admins",
      "Unit testing tests visual button colors; E2E testing tests network cables",
      "Unit testing is always manual; E2E testing is strictly automated"
    ],
    roleMapping: {
      0: ['QA / Software Tester', 'Software Developer', 'DevOps Engineer'],
      1: ['Backend Developer', 'Full-Stack Developer'],
      2: ['Technical Support Engineer', 'IT Consultant'],
      3: ['Project Coordinator', 'Product Manager']
    }
  },
  {
    id: 17,
    text: "In Data Engineering, why is an ETL/ELT pipeline with Apache Kafka or Spark required instead of querying production OLTP databases directly?",
    category: "data_engineering",
    options: [
      "Heavy analytical OLAP queries on production transactional DBs lock tables, degrade app performance, and lack dimensional modeling",
      "OLTP databases can only store up to 10,000 rows of text data before crashing",
      "Apache Kafka replaces SQL language with visual drag-and-drop diagrams",
      "Data pipelines are only required if company operates in more than three countries"
    ],
    roleMapping: {
      0: ['Data Engineer', 'Data Analyst', 'Business Intelligence Analyst'],
      1: ['Data Scientist', 'AI/ML Engineer'],
      2: ['Backend Developer', 'Cloud Engineer'],
      3: ['Business Analyst', 'IT Consultant']
    }
  },
  {
    id: 18,
    text: "In 3D Game Development and AR/VR, what role does a 'Shader' play?",
    category: "gaming_xr",
    options: [
      "A GPU program that calculates lighting, reflection, shadows, and surface material rendering for 3D meshes in real time",
      "A database server that stores multiplayer player high-scores and chat history",
      "A script that plays audio sound effects when collision events fire",
      "A version control branch used exclusively by 3D modelers in Blender"
    ],
    roleMapping: {
      0: ['Game Developer', 'AR/VR Developer', 'Graphics Engineer'],
      1: ['UI/UX Designer', 'Product Designer'],
      2: ['Robotics Engineer', 'IoT Engineer'],
      3: ['Software Developer', 'Research Engineer']
    }
  },
  {
    id: 19,
    text: "As a Business Analyst or Product Manager, how do you prioritize 20 competing feature requests from stakeholders?",
    category: "product_management",
    options: [
      "Use structured prioritization frameworks like RICE (Reach, Impact, Confidence, Effort) or MoSCoW aligned with business OKRs",
      "Always build the feature requested by the loudest executive stakeholder first",
      "Implement the easiest feature that takes less than one afternoon of coding",
      "Put all 20 feature tickets into the active sprint simultaneously and work overtime"
    ],
    roleMapping: {
      0: ['Business Analyst', 'Product Manager', 'Project Coordinator', 'IT Consultant'],
      1: ['Technical Writer', 'Product Designer'],
      2: ['QA / Software Tester', 'Technical Support Engineer'],
      3: ['Software Developer', 'Full-Stack Developer']
    }
  },
  {
    id: 20,
    text: "When robotics or IoT engineers design an autonomous warehouse rover, how do sensors (LiDAR/IMU) interact with actuators?",
    category: "robotics_iot",
    options: [
      "Sensor telemetry feeds a real-time micro-controller control loop (PID/SLAM) that computes trajectory and drives motor actuators",
      "Sensors stream video directly to YouTube and wait for human comments to navigate",
      "Actuators only move when an operator sends an HTTP POST request over cellular data",
      "LiDAR sensors are purely decorative and do not provide distance telemetry"
    ],
    roleMapping: {
      0: ['Robotics Engineer', 'IoT Engineer', 'RPA Developer', 'Research Engineer'],
      1: ['AI/ML Engineer', 'Data Engineer'],
      2: ['System Administrator', 'Network Engineer'],
      3: ['Cloud Engineer', 'Software Developer']
    }
  }
];

// Fallback legacy reference for professional users
export const PROFESSIONAL_QUESTIONS: Question[] = FRESHER_QUESTIONS;
export const STUDENT_QUESTIONS: Question[] = FIRST_YEAR_QUESTIONS;
