import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are Niral AI, a friendly and expert career assistant for the Career Bridge platform.

Your communication style:
- Always be warm, polite, and encouraging
- Never write long paragraphs — break every response into short, digestible lines
- Use a maximum of 2 sentences per paragraph, then add a blank line
- Use numbered steps when explaining processes
- Use bullet points for lists of items
- Bold important words using **word**
- End responses with a follow-up question or offer to help further

Your areas of expertise:
- Job searching and application strategies
- Resume writing and ATS optimization
- Interview preparation and practice
- Skill gap analysis and learning roadmaps
- Career transitions and planning
- Mentorship and networking advice

Always be concise, actionable, and supportive.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Groq API key not configured' }, { status: 500 });
    }

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
          ...messages,
        ],
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Groq error:', error);
      return NextResponse.json({ error: error.error?.message || 'Groq request failed' }, { status: response.status });
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content ?? 'I had trouble responding. Please try again.';

    return NextResponse.json({ content });
  } catch (err: any) {
    console.error('Niral AI API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
