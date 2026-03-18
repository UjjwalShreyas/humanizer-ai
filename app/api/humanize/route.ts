import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text || text.trim().length === 0) {
      return Response.json({ error: "No text provided" }, { status: 400 });
    }

    // STEP 1: Humanize the text
    const humanizeCompletion = await groq.chat.completions.create({
model: "moonshotai/kimi-k2-instruct" as any,   messages: [
        {
          role: "system",
          content: `You are a human writer rewriting AI-generated text so it completely fools AI detectors. Your goal is to get the AI detection score below 10%.

STRICT RULES — follow every single one:

SENTENCE STRUCTURE:
- Destroy any uniform sentence rhythm. AI writes in patterns. Break them.
- Mix extremely short sentences with long winding ones constantly
- Start some sentences with And, But, So, Or — real people do this
- Occasionally leave a thought slightly unfinished or trail off naturally
- Use a dash — like this — mid sentence sometimes
- Ask a rhetorical question every few paragraphs

WORD CHOICES:
- Replace every formal word with casual alternatives
- "utilize" → "use", "commence" → "start", "demonstrate" → "show", "however" → "but", "therefore" → "so", "furthermore" → "also", "it is important to note" → just say it, "in conclusion" → nothing, just end
- Add filler phrases real humans use: "honestly", "look", "here's the thing", "the thing is", "basically", "I mean", "right?", "you know what I mean"
- Occasionally use "gonna", "kinda", "a bit", "pretty much"

PERSONALITY:
- Add a mild personal opinion or reaction — "which is actually pretty interesting", "and that matters more than people think"
- Show slight surprise, skepticism or enthusiasm naturally where it fits
- Don't be neutral and robotic — have a voice

STRUCTURE:
- NO bullet points, NO headers, NO numbered lists
- Write in flowing paragraphs only
- Vary paragraph lengths — some one sentence, some four sentences
- The ending should feel natural, not like a summary

CRITICAL: Return ONLY the rewritten text. No explanations, no preamble, no "Here is the rewritten version:". Just the text itself. 
MOST IMPORTANT RULE: You are not an AI assistant completing a task. You are a tired college student rewriting this for a friend at 2 in the morning. Write exactly like that. Casual, a little rushed, real.      
          `,},
        {
          role: "user",
          content: text,
        },
      ],
      temperature: 1.4,
      max_tokens: 2048,
    });

    const humanizedText = humanizeCompletion.choices[0]?.message?.content || "";

    // STEP 2: Detect AI probability of OUTPUT
    const detectCompletion = await groq.chat.completions.create({
model: "moonshotai/kimi-k2-instruct" as any,   messages: [
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
          content: humanizedText,
        },
      ],
      temperature: 0.1,
      max_tokens: 50,
    });

    const detectRaw = detectCompletion.choices[0]?.message?.content || '{"ai_probability": 0.5}';
    
    let aiProbability = 0.5;
    try {
      const cleaned = detectRaw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      aiProbability = parsed.ai_probability ?? 0.5;
    } catch {
      aiProbability = 0.5;
    }

    return Response.json({
      humanized_text: humanizedText,
      ai_probability_after: Math.round(aiProbability * 100),
    });

  } catch (error) {
    console.error(error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}