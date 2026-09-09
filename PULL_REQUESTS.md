# ShikshaSathi — IEEE Contributions & Pull Requests Report

---

## 📌 Project Overview

**ShikshaSathi** is a voice-first AI co-teacher built for Indian school classrooms and government school smart boards.
- **Repository:** https://github.com/harshitSingh1/ShikshaSathi
- **Contributor Fork:** https://github.com/SriRamkunamsetty/ShikshaSathi
- **Voice & Multilingual Core:** Enables teachers to speak or type any topic in Hindi, English, or Hinglish to generate grade-appropriate lessons, diagrams, quizzes, and classroom activities.
- **Resilient AI Pipeline:** 3-tier fallback chain (Gemini 2.0 Flash → OpenRouter / Featherless AI → 8 built-in local offline templates).
- **Audio & Narration:** ElevenLabs text-to-speech with automatic failover to the native browser Web Speech API.
- **Tech Stack:** TanStack Start (SSR), React 19, Vite, Tailwind CSS v4, Radix UI, Zod schema validation, Vitest.

---

## 📊 Pull Request Statistics

| Metric | Count | Details & Direct URLs |
|---|:---:|---|
| **Total PRs on Upstream Repository** | **11** | **4 MERGED, 7 OPEN** |
| **Total PRs Pushed by SriRamkunamsetty** | **9** | **2 MERGED (PR #6, PR #7), 7 OPEN** |
| **Total Issues Raised by SriRamkunamsetty** | **7** | Issues #8, #10, #12, #14, #16, #18, #20 |
| **Total Merged PRs on Upstream** | **4** | PR #2, PR #5, PR #6, PR #7 |

### Status Breakdown of Your PRs
- 🟣 **Merged PRs:** 2 (PR #6, PR #7 — reviewed and merged by maintainer `harshitSingh1`)
- 🟢 **Open PRs:** 7 (PR #9, PR #11, PR #13, PR #15, PR #17, PR #19, PR #21)
- 🔴 **Closed/Rejected PRs:** 0

---

## 🔗 Contributor Pull Requests (IEEE Criteria Format & Full URLs)

### Pull Request #9 (CURRENTLY OPEN)
- **🔗 Pull Request Number & Link:** PR #9 — https://github.com/harshitSingh1/ShikshaSathi/pull/9
- **🎯 Issue Number Solved:** Fixes Issue #8 — https://github.com/harshitSingh1/ShikshaSathi/issues/8 (*"fix: Propagate selected language and grade to AI teaching engine"*)
- **📅 Date Pushed:** September 9, 2026 (`2026-09-09T01:41:43Z`)
- **⚡ Status:** **OPEN** (Ready for maintainer review & merge, 0 merge conflicts)
- **🌿 Source Branch:** `SriRamkunamsetty:pr/03-language-grade` — https://github.com/SriRamkunamsetty/ShikshaSathi/tree/pr/03-language-grade
- **📝 Short summary of the work done:**
  - Resolved bug where UI TopBar language switch and grade selector were ignored by the backend AI teaching engine, which was hardcoded to Hinglish and Class 6.
  - Added `language` and grade normalization to `src/lib/ai/teaching-engine.functions.ts`.
  - Updated `voice-context.tsx` and `AIPlayground.tsx` to forward active language and grade to `runEngine`.
  - Updated `prompts.ts` with language script directives and grade bands.
  - Passed production build (`npm run build` exits code 0).

---

### Pull Request #6
- **🔗 Pull Request Number & Link:** PR #6 — https://github.com/harshitSingh1/ShikshaSathi/pull/6
- **🎯 Issue Number Solved:** Fixes Issue #1 — https://github.com/harshitSingh1/ShikshaSathi/issues/1 (*"Footer links are all dead # anchors"*)
- **📅 Date Pushed:** August 28, 2026 (`2026-08-28T04:29:13Z`)
- **🎉 Date Merged:** September 8, 2026 (`2026-09-08T06:34:43Z`) by [Harshit Singh (`harshitSingh1`)](https://github.com/harshitSingh1)
- **⚡ Status:** **MERGED**
- **🌿 Source Branch:** SriRamkunamsetty:pr/01-landing-navigation — https://github.com/SriRamkunamsetty/ShikshaSathi/tree/pr/01-landing-navigation
- **📝 Short summary of the work done:**
  - Repaired inert landing-page hero and final CTA navigation buttons by connecting them directly to the `/classroom` route.
  - Replaced non-functional dead footer anchor tags (`href="#"`) across Product, For Schools, and Company sections with valid anchor targets (`#features`, `#smartboard`, `#voice`).
  - Added a dedicated, SSR-safe dynamic `/resources` route (`src/routes/resources.tsx`) backed by Zod query parameter validation for Roadmap, Pilot Programme, Teacher Training, NGO Partnerships, Case Studies, About, Mission, Careers, and Contact.
  - Verified with production build (`vite build` passed with zero errors).

---

### Pull Request #7
- **🔗 Pull Request Number & Link:** PR #7 — https://github.com/harshitSingh1/ShikshaSathi/pull/7
- **🎯 Issue Number Solved:** Fixes Classroom Static Prompt Bugs / Topic-Aware Actions
- **📅 Date Pushed:** August 28, 2026 (`2026-08-28T04:33:55Z`)
- **🎉 Date Merged:** September 8, 2026 (`2026-09-08T06:51:04Z`) by [Harshit Singh (`harshitSingh1`)](https://github.com/harshitSingh1)
- **⚡ Status:** **MERGED**
- **🌿 Source Branch:** SriRamkunamsetty:pr/02-classroom-actions — https://github.com/SriRamkunamsetty/ShikshaSathi/tree/pr/02-classroom-actions
- **📝 Short summary of the work done:**
  - Removed static placeholder prompts from the classroom sidebar (`LeftPanel.tsx`), which previously sent generic text like *"Teach a short lesson on the topic I will tell you next"* and *"Generate practice question quiz on this topic"*.
  - Implemented smart topic awareness: when an active lesson topic exists, "Teach a Lesson" or "Practice Quiz" automatically reuses that topic to construct specific queries (`Generate a 5-question quiz on "${topic}"`).
  - Added an event-driven fallback (`ss:open-type-input` custom event) that triggers a focused type-entry flow with contextual placeholder text when no topic has been selected yet.
  - Updated `RightPanel.tsx` contextual follow-up actions to preserve the active topic and automatically hide follow-up actions when no lesson context is present.

---

## 👥 Upstream Pull Requests (Complete Repo History)

| PR # | Title & Link | Author | Merged Date | Solves Issue |
|:---:|---|:---:|:---:|:---:|
| **#2** | [docs : add contributing guidelines](https://github.com/harshitSingh1/ShikshaSathi/pull/2) | Bawejakartik | 2026-08-13 | Contribution Workflow |
| **#5** | [docs: add API integration guide](https://github.com/harshitSingh1/ShikshaSathi/pull/5) | Bawejakartik | 2026-08-20 | [Issue #4](https://github.com/harshitSingh1/ShikshaSathi/issues/4) |
| **#6** | [fix: repair landing page navigation](https://github.com/harshitSingh1/ShikshaSathi/pull/6) | SriRamkunamsetty | 2026-09-08 | [Issue #1](https://github.com/harshitSingh1/ShikshaSathi/issues/1) |
| **#7** | [Pr/02 classroom actions](https://github.com/harshitSingh1/ShikshaSathi/pull/7) | SriRamkunamsetty | 2026-09-08 | Classroom Topic Continuity |

---

### 🎯 Complete Upstream Pull Requests & Issues Table

| PR # & Direct URL | Title / Purpose | Source Branch | Issue # & Link | Status |
|:---:|---|---|:---:|:---:|
| [**PR #11**](https://github.com/harshitSingh1/ShikshaSathi/pull/11) | **feat: smartboard classroom suite (worksheets, ncert, chalkboard, regional languages, team quiz, offline usb)** | `feat/classroom-smartboard-suite` | [Issue #10](https://github.com/harshitSingh1/ShikshaSathi/issues/10) | 🟢 **OPEN** |
| [**PR #9**](https://github.com/harshitSingh1/ShikshaSathi/pull/9) | **fix: propagate classroom language and grade to AI engine** | `pr/03-language-grade` | [Issue #8](https://github.com/harshitSingh1/ShikshaSathi/issues/8) | 🟢 **OPEN** |
| [**PR #13**](https://github.com/harshitSingh1/ShikshaSathi/pull/13) | **fix: clean extracted classroom topics** | `pr/04-topic-parser` | [Issue #12](https://github.com/harshitSingh1/ShikshaSathi/issues/12) | 🟢 **OPEN** |
| [**PR #15**](https://github.com/harshitSingh1/ShikshaSathi/pull/15) | **fix: clarify unsupported classroom actions** | `pr/05-supported-shortcuts` | [Issue #14](https://github.com/harshitSingh1/ShikshaSathi/issues/14) | 🟢 **OPEN** |
| [**PR #17**](https://github.com/harshitSingh1/ShikshaSathi/pull/17) | **fix: align production preview documentation** | `pr/06-deployment-preview` | [Issue #16](https://github.com/harshitSingh1/ShikshaSathi/issues/16) | 🟢 **OPEN** |
| [**PR #19**](https://github.com/harshitSingh1/ShikshaSathi/pull/19) | **test: cover AI parser and prompt contracts** | `pr/07-ai-tests` | [Issue #18](https://github.com/harshitSingh1/ShikshaSathi/issues/18) | 🟢 **OPEN** |
| [**PR #21**](https://github.com/harshitSingh1/ShikshaSathi/pull/21) | **fix: expose safe provider diagnostics** | `pr/08-diagnostics` | [Issue #20](https://github.com/harshitSingh1/ShikshaSathi/issues/20) | 🟢 **OPEN** |
| [**PR #7**](https://github.com/harshitSingh1/ShikshaSathi/pull/7) | **fix: make classroom actions topic aware** | `pr/02-classroom-actions` | Topic Continuity | 🟣 **MERGED** |
| [**PR #6**](https://github.com/harshitSingh1/ShikshaSathi/pull/6) | **fix: repair landing page navigation** | `pr/01-landing-navigation` | [Issue #1](https://github.com/harshitSingh1/ShikshaSathi/issues/1) | 🟣 **MERGED** |

---

## 🚀 Phase 2 Features Implemented in PR #11

1. **Printable Bilingual Classroom Worksheet (A4 PDF/Print):** Standard Indian school layout with school header, student info, Section A (5 MCQs), Section B (Subjective), Section C (Hands-on Activity), and Teacher signature block.
2. **NCERT Curriculum Navigator (Classes 6–10):** Direct chapter navigation for Science and Mathematics aligned with NCERT syllabus.
3. **Smart Board Touch Chalkboard Overlay:** Touch/stylus drawing overlay with 5 chalk colors, highlighter, precision eraser, and PNG notes export.
4. **Regional Indian Languages Expansion:** Adds Telugu (`తెలుగు`), Tamil (`தமிழ்`), Marathi (`मराठी`), Bengali (`বাংলা`), Kannada (`ಕನ್ನಡ`), and Gujarati (`ગુજરાતી`) with native script directives and speech recognition locales.
5. **Classroom Team Quiz Battle:** Team A (🦁 Blue Lions) vs Team B (🐯 Orange Tigers) with live smart board scoreboard (+10 pts) and winner celebration.
6. **Offline Lesson Library & USB Pack:** Browser offline storage cache with JSON export/import for USB pen drives.
7. **Verification:** `npm run build` passed with zero errors.
