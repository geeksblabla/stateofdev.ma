# Arabic Survey Support Design

**Date:** 2025-12-13
**Scope:** Survey sections only (not landing page or reports)
**Languages:** English (default) + Arabic with RTL support

## Overview

Add Arabic translation support to the survey with language selection on the before-start page. Full RTL layout for survey sections while keeping header/footer LTR.

## Key Decisions

- **Translation storage:** Nested `en`/`ar` fields in YAML files
- **Backward compatibility:** Plain strings treated as English
- **Language selection:** Picker on before-start page + URL parameter
- **RTL scope:** Survey sections only (not header/footer)
- **UI text:** Centralized translations in `src/lib/translations.ts`
- **Default:** English with fallback for missing Arabic translations

## 1. Data Structure

### YAML Translation Format

Support both plain strings (backward compatible) and nested translation objects:

```yaml
title:
  en: Profile
  ar: الملف الشخصي
label: profile
questions:
  - label:
      en: What is your gender?
      ar: ما هو جنسك؟
    required: true
    choices:
      - Male  # Plain string = English (no Arabic yet)
      - en: Female
        ar: أنثى

  - label:
      en: What is your occupation?
      ar: ما هي وظيفتك؟
    choices:
      - en: Back-end developer
        ar: مطور الواجهة الخلفية
      - en: DevOps engineer
        # No 'ar' field - falls back to English
```

### Fallback Logic

1. **Plain string** → Treated as English (backward compatible)
2. **Object with `en`/`ar`** → Use current language
3. **Missing `ar` field** → Fallback to `en`
4. Existing YAMLs work without changes

### UI Text Translations

Create `src/lib/translations.ts`:

```typescript
export const translations = {
  en: {
    survey: {
      multipleChoice: "You can choose multiple answers",
      skipHint: "Click skip button if not applicable",
      otherPlaceholder: "Please specify... use comma to separate each item (max 200 characters)",
      next: "Next",
      previous: "Previous",
      skip: "Skip",
      submit: "Submit"
    },
    beforeStart: {
      title: "Before You Start",
      intro: "Here's what you need to know:",
      start: "Start Survey",
      initializing: "Initializing Session...",
      rules: [
        "We care about privacy; that's why all your answers are **completely anonymous**...",
        // ... rest of rules
      ]
    }
  },
  ar: {
    survey: {
      multipleChoice: "يمكنك اختيار إجابات متعددة",
      skipHint: "انقر على زر التخطي إذا لم ينطبق",
      otherPlaceholder: "يرجى التحديد... استخدم الفاصلة للفصل بين كل عنصر (200 حرف كحد أقصى)",
      next: "التالي",
      previous: "السابق",
      skip: "تخطي",
      submit: "إرسال"
    },
    beforeStart: {
      title: "قبل أن تبدأ",
      intro: "إليك ما تحتاج إلى معرفته:",
      start: "ابدأ الاستبيان",
      initializing: "جاري تهيئة الجلسة...",
      rules: [
        // Arabic translations of rules
      ]
    }
  }
};
```

## 2. Language Selection UI

### Before-Start Page Flow

1. User lands on `/before-start` (defaults to `?lang=en`)
2. Sees language picker at top
3. Selects language → URL updates to `/before-start?lang=ar`
4. Page shows rules in selected language
5. Clicks "Start Survey" → redirects to `/survey?lang=ar`

### Language Picker Component

Create `src/components/language-picker.tsx`:

```tsx
export function LanguagePicker() {
  const [lang, setLang] = useState<'en' | 'ar'>('en'); // Read from URL param

  const handleLanguageChange = (newLang: 'en' | 'ar') => {
    const url = new URL(window.location.href);
    url.searchParams.set('lang', newLang);
    window.location.href = url.toString();
  };

  return (
    <div className="flex gap-4 justify-center mb-8">
      <button
        onClick={() => handleLanguageChange('en')}
        className={lang === 'en' ? 'active-style' : 'inactive-style'}
        aria-label="Switch to English"
      >
        English
      </button>
      <button
        onClick={() => handleLanguageChange('ar')}
        className={lang === 'ar' ? 'active-style' : 'inactive-style'}
        aria-label="التبديل إلى العربية"
      >
        العربية
      </button>
    </div>
  );
}
```

### Before-Start Page Updates

Update `/src/pages/before-start.astro`:
- Add `LanguagePicker` component at top
- Read `lang` param from URL
- Show translated rules from `translations.beforeStart.rules`
- Translate all UI text (title, intro, button text)
- Pass `lang` param when redirecting to `/survey`

## 3. Component Changes & Translation Logic

### Language Context

Create `src/lib/language-context.tsx`:

```tsx
import { createContext, useContext } from 'react';

type Language = 'en' | 'ar';

const LanguageContext = createContext<Language>('en');

export function LanguageProvider({
  children,
  lang
}: {
  children: React.ReactNode;
  lang: Language;
}) {
  return (
    <LanguageContext.Provider value={lang}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
```

### Translation Helper

Create `src/lib/get-translation.ts`:

```typescript
export type TranslatableField = string | { en: string; ar?: string };

export function getTranslation(
  field: TranslatableField,
  lang: 'en' | 'ar'
): string {
  // Backward compatible: plain string treated as English
  if (typeof field === 'string') return field;

  // Object: use requested language, fallback to English
  return field[lang] || field.en;
}
```

### Survey Page Updates

Update `/src/pages/survey.astro`:
- Read `lang` param from URL (default to 'en')
- Wrap `SurveyForm` with `LanguageProvider`

```astro
---
const lang = (Astro.url.searchParams.get('lang') || 'en') as 'en' | 'ar';
---

<BaseLayout>
  <LanguageProvider lang={lang} client:load>
    <SurveyForm />
  </LanguageProvider>
</BaseLayout>
```

### Question Component Updates

Update `src/components/survey/question.tsx`:

```tsx
import { getTranslation } from '@/lib/get-translation';
import { useLanguage } from '@/lib/language-context';

export function Question({ question, ... }: QuestionProps) {
  const lang = useLanguage();
  const { label, choices } = question;

  return (
    <div>
      <label>
        {`${index + 1}. ${getTranslation(label, lang)}`}
      </label>

      <span>
        {question.multiple ? getTranslation(translations[lang].survey.multipleChoice, lang) : ""}
      </span>

      {choices.map((choice, i) => (
        <Choice
          text={getTranslation(choice, lang)}
          // ... other props
        />
      ))}

      {showOtherInput && (
        <textarea
          placeholder={translations[lang].survey.otherPlaceholder}
          // ... other props
        />
      )}
    </div>
  );
}
```

### Survey Controls Updates

Update button labels to use translations:

```tsx
const lang = useLanguage();
const t = translations[lang].survey;

<button>{t.previous}</button>
<button>{t.next}</button>
<button>{t.skip}</button>
<button>{t.submit}</button>
```

## 4. RTL Styling

### Survey Section RTL

Apply `dir="rtl"` to survey content when Arabic selected:

```tsx
// In SurveyForm component
const lang = useLanguage();

return (
  <div className="min-h-screen pt-10">
    <Steps />
    <main className="flex flex-1 justify-center items-center">
      <div
        dir={lang === 'ar' ? 'rtl' : 'ltr'}
        className="survey-content md:w-[700px] w-full px-4 md:px-0"
      >
        <Question ... />
        <SurveyActions ... />
      </div>
    </main>
  </div>
);
```

### CSS Updates

Use logical properties for RTL compatibility:

```css
/* Instead of padding-left/right, use logical properties */
.survey-content {
  padding-inline-start: 1rem;  /* Becomes padding-right in RTL */
  margin-inline-end: 2rem;     /* Becomes margin-left in RTL */
}

/* Flip button order in RTL */
[dir="rtl"] .survey-actions {
  flex-direction: row-reverse;
}

/* Text alignment */
[dir="rtl"] .survey-content {
  text-align: right;
}
```

### What Flips in RTL

- Text alignment (right-aligned)
- Button order (Previous on right, Next on left)
- Checkbox/radio alignment
- Margins and padding
- Flex/grid direction

### What Stays LTR

- Header navigation
- Footer
- Any content outside survey wrapper

## 5. Type Updates & Schema

### TypeScript Types

Update `src/lib/validators/survey-schema.ts`:

```typescript
import { z } from 'zod';

// Translatable string: plain string OR object with en/ar
export const translatableStringSchema = z.union([
  z.string(),
  z.object({
    en: z.string(),
    ar: z.string().optional()
  })
]);

export type TranslatableString = z.infer<typeof translatableStringSchema>;

export const surveyQuestionSchema = z.object({
  label: translatableStringSchema,
  required: z.boolean().optional(),
  multiple: z.boolean().optional(),
  choices: z.array(translatableStringSchema)
});

export type SurveyQuestion = z.infer<typeof surveyQuestionSchema>;

export const surveySectionSchema = z.object({
  title: translatableStringSchema,
  label: z.string(),
  position: z.number(),
  questions: z.array(surveyQuestionSchema)
});

export type SurveySection = z.infer<typeof surveySectionSchema>;
```

### YAML Parsing

No special handling needed - YAML parser naturally handles both:
- `label: "string"` → parsed as string
- `label: { en: "...", ar: "..." }` → parsed as object

Existing build process and `vite-plugin-yaml` continue to work.

## 6. Tests & Validation

### Translation Helper Tests

Create `src/lib/get-translation.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { getTranslation } from './get-translation';

describe('getTranslation', () => {
  it('handles plain string (backward compatible)', () => {
    expect(getTranslation('Hello', 'en')).toBe('Hello');
    expect(getTranslation('Hello', 'ar')).toBe('Hello');
  });

  it('returns English when lang is en', () => {
    const field = { en: 'Hello', ar: 'مرحبا' };
    expect(getTranslation(field, 'en')).toBe('Hello');
  });

  it('returns Arabic when lang is ar and available', () => {
    const field = { en: 'Hello', ar: 'مرحبا' };
    expect(getTranslation(field, 'ar')).toBe('مرحبا');
  });

  it('falls back to English when Arabic missing', () => {
    const field = { en: 'Hello' };
    expect(getTranslation(field, 'ar')).toBe('Hello');
  });
});
```

### Survey Component Tests

Update `src/components/survey/survey-form.test.tsx`:

```typescript
// Update mock data to support both formats
const mockSections = [
  {
    title: { en: 'Profile', ar: 'الملف الشخصي' },
    label: 'profile',
    questions: [
      {
        label: { en: 'Test question?', ar: 'سؤال تجريبي؟' },
        choices: [
          'Plain choice',  // Plain string
          { en: 'Translated choice', ar: 'خيار مترجم' }
        ]
      }
    ]
  }
];

// Test with different languages
describe('SurveyForm with translations', () => {
  it('renders English by default', () => {
    // Test English rendering
  });

  it('renders Arabic when lang=ar', () => {
    // Test Arabic rendering
  });

  it('applies RTL dir when Arabic', () => {
    // Test dir="rtl" attribute
  });
});
```

### Schema Validation Tests

Test both formats pass validation:

```typescript
describe('surveySchema', () => {
  it('validates plain string format', () => {
    const section = {
      title: 'Profile',
      label: 'profile',
      questions: [{ label: 'Question?', choices: ['A', 'B'] }]
    };
    expect(() => surveySectionSchema.parse(section)).not.toThrow();
  });

  it('validates translated format', () => {
    const section = {
      title: { en: 'Profile', ar: 'الملف' },
      label: 'profile',
      questions: [{
        label: { en: 'Question?', ar: 'سؤال؟' },
        choices: [
          { en: 'A', ar: 'أ' },
          'B'  // Mixed formats
        ]
      }]
    };
    expect(() => surveySectionSchema.parse(section)).not.toThrow();
  });
});
```

### Question Component Tests

Update tests to handle translation:

```typescript
describe('Question component', () => {
  it('displays translated label in Arabic', () => {
    const question = {
      label: { en: 'Gender?', ar: 'الجنس؟' },
      choices: [{ en: 'Male', ar: 'ذكر' }]
    };

    render(
      <LanguageProvider lang="ar">
        <Question question={question} ... />
      </LanguageProvider>
    );

    expect(screen.getByText(/الجنس؟/)).toBeInTheDocument();
    expect(screen.getByText('ذكر')).toBeInTheDocument();
  });

  it('falls back to English when translation missing', () => {
    const question = {
      label: { en: 'Gender?' },  // No Arabic
      choices: ['Male']
    };

    render(
      <LanguageProvider lang="ar">
        <Question question={question} ... />
      </LanguageProvider>
    );

    expect(screen.getByText(/Gender?/)).toBeInTheDocument();
  });
});
```

## Implementation Checklist

### Phase 1: Core Infrastructure
- [ ] Create `src/lib/translations.ts` with UI text
- [ ] Create `src/lib/language-context.tsx`
- [ ] Create `src/lib/get-translation.ts` helper
- [ ] Update TypeScript types in `survey-schema.ts`
- [ ] Add tests for translation helper

### Phase 2: Before-Start Page
- [ ] Create `LanguagePicker` component
- [ ] Update `/src/pages/before-start.astro` with language support
- [ ] Add Arabic translations for rules
- [ ] Test language switching and URL param

### Phase 3: Survey Components
- [ ] Update `/src/pages/survey.astro` with LanguageProvider
- [ ] Update `Question` component for translations
- [ ] Update `SurveyActions` component for button labels
- [ ] Update `Steps` component if needed
- [ ] Apply RTL styling to survey sections

### Phase 4: YAML Updates
- [ ] Convert one survey YAML to new format (test)
- [ ] Add Arabic translations for converted YAML
- [ ] Test survey rendering with mixed formats
- [ ] Document translation process for remaining YAMLs

### Phase 5: Testing & Polish
- [ ] Update all component tests
- [ ] Add schema validation tests
- [ ] Test full user flow (both languages)
- [ ] Verify RTL layout on different screen sizes
- [ ] Check accessibility (aria labels in both languages)

## Notes & Considerations

### Future Enhancements
- Additional languages (French, Spanish) - same pattern applies
- Full site translation (landing, reports) - reuse infrastructure
- Language persistence in localStorage
- Auto-detect browser language

### Migration Strategy
- Existing YAMLs work without changes (backward compatible)
- Can translate YAMLs incrementally
- No breaking changes to survey data structure
- Answers stored the same way (index-based)

### Accessibility
- `lang` attribute on HTML elements
- `dir` attribute for RTL
- ARIA labels in current language
- Screen reader support for both languages

### Performance
- No additional bundle size concerns (translations inline)
- No runtime translation overhead (direct object access)
- YAML parsing unchanged
