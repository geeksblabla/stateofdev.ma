# Theme System

CSS variable-based theme system supporting light/dark modes with full Tailwind integration.

## Theme Architecture

### CSS Variables (`src/globals.css`)

- Light and dark theme color definitions in `:root` and `.dark` selectors
- Semantic color variables: `--primary`, `--secondary`, `--background`, `--foreground`, `--muted`, `--accent`, `--destructive`, `--border`, `--input`, `--ring`
- Extended chart palette: `--chart-1` through `--chart-10` for data visualization
- Utility variables: `--border-width`, `--focus-ring-width`, `--radius`, `--spacing`
- Font variables: `--font-sans`, `--font-serif`, `--font-mono`

### Tailwind Configuration (`tailwind.config.mjs`)

- `darkMode: ["class"]` - Enables class-based dark mode
- All theme colors mapped to CSS variables (e.g., `bg-primary` → `var(--primary)`)
- Chart colors accessible via `bg-chart-1` through `bg-chart-10`
- Border radius, widths, and ring styles use CSS variables
- Font families reference CSS variable values

### Theme Script (`src/components/layout.astro`)

- Inline script runs before page render to prevent FOUC
- Checks localStorage first, falls back to system preference
- Listens for system theme changes
- Automatically applies `.dark` class to `<html>`

## Usage Guidelines

### Always use semantic theme colors instead of hardcoded values

- ✅ `bg-primary text-primary-foreground` (adapts to theme)
- ❌ `bg-emerald-600 text-white` (hardcoded, breaks theme)

### Common Patterns

- **Primary actions**: `bg-primary text-primary-foreground hover:opacity-90`
- **Secondary actions**: `bg-secondary text-secondary-foreground`
- **Destructive actions**: `bg-destructive text-destructive-foreground`
- **Muted text**: `text-muted-foreground`
- **Borders**: `border` (uses `--border` variable)
- **Input fields**: `border-input focus:ring-ring`
- **Cards**: `bg-card text-card-foreground`

### Charts

- Use `bg-chart-{1-10}` for bar charts
- Use `var(--chart-{1-10})` for SVG fill colors
- Colors automatically adapt to light/dark theme

### Example Component

```tsx
<button className="bg-primary text-primary-foreground px-4 py-2 border hover:opacity-90">
  Submit
</button>;
```

## Files Updated for Theme

### Core

- `src/globals.css` - CSS variables and theme definitions
- `tailwind.config.mjs` - Tailwind theme configuration
- `src/components/layout.astro` - Theme script
- `src/components/theme-toggle.tsx` - Toggle component

### Components

- Chart components: `bar-chart.tsx`, `pie-chart.tsx`, `chart.tsx`, `share-buttons.tsx`, `chart-actions.tsx`
- Survey components: `survey-form.tsx`, `section.tsx`, `question.tsx`, `steps.tsx`
- Navigation: `header.astro`, `header-link.astro`, `footer.astro`
