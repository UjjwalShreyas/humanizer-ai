import Groq from "groq-sdk";
import { RateLimiter } from "@/lib/rate-limit";

// Rate limit: 10 requests per minute per IP
const rateLimiter = new RateLimiter({ limit: 10, windowMs: 60000 });

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request: Request) {
  try {
    // 1. Rate Limiting Check
    const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const rateLimit = rateLimiter.check(ip);
    if (!rateLimit.success) {
      return Response.json({ error: "Too many requests, please try again later." }, { status: 429 });
    }

    const body = await request.json().catch(() => ({}));
    const text = body.text;

    // 2. Strict Input Validation (Type & Empty Checks)
    if (typeof text !== "string") {
      return Response.json({ error: "Invalid data format. Expected a string." }, { status: 400 });
    }

    if (!text || text.trim().length === 0) {
      return Response.json({ error: "No text provided" }, { status: 400 });
    }

    // 3. Length Limitation (Max 5000 chars)
    if (text.length > 5000) {
      return Response.json({ error: "Text exceeds maximum allowed length of 5000 characters." }, { status: 400 });
    }

    const completion = await groq.chat.completions.create({
model: "moonshotai/kimi-k2-instruct" as any ,    messages: [
        {
          role: "system",
          content: `You are an AI detection expert. Analyze the given text and estimate the probability that it was written by an AI.

Consider:
- Unnatural uniformity in sentence structure
- Overly formal or robotic phrasing  
- Lack of personality or human quirks
- Typical AI patterns and phrases

Respond with ONLY a JSON object in this exact format, nothing else:
{"ai_probability": 0.85}

Where the value is between 0.0 (fully human) and 1.0 (fully AI).`,
        },
        {
          role: "user",
          content: text,
        },
      ],
      temperature: 1.3,
      max_tokens: 50,
    });

    const raw = completion.choices[0]?.message?.content || '{"ai_probability": 0.5}';
    
    let aiProbability = 0.5;
    try {
      const cleaned = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      aiProbability = parsed.ai_probability ?? 0.5;
    } catch {
      aiProbability = 0.5;
    }

    return Response.json({
      ai_probability: Math.round(aiProbability * 100),
    });

  } catch (error) {
    console.error(error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}