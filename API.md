# API Integration Guide

> Contributor-focused documentation for the AI APIs used by ShikshaSathi. This guide is intentionally limited to **ElevenLabs** and **OpenRouter**; Gemini is referenced only where it is necessary to explain the fallback chain.


## Scope

This document covers the external AI APIs currently used by ShikshaSathi:

- **ElevenLabs** — AI narration / text-to-speech.
- **OpenRouter** — fallback text-generation provider when the primary Gemini provider is unavailable.

The examples and troubleshooting guidance below match the current implementation in this repository.

---

## 1. Prerequisites

Before running the application locally, make sure you have:

- Node.js and the project's dependencies installed.
- An ElevenLabs API key if you want AI narration.
- An OpenRouter API key if you want the cloud text-generation fallback.

Keep both keys on the **server side**. Do not expose them in React/client-side code.

Typical environment variables:

```env
ELEVENLABS_API_KEY=your_elevenlabs_api_key
OPENROUTER_API_KEY=your_openrouter_api_key
```

The exact environment/secrets mechanism depends on the local/deployment environment, but the application reads these values from `process.env`.

---


## 1.1 Local setup

1. Create or update your local environment file with the provider keys you need.
2. Keep the keys server-side; never hard-code them in React/client code.
3. Restart the development server after changing `.env`, because the server reads environment variables at process startup.
4. Use the diagnostics endpoint for OpenRouter/provider checks:
   ```bash
   curl http://localhost:3000/api/public/health/diagnostics
   ```
5. For ElevenLabs, trigger a real narration from the classroom UI and confirm the response has `fallback: false`.

### Minimum contributor setup

```env
ELEVENLABS_API_KEY=your_elevenlabs_api_key
OPENROUTER_API_KEY=your_openrouter_api_key
```

You do **not** need both providers for every contribution. ElevenLabs is only needed when working on AI narration, while OpenRouter is needed when testing the cloud text-generation fallback.

## 2. ElevenLabs API

ShikshaSathi uses ElevenLabs for AI-generated narration.

## 2.1 Where ElevenLabs is used

The implementation is in:

```text
src/lib/ai/voice.functions.ts
```

The exported server function is:

```ts
synthesizeSpeech(...)
```

It accepts:

```ts
{
  text: string;
  voiceId?: string;
  speed?: number;
  style?: "teacher" | "friendly" | "energetic" | number;
  language?: "English" | "Hindi" | "Hinglish";
}
```

The function runs server-side and reads:

```ts
process.env.ELEVENLABS_API_KEY
```

## 2.2 Request flow

The application sends a POST request to the ElevenLabs text-to-speech endpoint:

```text
https://api.elevenlabs.io/v1/text-to-speech/{voiceId}?output_format=mp3_44100_128
```

The request includes:

```http
xi-api-key: <ELEVENLABS_API_KEY>
Content-Type: application/json
```

The generated audio is returned as base64-encoded MP3 data to the application.

Conceptually:

```text
Lesson text
    ↓
synthesizeSpeech()
    ↓
ElevenLabs TTS
    ↓
MP3 audio
    ↓
Base64 response
    ↓
Browser playback
```

## 2.3 Models

The application chooses the model based on the selected language:

| Language | Model |
|---|---|
| English | `eleven_turbo_v2_5` |
| Hindi | `eleven_multilingual_v2` |
| Hinglish | `eleven_multilingual_v2` |

Hindi and Hinglish use the multilingual model because the implementation is specifically tuned for non-English narration.

## 2.4 Voice and style settings

The default voice is:

```ts
EXAVITQu4vr4xnSDxMaL
```

The application also supports three style presets:

```text
teacher
friendly
energetic
```

Each style changes ElevenLabs voice parameters such as:

- `stability`
- `similarity_boost`
- `style`
- `use_speaker_boost`
- `speed`

Speed is clamped between:

```text
0.7x and 1.2x
```

This prevents invalid/extreme values from being sent to the API.

## 2.5 Text length

Before sending text to ElevenLabs, the implementation limits it to:

```text
2400 characters
```

Empty input returns an `EMPTY` fallback error instead of making an API request.

## 2.6 ElevenLabs fallback behavior

The application intentionally does **not throw** when ElevenLabs fails.

If the API key is missing:

```text
error: NO_KEY
fallback: true
```

If the request fails because of quota/auth/rate-limit conditions:

```text
error: QUOTA_EXCEEDED
fallback: true
```

For other HTTP failures, the error looks like:

```text
TTS_<HTTP_STATUS>
```

The client can then fall back to browser `SpeechSynthesis`.

This means ElevenLabs is an enhancement for narration, not a hard dependency for using the application.

---

## 3. OpenRouter API

OpenRouter is used as the **fallback text-generation provider**.

The provider implementation is in:

```text
src/lib/ai/providers.ts
```

The application does not use OpenRouter as the primary provider. The current fallback order is:

```text
1. Gemini
   ↓ if unavailable/fails
2. OpenRouter
   ↓ if unavailable/fails
3. Local fallback
```

## 3.1 OpenRouter environment variable

The provider reads:

```ts
process.env.OPENROUTER_API_KEY
```

If this variable is missing, OpenRouter is skipped and the application continues to the local fallback.

## 3.2 Endpoint

The implementation sends requests to:

```text
https://openrouter.ai/api/v1/chat/completions
```

Request headers include:

```http
Authorization: Bearer <OPENROUTER_API_KEY>
Content-Type: application/json
HTTP-Referer: https://shikshasathi.lovable.app
X-Title: ShikshaSathi
```

## 3.3 Models

The current implementation tries these free models:

```ts
const OPENROUTER_MODELS = [
  "google/gemma-3-4b-it:free",
  "mistralai/mistral-small-3.1-24b-instruct:free",
];
```

The models are attempted sequentially.

If the first model fails, the application tries the second model.

If both fail, control returns to the provider fallback chain.

## 3.4 Request format

OpenRouter receives a chat-completions request similar to:

```json
{
  "model": "google/gemma-3-4b-it:free",
  "messages": [
    {
      "role": "system",
      "content": "You output only valid JSON. No prose, no markdown."
    },
    {
      "role": "user",
      "content": "<generated teaching or quiz prompt>"
    }
  ],
  "response_format": {
    "type": "json_object"
  },
  "temperature": 0.6
}
```

The returned content is extracted from:

```ts
data?.choices?.[0]?.message?.content
```

It is then parsed and validated against the application's teaching response schema.

---

## 4. Provider fallback chain

The fallback chain is implemented in:

```text
src/lib/ai/providers.ts
```

The main function is:

```ts
generateLessonJSON(...)
```

The current order is:

```text
                ┌─────────────┐
                │   Gemini    │
                └──────┬──────┘
                       │ failure
                       ▼
                ┌─────────────┐
                │ OpenRouter  │
                └──────┬──────┘
                       │ failure
                       ▼
                ┌─────────────┐
                │    Local    │
                │  Fallback   │
                └─────────────┘
```

### Gemini succeeds

The result is returned immediately:

```ts
{
  provider: "gemini"
}
```

### Gemini fails and OpenRouter succeeds

The result contains:

```ts
{
  provider: "openrouter",
  fallbackReason: "gemini-failed"
}
```

### Both cloud providers fail

The local fallback is used:

```ts
{
  provider: "local"
}
```

The `attempts` array records whether each provider succeeded, the error, and latency.

This is useful when debugging provider failures locally.

---

## 5. Error handling

The relevant gateway/error-handling code is:

```text
src/lib/ai/gateway.server.ts
```

This file currently contains the Google/Gemini provider setup and Gemini error classification.

It defines typed error codes including:

```text
MISSING_API_KEY
QUOTA_EXCEEDED
RATE_LIMITED
INVALID_API_KEY
INVALID_RESPONSE
NETWORK
UNKNOWN
```

For example, a missing Google API key becomes:

```text
MISSING_API_KEY
```

A rate-limit response becomes:

```text
RATE_LIMITED
```

A network failure becomes:

```text
NETWORK
```

### Important distinction

OpenRouter-specific failures are currently handled directly in:

```text
src/lib/ai/providers.ts
```

ElevenLabs-specific failures are currently handled directly in:

```text
src/lib/ai/voice.functions.ts
```

`gateway.server.ts` is primarily responsible for the Gemini gateway and its typed error classification.

---


### Recommended debugging flow

When an AI feature fails locally, debug from the application outward:

```text
1. Check .env / process.env
        ↓
2. Confirm the relevant server function is called
        ↓
3. Inspect the provider HTTP request/response
        ↓
4. Inspect provider-specific fallback/error values
        ↓
5. Inspect the `attempts` array for text generation
        ↓
6. Confirm the next fallback is reached
```

For text generation, start in `src/lib/ai/providers.ts`.
For narration, start in `src/lib/ai/voice.functions.ts`.
For Gemini's typed gateway errors, inspect `src/lib/ai/gateway.server.ts`.

## 6. Debugging and troubleshooting

## 6.1 `ELEVENLABS_API_KEY` missing

### Symptom

Narration does not use ElevenLabs.

### Check

Make sure the server environment contains:

```env
ELEVENLABS_API_KEY=...
```

Restart the development server after changing environment variables.

### Expected behavior

This is not treated as a fatal application error. `synthesizeSpeech()` returns:

```text
NO_KEY
```

and the client can use browser SpeechSynthesis instead.

---

## 6.2 ElevenLabs returns 401 / 402 / 429

### Possible causes

- Invalid API key.
- Account/authentication problem.
- Insufficient quota.
- Rate limit.

The implementation maps these cases to:

```text
QUOTA_EXCEEDED
```

and enables the narration fallback.

### What to check

1. Confirm the API key is correct.
2. Confirm the key is available to the server process.
3. Check the ElevenLabs account/quota.
4. Restart the local server after changing the key.

---

## 6.3 ElevenLabs returns `TTS_4xx` or `TTS_5xx`

The implementation returns the HTTP status as:

```text
TTS_<status>
```

For example:

```text
TTS_400
TTS_500
```

Check the request input first:

- Is `text` non-empty?
- Is the selected `voiceId` valid?
- Is the selected language supported by the selected model?
- Is the API key valid?

The implementation also truncates text to 2400 characters.

---

## 6.4 OpenRouter API key missing

### Symptom

OpenRouter is skipped.

### Check

```env
OPENROUTER_API_KEY=...
```

The provider explicitly throws:

```text
OPENROUTER_API_KEY missing
```

If the key is unavailable, the application continues to the local provider.

---

## 6.5 OpenRouter returns an HTTP error

The provider converts the response into an error containing the HTTP status and a short portion of the response body:

```text
OpenRouter <status>: <response>
```

Common causes include:

- `401` — invalid/missing authentication.
- `402` — account/credit restriction.
- `403` — access/permission restriction.
- `429` — rate limit.
- `5xx` — provider/model/server-side problem.

### What to check

1. Confirm `OPENROUTER_API_KEY`.
2. Check whether the selected free model is currently available.
3. Check OpenRouter rate limits/status.
4. Try the second configured model.
5. Check the provider attempt logs.

---

## 6.6 OpenRouter returns invalid JSON

ShikshaSathi expects structured JSON.

The system:

1. Removes optional Markdown code fences.
2. Parses the response as JSON.
3. Adds the request intent.
4. Validates the result against `teachingResponseSchema`.

If parsing or validation fails, that model attempt is treated as failed and the next configured provider/model can be attempted.

When debugging, inspect the OpenRouter response and verify that the model is following:

```text
You output only valid JSON. No prose, no markdown.
```

---

## 6.7 OpenRouter times out

OpenRouter requests have a timeout of:

```text
12 seconds
```

If the request exceeds this duration, the model attempt fails.

The provider then tries the next OpenRouter model or proceeds to the local fallback.

---

## 6.8 Gemini fails but OpenRouter works

This is an expected fallback scenario.

Check the provider result:

```ts
provider: "openrouter"
fallbackReason: "gemini-failed"
```

Then inspect the `attempts` array for the Gemini error.

For Gemini-specific error classification, see:

```text
src/lib/ai/gateway.server.ts
```

---

## 7. Local debugging checklist

When an AI request is not working, check the providers in this order.

### ElevenLabs narration

```text
[ ] ELEVENLABS_API_KEY exists
[ ] Server was restarted after changing .env
[ ] Input text is not empty
[ ] Input text is within the 2400-character limit
[ ] voiceId is valid
[ ] ElevenLabs request is reaching the API
[ ] Browser SpeechSynthesis fallback works
```

### OpenRouter

```text
[ ] OPENROUTER_API_KEY exists
[ ] Server was restarted after changing .env
[ ] OpenRouter request reaches /api/v1/chat/completions
[ ] Selected model is available
[ ] Response contains choices[0].message.content
[ ] Returned content is valid JSON
[ ] teachingResponseSchema validation succeeds
```

### Fallback chain

```text
[ ] Check generateLessonJSON()
[ ] Inspect the attempts array
[ ] Check Gemini error classification
[ ] Check OpenRouter error message
[ ] Confirm local fallback is reached when both cloud providers fail
```

---

## 8. Relevant source files

| File | Responsibility |
|---|---|
| `src/lib/ai/voice.functions.ts` | ElevenLabs text-to-speech, voice settings, language/model selection, and narration fallback |
| `src/lib/ai/providers.ts` | Gemini → OpenRouter → local provider fallback chain and OpenRouter requests |
| `src/lib/ai/gateway.server.ts` | Gemini provider configuration and typed Gemini error classification |

These are the first files contributors should inspect when adding, modifying, or debugging AI API behavior. In particular, use `voice.functions.ts` for ElevenLabs request/fallback behavior, `providers.ts` for the Gemini → OpenRouter → local fallback chain, and `gateway.server.ts` for Gemini gateway/error classification.

---

## 9. Security notes

Never commit API keys to Git.

Do not put:

```env
ELEVENLABS_API_KEY=...
OPENROUTER_API_KEY=...
```

inside source-controlled files.

Do not expose either key through client-side React code.

Both APIs are called from server-side code:

```text
src/lib/ai/voice.functions.ts
src/lib/ai/providers.ts
```

If a key is accidentally committed, revoke/rotate it immediately.

---


## 9.1 Contributor workflow

Before opening a PR that changes an API integration:

- Verify the relevant environment variable is available locally.
- Test the success path.
- Test the missing-key path.
- Test the provider failure path and confirm the documented fallback occurs.
- Check the server logs / `attempts` data for useful error information.
- Avoid logging full API keys or sensitive request data.
- Update this document if you change provider order, model IDs, endpoints, response shapes, or error behavior.

## 10. Quick reference

| API | Purpose | Environment variable | Source |
|---|---|---|---|
| ElevenLabs | AI narration / TTS | `ELEVENLABS_API_KEY` | `src/lib/ai/voice.functions.ts` |
| OpenRouter | Text-generation fallback | `OPENROUTER_API_KEY` | `src/lib/ai/providers.ts` |
| Gateway error handling | Gemini provider/error classification | `GOOGLE_API_KEY` | `src/lib/ai/gateway.server.ts` |

The important architecture to remember is:

```text
Voice:
Text → ElevenLabs → MP3 → Browser
              ↓
       Browser TTS fallback

Text generation:
Gemini → OpenRouter → Local fallback
           ↓
       JSON validation
```

This keeps external AI services optional where possible while allowing contributors to run and debug the project locally.
