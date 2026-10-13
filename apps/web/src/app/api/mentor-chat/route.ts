import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { messages, mentor } = await req.json();

    const groqKey =
      process.env.GROQ_API_KEY ||
      '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';

    const mentorName = mentor?.name || 'Mentor';
    const mentorTitle = mentor?.title || 'Senior Engineer';
    const mentorCompany = mentor?.company || 'Top Tech';
    const mentorSkills = (mentor?.expertise || []).join(', ') || 'Software Engineering, Career Growth';
    const mentorBio = mentor?.bio || '';

    const systemPrompt = `You are ${mentorName}, a ${mentorTitle} at ${mentorCompany}.
Your technical expertise includes: ${mentorSkills}.
Background: ${mentorBio}.

You are currently in a LIVE 1-on-1 video & chat mentorship session with an ambitious mentee on CareerBridge.
- Respond in the first person as ${mentorName}.
- Be warm, empathetic, highly technical, and practical.
- Share real-world insights from your experience at ${mentorCompany}.
- If the user asks a simple greeting (like "hi", "hello", "hii"), greet them enthusiastically, introduce yourself briefly, and invite them to discuss their goals, challenges, or current projects.
- Keep your answers concise, clear, and conversational (1-3 short paragraphs max), formatted with clean markdown bullets where helpful.`;

    // Filter valid chat messages
    const formattedMessages = (messages || [])
      .filter((m: { role: string; content: string }) => m.content && m.content.trim())
      .map((m: { role: string; content: string }) => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content,
      }));

    if (groqKey) {
      try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${groqKey}`,
          },
          body: JSON.stringify({
            model: 'qwen/qwen3.8-27b',
            messages: [{ role: 'system', content: systemPrompt }, ...formattedMessages],
            temperature: 0.7,
            max_tokens: 1024,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const reply = data.choices?.[0]?.message?.content?.trim();
          if (reply) {
            return NextResponse.json({
              success: true,
              reply,
              mentorName,
              source: 'groq-live',
            });
          }
        }
      } catch (err: any) {
        console.warn('Groq mentor chat call failed, falling back to smart reply:', err.message);
      }
    }

    // Smart persona-based fallback reply
    const lastUserMsg = (messages?.[messages.length - 1]?.content || '').toLowerCase();
    let reply = `Hi! Great to connect with you. As a ${mentorTitle} at ${mentorCompany}, I'm here to help you level up. Whether you want to discuss system design, coding challenges, or career navigation, feel free to dive in! What's your main goal for today's session?`;

    if (lastUserMsg.includes('hi') || lastUserMsg.includes('hello') || lastUserMsg.includes('hey')) {
      reply = `Hello! 👋 It's wonderful to meet you. I'm ${mentorName} from ${mentorCompany}. Thanks for jumping on this live session! How are things going with your current projects or preparation?`;
    } else if (lastUserMsg.includes('interview') || lastUserMsg.includes('prep')) {
      reply = `Interview preparation is all about structure! At ${mentorCompany}, we focus heavily on clear problem scoping, algorithmic trade-offs, and communication. What specific roles or companies are you targeting right now?`;
    } else if (lastUserMsg.includes('resume') || lastUserMsg.includes('ats')) {
      reply = `I'd love to review your resume. The biggest thing hiring managers look for is measurable business impact—not just technologies used, but what you actually achieved with them. Tell me a bit about your key projects!`;
    }

    return NextResponse.json({
      success: true,
      reply,
      mentorName,
      source: 'smart-fallback',
    });
  } catch (error: any) {
    console.error('Mentor chat handler error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Chat failed' },
      { status: 500 }
    );
  }
}
