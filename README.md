# ShikshaSathi

![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000?logo=vercel)
![TanStack Start](https://img.shields.io/badge/Built_with-TanStack_Start_%26_React_19-141321?logo=react)
![AI Engine](https://img.shields.io/badge/AI-Google_Gemini_2.0_Flash-4285F4?logo=google)
![Voice](https://img.shields/badge/Voice-ElevenLabs_%2B_WebSpeech-000?logo=openai)
![License](https://img.shields.io/badge/License-MIT-green)

**ShikshaSathi** is a voice-first AI co-teacher built for Indian school classrooms. A teacher speaks or types a topic, and the system instantly generates a complete, grade-appropriate lesson in Hinglish — complete with visuals, quizzes, classroom activities, and an AI-generated narration. It runs on smart boards, works offline, and supports multilingual teaching across all subjects.

---

## Problem Statement

**The Indian classroom faces a systemic resource gap.** One teacher is often responsible for 40–60 students with wildly different learning levels. The core challenges are:

| Challenge | Reality in the Classroom |
|---|---|
| **Content generation** | Teachers spend hours creating lesson plans, visual aids, and quizzes from scratch every day |
| **Personalization** | One pace cannot fit all — fast learners wait while slow learners fall behind |
| **Student engagement** | Textbook-only delivery fails to hold attention; teachers need interactive activities |
| **Language barriers** | Rural and semi-urban schools need Hinglish (Roman Hindi + English) materials, not purely English content |
| **Visual aids** | Teachers lack time and tools to produce clear, topic-specific diagrams for every lesson |
| **Assessment** | Creating contextual, grade-appropriate quizzes quickly is nearly impossible without support |

Traditional LMS platforms add administrative burden without solving these core teaching problems. ShikshaSathi replaces the teacher's prep work with AI — not the teacher.

---

## Solution

ShikshaSathi acts as an always-available teaching assistant that transforms a teacher's intent into a full classroom experience in seconds.

- **Speak or type** a topic (e.g., "Explain Photosynthesis for Class 7")
- The engine **detects intent** (lesson vs. quiz) and **extracts the topic and grade** automatically
- **Google Gemini 2.0 Flash** generates a structured, grade-aware lesson in Hinglish with visual steps, key points, examples, activities, and a teacher script
- If Gemini is unavailable, the system **falls back to OpenRouter** (Gemma 3 or Mistral) — and if all cloud providers fail, a **local template engine** delivers 8 built-in complete lessons instantly
- The lesson renders as **rich, animated cards** in a 3-panel classroom UI, optimized for smart-board projection
- An AI **voice narrator** (ElevenLabs multilingual, with 6 voice presets) reads the lesson aloud; students can answer via speech or text

The result is a fully self-contained, high-quality teaching session — zero prep time required.

---

## Features

### Core Teaching
- **AI Lesson Generation** — Structured Hinglish lessons with hooks, concepts, key points, subtopics, examples, common mistakes, classroom questions, activities, summaries, and teacher scripts (validated via Zod schema)
- **Grade-Aware Content** — Prompts scale word count and complexity automatically: 150–250 words for Class 1–3, up to 800–1200 words for Class 11–12
- **Quiz Generation** — Exactly 5 MCQs per topic, with 4 plausible options, correct answers, and explanations — all flagged with difficulty and type

### Visual Learning
- **Visual Flow Diagrams** — Flowcharts generated from AI responses (2–8 steps with icons and labels); rendered as animated vertical chains
- **Smart Board Mode** — High-contrast, large-typography presentation view designed for classroom projection with "Start Quiz" overlay

### Voice & Narration
- **Speech-to-Text** — Browser-native Web Speech API for continuous, interim-result voice input
- **AI Narration** — ElevenLabs `eleven_multilingual_v2` for Hindi/Hinglish, `eleven_turbo_v2_5` for English; returns base64 MP3 audio
- **Browser SpeechSynthesis Fallback** — Automatic fallback when ElevenLabs is unavailable (offline/quota)
- **TTS Caching** — LRU cache (80 entries) keyed by voice, style, speed, language, and text to eliminate redundant synthesis
- **6 Voice Presets** — Female/Male × Teacher/Friendly/Energetic style tuning (prosody, stability, similarity)

### Classroom Management
- **Smart Board Toggle** — One-click switch between detail view and projected presentation mode
- **Theme Selection** — Six per-subject themes: Nature, Science, History, Math, Language, Default
- **Session Context** — `sessionStorage`-backed classroom memory persists topic, grade, language, lesson, visual, and quiz across browser interactions
- **Command History** — Last 8 voice/text commands logged in the right panel
- **Conversation Timeline** — Full transcript of teacher input and AI narration in the RightPanel

### Multilingual & EdTech
- **Hinglish by Default** — All generated content uses natural Romanized Hindi + English (no Devanagari scripts)
- **Language Selection** — English, Hindi, Hinglish — voice engine and STT adapt accordingly
- **Indian Context Examples** — LLM prompts explicitly request Indian-context examples (cooking, cricket, Ganga, Chandrayaan)

### Resilience & Observability
- **Three-Tier Fallback** — Gemini 2.0 Flash → OpenRouter (Gemma 3 4B / Mistral Small) → Local template engine (8 built-in lessons); zero-config offline mode
- **Provider Error Classification** — Typed error codes for MISSING_API_KEY, QUOTA_EXCEEDED, RATE_LIMITED, INVALID_API_KEY, NETWORK
- **Health Endpoints** — Public API routes check Gemini and all providers at `/api/public/health/diagnostics`
- **Dev/Debug Mode** — URL param `?dev=1` toggles AIPlayground and DevDebugPanel for rapid iteration

---

## Screenshots

![Landing Page](docs/landing.png)
![Classroom View](docs/classroom.png)
![Quiz Mode](docs/quiz.png)
![Visual Learning](docs/visual-learning.png)

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, TypeScript 5.8, TanStack Start, TanStack Router, Vite 8 |
| **Styling** | Tailwind CSS 4.2, Custom CSS (`oklch` color system), CVA, Radix UI primitives |
| **UI Components** | shadcn/ui (60+ Radix components), Lucide React icons, Recharts, Embla Carousel |
| **AI** | Google Gemini 2.0 Flash (`@ai-sdk/google`), OpenRouter, Zod-validated structured JSON |
| **Voice** | ElevenLabs REST API, Web Speech API (SpeechRecognition + SpeechSynthesis) |
| **State** | React Context (Voice, Narration, Mode, Teaching Engine), React Query (TanStack Query) |
| **Forms** | React Hook Form + Zod |
| **Deployment** | Vercel (`dist/client` SPA fallback rewrites) |

---

## Project Architecture

```
Teacher Input (Voice / Text)
           │
           ▼
Intent Detection (detectIntent regex)
           │
           ▼
Topic & Grade Extraction (extractTopic, extractGrade)
           │
           ▼
Teaching Engine (generateTeachingResponse serverFn)
           │
     ┌─────┴─────┐
     │           │
  Gemini 2.0   OpenRouter
  (Primary)    (Gemma 3 / Mistral)
     │           │
     └─────┬─────┘
           │
           ▼
        Local Fallback
    (8 Hinglish templates)
           │
           ▼
    Zod Schema Validation
  (teachingResponseSchema)
           │
     ┌─────┴─────┐
     │           │
  Lesson       Quiz
  Cards        Experience
     │           │
     └─────┬─────┘
           │
           ▼
   CenterCanvas / SmartBoard
  + RightPanel + NarrateButton
```

**Key Architecture Components:**

- **`teaching-engine.functions.ts`** — Main server function (`generateTeachingResponse`) that orchestrates intent detection, prompt building, three-tier provider fallback, and Zod validation. Returns type-safe `TeachingResponse`.
- **`providers.ts`** — Three-tier fallback chain with 12-second timeouts: Gemini via `@ai-sdk/google`, OpenRouter via FETCH with `json_object` mode, local template synthesis. Tracks attempts, providers, and latency.
- **`voice.functions.ts`** — ElevenLabs TTS server function (`synthesizeSpeech`) with multilingual model selection, per-style voice tuning, speed clamping, and graceful fallback flagging.
- **`schema.ts`** — Zod schemas for the entire AI contract: `lessonSchema`, `quizSchema`, `quizQuestionSchema`, `visualSchema`, `teachingResponseSchema`. Enforces strict shape for UI rendering.
- **`prompts.ts`** — Grade-band-aware system prompts (`buildTeachingPrompt`, `buildQuizPrompt`) with hard constraints on Hinglish output, visual step rules, and placeholder bans.
- **`teaching-engine-context.tsx`** — React context managing engine status lifecycle (`idle → understanding → generating → preparing → done`), sessionStorage-backed classroom context, and topic-change merge logic.
- **`voice-context.tsx`** — React context wrapping Web Speech API recognition, ElevenLabs synthesis, TTS caching, audio playback state, and message timeline.

---

## Folder Structure

```
src/
├── routes/
│   ├── __root.tsx                      # Root shell, QueryClientProvider, SEO meta
│   ├── index.tsx                       # Landing page (Hero, Features, HowItWorks, Benefits, CTA)
│   ├── classroom.tsx                   # Main 3-panel classroom interface
│   └── api/public/
│       ├── health.ai.ts                # Gemini health check
│       └── health.diagnostics.ts       # All-provider diagnostics endpoint
├── components/
│   ├── classroom/
│   │   ├── ai-engine/
│   │   │   ├── teaching-engine-context.tsx  # Engine state + runEngine()
│   │   │   ├── intents.ts                   # Intent definitions + labels
│   │   │   ├── DevDebugPanel.tsx            # Diagnostics overlay
│   │   │   ├── AIPlayground.tsx             # Rapid prompt testing UI
│   │   │   ├── AIUnderstandingEngine.tsx    # AI pipeline visualization
│   │   │   └── VisualIntelligenceCard.tsx   # Visual step processing
│   │   ├── quiz/
│   │   │   ├── QuizExperience.tsx           # Live quiz with timer + results
│   │   │   ├── QuizTimer.tsx                # 20-second countdown per question
│   │   │   ├── QuizNarratorCard.tsx         # Voice quiz reading
│   │   │   ├── QuizAnalytics.tsx            # Results breakdown
│   │   │   ├── QuizHistoryCard.tsx          # Recent quiz log
│   │   │   └── quiz-data.ts                 # Question banks & history
│   │   ├── voice/
│   │   │   ├── VoiceSettingsCard.tsx        # Gender, style, speed, language
│   │   │   ├── VoiceShortcutsCard.tsx       # Quick-command prompts
│   │   │   └── ConversationTimelineCard.tsx # Message history
│   │   ├── CenterCanvas.tsx                # Main content area (lesson cards + quiz + smart board)
│   │   ├── LeftPanel.tsx                   # Teach / Quiz buttons + history
│   │   ├── RightPanel.tsx                  # Voice orb + transcript + insights
│   │   ├── TopBar.tsx                      # Language, class, smart-board toggles
│   │   ├── FloatingActionBar.tsx           # Mic, Lesson, Quiz, Type actions
│   │   ├── EmptyState.tsx                  # Pre-lesson landing in classroom
│   │   ├── StreamingOverlay.tsx            # AI generation loading state
│   │   ├── lesson-cards.tsx                # 12 typed lesson card components
│   │   ├── lesson-theme.ts                 # Theme metadata (gradients, icons)
│   │   ├── mode-context.tsx                # Teaching vs Quiz mode state
│   │   ├── narration-context.tsx           # Narration playback timeline
│   │   ├── voice-context.tsx               # Voice input/output state machine
│   │   ├── VoiceOrb.tsx                    # Animated listening/speaking orb
│   │   ├── VoiceWaveform.tsx               # Audio-level waveform visualization
│   │   ├── NarrateButton.tsx               # Play/stop narration button
│   │   ├── TranscriptCard.tsx              # Live transcript display
│   │   └── IntentCard.tsx                  # Detected intent display
│   ├── landing/
│   │   ├── Hero.tsx                        # Hero headline + CTA
│   │   ├── Features.tsx                    # Feature highlights
│   │   ├── HowItWorks.tsx                  # 4-step workflow
│   │   ├── Benefits.tsx                    # Value propositions
│   │   ├── FinalCTA.tsx                    # Call to action
│   │   ├── ClassroomIllustration.tsx       # SVG illustration
│   │   ├── Navbar.tsx / Logo.tsx / Footer.tsx
│   └── ui-edu/                             # Branded card, button, badge, section-header
├── lib/
│   ├── ai/
│   │   ├── schema.ts                       # Zod contracts for all AI responses
│   │   ├── prompts.ts                      # Grade-aware teaching + quiz prompts
│   │   ├── providers.ts                    # 3-tier provider orchestration
│   │   ├── teaching-engine.functions.ts    # Main generation serverFn
│   │   ├── voice.functions.ts              # ElevenLabs TTS serverFn
│   │   ├── gateway.server.ts               # Gemini SDK wrapper + error classification
│   │   ├── local-fallback.ts               # 8 built-in Hinglish lesson templates
│   │   └── api/example.functions.ts        # Starter template API
│   ├── utils.ts                            # clsx + tailwind-merge
│   ├── config.server.ts                    # Server configuration
│   └── lovable-error-reporting.ts          # Error capture
├── styles.css                              # Design system (oklch colors, gradients, fonts)
├── router.tsx                              # Route configuration
├── start.ts                                # TanStack Start entry
└── server.ts                               # SSR entry point
```

---

## AI Workflow

1. **Input Capture** — Teacher speaks via Web Speech API (or clicks a shortcut, or types in `FloatingActionBar`)
2. **Local Intent Detection** — Regex matching for keywords (`quiz`, `mcq`, `question`, `test`) determines `teaching` vs. `quiz`
3. **Topic Extraction** — Regex strips prefixes like "Explain", "Quiz on", "Teach" and extracts the core subject; grade is parsed from "Class 7" / "Grade 6" patterns
4. **Server Function Call** — `generateTeachingResponse` serverFn receives `{ input, intent, contextTopic, grade }` via TanStack Start
5. **Prompt Construction** — `buildTeachingPrompt` or `buildQuizPrompt` wraps the topic in grade-band-aware Hinglish constraints (word counts, example requirements, banned generic phrases)
6. **Provider Chain Execution** — `generateLessonJSON` attempts Gemini → OpenRouter → Local template; each attempt is logged with `{ provider, ok, error, latencyMs }`
7. **Schema Validation** — Raw JSON is stripped of code fences, merged with `intent`, and validated against `teachingResponseSchema` via Zod
8. **Context Merge** — Client merges result into `classroomContext`; topic changes clear prior lesson/quiz to prevent stale data
9. **UI Rendering** — `CenterCanvas` renders the appropriate view: `ActiveLesson` (12 typed cards) or `QuizExperience` (live quiz with timer)
10. **Voice Narration** — `NarrateButton` calls `synthesizeSpeech` serverFn → ElevenLabs; falls back to `speechSynthesis.speak` automatically when API fails
11. **Persistence** — `classroomContext` is serialized to `sessionStorage` on every update and rehydrated on load

---

## Prompt Engineering

**Teaching Prompts (`buildTeachingPrompt`)**

The prompt enforces a strict Hinglish (Roman script) output with:
- Grade-band word count: 150–250 (Class 1–3), 300–500 (Class 4–6), 500–800 (Class 7–10), 800–1200 (Class 11–12)
- 13 required fields: `hook`, `concept`, `whyItMatters`, `keyPoints`, `subtopics`, `examples`, `mistakes`, `classroomQuestion`, `activity`, `summary`, `teacherScript`, `studentQuestions`, `expectedAnswers`
- Hard constraints: NO generic phrases ("important topic", "basic ideas", "concept", "how it works"); visual steps MUST be 4–6 REAL conceptual stages of the topic
- Output format: exact JSON schema with no markdown or code fences

**Quiz Prompts (`buildQuizPrompt`)**

Simplified but strict:
- Exactly 5 MCQs
- Each with 4 plausible options, `correctAnswer` matching an option EXACTLY (case-sensitive)
- `explanation` field per question in Hinglish
- Default difficulty: `easy`

**Local Fallback Templates**

When all cloud providers fail, 8 pre-built Hinglish templates deliver full lessons + quizzes instantly:
- Photosynthesis, Water Cycle, Solar System, Number System, Fractions, Democracy, Food Chain, States of Matter
- Plus a generic template for any unrecognized topic
- Each template contains 3–6 key points, 3–4 Indian-context examples, 2–3 common mistakes, a hands-on activity, a 3–5 line teacher script, 3 student questions with expected answers, and a 5-question quiz

**Structured JSON Generation**

- `@ai-sdk/google` with `responseMimeType: "application/json"` forces Gemini to emit parseable JSON
- OpenRouter uses `response_format: { type: "json_object" }` with a system message: "You output only valid JSON. No prose, no markdown."
- `stripFences` removes accidental code-fence wrapping before `JSON.parse`
- Zod `teachingResponseSchema.safeParse` guarantees downstream components never encounter malformed data

---

## Installation

```bash
git clone https://github.com/<your-username>/ShikshaSathi.git
cd ShikshaSathi
npm install
```

## Environment Variables

Create a `.env` file in the project root:

```bash
GOOGLE_API_KEY=your_gemini_api_key_here
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
OPENROUTER_API_KEY=your_openrouter_api_key_here  # Optional — enhances fallback coverage
```

| Variable | Required | Purpose |
|---|---|---|
| `GOOGLE_API_KEY` | Yes | Google Generative Language API key for Gemini 2.0 Flash |
| `ELEVENLABS_API_KEY` | Yes | ElevenLabs API key for AI narration |
| `OPENROUTER_API_KEY` | No | Fallback provider (enhances offline resilience) |

## Running Locally

```bash
npm run dev
```

Open `http://localhost:3000`.

## Build

```bash
npm run build
```

Build output is written to `dist/client`.

## Preview

```bash
npm run preview
```

## Lint

```bash
npm run lint
```

## Deployment

ShikshaSathi is optimized for **Vercel**. The `vercel.json` config already specifies:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist/client",
  "framework": null,
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

**Deploy steps:**

1. Push to GitHub
2. Import repo in Vercel
3. Add environment variables (`GOOGLE_API_KEY`, `ELEVENLABS_API_KEY`, optionally `OPENROUTER_API_KEY`)
4. Click Deploy

**TanStack Start notes:**
- The build produces an SSR server bundle and a client bundle; Vercel's SPA fallback rewrite ensures all routes resolve to `dist/client`
- For self-hosted deployment, run `npm run build` then `node dist/server/server.js`

---

## Future Improvements

- **Student Profiles** — Per-student progress tracking, individual performance analytics, and personalized lesson pacing
- **Attendance & Session Analytics** — Track engagement duration, response accuracy, and topic difficulty over time
- **LMS Integration** — Export lessons, quizzes, and grades to Google Classroom, Moodle, or DIKSHA
- **Image-Based Learning** — Accept camera/photo input for diagram recognition and real-world object explanation
- **Adaptive Learning Paths** — Difficulty adjustment based on quiz performance and historical mastery data
- **Collaborative Classrooms** — Multi-teacher rooms with shared history and student rosters
- **Offline PWA** — Service worker + IndexedDB for full offline lesson delivery in low-connectivity schools
- **Multi-Subject Onboarding** — Structured subject catalog with curated prompt templates per NCERT chapter
- **Accessibility** — WCAG-compliant high-contrast mode, screen-reader labels, keyboard-only navigation
- **Analytics Dashboard** — Teacher-facing insights on common misconceptions, class-wide performance trends, and exportable reports

---

## Demo Video

Coming soon.

---

## License

[MIT](LICENSE)

---

Built for teachers who deserve better tools. If ShikshaSathi helps your classroom, star the repo and share it with your school network.
