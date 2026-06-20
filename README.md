# SmartShala — AI Classroom (TanStack Start)

A live AI tutoring surface: a teacher types an instruction ("Explain X",
"Quiz me on Y", "Activity on Z"), and the app generates a structured
lesson, visual, quiz, activity, or translation, narrated by ElevenLabs.

## Tech Stack
- TanStack Start v1 (React 19 + Vite 7), file‑based routes
- Tailwind v4 via `src/styles.css`, shadcn/ui components
- AI SDK v6 (`ai`, `@ai-sdk/openai-compatible`)
  → `google/gemini-3-flash-preview`
- ElevenLabs TTS (REST) for voice
- No database. Session state in `sessionStorage`
  (`ss-global-classroom-context`)

## Folder Structure
src/
├── routes/
│   ├── __root.tsx              # html/head/body shell
│   ├── index.tsx               # landing page
│   └── classroom.tsx           # main app surface
├── components/
│   ├── classroom/
│   │   ├── ai-engine/
│   │   │   ├── teaching-engine-context.tsx  # client state, runEngine()
│   │   │   ├── DevDebugPanel.tsx            # ?dev=1 diagnostics
│   │   │   ├── AIPlayground.tsx
│   │   │   ├── AIUnderstandingEngine.tsx
│   │   │   ├── VisualIntelligenceCard.tsx
│   │   │   └── intents.ts
│   │   ├── visual-engine/      # MindMap/Cycle/Flowchart/Timeline/...
│   │   ├── quiz/               # QuizExperience, QuizNarrator, analytics
│   │   ├── activity/           # ActivityExperience, Facilitator card
│   │   ├── summary/            # SummaryStudio
│   │   ├── translation/        # TranslationStudio
│   │   ├── voice/              # VoiceSettingsCard, ConversationTimeline
│   │   ├── voice-context.tsx
│   │   ├── narration-context.tsx
│   │   ├── mode-context.tsx
│   │   ├── CenterCanvas.tsx LeftPanel.tsx RightPanel.tsx TopBar.tsx
│   │   ├── NarrateButton.tsx VoiceOrb.tsx VoiceWaveform.tsx
│   │   └── lesson-cards.tsx lesson-theme.ts
│   ├── landing/                # Hero, Navbar, Features, etc.
│   ├── ui/                     # shadcn primitives
│   └── ui-edu/                 # branded variants
├── lib/
│   ├── ai/
│   │   ├── gateway.server.ts            # gemini api
│   │   ├── teaching-engine.functions.ts # ★ main lesson/quiz/activity engine
│   │   ├── summary.functions.ts
│   │   ├── translation.functions.ts
│   │   ├── voice.functions.ts           # ElevenLabs TTS
│   │   ├── prompts.ts                   # SYSTEM_PROMPT, ACTIVITY_…, etc.
│   │   └── schema.ts                    # Zod schemas, enums
│   ├── api/example.functions.ts
│   ├── config.server.ts
│   ├── error-capture.ts
│   ├── error-page.ts
│   └── utils.ts
├── styles.css
├── router.tsx
├── routeTree.gen.ts            # auto-generated, do not edit
└── start.ts

## Routes
- `/`           Landing page
- `/classroom`  Main teaching surface (supports `?dev=1`)

## React Contexts
- `ModeProvider`            UI mode toggles
- `TeachingEngineProvider`  Engine status, lesson state, debug payload
- `VoiceProvider`           Voice settings (language, style, gender, speed)
- `NarrationProvider`       Active narration timeline / playback

## AI Pipeline (end‑to‑end)
1. User types in `FloatingActionBar` (classroom.tsx).
2. `useTeachingEngine().runEngine(input, hints)` (teaching-engine-context).
3. `useServerFn(generateTeachingResponse)` → POST `/​_serverFn/...`.
4. `teaching-engine.functions.ts` handler:
   a. `detectIntentFromText` (teach | quiz | activity | translate | summary | visual | revision)
   b. `extractTopicFromInput`
   c. `buildUserPrompt` + `SYSTEM_PROMPT` / `ACTIVITY_SYSTEM_PROMPT`
   d. `tryGenerate` → `generateText({ model: gateway("google/gemini-3-flash-preview") })`
   e. Up to 3 attempts (standard → reinforced → simplified)
   f. After each: `repairToLesson` / `coerceLoose` → `teachingResponseSchema.safeParse`
   g. If everything fails → `synthesiseFallback` (the misleading "3 attempts" message)
   h. `attachDebug(...)` mutates the result with `__debug` for ?dev=1
5. Client merges into `classroomContext`, renders via VisualEngine + lesson cards.
6. `NarrateButton` → `synthesizeSpeech` (voice.functions.ts) → ElevenLabs.

### Quiz flow
Same engine, `intent=generate_quiz`, uses `SIMPLIFIED_QUIZ_PROMPT` on retry. Rendered by `quiz/QuizExperience.tsx`.

### Activity flow
Same engine, `intent=create_activity`, uses `ACTIVITY_SYSTEM_PROMPT`. Rendered by `activity/ActivityExperience.tsx`.

### Translation flow
`translation.functions.ts` → Google api → renders in `translation/TranslationStudio.tsx`.

### Summary flow
`summary.functions.ts` → Google api → `summary/SummaryStudio.tsx`.

### Voice flow
`voice.functions.ts` → ElevenLabs REST. Always returns 200; sets `fallback:true` and an error code on failure so the client may use browser SpeechSynthesis (only as emergency fallback).

## Environment Variables
Server‑only (Google Cloud "Secrets"):
- `GOOGLE_API_KEY`       gemini ai (to generate output)
- `ELEVENLABS_API_KEY`    ElevenLabs TTS (connector‑managed)

Client (Vite):
- (none required)


## State Management
- React context (Engine, Voice, Narration, Mode).
- `sessionStorage` key `ss-global-classroom-context` (persists topic, lesson, visual, quiz, activity, translation across reloads in a tab).
- Server functions are stateless.

## Setup
```bash
npm install
npm run dev
```

## environment variables (.env setup) (Optional)
```bash
GOOGLE_API_KEY=YOUR_GEMINI_API_KEY
ELEVENLABS_API_KEY=YOUR_ELEVENLABS_API_KEY
```