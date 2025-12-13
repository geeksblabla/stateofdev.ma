## Project Overview

StateOfDev.ma is an annual survey website for developers in Morocco by GeeksBlaBla Community. Built with Astro 4, React, and Firebase. Collects anonymous survey responses and displays interactive results with charts.

## Rules

- Extremely concise in all interactions and commit messages. Sacrifice grammar for concision.
- At end of each plan, list unresolved questions (extremely concise).
- DO NOT write tests unless explicitly requested
- DO NOT run dev server - assume already running
- Add code comments sparingly - focus on "why", not "what"
- Use GitHub CLI for all GitHub interactions

## Tech Stack

- **Framework**: Astro 4 (hybrid SSR/SSG, Netlify adapter)
- **UI**: React 18 + Tailwind CSS + Radix UI
- **Backend**: Firebase (Auth, Firestore) + Firebase Admin SDK
- **Forms**: React Hook Form
- **Testing**: Vitest + Testing Library
- **Build**: Vite + YAML plugin for survey questions

## Development Commands

### Essential

- `pnpm dev` - Start dev server (http://localhost:4321)
- `pnpm build` - Type-check and build for production
- `pnpm check` - Clean dist folder and run Astro type checking
- `pnpm preview` - Preview production build

### Testing

- `pnpm test` - Run tests with Vitest
- `pnpm test:ui` - Tests with UI interface
- `pnpm test:ci` - Tests with coverage
- Config: `vitest.config.ts`, setup: `vitest-setup.js`

### Linting

- `pnpm lint` - Format and fix (Prettier + ESLint)
- `pnpm lint:ci` - Check only (for CI)
- Husky pre-commit hooks configured

### Data Export

- `pnpm export-results` - Export survey results from Firestore (requires `.env.local`)
- `pnpm export-results:ci` - Export in CI (uses env vars)

## Key Directories

- `/survey/` - YAML question definitions (format: `{position}-{section-name}.yml`)
- `/results/{year}/` - Exported results + metadata (results.json, questions.json)
- `/src/actions/` - Astro server actions (init-session, submit-answers, remove-session)
- `/src/lib/firebase/` - Firebase client/server/database operations
- `/src/components/survey/` - Survey form components
- `/src/components/chart/` - Results visualization
- `/src/pages/` - Astro pages (hybrid rendering)
- `/scripts/` - Utility scripts (export-results, generate-questions)

## Progressive Disclosure

For detailed guidance on specific tasks, see:

- **docs/architecture.md** - Directory structure, file purposes, code organization
- **docs/survey-system.md** - Survey flow, answer structures, session management
- **docs/theme-system.md** - CSS variables, theme toggle, styling

Read relevant docs when working on related features.
