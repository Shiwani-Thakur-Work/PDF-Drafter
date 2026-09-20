# PRD Drafter

A free, open-source AI tool that turns a rough product idea into a structured,
editable PRD (Product Requirements Document) — built with **Next.js** (App Router)
and **Groq** (free-tier LLM inference).

## How it works

1. **Describe the idea** — a sentence or two is enough.
2. **Answer a few clarifying questions** — AI-generated based on your idea (target
   user, core metric, platform, constraints, scope boundary). Skip any you're unsure of.
3. **Get a full PRD** — 11 standard sections (problem, goals, non-goals, personas,
   user stories, requirements, NFRs, scope, risks, timeline, open questions),
   each editable inline, with a "Regenerate" and "Tighten wording" button per section.
4. **Export** — download as Markdown or copy to clipboard.

No login, no database — everything happens in the request/response cycle. Your
Groq API key stays server-side (never shipped to the browser). Light and dark
themes are both supported.

## Tech stack

- Next.js 14 (App Router, TypeScript)
- Tailwind CSS
- Framer Motion for the small transitions and micro-interactions
- Groq API (OpenAI-compatible `/chat/completions` endpoint, `openai/gpt-oss-120b`
  by default — override with `GROQ_MODEL` if Groq's open-tier lineup changes; see
  [console.groq.com/docs/models](https://console.groq.com/docs/models))
- `jsonrepair` to recover from the occasional malformed-JSON response a model
  produces, instead of failing the whole generation

## Running it locally

```bash
git clone <your-repo-url>
cd prd-generator-app
npm install
cp .env.example .env.local
```

Get a free API key at [console.groq.com/keys](https://console.groq.com/keys) and
paste it into `.env.local`:

```
GROQ_API_KEY=your_key_here
```

Then:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). No key yet? Click "Preview
with sample data" on the idea screen to see the full generated-PRD layout without
touching the API.

## Deploying to Netlify

1. Push this folder to a new GitHub repo.
2. Go to [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project** → pick your repo.
3. Netlify auto-detects Next.js via the included `netlify.toml` (which pulls in `@netlify/plugin-nextjs`) — no manual build settings needed.
4. In **Site configuration → Environment variables**, add `GROQ_API_KEY` = your key.
5. Deploy. Your API routes run as Netlify Functions automatically.

## Project structure

```
app/
  api/
    questions/route.ts   — generates clarifying questions from the idea
    prd/route.ts          — generates the full structured PRD
    section/route.ts      — regenerates a single section
  page.tsx                — landing page + tool
  layout.tsx, globals.css
components/
  Hero.tsx                 — animated hero section
  Logo.tsx                 — small logo mark
  ThemeToggle.tsx           — light/dark toggle
  PrdTool.tsx               — the multi-step client-side flow
  LearnSection.tsx          — the tabbed "What's a PRD?" info section
lib/
  groq.ts                   — Groq API helper (fetch wrapper + JSON recovery)
  sections.ts                — PRD section definitions + markdown export
  examples.ts                — example idea presets + no-API sample fixtures
```

## Why this exists

Built as a portfolio project — a small, real, deployed tool rather than a mockup,
to show both product thinking (the section structure, the clarifying-questions step)
and the ability to ship working software end to end.

## Credits & inspiration

The idea → clarifying questions → generated PRD flow was inspired by
[RapidNative's free PRD generator](https://www.rapidnative.com/tools/prd-generator),
which I came across while looking for a PRD maker project that would actually get
used rather than just look nice as an idea. I liked the shape of that flow
enough to want to build my own version of it — with a fuller 11-section output,
per-section editing and regeneration, and a codebase I could actually ship and
own end to end. No code, copy, or design assets were copied from that site; this
is an original implementation built from scratch.

## License

Personal project
