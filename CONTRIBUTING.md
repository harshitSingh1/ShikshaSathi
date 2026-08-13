# Contributing to ShikshaSathi

*Pull requests, bug reports, and all other forms of contribution are welcomed and highly encouraged!* 🎓

### Contents

- [Contributing to ShikshaSathi](#contributing-to-shikshasathi)
    - [Contents](#contents)
  - [:book: Code of Conduct](#book-code-of-conduct)
  - [:bulb: Asking Questions](#bulb-asking-questions)
  - [:inbox\_tray: Opening an Issue](#inbox_tray-opening-an-issue)
    - [:lock: Reporting Security Issues](#lock-reporting-security-issues)
    - [:beetle: Bug Reports and Other Issues](#beetle-bug-reports-and-other-issues)
  - [:love\_letter: Feature Requests](#love_letter-feature-requests)
  - [:mag: Triaging Issues](#mag-triaging-issues)
  - [:hammer\_and\_wrench: Project Setup](#hammer_and_wrench-project-setup)
  - [:repeat: Submitting Pull Requests](#repeat-submitting-pull-requests)
  - [:memo: Writing Commit Messages](#memo-writing-commit-messages)
  - [:white\_check\_mark: Code Review](#white_check_mark-code-review)
  - [:nail\_care: Coding Style](#nail_care-coding-style)

> **This guide sets clear expectations for everyone involved with ShikshaSathi so we can improve it together while creating a welcoming space for every contributor.** Following these guidelines helps ensure a positive experience for both contributors and maintainers.

## :book: Code of Conduct

By participating in this project, you agree to treat all contributors and maintainers with respect. Be kind, be constructive, and remember that everyone here shares the same goal: building better tools for teachers and students. Harassment, discrimination, or disrespectful behavior of any kind will not be tolerated.

## :bulb: Asking Questions

GitHub Issues are reserved for bug reports and feature requests — not general "how do I get this running" debugging. If you have a question about using ShikshaSathi, please open a [Discussion](../../discussions) (if enabled) or check the [README](README.md) first, especially the **Installation**, **Environment Variables**, and **AI Workflow** sections.

## :inbox_tray: Opening an Issue

Before creating an issue, make sure you're on the latest `main` branch and that `npm install` completed cleanly. A surprising number of issues (missing `GOOGLE_API_KEY`/`ELEVENLABS_API_KEY`, stale `node_modules`, wrong Node version) are resolved by re-checking the [Environment Variables](README.md#environment-variables) table in the README.

### :lock: Reporting Security Issues

**Do not** open a public issue for security vulnerabilities — especially anything related to leaked API keys, prompt injection into the teaching engine, or exposure of the `/api/public/health/diagnostics` endpoint. Instead, contact the maintainers privately (see repo owner's GitHub profile for contact details).

### :beetle: Bug Reports and Other Issues

A great way to contribute is to send a detailed issue when you hit a problem. Since you're most likely a developer, **provide the ticket you'd want to receive**.

- **Search existing issues first.** Don't open a duplicate — if your issue already exists, add a comment or a 👍 reaction instead.
- **Fully complete the issue template**, if one is provided.
- Be clear, concise, and descriptive. Include:
  - Steps to reproduce
  - Expected vs. actual behavior
  - Browser/OS and Node version
  - Whether it's reproducible with all three AI providers or only one tier of the fallback chain (Gemini → OpenRouter → Local template) — this matters a lot for this project
  - Console errors, stack traces, or relevant logs (use the `DevDebugPanel`, available via `?dev=1`, where helpful)
  - Screenshots or screen recordings, especially for UI/voice/animation bugs
- **Use [GitHub-flavored Markdown](https://help.github.com/en/github/writing-on-github/basic-writing-and-formatting-syntax)** — put code blocks, console output, and JSON payloads in backticks (\`\`\`).

## :love_letter: Feature Requests

Feature requests are welcome! We can't guarantee every request will be accepted — we want to avoid feature creep and keep ShikshaSathi focused on its core mission: giving teachers a zero-prep, voice-first co-teacher. Check the README's [Future Improvements](README.md#future-improvements) list first; your idea may already be planned.

- **Search first.** Don't open a duplicate feature request — comment on the existing one instead.
- **Be precise** about the proposed outcome and how it relates to existing features (e.g., the teaching engine, quiz system, voice narration, or smart board mode).
- Include implementation details if you have them — for example, whether the feature touches `prompts.ts`, `providers.ts`, `schema.ts`, or the UI layer.
- We cannot commit to a timeline, but you're welcome to submit a pull request!

## :mag: Triaging Issues

You can help by reproducing bug reports, asking for missing details (Node version, which AI provider tier failed, browser for Web Speech API issues), or confirming an issue still exists on `main`. This is hugely appreciated!

## :hammer_and_wrench: Project Setup

```bash
git clone https://github.com/<your-username>/ShikshaSathi.git
cd ShikshaSathi
npm install
```

Create a `.env` file at the project root (see [README § Environment Variables](README.md#environment-variables) for details):

```bash
GOOGLE_API_KEY=your_gemini_api_key_here
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
OPENROUTER_API_KEY=your_openrouter_api_key_here  # Optional
```

Common commands:

```bash
npm run dev      # start the dev server at http://localhost:3000
npm run lint     # run ESLint
npm run format   # run Prettier
npm run build    # production build (outputs to dist/client)
npm run preview  # preview the production build
```

If you don't have API keys handy, the app still runs end-to-end thanks to the local template fallback — this is a good way to work on UI, voice UX, or quiz flow without cloud dependencies.

## :repeat: Submitting Pull Requests

We **love** pull requests! For non-trivial changes, please open an issue first to discuss the approach — this saves everyone time.

*Note: All contributions will be licensed under the project's [MIT License](LICENSE).*

- **Smaller is better.** One pull request per bug fix or feature. Don't bundle unrelated refactors or reformatting into your change.
- **Coordinate bigger changes.** For anything touching the AI provider chain (`providers.ts`, `gateway.server.ts`), the Zod contracts (`schema.ts`), or the voice pipeline (`voice.functions.ts`, `voice-context.tsx`), open an issue first to discuss the strategy.
- **Prioritize understanding over cleverness.** This is a multi-provider, schema-validated AI pipeline feeding a real-time voice UI — clarity matters more than compactness. Comment non-obvious logic, especially around fallback ordering, error classification, and prompt constraints.
- **Follow existing conventions.** Match the existing TypeScript, React, and Tailwind patterns already in the codebase (see [Coding Style](#nail_care-coding-style) below).
- **Validate against the schema.** If you touch the AI response contract, make sure `teachingResponseSchema` (and any dependent schemas in `schema.ts`) still validate real provider output — for all three tiers where relevant.
- **Test the fallback chain.** Changes to prompts or providers should be checked against Gemini, OpenRouter, and the local template engine, since a change to one tier's expected output shape can break schema validation for all three.
- **Update the example project / demo,** if your change affects the classroom UI, quiz flow, or narration.
- **Add documentation.** Update the README (Features, Architecture, Folder Structure, or AI Workflow sections) if your change affects them.
- **Update the CHANGELOG**, if one exists, for enhancements and bug fixes, including the issue number and your GitHub username (example: "- Fixed narration fallback when ElevenLabs quota exceeded. #42 @yourhandle").
- **Branch from and target `main`.**
- **Resolve merge conflicts** before requesting review.
- **Promptly address CI/lint failures** — push a follow-up commit rather than force-pushing over review comments unless asked.
- Use properly constructed sentences with punctuation in comments.
- Use spaces, not tabs (Prettier/ESLint will enforce this).

## :memo: Writing Commit Messages

1. Separate subject from body with a blank line
2. Limit the subject line to 50 characters
3. Capitalize the subject line
4. Do not end the subject line with a period
5. Use the imperative mood (example: "Fix quiz timer reset bug")
6. Wrap the body at about 72 characters
7. Use the body to explain **why**, not what and how (the diff shows that)
8. Prefix the title with the relevant area when helpful (examples: "[Voice] Fix ElevenLabs fallback", "[Engine] Add OpenRouter timeout handling", "[UI] Fix smart board contrast")

```
[Area] Short summary of changes in 50 chars or less

Explain the problem this commit solves and why this approach was
taken. Mention any side effects — for example, if this changes the
shape of data returned by the teaching engine, note what downstream
components (lesson cards, quiz experience, narration) are affected.

Resolves: #123
See also: #456
```

## :white_check_mark: Code Review

- **Review the code, not the author.** Offer actionable, specific feedback and explain your reasoning.
- **You are not your code.** Don't take critique personally — everyone is here to make ShikshaSathi better for teachers and students.
- **Always do your best.** No one writes bugs on purpose. Learn from mistakes and move forward.
- Kindly flag any deviations from this guide.

## :nail_care: Coding Style

Consistency matters most. Follow the conventions already used in the file and project you're modifying:

- **TypeScript everywhere** — avoid `any`; prefer explicit types and Zod-inferred types from `schema.ts` for anything touching AI responses.
- **React 19 functional components** with hooks; follow existing patterns for context providers (see `teaching-engine-context.tsx`, `voice-context.tsx`, `mode-context.tsx`) rather than introducing new state-management approaches.
- **Tailwind CSS 4** utility classes for styling; use the existing `oklch`-based design tokens in `styles.css` rather than hardcoding new colors.
- **shadcn/ui + Radix primitives** for interactive components — check `components/ui-edu/` and existing shadcn components before building a new one from scratch.
- **Naming**: camelCase for variables/functions, PascalCase for components, and match existing file naming (`kebab-case.tsx` for most files, `PascalCase.tsx` for components — check the neighboring files).
- ESLint and Prettier are configured and will enforce most formatting automatically — run `npm run lint` and `npm run format` before committing.
- If in doubt, search the codebase for a similar existing pattern before inventing a new one.

**If ShikshaSathi helps your classroom, star the repo and share it with your school network.** 🎓
