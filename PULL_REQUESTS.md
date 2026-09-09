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
| **Total PRs on Upstream Repository** | **4** | **4 MERGED (100% Merge Rate)** |
| **Total PRs Pushed by SriRamkunamsetty** | **2** | **2 MERGED (PR #6 & PR #7)** |
| **Additional Prepared Branches on Fork** | **6** | `pr/03` through `pr/08` (Staged & verified) |
| **Total Issues on Upstream Tracker** | **2** | **2 CLOSED** (Issue #1 & Issue #4) |

### Status Breakdown of Your PRs
- 🟣 **Merged PRs:** 2 (PR #6, PR #7 — both reviewed and merged by maintainer `harshitSingh1`)
- 🟢 **Open PRs:** 0 (Ready to raise next issue for `pr/03-language-grade`)
- 🔴 **Closed/Rejected PRs:** 0

---

## 🔗 Contributor Pull Requests (IEEE Criteria Format & Full URLs)

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

## 🎯 Issues Resolved & Sequenced Next Steps

| # | Issue Title & Direct Link | Solved By / Branch | Status |
|:---:|---|---|:---:|
| **1** | [Issue #1: Footer links are all dead # anchors](https://github.com/harshitSingh1/ShikshaSathi/issues/1) | PR #6 (https://github.com/harshitSingh1/ShikshaSathi/pull/6) | **CLOSED** (Merged) |
| **2** | [Issue #4: Create api.md Documentation](https://github.com/harshitSingh1/ShikshaSathi/issues/4) | PR #5 (https://github.com/harshitSingh1/ShikshaSathi/pull/5) | **CLOSED** (Merged) |
| **3** | Classroom quick actions lack topic awareness | PR #7 (https://github.com/harshitSingh1/ShikshaSathi/pull/7) | **RESOLVED** (Merged) |
| **4** | Language selector and grade not propagated to backend | `pr/03-language-grade` (https://github.com/SriRamkunamsetty/ShikshaSathi/tree/pr/03-language-grade) | **NEXT IN QUEUE** (Ready for Issue) |
| **5** | Regex topic parser captures grade and student suffix words | `pr/04-topic-parser` (https://github.com/SriRamkunamsetty/ShikshaSathi/tree/pr/04-topic-parser) | Staged on Fork |
| **6** | Inert classroom shortcuts fail silently with empty prompts | `pr/05-supported-shortcuts` (https://github.com/SriRamkunamsetty/ShikshaSathi/tree/pr/05-supported-shortcuts) | Staged on Fork |
| **7** | Production preview instructions mismatch in README | `pr/06-deployment-preview` (https://github.com/SriRamkunamsetty/ShikshaSathi/tree/pr/06-deployment-preview) | Staged on Fork |
| **8** | AI contracts and parser lack automated tests | `pr/07-ai-tests` (https://github.com/SriRamkunamsetty/ShikshaSathi/tree/pr/07-ai-tests) | Staged on Fork |
| **9** | DevDebugPanel crashes on stale telemetry fields | `pr/08-diagnostics` (https://github.com/SriRamkunamsetty/ShikshaSathi/tree/pr/08-diagnostics) | Staged on Fork |

---

## 🚀 Phase 2 Production Upgrades (Approved & Verified)

To elevate ShikshaSathi into an indispensable smart-board platform for Indian government & budget schools, the following modular features have been implemented and verified with zero build/TypeScript errors (`npm run build` exits 0):

| Feature | Branch / Package | Problem Solved & Classroom Value | Verification |
|---|---|---|:---:|
| **1. Printable Bilingual Classroom Worksheet (A4 PDF/Print)** | `feat/printable-worksheets` | Generates official school A4 worksheets with Section A (5 MCQs), Section B (Subjective), Section C (Hands-on Activity), and Teacher signature block for low-tech schools. | Verified & Build OK |
| **2. NCERT Curriculum Navigator (Classes 6–10)** | `feat/ncert-curriculum` | One-tap syllabus navigation for Science & Math chapters so teachers don't need complex prompting. | Verified & Build OK |
| **3. Smart Board Chalkboard Overlay** | `feat/chalkboard-overlay` | Touch/stylus annotation layer with 5 chalk colors, highlighter, eraser, and PNG notes export for smart boards. | Verified & Build OK |
| **4. Regional Indian Languages Expansion** | `feat/regional-languages` | Adds Telugu, Tamil, Marathi, Bengali, Kannada, and Gujarati with native scripts and BCP 47 STT/TTS locales. | Verified & Build OK |
| **5. Classroom Team Quiz Battle** | `feat/team-quiz-mode` | Blue Lions 🦁 vs Orange Tigers 🐯 with live smart board scoring (+10 pts) and turn indicators for whole-class participation. | Verified & Build OK |
| **6. Offline Library & USB Pack** | `feat/offline-usb-library` | Local browser lesson cache and JSON pack export/import via USB pen drive for zero-connectivity classrooms. | Verified & Build OK |

---

## 💡 Maintainer Recommended Workflow
As requested by the repository maintainer (`harshitSingh1`):
1. **Raise the GitHub Issue first** stating the problem and proposing the targeted solution.
2. Wait for confirmation or submit the corresponding PR directly linking the issue.
3. Keep PRs modular and reviewable one by one to avoid merge conflicts.
