# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

StateOfDev.ma is an annual survey website for software developers in Morocco, created by the GeeksBlaBla Morocco Community. Built with Astro (v4), React, and Firebase, it collects anonymous responses and displays interactive results using charts and visualizations.

## Rules

- In all interactions and commit messages, be extremely concise and sacrifice grammar for the sake of concision.

- At the end of each plan, give me a list of unresolved questions to answer, if any. Make the questions extremely concise. Sacrifice grammar for the sake of concision.

- DO NOT write tests unless explicitly requested

- DO NOT run dev server - assume already running

- Add code comments sparingly - focus on "why", not "what". Only add comments if the code is not self-explanatory.

- Your primary method for interacting with GitHub should be the GitHub CLI.

## Development Commands

### Essential Commands

- `pnpm dev` - Start development server at http://localhost:4321
- `pnpm build` - Type-check and build for production (runs `astro check && astro build`)
- `pnpm check` - Clean dist folder and run Astro type checking
- `pnpm preview` - Preview production build locally

### Testing

- `pnpm test` - Run tests with Vitest
- `pnpm test:ui` - Run tests with UI interface
- `pnpm test:ci` - Run tests with coverage reporting
- Test config is in `vitest.config.ts` with jsdom environment
- Setup file: `vitest-setup.js`

### Linting & Formatting

- `pnpm lint` - Format and fix all issues (Prettier + ESLint)
- `pnpm lint:ci` - Run ESLint checks without fixing (for CI)
- Husky pre-commit hooks configured with lint-staged

### Data Export

- `pnpm export-results` - Export survey results from Firestore (requires `.env.local`)
- `pnpm export-results:ci` - Export results in CI environment (uses env vars directly)

## Architecture

### Tech Stack

- **Framework**: Astro 4 with hybrid SSR/SSG (output: "hybrid", adapter: Netlify)
- **UI**: React 18 + Tailwind CSS + Radix UI components
- **Backend**: Firebase (Auth, Firestore) with Firebase Admin SDK
- **Forms**: React Hook Form
- **Testing**: Vitest + Testing Library
- **Build**: Vite with YAML plugin for survey questions

### Directory Structure

**`/survey/`** - YAML files defining survey questions organized by sections:

- Format: `{position}-{section-name}.yml`
- Structure: `{ title, label, position, questions: [{ label, required, multiple, choices }] }`
- Questions are referenced by ID format: `{section-label}-q-{index}` (e.g., `profile-q-0`)

**`/results/{year}/`** - Exported survey results and metadata:

- `results.json` - Raw response data (user answers indexed by question IDs)
- `questions.json` - Generated questions map with choices for data visualization
- Data licensed under ODC-ODbL License

**`/src/actions/`** - Astro server actions (API endpoints):

- `init-session.ts` - Initialize anonymous Firebase session with CAPTCHA validation
- `submit-answers.ts` - Validate session and save answers to Firestore
- `remove-session.ts` - Clean up session data
- `index.ts` - Exports all actions as `server` object

**`/src/lib/firebase/`** - Firebase integration:

- `server.ts` - Firebase Admin SDK initialization (supports both `import.meta.env` and `process.env`)
- `client.ts` - Client-side Firebase SDK initialization
- `database.ts` - Firestore operations (save/export results)

**`/src/components/survey/`** - Survey form components:

- `survey-form.tsx` - Main form orchestrator with progress tracking
- `section.tsx` - Section-level form with validation
- `question.tsx` - Individual question renderer (radio, checkbox, textarea for "other" options)
- Form state: answers stored as `{ "question-id": choiceIndex }` where `choiceIndex` is number (single) or array (multiple)

**`/src/components/chart/`** - Results visualization:

- `utils.ts` - Core data processing logic (`getQuestion()` function)
- `chart.tsx` - Main chart component wrapper
- `bar-chart.tsx` / `pie-chart.tsx` - Chart implementations
- Data flow: Load results.json + questions.json → `getQuestion(id)` → render charts

**`/src/pages/`** - Astro pages (hybrid rendering):

- `index.astro` - Redirects to `/home`
- `home.astro` - Landing page
- `before-start.astro` - Pre-survey CAPTCHA and session initialization
- `survey.astro` - Survey form (protected by session check)
- `thanks.astro` - Post-survey thank you page with social sharing
- `{year}.astro` - Results pages for each survey year
- `playground.astro` - Interactive data exploration with filters
- `/api/` - API endpoints

**`/scripts/`** - Utility scripts:

- `export-results.ts` - Fetch all Firestore responses and generate results.json
- `generate-questions.ts` - Parse YAML files and create questions.json

### Survey Flow

1. **Session Initialization** (`/before-start`):

   - User views survey info and completes CAPTCHA (Cloudflare Turnstile)
   - Anonymous Firebase auth session created
   - `initSession` action validates CAPTCHA + session, sets cookie
   - Redirect to `/survey`

2. **Survey Submission** (`/survey`):

   - Session validation on page load
   - Questions loaded from YAML files, organized by sections
   - Answers collected as: `{ "question-id": choiceIndex, "question-id-others": "text" }`
   - Each section submitted via `submitAnswers` action
   - Server validates session, saves to Firestore with userId as document ID (prevents duplicates)

3. **Data Export** (GitHub Actions daily at 12:00 AM UTC):

   - `export-results` script fetches all Firestore documents
   - Generates `results.json` with all responses
   - `generate-questions` creates `questions.json` from YAML files
   - Committed to `/results/{year}/` directory

4. **Results Display** (`/{year}` pages):
   - `getQuestion({ id, condition?, groupBy?, year })` filters and aggregates data
   - Charts render using processed data with percentages
   - Playground allows filtering by demographics (e.g., by age, location)

### Environment Configuration

Required `.env.local` variables:

```env
# Client-side Firebase (PUBLIC_ prefix required for Astro)
PUBLIC_FIREBASE_API_KEY=
PUBLIC_FIREBASE_AUTH_DOMAIN=
PUBLIC_FIREBASE_STORAGE_BUCKET=
PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
PUBLIC_FIREBASE_APP_ID=

# Server-side Firebase Admin SDK
FIREBASE_PRIVATE_KEY_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_CLIENT_ID=
FIREBASE_AUTH_URI=
FIREBASE_TOKEN_URI=
FIREBASE_AUTH_CERT_URL=
FIREBASE_CLIENT_CERT_URL=

# CAPTCHA (optional, set CAPTCHA_ENABLED=false in dev)
CAPTCHA_ENABLED=false
CAPTCHA_SITE_KEY=
CAPTCHA_SECRET_KEY=
```

## Important Patterns

### Answer Data Structure

- Single choice: `{ "profile-q-0": 1 }` (choice index as number)
- Multiple choice: `{ "profile-q-2": [3, 2] }` (array of choice indices)
- With "other" text: `{ "profile-q-3": 6, "profile-q-3-others": "custom text" }`
- Skipped: `{ "profile-q-4": null }`

### Firebase Admin SDK Environment Handling

The `server.ts` file supports both `import.meta.env` (Vite) and `process.env` (Node scripts) because:

- Astro server uses Vite's `import.meta.env`
- Export scripts run with `tsx` and use `process.env`

### Results Data Processing

Use `getQuestion()` from `src/components/chart/utils.ts`:

- Filters results by conditions (demographic filters)
- Calculates choice counts and percentages
- Supports grouping (cross-tabulation)
- Handles missing/skipped answers gracefully

## Theme System

The project uses a CSS variable-based theme system supporting light/dark modes with full Tailwind integration.

### Theme Architecture

**CSS Variables** (`src/globals.css`):

- Light and dark theme color definitions in `:root` and `.dark` selectors
- Semantic color variables: `--primary`, `--secondary`, `--background`, `--foreground`, `--muted`, `--accent`, `--destructive`, `--border`, `--input`, `--ring`
- Extended chart palette: `--chart-1` through `--chart-10` for data visualization
- Utility variables: `--border-width`, `--focus-ring-width`, `--radius`, `--spacing`
- Font variables: `--font-sans`, `--font-serif`, `--font-mono`

**Tailwind Configuration** (`tailwind.config.mjs`):

- `darkMode: ["class"]` - Enables class-based dark mode
- All theme colors mapped to CSS variables (e.g., `bg-primary` → `var(--primary)`)
- Chart colors accessible via `bg-chart-1` through `bg-chart-10`
- Border radius, widths, and ring styles use CSS variables
- Font families reference CSS variable values

### Theme Toggle

**Component** (`src/components/theme-toggle.tsx`):

- React component with localStorage persistence
- Respects system preference as default
- Sun/moon icons for visual feedback
- Mounted check to prevent hydration mismatch

**Implementation**:

```tsx
import { ThemeToggle } from "./theme-toggle";
// In Astro component:
<ThemeToggle client:load />;
```

**Theme Script** (`src/components/layout.astro`):

- Inline script runs before page render to prevent FOUC
- Checks localStorage first, falls back to system preference
- Listens for system theme changes
- Automatically applies `.dark` class to `<html>`

### Usage Guidelines

**Always use semantic theme colors instead of hardcoded values:**

- ✅ `bg-primary text-primary-foreground` (adapts to theme)
- ❌ `bg-emerald-600 text-white` (hardcoded, breaks theme)

**Common Patterns:**

- Primary actions: `bg-primary text-primary-foreground hover:opacity-90`
- Secondary actions: `bg-secondary text-secondary-foreground`
- Destructive actions: `bg-destructive text-destructive-foreground`
- Muted text: `text-muted-foreground`
- Borders: `border` (uses `--border` variable)
- Input fields: `border-input focus:ring-ring`
- Cards: `bg-card text-card-foreground`

**Charts:**

- Use `bg-chart-{1-10}` for bar charts
- Use `var(--chart-{1-10})` for SVG fill colors
- Colors automatically adapt to light/dark theme

**Example Component:**

```tsx
<button className="bg-primary text-primary-foreground px-4 py-2 border hover:opacity-90">
  Submit
</button>
```

### Files Updated for Theme

**Core:**

- `src/globals.css` - CSS variables and theme definitions
- `tailwind.config.mjs` - Tailwind theme configuration
- `src/components/layout.astro` - Theme script
- `src/components/theme-toggle.tsx` - Toggle component

**Components:**

- Chart components: `bar-chart.tsx`, `pie-chart.tsx`, `chart.tsx`, `share-buttons.tsx`, `chart-actions.tsx`
- Survey components: `survey-form.tsx`, `section.tsx`, `question.tsx`, `steps.tsx`
- Navigation: `header.astro`, `header-link.astro`, `footer.astro`

**Remaining Components:**
Other components (home, playground, report pages) may still use hardcoded colors and should be migrated to theme variables following the patterns above.

## Testing Notes

- Component tests use `@testing-library/react` with jsdom
- Example test files: `chart.test.ts`, `survey-form.test.tsx`
- Run single test: `pnpm test {filename}`
- Coverage reports in `coverage/` directory
