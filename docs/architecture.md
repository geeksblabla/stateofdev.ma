# Architecture

Detailed codebase structure and file organization for StateOfDev.ma.

## Directory Structure

### `/survey/`
YAML files defining survey questions organized by sections.

- Format: `{position}-{section-name}.yml`
- Structure: `{ title, label, position, questions: [{ label, required, multiple, choices }] }`
- Questions referenced by ID: `{section-label}-q-{index}` (e.g., `profile-q-0`)

### `/results/{year}/`
Exported survey results and metadata.

- `results.json` - Raw response data (user answers indexed by question IDs)
- `questions.json` - Generated questions map with choices for visualization
- Licensed under ODC-ODbL License

### `/src/actions/`
Astro server actions (API endpoints).

- `init-session.ts` - Initialize anonymous Firebase session with CAPTCHA validation
- `submit-answers.ts` - Validate session and save answers to Firestore
- `remove-session.ts` - Clean up session data
- `index.ts` - Exports all actions as `server` object

### `/src/lib/firebase/`
Firebase integration.

- `server.ts` - Firebase Admin SDK initialization (supports both `import.meta.env` and `process.env`)
- `client.ts` - Client-side Firebase SDK initialization
- `database.ts` - Firestore operations (save/export results)

### `/src/components/survey/`
Survey form components.

- `survey-form.tsx` - Main form orchestrator with progress tracking
- `section.tsx` - Section-level form with validation
- `question.tsx` - Individual question renderer (radio, checkbox, textarea for "other" options)
- Form state: answers stored as `{ "question-id": choiceIndex }` where `choiceIndex` is number (single) or array (multiple)

### `/src/components/chart/`
Results visualization.

- `utils.ts` - Core data processing logic (`getQuestion()` function)
- `chart.tsx` - Main chart component wrapper
- `bar-chart.tsx` / `pie-chart.tsx` - Chart implementations
- Data flow: Load results.json + questions.json → `getQuestion(id)` → render charts

### `/src/pages/`
Astro pages (hybrid rendering).

- `index.astro` - Redirects to `/home`
- `home.astro` - Landing page
- `before-start.astro` - Pre-survey CAPTCHA and session initialization
- `survey.astro` - Survey form (protected by session check)
- `thanks.astro` - Post-survey thank you page with social sharing
- `{year}.astro` - Results pages for each survey year
- `playground.astro` - Interactive data exploration with filters
- `/api/` - API endpoints

### `/scripts/`
Utility scripts.

- `export-results.ts` - Fetch all Firestore responses and generate results.json
- `generate-questions.ts` - Parse YAML files and create questions.json
