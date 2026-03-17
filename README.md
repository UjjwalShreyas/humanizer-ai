# AI Humanizer

A free, private tool that rewrites AI-generated text to sound completely human — beating AI detectors consistently.

## Features

- Rewrites AI text to sound natural and human
- Built-in AI detection score before and after
- 100% free, no account required
- Zero data storage — your text is never saved
- Fully responsive — works on all devices

## Tech Stack

- Next.js 14 (App Router)
- Tailwind CSS
- Groq API (Mixtral / Kimi K2)
- TypeScript

## Getting Started

1. Clone the repo
2. Install dependencies with `npm install`
3. Create a `.env.local` file with your Groq API key:

GROQ_API_KEY=your_key_here

4. Run the dev server with `npm run dev`
5. Open `http://localhost:3000`

## Deployment

Deployed on Vercel. Add `GROQ_API_KEY` as an environment variable in your Vercel project settings.

## Privacy

No user data is collected or stored. Text is processed in memory and immediately discarded after the result is returned.

## Disclaimer

This tool is intended for legitimate use only. Users are solely responsible for how they use the output.
```

Save, then run:
```
git add .
```
```
git commit -m "add README"
```
```
git push
