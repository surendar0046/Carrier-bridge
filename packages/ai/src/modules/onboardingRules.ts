import { BranchInsight } from '@career-bridge/types';

export interface BranchWeightRule {
  branchId: string;
  name: string;
  code: string;
  keywords: string[];
  insight: BranchInsight;
  workPath: {
    beforeCollege: string[];
    yearOneSkills: string[];
    firstProjects: string[];
    typicalCareers: string[];
  };
}

export const BRANCH_CATALOG: Record<string, BranchWeightRule> = {
  cse: {
    branchId: 'cse',
    name: 'Computer Science & Engineering (CSE)',
    code: 'CSE',
    keywords: ['Computer Science', 'Python', 'C++', 'solving puzzles', 'building apps', 'software', 'computers'],
    insight: {
      branchName: 'Computer Science & Engineering',
      typicalRoles: ['Software Engineer', 'Full-Stack Developer', 'System Architect', 'Cloud DevOps Engineer'],
      keySkills: ['Data Structures & Algorithms', 'Web Architecture', 'Git', 'Databases (SQL/NoSQL)'],
      demandOutlook: 'Projected 25% employment growth in software engineering from 2022 to 2032.',
      source: 'U.S. Bureau of Labor Statistics (BLS) Occupational Outlook',
      sourceDate: 'September 2023',
    },
    workPath: {
      beforeCollege: [
        'Learn Python or JavaScript syntax basics',
        'Set up a GitHub account and learn Git commands',
        'Solve 20 beginner logic puzzles on HackerRank or LeetCode',
      ],
      yearOneSkills: ['C / C++ Foundations', 'Discrete Mathematics', 'Computer Architecture', 'Object-Oriented Programming'],
      firstProjects: ['Command-line Student Record Manager', 'Personal Responsive Portfolio Website', 'Calculator Web App'],
      typicalCareers: ['SDE-1 at Technology Product Firms', 'Full-Stack Developer at High-growth Startups', 'Systems Engineer'],
    },
  },
  ai_ds: {
    branchId: 'ai_ds',
    name: 'Artificial Intelligence & Data Science',
    code: 'AI & DS',
    keywords: ['Maths', 'Python', 'AI and data', 'solving puzzles', 'experiments and nature or life sciences', 'computers'],
    insight: {
      branchName: 'AI & Data Science',
      typicalRoles: ['Machine Learning Engineer', 'Data Scientist', 'AI Solutions Architect', 'Data Analyst'],
      keySkills: ['Python (NumPy, Pandas)', 'Applied Mathematics & Statistics', 'PyTorch/TensorFlow', 'SQL'],
      demandOutlook: 'Data Scientists employment projected to grow 35% from 2022 to 2032.',
      source: 'U.S. Bureau of Labor Statistics (BLS) Occupational Outlook',
      sourceDate: 'September 2023',
    },
    workPath: {
      beforeCollege: [
        'Brush up on High School Linear Algebra and Probability',
        'Complete Python basics tutorial with Jupyter Notebooks',
        'Explore Kaggle datasets to understand data exploration',
      ],
      yearOneSkills: ['Probability & Statistics for Computing', 'Python for Scientific Computing', 'Data Structures', 'Database Management'],
      firstProjects: ['Exploratory Data Analysis on Public COVID or Weather Dataset', 'Movie Recommendation Prototype'],
      typicalCareers: ['Junior ML Engineer', 'Associate Data Scientist', 'BI & Analytics Consultant'],
    },
  },
  it: {
    branchId: 'it',
    name: 'Information Technology (IT)',
    code: 'IT',
    keywords: ['Computer Science', 'Python', 'software', 'building apps', 'computers', 'stable job'],
    insight: {
      branchName: 'Information Technology',
      typicalRoles: ['Software Developer', 'Cloud Administrator', 'Information Security Analyst', 'Database Administrator'],
      keySkills: ['Cloud Infrastructure (AWS/Azure)', 'Networking Protocols', 'Web Technologies', 'Information Security'],
      demandOutlook: 'Computer and Information Technology occupations projected to add about 377,500 openings each year.',
      source: 'U.S. Bureau of Labor Statistics (BLS)',
      sourceDate: 'April 2024',
    },
    workPath: {
      beforeCollege: [
        'Learn how the Internet, DNS, and HTTP work',
        'Practice HTML, CSS, and basic JavaScript',
        'Experiment with Linux command line basics',
      ],
      yearOneSkills: ['Programming in C/Java', 'Computer Networks', 'Operating Systems', 'Web Fundamentals'],
      firstProjects: ['Client-Server Socket Chat Application', 'Multi-user Task Manager with REST API'],
      typicalCareers: ['Cloud Operations Engineer', 'Backend Developer', 'Enterprise Systems Analyst'],
    },
  },
  ece: {
    branchId: 'ece',
    name: 'Electronics & Communication Engineering (ECE)',
    code: 'ECE',
    keywords: ['Physics', 'Maths', 'working with machines or circuits', 'electronics', 'hands-on equipment'],
    insight: {
      branchName: 'Electronics & Communication Engineering',
      typicalRoles: ['Embedded Systems Engineer', 'VLSI Design Engineer', 'IoT Firmware Developer', 'RF Engineer'],
      keySkills: ['Digital Electronics', 'Microcontroller Programming (C/Embedded C)', 'Verilog/VHDL', 'Circuit Simulation'],
      demandOutlook: 'Semiconductor industry projected to require tens of thousands of skilled engineers under CHIPS and national electronics initiatives.',
      source: 'Semiconductor Industry Association (SIA) Workforce Report',
      sourceDate: 'July 2023',
    },
    workPath: {
      beforeCollege: [
        'Get an Arduino or Raspberry Pi starter kit and blink LEDs',
        'Review high school electromagnetic induction & circuit laws',
        'Learn basic C programming',
      ],
      yearOneSkills: ['Circuit Theory', 'Semiconductor Devices', 'C Programming', 'Engineering Physics'],
      firstProjects: ['Smart Home Temperature & Humidity Monitor with Arduino', 'Digital Stopwatch Circuit on Breadboard'],
      typicalCareers: ['Firmware Engineer at Automotive/Consumer Electronics', 'Hardware Test Engineer', 'Telecom Systems Engineer'],
    },
  },
  eee: {
    branchId: 'eee',
    name: 'Electrical & Electronics Engineering (EEE)',
    code: 'EEE',
    keywords: ['Physics', 'Maths', 'working with machines or circuits', 'electronics', 'hands-on equipment', 'stable job'],
    insight: {
      branchName: 'Electrical & Electronics Engineering',
      typicalRoles: ['Power Systems Engineer', 'EV Powertrain Engineer', 'Control Systems Engineer', 'Renewable Energy Specialist'],
      keySkills: ['Power Electronics', 'MATLAB/Simulink', 'Electrical Machines', 'Control Systems'],
      demandOutlook: 'Electric vehicle and renewable grid transitions driving strong engineering demand.',
      source: 'International Energy Agency (IEA) World Energy Employment',
      sourceDate: 'November 2023',
    },
    workPath: {
      beforeCollege: [
        'Learn basics of AC/DC circuits and transformers',
        'Simulate basic RLC circuits using online circuit simulators',
        'Understand EV battery and motor basics',
      ],
      yearOneSkills: ['Basic Electrical Engineering', 'Network Analysis', 'Engineering Mathematics', 'MATLAB basics'],
      firstProjects: ['Solar Panel Battery Charge Controller Simulation', 'Dual-axis Solar Tracker Prototype'],
      typicalCareers: ['EV Systems Engineer', 'Grid Integration Specialist', 'Electrical Infrastructure Consultant'],
    },
  },
  mechanical: {
    branchId: 'mechanical',
    name: 'Mechanical Engineering',
    code: 'MECH',
    keywords: ['Physics', 'working with machines or circuits', 'mechanical', 'designing things', 'hands-on equipment'],
    insight: {
      branchName: 'Mechanical Engineering',
      typicalRoles: ['Design Engineer (CAD/CAE)', 'Robotics Engineer', 'Thermal Systems Analyst', 'Manufacturing Automation Engineer'],
      keySkills: ['SolidWorks / AutoCAD', 'Thermodynamics & Fluid Mechanics', 'FEA Analysis', 'Robotics Fundamentals'],
      demandOutlook: 'Steady growth with specialized spikes in industrial robotics, 3D printing, and automation.',
      source: 'American Society of Mechanical Engineers (ASME) Trends',
      sourceDate: 'January 2024',
    },
    workPath: {
      beforeCollege: [
        'Download FreeCAD or Fusion360 and model simple 3D mechanical objects',
        'Review Newtonian mechanics, friction, and torque principles',
        'Explore how 3D printers and internal combustion / electric motors work',
      ],
      yearOneSkills: ['Engineering Graphics & CAD', 'Engineering Mechanics', 'Material Science', 'Manufacturing Processes Workshop'],
      firstProjects: ['3D Model of a Planetary Gearbox', 'Drone Chassis Structural Analysis'],
      typicalCareers: ['Automotive Design Engineer', 'Robotics Systems Integrator', 'Aerospace Structural Engineer'],
    },
  },
  civil: {
    branchId: 'civil',
    name: 'Civil & Structural Engineering',
    code: 'CIVIL',
    keywords: ['Physics', 'Maths', 'civil', 'designing things', 'hands-on equipment', 'stable job'],
    insight: {
      branchName: 'Civil & Structural Engineering',
      typicalRoles: ['Structural Engineer', 'BIM Coordinator', 'Geotechnical Consultant', 'Transportation Planner'],
      keySkills: ['AutoCAD & Revit BIM', 'Structural Mechanics', 'Soil Mechanics', 'Quantity Surveying & Estimation'],
      demandOutlook: 'Infrastructure bill modernization funding ongoing civil public works globally.',
      source: 'U.S. Bureau of Labor Statistics (BLS)',
      sourceDate: 'September 2023',
    },
    workPath: {
      beforeCollege: [
        'Learn basic architectural drawing reading',
        'Try out sketchup or AutoCAD student edition',
        'Read about modern megastructures and bridge engineering',
      ],
      yearOneSkills: ['Surveying & Geomatics', 'Building Materials', 'Engineering Mechanics', 'AutoCAD Drafting'],
      firstProjects: ['2D Building Floor Plan with Estimation', 'Bridge Truss Load Simulation'],
      typicalCareers: ['Structural Consultant', 'Project Planning Engineer at Infrastructure Conglomerate', 'Government Public Works Specialist'],
    },
  },
  biotech: {
    branchId: 'biotech',
    name: 'Biotechnology & Bioinformatics',
    code: 'BIOTECH',
    keywords: ['Biology', 'Chemistry', 'experiments and nature or life sciences', 'bio and chemical', 'lab experiments', 'research'],
    insight: {
      branchName: 'Biotechnology',
      typicalRoles: ['Bioinformatics Analyst', 'Bioprocess Engineer', 'Clinical Research Associate', 'Genomics Scientist'],
      keySkills: ['Molecular Biology Techniques', 'Bio-Python & R', 'CRISPR & Gene Editing Basics', 'Bioreactor Operations'],
      demandOutlook: 'Biomedical engineering and computational genomics seeing substantial venture and pharmaceutical R&D.',
      source: 'World Health Organization (WHO) Global Health Observatory & BLS',
      sourceDate: 'October 2023',
    },
    workPath: {
      beforeCollege: [
        'Review cell genetics, DNA replication, and molecular biochemistry',
        'Learn basic Python for string processing (DNA sequence analysis)',
        'Explore the NCBI biological databases and PubMed',
      ],
      yearOneSkills: ['Biochemistry', 'Microbiology', 'Cell Biology', 'Introduction to Bioinformatics (Biopython)'],
      firstProjects: ['FASTA DNA Sequence Alignment Tool in Python', 'Enzyme Kinetics Simulation Notebook'],
      typicalCareers: ['Bioinformatics Specialist', 'Pharma Quality & Process Engineer', 'Genomics Research Assistant'],
    },
  },
  chemical: {
    branchId: 'chemical',
    name: 'Chemical & Process Engineering',
    code: 'CHEM',
    keywords: ['Chemistry', 'Maths', 'bio and chemical', 'lab experiments', 'working with machines or circuits'],
    insight: {
      branchName: 'Chemical Engineering',
      typicalRoles: ['Process Safety Engineer', 'Refinery/Polymer Specialist', 'Battery Materials Chemist', 'Environmental Engineer'],
      keySkills: ['Heat & Mass Transfer', 'Chemical Reaction Engineering', 'Process Simulation (Aspen Plus)', 'Fluid Dynamics'],
      demandOutlook: 'Specialized expansion in hydrogen energy, green fertilizers, and battery cell chemistry.',
      source: 'American Institute of Chemical Engineers (AIChE)',
      sourceDate: 'February 2024',
    },
    workPath: {
      beforeCollege: [
        'Review stoichiometry, chemical equilibrium, and organic reaction mechanisms',
        'Learn unit conversions and mass balance equations',
        'Study how lithium-ion battery chemistry works',
      ],
      yearOneSkills: ['Engineering Chemistry', 'Chemical Process Calculations', 'Fluid Mechanics', 'Thermodynamics'],
      firstProjects: ['Material Balance Model for a Distillation Column', 'Biodiesel Synthesis Lab Report'],
      typicalCareers: ['Process Engineer at Energy/Chemical Plant', 'Battery Chemist', 'FMCG Manufacturing Technologist'],
    },
  },
};

export const DOMAIN_CATALOG: Record<string, {
  domainId: string;
  name: string;
  tagline: string;
  keySkills: string[];
  roadmapId: string;
  targetRole: string;
  beginnerCourses: string[];
  careerOpportunities: string[];
}> = {
  software_development: {
    domainId: 'software_development',
    name: 'Full-Stack Software Development',
    tagline: 'Modern responsive web, robust scalable APIs, and production deployments.',
    keySkills: ['React.js', 'Node.js & Express', 'TypeScript', 'PostgreSQL / Prisma', 'Tailwind CSS', 'Git & Docker'],
    roadmapId: 'roadmap-fullstack',
    targetRole: 'Full Stack Developer',
    beginnerCourses: ['course-001', 'course-002', 'course-003'],
    careerOpportunities: ['Full-Stack Developer', 'Frontend Engineer', 'Backend Specialist'],
  },
  data_science_ai: {
    domainId: 'data_science_ai',
    name: 'Artificial Intelligence & Data Science',
    tagline: 'Predictive modeling, machine learning pipelines, deep learning, and data insights.',
    keySkills: ['Python & Pandas', 'Statistics & Linear Algebra', 'Scikit-learn', 'PyTorch / TensorFlow', 'SQL & EDA'],
    roadmapId: 'roadmap-ai-ml',
    targetRole: 'AI / ML Engineer',
    beginnerCourses: ['course-004', 'course-005'],
    careerOpportunities: ['AI/ML Engineer', 'Data Scientist', 'Business Intelligence Analyst'],
  },
  cybersecurity: {
    domainId: 'cybersecurity',
    name: 'Cybersecurity & Infrastructure',
    tagline: 'Defensive architecture, network security, penetration testing, and SOC analysis.',
    keySkills: ['Linux System Administration', 'Network Protocols (TCP/IP)', 'Wireshark', 'Security Audits', 'Cloud Defense'],
    roadmapId: 'roadmap-cybersecurity',
    targetRole: 'Cybersecurity Analyst',
    beginnerCourses: ['course-006', 'course-007'],
    careerOpportunities: ['Cybersecurity Analyst', 'SOC Analyst', 'Cloud Security Associate'],
  },
  cloud_devops: {
    domainId: 'cloud_devops',
    name: 'Cloud Architecture & DevOps',
    tagline: 'Automated CI/CD pipelines, container orchestration, and multi-cloud resilience.',
    keySkills: ['Docker & Kubernetes', 'AWS / Azure Foundations', 'GitHub Actions', 'Terraform', 'Linux Bash'],
    roadmapId: 'roadmap-cloud-devops',
    targetRole: 'Cloud / Solutions Architect',
    beginnerCourses: ['course-008', 'course-009'],
    careerOpportunities: ['DevOps Engineer', 'Cloud Infrastructure Engineer', 'Site Reliability Engineer'],
  },
  ui_ux_product: {
    domainId: 'ui_ux_product',
    name: 'Product Design & UI/UX',
    tagline: 'Human-centered interaction design, interactive prototypes, and design systems.',
    keySkills: ['Figma Mastery', 'Wireframing & Prototyping', 'User Research & Personas', 'Design Systems', 'Usability Audits'],
    roadmapId: 'roadmap-ui-ux',
    targetRole: 'Product Designer (UI/UX)',
    beginnerCourses: ['course-010', 'course-011'],
    careerOpportunities: ['UI/UX Designer', 'Product Designer', 'Interaction Designer'],
  },
  embedded_iot: {
    domainId: 'embedded_iot',
    name: 'Embedded Systems & IoT',
    tagline: 'Firmware development, sensor integration, real-time operating systems (RTOS), and hardware interfaces.',
    keySkills: ['Embedded C / C++', 'Microcontrollers (STM32, ESP32)', 'I2C / SPI / UART', 'RTOS', 'Circuit Schematics'],
    roadmapId: 'roadmap-embedded',
    targetRole: 'Embedded Systems Engineer',
    beginnerCourses: ['course-012', 'course-013'],
    careerOpportunities: ['Firmware Engineer', 'IoT Solutions Developer', 'Hardware Test Engineer'],
  },
};

export interface CompanyTypeTemplate {
  type: string;
  focusRounds: string[];
  roundsSummary: string;
  keyPrepAreas: string[];
}

export const COMPANY_TYPE_TEMPLATES: Record<string, CompanyTypeTemplate> = {
  product: {
    type: 'Product Companies (Tier 1 & 2)',
    focusRounds: ['Online Assessment (DSA + Aptitude)', 'Technical DSA Round 1', 'Technical Problem Solving / System Design Round 2', 'Hiring Manager / Values Round'],
    roundsSummary: 'Focuses heavily on Data Structures, Algorithms, problem-solving speed, and clean code principles.',
    keyPrepAreas: ['LeetCode Medium/Hard DSA', 'Time & Space Complexity Analysis', 'OOP Principles & Low-Level Design', 'CS Core (OS, DBMS, Networks)'],
  },
  it_services: {
    type: 'IT Services Companies (TCS, Infosys, Wipro, Cognizant, etc.)',
    focusRounds: ['Online National Qualifier Test (Quantitative + Verbal + Logical)', 'Hands-on Coding Round (Basic to Intermediate)', 'Technical & TR Round', 'HR Interview'],
    roundsSummary: 'High emphasis on aptitude speed, verbal ability, and standard coding patterns with fast turnaround.',
    keyPrepAreas: ['Quantitative Aptitude Shortcuts', 'Standard String & Array Algorithms', 'Communication & Professional Etiquette', 'Project Explanation'],
  },
  startups: {
    type: 'High-Growth Tech Startups',
    focusRounds: ['Machine Coding / Take-home Assignment', 'Live Code Pairing & Architecture Review', 'Cultural Alignment & Fast-paced Execution Round'],
    roundsSummary: 'Evaluates your ability to build, debug, and ship production-grade software independently.',
    keyPrepAreas: ['Modern Web Frameworks (React, Node.js)', 'REST APIs & Database Design', 'Git Workflow & Unit Testing', 'Fast Debugging'],
  },
  core: {
    type: 'Core Engineering Enterprises',
    focusRounds: ['GATE-Pattern Technical Aptitude Test', 'Core Domain Interview (Thermodynamics / Circuits / Signals / Structures)', 'Management & Safety Interview'],
    roundsSummary: 'Rigorous assessment of fundamental engineering disciplines and safety/quality standards.',
    keyPrepAreas: ['Engineering Mathematics', 'Branch Core Concepts', 'Laboratory & Practical Experience', 'Industry Standard Software (CAD/MATLAB/SPICE)'],
  },
  government: {
    type: 'Government / PSU Organizations',
    focusRounds: ['Written Competitive Examination', 'Document Verification & Technical Group Discussion', 'Final Personal Interview'],
    roundsSummary: 'Standardized national examination formats with strictly transparent evaluation criteria.',
    keyPrepAreas: ['General Awareness & Current Affairs', 'Quantitative & Reasoning Depth', 'Technical Discipline Syllabus', 'Precision & Accuracy'],
  },
};

