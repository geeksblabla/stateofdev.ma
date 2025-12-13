# Survey System

End-to-end survey flow, session management, and answer data structures.

## Survey Flow

### 1. Session Initialization (`/before-start`)

- User views survey info and completes CAPTCHA (Cloudflare Turnstile)
- Anonymous Firebase auth session created
- `initSession` action validates CAPTCHA + session, sets cookie
- Redirect to `/survey`

### 2. Survey Submission (`/survey`)

- Session validation on page load
- Questions loaded from YAML files, organized by sections
- Answers collected as: `{ "question-id": choiceIndex, "question-id-others": "text" }`
- Each section submitted via `submitAnswers` action
- Server validates session, saves to Firestore with userId as document ID (prevents duplicates)

### 3. Data Export (GitHub Actions daily at 12:00 AM UTC)

- `export-results` script fetches all Firestore documents
- Generates `results.json` with all responses
- `generate-questions` creates `questions.json` from YAML files
- Committed to `/results/{year}/` directory

### 4. Results Display (`/{year}` pages)

- `getQuestion({ id, condition?, groupBy?, year })` filters and aggregates data
- Charts render using processed data with percentages
- Playground allows filtering by demographics (e.g., by age, location)

## Answer Data Structure

How answers are stored and represented:

- **Single choice**: `{ "profile-q-0": 1 }` (choice index as number)
- **Multiple choice**: `{ "profile-q-2": [3, 2] }` (array of choice indices)
- **With "other" text**: `{ "profile-q-3": 6, "profile-q-3-others": "custom text" }`
- **Skipped**: `{ "profile-q-4": null }`
