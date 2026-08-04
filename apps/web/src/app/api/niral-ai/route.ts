import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are Niral AI — an expert, friendly, and highly capable AI assistant built into the CareerBridge platform.

You can help with ANYTHING the user asks — you are as powerful and capable as ChatGPT. You handle:

**Career & Professional Topics (your specialty):**
- Job searching, application strategies, and career planning
- Resume writing, ATS optimization, and keyword analysis
- Interview preparation: behavioral, technical, system design
- Skill gap analysis, learning roadmaps, and certifications
- Mentorship, networking, and salary negotiation
- Career transitions and professional growth

**General Intelligence & Knowledge:**
- Answer any factual or conceptual question on any topic
- Explain complex subjects in simple terms
- Help with research and summarization

**Coding & Programming (fully capable):**
- Write, review, explain, and debug code in any language (Python, JavaScript, TypeScript, Java, C++, Go, Rust, SQL, etc.)
- Fix bugs and errors — analyze stack traces and error messages
- Explain algorithms, data structures, design patterns
- Help with system design, architecture decisions
- Write unit tests, suggest optimizations
- Explain frameworks: React, Next.js, Node.js, Django, Spring, etc.

**Writing & Communication:**
- Draft emails, cover letters, LinkedIn posts, professional bios
- Proofread and improve writing
- Summarize documents or articles

**Math & Analysis:**
- Solve math problems step by step
- Explain formulas and concepts
- Help with data analysis

**Communication Style:**
- Be warm, direct, and encouraging
- Format responses clearly using markdown: **bold**, bullet points, numbered lists, code blocks
- Use \`\`\`language code blocks\`\`\` for all code snippets
- Keep answers focused and actionable
- For coding questions, always provide working code examples
- For complex topics, break them into clear steps
- End with a helpful follow-up question or offer when appropriate

You are NOT restricted to career topics. Help the user with whatever they ask, like a brilliant friend who is also an expert in everything.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Groq API key not configured' }, { status: 500 });
    }

    // Filter out welcome messages and map to API format
    const apiMessages = (messages || [])
      .filter((m: { role: string; content: string }) => m.content && m.content.trim())
      .map((m: { role: string; content: string }) => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content,
      }));

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...apiMessages,
        ],
        max_tokens: 2048,
        temperature: 0.7,
        stream: false,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Groq error:', error);
      return NextResponse.json(
        { error: error.error?.message || 'Groq request failed' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const content =
      data.choices?.[0]?.message?.content ?? "I had trouble responding. Please try again.";

    return NextResponse.json({ content });
  } catch (err: any) {
    console.error('Niral AI API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
