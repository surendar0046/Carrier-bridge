import { NextRequest, NextResponse } from 'next/server';

export interface AnalysisResult {
  overallScore: number;
  scoreLabel: string;
  tagline: string;
  dimensions: {
    content: number;
    relevance: number;
    impact: number;
    structure: number;
    keywords: number;
  };
  strengths: string[];
  improvements: string[];
  criticalIssues: string[];
  foundKeywords: string[];
  missingKeywords: string[];
  quickWin: string;
}

const ROLE_KEYWORDS: Record<string, string[]> = {
  // Software & Development
  "software engineer": ["algorithms", "data structures", "REST API", "microservices", "CI/CD", "Git", "unit testing", "agile", "system design", "scalability", "SQL", "OOP"],
  "full stack developer": ["React", "Node.js", "REST API", "databases", "TypeScript", "JavaScript", "Java", "MongoDB", "SQL", "HTML", "CSS", "Git", "agile", "Docker", "Express", "Spring Boot"],
  "fullstack developer": ["React", "Node.js", "REST API", "databases", "TypeScript", "JavaScript", "Java", "MongoDB", "SQL", "HTML", "CSS", "Git", "agile", "Docker", "Express", "Spring Boot"],
  "frontend developer": ["React", "TypeScript", "JavaScript", "CSS", "HTML", "Tailwind CSS", "Next.js", "performance optimization", "responsive design", "accessibility", "REST API", "state management", "Git"],
  "backend developer": ["Node.js", "Java", "Python", "REST API", "microservices", "databases", "SQL", "PostgreSQL", "MongoDB", "Spring Boot", "Docker", "authentication", "caching", "Redis"],
  "java developer": ["Java", "Spring Boot", "Spring Data JPA", "Hibernate", "REST API", "Microservices", "SQL", "MySQL", "PostgreSQL", "Maven", "Git", "JUnit", "Docker", "OOP"],
  "java full stack developer": ["Java", "Spring Boot", "React", "JavaScript", "TypeScript", "REST API", "SQL", "MongoDB", "HTML", "CSS", "Git", "Hibernate", "Microservices", "Docker"],
  "mobile developer": ["React Native", "Flutter", "iOS", "Android", "Swift", "Kotlin", "REST API", "Firebase", "mobile UI", "Git"],
  "devops engineer": ["Kubernetes", "Docker", "CI/CD", "Terraform", "AWS", "Linux", "Jenkins", "Ansible", "monitoring", "GitOps", "infrastructure as code"],
  "cloud engineer": ["AWS", "Azure", "GCP", "Terraform", "CloudFormation", "EC2", "S3", "IAM", "Docker", "Kubernetes", "Linux", "networking"],
  "cybersecurity analyst": ["penetration testing", "SIEM", "vulnerability assessment", "incident response", "network security", "firewall", "OWASP", "encryption", "threat modeling", "compliance"],
  "data scientist": ["Python", "machine learning", "pandas", "numpy", "SQL", "TensorFlow", "PyTorch", "data visualization", "statistical analysis", "scikit-learn"],
  "data engineer": ["ETL", "SQL", "Python", "Apache Spark", "data pipelines", "Kafka", "data warehouse", "Snowflake", "PostgreSQL", "Airflow", "cloud platforms"],
  "ml engineer": ["Python", "TensorFlow", "PyTorch", "machine learning", "deep learning", "MLOps", "Docker", "model deployment", "APIs", "data preprocessing"],
  "ai engineer": ["Python", "LLMs", "Generative AI", "prompt engineering", "PyTorch", "APIs", "LangChain", "RAG", "fine-tuning", "vector databases"],
  "product manager": ["roadmap", "stakeholder management", "user stories", "agile", "scrum", "KPIs", "go-to-market", "data analytics", "market research"],
  "ui/ux designer": ["Figma", "user research", "wireframing", "prototyping", "design systems", "usability testing", "interaction design", "accessibility", "visual design"],
  "qa engineer": ["automation testing", "Selenium", "Cypress", "unit testing", "API testing", "Postman", "manual testing", "test cases", "Jira", "CI/CD"],
};

function getScoreLabel(score: number): { label: string; tagline: string } {
  if (score >= 90) return { label: "Exceptional", tagline: "Your resume is highly competitive — recruiters and ATS filters will rank this at the top!" };
  if (score >= 80) return { label: "Strong", tagline: "Great match! A few targeted keyword additions will make it stand out even more." };
  if (score >= 65) return { label: "Competitive", tagline: "Good foundation, but missing some key technical terms and quantified impacts." };
  if (score >= 50) return { label: "Needs Polish", tagline: "Your resume needs more alignment with role expectations to reliably pass ATS filters." };
  return { label: "Critical Gaps", tagline: "Major sections and core target role keywords are missing." };
}

function normalizeRoleKey(role: string): string {
  const clean = role.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
  for (const key of Object.keys(ROLE_KEYWORDS)) {
    if (clean.includes(key) || key.includes(clean)) return key;
  }
  return "full stack developer";
}

function runFallbackAnalysis(text: string, targetRole: string, skillsFromPayload: string[]): AnalysisResult {
  const normKey = normalizeRoleKey(targetRole);
  const keywords = ROLE_KEYWORDS[normKey] || ROLE_KEYWORDS["full stack developer"];

  const fullText = (text + " " + skillsFromPayload.join(" ")).toLowerCase();

  const foundKeywords: string[] = [];
  const missingKeywords: string[] = [];

  keywords.forEach((kw) => {
    if (fullText.includes(kw.toLowerCase())) {
      foundKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  });

  // Calculate scores
  const hasSummary = fullText.includes('summary') || fullText.includes('objective') || fullText.length > 250;
  const hasEducation = fullText.includes('b.tech') || fullText.includes('b.e') || fullText.includes('degree') || fullText.includes('education') || fullText.includes('college') || fullText.includes('university');
  const hasExperience = fullText.includes('experience') || fullText.includes('intern') || fullText.includes('trainee') || fullText.includes('developer') || fullText.includes('worked at');
  const hasProjects = fullText.includes('project') || fullText.includes('hackathon') || fullText.includes('built') || fullText.includes('developed');
  const hasContact = fullText.includes('@') && (fullText.includes('github') || fullText.includes('linkedin') || /\d{10}/.test(fullText));

  const keywordRatio = keywords.length > 0 ? foundKeywords.length / keywords.length : 0.5;

  const contentScore = Math.min(95, Math.max(50, Math.round(55 + (hasSummary ? 10 : 0) + (hasExperience ? 15 : 5) + (hasProjects ? 15 : 0))));
  const relevanceScore = Math.min(96, Math.max(45, Math.round(45 + keywordRatio * 45 + (hasExperience ? 10 : 0))));
  const impactScore = Math.min(92, Math.max(40, Math.round(40 + (hasProjects ? 25 : 10) + (fullText.includes('%') || /\d+\+?/.test(fullText) ? 15 : 0))));
  const structureScore = Math.min(98, Math.max(55, Math.round(55 + (hasContact ? 15 : 0) + (hasEducation ? 15 : 0) + (hasSummary ? 10 : 0))));
  const keywordsScore = Math.min(95, Math.max(35, Math.round(35 + keywordRatio * 60)));

  const overallScore = Math.round(
    contentScore * 0.25 +
    relevanceScore * 0.25 +
    impactScore * 0.20 +
    structureScore * 0.15 +
    keywordsScore * 0.15
  );

  const { label, tagline } = getScoreLabel(overallScore);

  const strengths = [
    `Strong technical profile matching core requirements for ${targetRole}.`,
    hasSummary ? "Well-defined professional summary highlighting background and technical focus." : "Clear presentation of technical proficiencies.",
    hasProjects ? "Active involvement in projects or hackathon problem-solving demonstrating hands-on experience." : "Good foundational knowledge of development principles."
  ];

  const improvements: string[] = [];
  if (missingKeywords.length > 0) {
    improvements.push(`Include high-demand keywords such as: ${missingKeywords.slice(0, 3).join(', ')}.`);
  }
  improvements.push("Quantify achievements by including measurable metrics (e.g. 'Improved efficiency by 25%' or 'Handled 500+ requests/sec').");
  improvements.push("Explicitly highlight automated testing (e.g. JUnit, Jest) and modern deployment tools (e.g. Docker, CI/CD).");

  const criticalIssues: string[] = [];
  if (missingKeywords.length > 6) {
    criticalIssues.push(`Missing several core industry keywords expected for a ${targetRole}.`);
  }

  const quickWin = missingKeywords.length > 0
    ? `Add these key technologies to your skills and project sections: ${missingKeywords.slice(0, 3).join(', ')}.`
    : "Add metric-driven bullet points showcasing quantifiable impact in your top projects.";

  return {
    overallScore,
    scoreLabel: label,
    tagline,
    dimensions: {
      content: contentScore,
      relevance: relevanceScore,
      impact: impactScore,
      structure: structureScore,
      keywords: keywordsScore,
    },
    strengths,
    improvements: improvements.slice(0, 4),
    criticalIssues,
    foundKeywords: foundKeywords.slice(0, 12),
    missingKeywords: missingKeywords.slice(0, 8),
    quickWin
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const targetRole = body.targetRole || "Full Stack Developer";

    // Gather resume text from body
    let combinedText = "";
    if (typeof body.summary === 'string') combinedText += " " + body.summary;
    if (body.personalInfo) combinedText += ` ${body.personalInfo.fullName || ''} ${body.personalInfo.email || ''}`;
    if (Array.isArray(body.skills)) combinedText += " " + body.skills.join(" ");
    if (Array.isArray(body.experience)) {
      body.experience.forEach((e: any) => {
        combinedText += ` ${e.company || ''} ${e.role || ''} ${(e.achievements || []).join(' ')} ${e.description || ''}`;
      });
    }
    if (Array.isArray(body.projects)) {
      body.projects.forEach((p: any) => {
        combinedText += ` ${p.name || ''} ${p.description || ''} ${(p.tech || []).join(' ')}`;
      });
    }
    if (Array.isArray(body.education)) {
      body.education.forEach((edu: any) => {
        combinedText += ` ${edu.institution || ''} ${edu.degree || ''} ${edu.field || ''}`;
      });
    }

    const skillsList = Array.isArray(body.skills) ? body.skills : [];

    // Attempt Groq AI analysis if API key is present
    const apiKey = process.env.GROQ_API_KEY;
    if (apiKey) {
      try {
        const groqPrompt = `
You are an expert ATS (Applicant Tracking System) and Senior Technical Hiring Manager.
Analyze this candidate's resume for the target role: "${targetRole}".

Candidate Resume Text:
"""
${combinedText.slice(0, 4000)}
"""

Evaluate the resume accurately based on:
1. Relevance to "${targetRole}".
2. Core skills, frameworks, and technologies mentioned.
3. Quantifiable achievements and impact metrics.
4. ATS readability, structure, and missing critical keywords.

You MUST respond ONLY with valid JSON (no markdown formatting, no code block backticks).
Matching exactly this JSON schema:
{
  "overallScore": number (0 to 100),
  "scoreLabel": "Exceptional" | "Strong" | "Competitive" | "Needs Polish" | "Critical Gaps",
  "tagline": string (one sentence evaluation summary),
  "dimensions": {
    "content": number (0 to 100),
    "relevance": number (0 to 100),
    "impact": number (0 to 100),
    "structure": number (0 to 100),
    "keywords": number (0 to 100)
  },
  "strengths": string[] (3 specific strengths),
  "improvements": string[] (3 actionable improvements),
  "criticalIssues": string[] (0-2 critical issues),
  "foundKeywords": string[] (up to 10 technical keywords found),
  "missingKeywords": string[] (3 to 6 technical keywords that should be added for ${targetRole}),
  "quickWin": string (one high-impact tip)
}`;

        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              { role: 'system', content: 'You are an ATS resume evaluation engine. You output valid raw JSON only.' },
              { role: 'user', content: groqPrompt }
            ],
            temperature: 0.2,
            max_tokens: 1200,
          }),
        });

        if (groqRes.ok) {
          const groqData = await groqRes.json();
          const rawContent = groqData.choices?.[0]?.message?.content || "";
          const cleaned = rawContent.replace(/```json?/gi, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(cleaned);

          if (parsed && typeof parsed.overallScore === 'number' && parsed.dimensions) {
            const score = Math.round(Math.max(0, Math.min(100, parsed.overallScore)));
            const { label, tagline } = getScoreLabel(score);

            const result: AnalysisResult = {
              overallScore: score,
              scoreLabel: parsed.scoreLabel || label,
              tagline: parsed.tagline || tagline,
              dimensions: {
                content: Math.round(parsed.dimensions.content || 70),
                relevance: Math.round(parsed.dimensions.relevance || 70),
                impact: Math.round(parsed.dimensions.impact || 65),
                structure: Math.round(parsed.dimensions.structure || 80),
                keywords: Math.round(parsed.dimensions.keywords || 70),
              },
              strengths: Array.isArray(parsed.strengths) ? parsed.strengths : ["Strong foundational competencies."],
              improvements: Array.isArray(parsed.improvements) ? parsed.improvements : ["Add more metrics to bullet points."],
              criticalIssues: Array.isArray(parsed.criticalIssues) ? parsed.criticalIssues : [],
              foundKeywords: Array.isArray(parsed.foundKeywords) ? parsed.foundKeywords : [],
              missingKeywords: Array.isArray(parsed.missingKeywords) ? parsed.missingKeywords : [],
              quickWin: parsed.quickWin || "Highlight your top achievements with quantifiable metrics.",
            };

            return NextResponse.json({ success: true, data: result });
          }
        }
      } catch (aiErr) {
        console.warn("Groq ATS analysis call failed, falling back to local ATS engine:", aiErr);
      }
    }

    // Deterministic fallback ATS analysis
    const fallbackResult = runFallbackAnalysis(combinedText, targetRole, skillsList);
    return NextResponse.json({ success: true, data: fallbackResult });
  } catch (error: any) {
    console.error("Resume analyze route error:", error);
    return NextResponse.json(
      { error: true, message: error.message || "Failed to analyze resume" },
      { status: 500 }
    );
  }
}
