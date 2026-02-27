# Multi-Language Survey Support Design

**Date:** 2025-12-15
**Status:** Approved
**Scope:** Survey flow only (language selection, before-start, survey pages)

## Overview

Add Arabic and English language support to the StateOfDev.ma survey. Users select language first, then complete survey in chosen language. Focus on survey experience only (not results pages).

## Design Decisions

### Language Selection Flow

```
/select-language → /before-start?lang=X → /survey?lang=X
```

- **New entry point:** `/select-language` - minimal page with two language cards (English/Arabic)
- **URL-based persistence:** Language choice stored in `?lang=en` or `?lang=ar` parameter
- **Default language:** English when no `lang` parameter present
- **Invalid values:** Any `?lang=X` where X is not 'ar' defaults to English

### Translation Architecture

#### 1. YAML Question Structure (Flexible Format)

Labels and choices can be either:
- **String** (defaults to English, backward compatible)
- **Object** with `{ en: string, ar?: string }`

**Example:**
```yaml
title: Profile
label: profile
position: 1
questions:
  # Simple string (English only)
  - label: What is your gender?
    required: true
    choices:
      - Male
      - Female

  # Bilingual object
  - label:
      en: What is your age?
      ar: ما هو عمرك؟
    required: true
    choices:
      - en: Younger than 18 years
        ar: أقل من 18 سنة
      - en: 18 to 24 years
        ar: من 18 إلى 24 سنة

  # Mixed: English label, bilingual choices
  - label: Where are you currently located?
    choices:
      - en: Rabat-Salé-Kénitra
        ar: الرباط-سلا-القنيطرة
      - Casablanca-Settat  # String fallback
```

**Benefits:**
- Backward compatible with existing YAML files
- Gradual translation (add Arabic as needed)
- Each field (label, choices) translates independently

#### 2. UI Text Translation (Centralized Constants)

**File:** `src/constants/translations.ts`

```ts
export const translations = {
  beforeStart: {
    title: { en: "Before You Start", ar: "قبل أن تبدأ" },
    subtitle: { en: "Here's what you need to know:", ar: "إليك ما تحتاج معرفته:" },
    startButton: { en: "Start", ar: "ابدأ" },
    initializingSession: { en: "Initializing Session...", ar: "جارٍ تهيئة الجلسة..." },
  },
  survey: {
    next: { en: "Next", ar: "التالي" },
    previous: { en: "Previous", ar: "السابق" },
    submit: { en: "Submit", ar: "إرسال" },
    skip: { en: "Skip", ar: "تخطي" },
  },
  errors: {
    sessionFailed: {
      en: "Session initialization failed. Please try again...",
      ar: "فشل تهيئة الجلسة. يرجى المحاولة مرة أخرى..."
    },
  }
} as const;

export type Lang = 'en' | 'ar';
export type TranslationValue = { en: string; ar: string } | string;

// Translation helper with fallback
export function t(value: TranslationValue, lang: Lang): string {
  if (typeof value === 'string') return value; // English fallback
  return value[lang] || value.en; // Fallback to English if Arabic missing
}
```

**Translation Scope:**
- All button text (Start, Next, Submit, Skip)
- All rules/instructions on before-start page
- All error messages
- All validation text
- Section titles

#### 3. Language Detection Helper

```ts
// src/lib/utils/language.ts
export function getCurrentLang(url: URL): Lang {
  const lang = url.searchParams.get('lang');
  return lang === 'ar' ? 'ar' : 'en'; // Default to 'en'
}
```

### RTL (Right-to-Left) Support

**Scope:** Full RTL for main content when Arabic selected, header/footer stay LTR

**Implementation:**

1. **Main content container:**
   ```astro
   <main dir={lang === 'ar' ? 'rtl' : 'ltr'}>
     <!-- Survey content -->
   </main>
   ```

2. **CSS approach:**
   - Use Tailwind logical properties (start/end instead of left/right)
   - Add `tailwindcss-rtl` plugin
   - Most components auto-adapt with `dir` attribute

3. **Examples:**
   ```jsx
   // Tailwind classes
   <div class="ms-4 me-2">  // margin-start, margin-end
   <div class="ps-6 pe-4">  // padding-start, padding-end
   <p class="text-start">   // Left in LTR, right in RTL
   ```

4. **Forms:**
   - Radio buttons, checkboxes flip automatically
   - Text inputs align based on `dir`
   - Keep existing classes, most adapt automatically

### Component Changes

#### New Components

**1. Language Selection Page** (`src/pages/select-language.astro`)
- Two cards: English (🇬🇧) and Arabic (🇲🇦)
- Links to `/before-start?lang=en` or `/before-start?lang=ar`
- Minimal design, no extra text
- Prerendered static page

#### Modified Components

**2. BaseLayout** (`src/components/layout.astro`)
- Accept optional `lang` prop
- Pass to main: `<main dir={lang === 'ar' ? 'rtl' : 'ltr'}>`
- Header/footer stay LTR (no dir override needed)

**3. Before-Start Page** (`src/pages/before-start.astro`)
- Extract lang from URL: `const lang = getCurrentLang(Astro.url)`
- Translate rules array using `t()` helper
- Translate all button text
- Preserve lang in redirect: `window.location.href = \`/survey?lang=${lang}\``

**4. Survey Page** (`src/pages/survey.astro`)
- Extract lang from URL
- Pass lang to `<SurveyForm lang={lang} />`
- Preserve lang in all form actions/submissions

**5. SurveyForm Component** (`src/components/survey/index.astro`)
- Accept `lang` prop
- Process question labels/choices through `t()` helper
- Translate all UI text (buttons, validation messages)

### Data Flow

```
User visits /select-language
  ↓
Selects language → /before-start?lang=ar
  ↓
Page extracts: getCurrentLang(Astro.url) → 'ar'
  ↓
Renders localized rules/buttons using t(translations.beforeStart.X, 'ar')
  ↓
Start button click → /survey?lang=ar
  ↓
Survey loads questions, processes each:
  - label = t(question.label, 'ar')
  - choices = question.choices.map(c => t(c, 'ar'))
  ↓
Form submissions preserve lang parameter
```

### Migration Strategy

**Phase 1: Infrastructure**
- Create translations constants file
- Add language detection helper
- Create `/select-language` page
- Update BaseLayout for RTL support

**Phase 2: Localize UI**
- Translate before-start rules
- Translate all button text
- Translate error messages
- Update redirects to preserve lang

**Phase 3: Localize Questions**
- Start with 1-2 sections (gradual approach)
- Convert YAML strings to `{ en, ar }` objects
- Test rendering with both languages
- Continue section by section

**Backward Compatibility:**
- Existing string labels continue working (English fallback)
- No breaking changes to current survey flow
- Can deploy infrastructure before translations complete

### Edge Cases

| Case | Behavior |
|------|----------|
| No `?lang` parameter | Default to English |
| Invalid lang (`?lang=fr`) | Default to English |
| Missing Arabic translation | Show English text (fallback via `t()` helper) |
| Partially translated question | Each field (label, choices) falls back independently |
| User changes URL manually | Works (stateless design) |

### Non-Goals (Out of Scope)

- Results pages translation (future work)
- Language switcher in header (not needed, stateless)
- Storing language preference in Firebase (URL is source of truth)
- Browser language auto-detection (explicit choice preferred)
- Additional languages beyond Arabic/English

## Implementation Notes

**Dependencies:**
- `tailwindcss-rtl` plugin for RTL support
- No i18n library needed (custom lightweight solution)

**Testing Considerations:**
- Test both languages render correctly
- Test RTL layout doesn't break existing components
- Test fallback behavior when translations missing
- Test lang parameter preserved through flow
- Verify Arabic text displays properly (font support)

**Performance:**
- No runtime overhead (simple object lookups)
- YAML files already loaded, just processing differently
- Translation constants tree-shakeable

## Open Questions

None - design approved and ready for implementation.
