# Arabic Survey Support Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: use executing-plans skill to implement this plan task-by-task.

**Goal:** Add Arabic translation support to survey with language selection, RTL layout, and backward-compatible YAML structure.

**Architecture:** Nested `en`/`ar` fields in YAMLs (backward compatible with plain strings), Language context provider for React components, URL param for language persistence, RTL styling only for survey sections.

**Tech Stack:** React Context API, TypeScript, Zod validation, Tailwind CSS (RTL), Astro pages

---

## Task 1: Create Translation Infrastructure

**Files:**
- Create: `src/lib/translations.ts`
- Create: `src/lib/get-translation.ts`
- Create: `src/lib/language-context.tsx`

**Step 1: Create UI text translations**

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
      submit: "Submit",
      back: "Back",
      loading: "Loading..."
    },
    beforeStart: {
      title: "Before You Start",
      intro: "Here's what you need to know:",
      start: "Start Survey",
      initializing: "Initializing Session...",
      selectLanguage: "Select your language",
      rules: [
        "We care about privacy; that's why all your answers are **completely anonymous**. We only rely on anonymous sessions to avoid spam",
        "**Please be honest**. Our goal is to understand the Moroccan IT market and share results with the community.",
        "The Survey should take around **8 minutes** to complete",
        "The survey is divided into **6 parts**: Profile, Learning & Education, AI, Work, Technology, and Community(we submit your answers at the end of each part)",
        "All Questions are **required** unless you have a **skip button**",
        "For questions that accept others as an option, please add them in the **text field**",
        "There are two types of questions: **Multiple Choice** (select one or more options) and **Single Select** (choose only one option)"
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
      submit: "إرسال",
      back: "رجوع",
      loading: "جاري التحميل..."
    },
    beforeStart: {
      title: "قبل أن تبدأ",
      intro: "إليك ما تحتاج إلى معرفته:",
      start: "ابدأ الاستبيان",
      initializing: "جاري تهيئة الجلسة...",
      selectLanguage: "اختر لغتك",
      rules: [
        "نحن نهتم بالخصوصية؛ لهذا السبب جميع إجاباتك **مجهولة تماماً**. نعتمد فقط على الجلسات المجهولة لتجنب البريد المزعج",
        "**يرجى أن تكون صادقاً**. هدفنا هو فهم سوق تكنولوجيا المعلومات المغربي ومشاركة النتائج مع المجتمع.",
        "يجب أن يستغرق الاستبيان حوالي **8 دقائق** لإكماله",
        "ينقسم الاستبيان إلى **6 أجزاء**: الملف الشخصي، التعلم والتعليم، الذكاء الاصطناعي، العمل، التكنولوجيا، والمجتمع (نقوم بإرسال إجاباتك في نهاية كل جزء)",
        "جميع الأسئلة **مطلوبة** ما لم يكن لديك **زر تخطي**",
        "بالنسبة للأسئلة التي تقبل الخيارات الأخرى، يرجى إضافتها في **حقل النص**",
        "هناك نوعان من الأسئلة: **الاختيار المتعدد** (اختر خياراً واحداً أو أكثر) و **الاختيار الواحد** (اختر خياراً واحداً فقط)"
      ]
    }
  }
} as const;

export type Language = 'en' | 'ar';
```

**Step 2: Create translation helper function**

Create `src/lib/get-translation.ts`:

```typescript
export type TranslatableField = string | { en: string; ar?: string };

/**
 * Get translation for a field based on language
 * @param field - Plain string or object with en/ar keys
 * @param lang - Language code ('en' or 'ar')
 * @returns Translated string (falls back to English if Arabic missing)
 */
export function getTranslation(
  field: TranslatableField,
  lang: 'en' | 'ar'
): string {
  // Backward compatible: plain string treated as English
  if (typeof field === 'string') {
    return field;
  }

  // Object: use requested language, fallback to English
  return field[lang] || field.en;
}
```

**Step 3: Create Language context provider**

Create `src/lib/language-context.tsx`:

```typescript
import { createContext, useContext } from 'react';

export type Language = 'en' | 'ar';

const LanguageContext = createContext<Language>('en');

interface LanguageProviderProps {
  children: React.ReactNode;
  lang: Language;
}

export function LanguageProvider({ children, lang }: LanguageProviderProps) {
  return (
    <LanguageContext.Provider value={lang}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): Language {
  return useContext(LanguageContext);
}
```

**Step 4: Verify type checking**

```bash
pnpm check
```

Expected: No type errors or linting issues

---

## Task 2: Update Survey Schema for Translations

**Files:**
- Modify: `src/lib/validators/survey-schema.ts`

**Step 1: Add translatable string schema**

Add after imports in `src/lib/validators/survey-schema.ts`:

```typescript
// Translatable string: plain string OR object with en/ar
export const translatableStringSchema = z.union([
  z.string(),
  z.object({
    en: z.string(),
    ar: z.string().optional()
  })
]);

export type TranslatableString = z.infer<typeof translatableStringSchema>;
```

**Step 2: Update SurveyQuestionSchema label field**

Replace line 42-52 with:

```typescript
export const SurveyQuestionSchema = z.object({
  label: z.union([
    // Plain string with validation
    z.string()
      .trim()
      .min(MIN_LABEL_LENGTH, "Question label must be at least 3 characters")
      .max(MAX_LABEL_LENGTH, `Question label must not exceed ${MAX_LABEL_LENGTH} characters`)
      .refine(val => val.trim().length > 0, {
        message: "Question label cannot be empty or whitespace only"
      }),
    // Translation object with validation
    z.object({
      en: z.string()
        .trim()
        .min(MIN_LABEL_LENGTH, "Question label must be at least 3 characters")
        .max(MAX_LABEL_LENGTH, `Question label must not exceed ${MAX_LABEL_LENGTH} characters`)
        .refine(val => val.trim().length > 0, {
          message: "Question label cannot be empty or whitespace only"
        }),
      ar: z.string()
        .trim()
        .min(MIN_LABEL_LENGTH, "Arabic question label must be at least 3 characters")
        .max(MAX_LABEL_LENGTH, `Arabic question label must not exceed ${MAX_LABEL_LENGTH} characters`)
        .refine(val => val.trim().length > 0, {
          message: "Arabic question label cannot be empty or whitespace only"
        })
        .optional()
    })
  ]),
```

**Step 3: Update SurveyQuestionSchema choices field**

Replace line 58-83 with:

```typescript
  choices: z
    .array(
      z.union([
        // Plain string choice
        z.string()
          .trim()
          .min(1, "Choice must not be empty")
          .max(MAX_CHOICE_LENGTH, `Choice must not exceed ${MAX_CHOICE_LENGTH} characters`)
          .refine(val => val.trim().length > 0, {
            message: "Choice cannot be whitespace only"
          }),
        // Translation object choice
        z.object({
          en: z.string()
            .trim()
            .min(1, "Choice must not be empty")
            .max(MAX_CHOICE_LENGTH, `Choice must not exceed ${MAX_CHOICE_LENGTH} characters`)
            .refine(val => val.trim().length > 0, {
              message: "Choice cannot be whitespace only"
            }),
          ar: z.string()
            .trim()
            .min(1, "Arabic choice must not be empty")
            .max(MAX_CHOICE_LENGTH, `Arabic choice must not exceed ${MAX_CHOICE_LENGTH} characters`)
            .refine(val => val.trim().length > 0, {
              message: "Arabic choice cannot be whitespace only"
            })
            .optional()
        })
      ])
    )
    .min(MIN_CHOICES, `Each question must have at least ${MIN_CHOICES} choices`)
    .refine(
      (choices) => {
        // Check for duplicate choices (case-insensitive) - handle both string and object
        const lowerCaseChoices = choices.map(c => {
          const text = typeof c === 'string' ? c : c.en;
          return text.toLowerCase().trim();
        });
        const uniqueChoices = new Set(lowerCaseChoices);
        return uniqueChoices.size === lowerCaseChoices.length;
      },
      {
        message: "Duplicate choices detected (case-insensitive comparison)"
      }
    ),
```

**Step 4: Update SurveyFileSchema title field**

Replace line 91-97 with:

```typescript
  .object({
    title: z.union([
      // Plain string title
      z.string()
        .trim()
        .min(MIN_TITLE_LENGTH, "Section title must be at least 2 characters")
        .refine(val => val.trim().length > 0, {
          message: "Section title cannot be empty or whitespace only"
        }),
      // Translation object title
      z.object({
        en: z.string()
          .trim()
          .min(MIN_TITLE_LENGTH, "Section title must be at least 2 characters")
          .refine(val => val.trim().length > 0, {
            message: "Section title cannot be empty or whitespace only"
          }),
        ar: z.string()
          .trim()
          .min(MIN_TITLE_LENGTH, "Arabic section title must be at least 2 characters")
          .refine(val => val.trim().length > 0, {
            message: "Arabic section title cannot be empty or whitespace only"
          })
          .optional()
      })
    ]),
```

**Step 5: Update duplicate label check to handle translations**

Replace line 120-130 with:

```typescript
    .refine(
      (questions) => {
        // Check for duplicate question labels within the section - handle both string and object
        const labels = questions.map(q => {
          const text = typeof q.label === 'string' ? q.label : q.label.en;
          return text.toLowerCase().trim();
        });
        const uniqueLabels = new Set(labels);
        return uniqueLabels.size === labels.length;
      },
      {
        message: "Duplicate question labels detected within the section"
      }
    ),
```

**Step 6: Verify type checking**

```bash
pnpm check
```

Expected: No type errors

---

## Task 3: Create Language Picker Component

**Files:**
- Create: `src/components/language-picker.tsx`

**Step 1: Implement LanguagePicker component**

Create `src/components/language-picker.tsx`:

```typescript
import { useState, useEffect } from 'react';

export function LanguagePicker() {
  const [lang, setLang] = useState<'en' | 'ar'>('en');

  // Read language from URL param on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get('lang');
    if (urlLang === 'ar' || urlLang === 'en') {
      setLang(urlLang);
    }
  }, []);

  const handleLanguageChange = (newLang: 'en' | 'ar') => {
    const url = new URL(window.location.href);
    url.searchParams.set('lang', newLang);
    window.location.href = url.toString();
  };

  return (
    <div className="flex gap-4 justify-center mb-8">
      <button
        type="button"
        onClick={() => handleLanguageChange('en')}
        className={`px-6 py-3 font-medium border-2 transition ${
          lang === 'en'
            ? 'bg-primary text-primary-foreground border-primary'
            : 'bg-background text-foreground border-border hover:border-primary'
        }`}
        aria-label="Switch to English"
        aria-pressed={lang === 'en'}
      >
        English
      </button>
      <button
        type="button"
        onClick={() => handleLanguageChange('ar')}
        className={`px-6 py-3 font-medium border-2 transition ${
          lang === 'ar'
            ? 'bg-primary text-primary-foreground border-primary'
            : 'bg-background text-foreground border-border hover:border-primary'
        }`}
        aria-label="التبديل إلى العربية"
        aria-pressed={lang === 'ar'}
      >
        العربية
      </button>
    </div>
  );
}
```

**Step 2: Verify type checking**

```bash
pnpm check
```

Expected: No type errors

---

## Task 4: Update Before-Start Page

**Files:**
- Modify: `src/pages/before-start.astro`

**Step 1: Import translations and LanguagePicker**

Add imports at top of frontmatter (after line 2):

```typescript
import { translations } from "@/lib/translations";
import { LanguagePicker } from "@/components/language-picker";
```

**Step 2: Read language from URL param**

Replace lines 4-12 with:

```typescript
const lang = (Astro.url.searchParams.get('lang') || 'en') as 'en' | 'ar';
const t = translations[lang].beforeStart;
```

**Step 3: Update page content with translations**

Replace lines 18-65 with:

```astro
<BaseLayout>
  <div class="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <div class="bg-card border-2 border-border">
      <div class="p-6 sm:p-8">
        <h1
          class="text-xl font-sans font-medium text-foreground mb-6 text-center"
        >
          {t.title}
        </h1>

        <LanguagePicker client:load />

        <p class="text-base text-foreground mb-8">
          {t.intro}
        </p>
        <ul class="space-y-4 mb-8">
          {
            t.rules.map((rule, index) => (
              <li class="flex items-start gap-3">
                <span class="flex h-6 w-6 shrink-0 items-center justify-center border-2 border-input bg-muted text-sm font-medium text-muted-foreground mt-0.5">
                  {index + 1}
                </span>
                <span
                  class="text-foreground leading-relaxed"
                  set:html={rule.replace(
                    /\*\*(.*?)\*\*/g,
                    "<strong>$1</strong>"
                  )}
                />
              </li>
            ))
          }
        </ul>

        <div id="captcha-container" class="mb-6 mx-auto w-fit"></div>
        <div
          id="error-alert"
          class="hidden mb-6 p-4 bg-destructive/10 border-l-4 border-destructive text-destructive"
          role="alert"
        >
          <p id="error-message" class="font-medium"></p>
        </div>
        <button
          id="start-survey-btn"
          class="w-full bg-primary hover:opacity-90 text-primary-foreground font-bold py-3 px-6 border-2 border-primary transition duration-300 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-ring focus:ring-opacity-50"
        >
          {t.start}
        </button>
      </div>
    </div>
  </div>
</BaseLayout>
```

**Step 4: Update button text in script**

Replace line 110 with:

```typescript
const lang = new URLSearchParams(window.location.search).get('lang') || 'en';
const t = translations[lang as 'en' | 'ar'].beforeStart;

startButton.addEventListener("click", async () => {
  startButton.disabled = true;
  startButton.innerHTML = t.initializing;
```

And replace line 103 with:

```typescript
  startButton.innerHTML = t.start;
```

And replace line 129 with:

```typescript
    // Redirect to the survey page with lang param
    window.location.href = `/survey?lang=${lang}`;
```

**Step 5: Add translation import in script**

Add after script imports (line 76):

```typescript
import { translations } from "@/lib/translations";
```

**Step 6: Verify type checking**

```bash
pnpm check
```

Expected: No type errors or linting issues

---

## Task 5: Update Survey Page with Language Provider

**Files:**
- Modify: `src/pages/survey.astro`
- Modify: `src/components/survey/index.astro`

**Step 1: Update survey.astro to pass lang param**

Add after line 5 in `src/pages/survey.astro`:

```typescript
const lang = (Astro.url.searchParams.get('lang') || 'en') as 'en' | 'ar';
```

Replace line 27-29 with:

```astro
<BaseLayout>
  <SurveyForm lang={lang} />
</BaseLayout>
```

**Step 2: Read survey/index.astro**

```bash
cat src/components/survey/index.astro
```

**Step 3: Update SurveyForm wrapper to accept and pass lang**

Update `src/components/survey/index.astro` to accept lang prop and wrap with LanguageProvider.

First, read the file:

```typescript
// Will read in next step to see current structure
```

**Step 4: Verify type checking**

```bash
pnpm check
```

Expected: No type errors

---

## Task 6: Update Question Component with Translations

**Files:**
- Modify: `src/components/survey/question.tsx`

**Step 1: Import translation utilities**

Add imports after line 6:

```typescript
import { getTranslation } from "@/lib/get-translation";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";
```

**Step 2: Use language context in Question component**

Add after line 33:

```typescript
  const lang = useLanguage();
  const t = translations[lang].survey;
```

**Step 3: Update label rendering with translation**

Replace line 109-113 with:

```typescript
        <label id={questionLabelId} className="block mb-2 ">
          {`${index + 1}. ${getTranslation(label, lang)}`}
          {" "}
          <br />
        </label>
```

**Step 4: Update helper text with translations**

Replace line 115-120 with:

```typescript
        <span className="font-normal text-sm pl-2.5">
          {question.multiple ? t.multipleChoice : ""}
        </span>
        <span className="font-normal text-sm pl-2.5">
          {question.required ? "" : t.skipHint}
        </span>
```

**Step 5: Update choices rendering with translation**

Replace line 128-140 with:

```typescript
        {choices.map((c, i) => (
          <Choice
            key={`${sectionId}-q-${index}-${i}`}
            text={getTranslation(c, lang)}
            id={`${sectionId}-q-${index}-${i}`}
            name={`${sectionId}-q-${index}`}
            index={i}
            required={question.required ?? true}
            multiple={question.multiple ?? false}
            checked={isChecked(i)}
            onChange={handleChoiceChange}
          />
        ))}
```

**Step 6: Update other input placeholder**

Replace line 144 with:

```typescript
            placeholder={t.otherPlaceholder}
```

**Step 7: Verify type checking**

```bash
pnpm check
```

Expected: No type errors

---

## Task 7: Update Survey Controls with Translations

**Files:**
- Modify: `src/components/survey/survey-controls.tsx`

**Step 1: Import translation utilities**

Add imports after line 1:

```typescript
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";
```

**Step 2: Use language context in BackButton**

Add after line 62:

```typescript
export function BackButton({ onClick }: BackButtonProps) {
  const lang = useLanguage();
  const t = translations[lang].survey;

  return (
```

**Step 3: Update Back button text**

Replace line 84 with:

```typescript
        {t.back}
```

**Step 4: Use language context in SurveyActions**

Add after line 92:

```typescript
  const lang = useLanguage();
  const t = translations[lang].survey;
```

**Step 5: Update Skip button text**

Replace line 153 with:

```typescript
            {t.skip}
```

**Step 6: Update Next button text**

Replace line 163 with:

```typescript
          {isSubmitting ? t.loading : t.next}
```

**Step 7: Verify type checking**

```bash
pnpm check
```

Expected: No type errors

---

## Task 8: Add RTL Support to Survey Form

**Files:**
- Modify: `src/components/survey/survey-form.tsx`

**Step 1: Import language context**

Add import after line 3:

```typescript
import { useLanguage } from "@/lib/language-context";
```

**Step 2: Use language context**

Add after line 11:

```typescript
  const lang = useLanguage();
```

**Step 3: Apply RTL dir to survey content**

Replace line 44-46 with:

```typescript
        <div
          id={currentSection.label}
          dir={lang === 'ar' ? 'rtl' : 'ltr'}
          className="md:w-[700px] w-full px-4 md:px-0"
        >
```

**Step 4: Verify type checking**

```bash
pnpm check
```

Expected: No type errors

---

## Task 9: Wrap Survey with Language Provider

**Files:**
- Modify: `src/components/survey/index.astro`

**Step 1: Read current structure**

Read `src/components/survey/index.astro` to understand current wrapper.

**Step 2: Add lang prop and wrap with LanguageProvider**

Update the file to:
1. Accept `lang` prop from Astro
2. Import and use LanguageProvider
3. Pass lang to provider

The exact changes depend on current structure - will implement after reading.

**Step 3: Verify type checking**

```bash
pnpm check
```

Expected: No type errors

---

## Task 10: Add Translation Helper Tests

**Files:**
- Create: `src/lib/get-translation.test.ts`

**Step 1: Create translation helper tests**

Create `src/lib/get-translation.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { getTranslation } from './get-translation';

describe('getTranslation', () => {
  it('handles plain string in English', () => {
    expect(getTranslation('Hello', 'en')).toBe('Hello');
  });

  it('handles plain string in Arabic (backward compatible)', () => {
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

  it('handles empty Arabic string by using it (not falling back)', () => {
    const field = { en: 'Hello', ar: '' };
    expect(getTranslation(field, 'ar')).toBe('');
  });
});
```

**Step 2: Run tests**

```bash
pnpm test src/lib/get-translation.test.ts
```

Expected: All tests pass

---

## Task 11: Update Schema Validation Tests

**Files:**
- Modify: `src/lib/validators/survey-schema.test.ts`

**Step 1: Add tests for translatable fields**

Add after existing tests in `src/lib/validators/survey-schema.test.ts`:

```typescript
describe('SurveyQuestionSchema with translations', () => {
  it('validates plain string label (backward compatible)', () => {
    const question = {
      label: 'What is your gender?',
      choices: ['Male', 'Female']
    };
    expect(() => SurveyQuestionSchema.parse(question)).not.toThrow();
  });

  it('validates translation object label', () => {
    const question = {
      label: { en: 'What is your gender?', ar: 'ما هو جنسك؟' },
      choices: ['Male', 'Female']
    };
    expect(() => SurveyQuestionSchema.parse(question)).not.toThrow();
  });

  it('validates translation object label without Arabic', () => {
    const question = {
      label: { en: 'What is your gender?' },
      choices: ['Male', 'Female']
    };
    expect(() => SurveyQuestionSchema.parse(question)).not.toThrow();
  });

  it('validates mixed format choices', () => {
    const question = {
      label: 'Gender?',
      choices: [
        'Male',  // Plain string
        { en: 'Female', ar: 'أنثى' },  // Translated
        { en: 'Other' }  // English only
      ]
    };
    expect(() => SurveyQuestionSchema.parse(question)).not.toThrow();
  });

  it('detects duplicate choices in translated format', () => {
    const question = {
      label: 'Test?',
      choices: [
        { en: 'Option A', ar: 'خيار أ' },
        { en: 'Option A', ar: 'خيار ب' }  // Duplicate English
      ]
    };
    expect(() => SurveyQuestionSchema.parse(question)).toThrow('Duplicate choices');
  });
});

describe('SurveyFileSchema with translations', () => {
  it('validates plain string title (backward compatible)', () => {
    const section = {
      title: 'Profile',
      label: 'profile',
      position: 1,
      questions: [
        { label: 'Question?', choices: ['A', 'B'], required: true }
      ]
    };
    expect(() => SurveyFileSchema.parse(section)).not.toThrow();
  });

  it('validates translation object title', () => {
    const section = {
      title: { en: 'Profile', ar: 'الملف الشخصي' },
      label: 'profile',
      position: 1,
      questions: [
        { label: 'Question?', choices: ['A', 'B'], required: true }
      ]
    };
    expect(() => SurveyFileSchema.parse(section)).not.toThrow();
  });

  it('validates full translated survey section', () => {
    const section = {
      title: { en: 'Profile', ar: 'الملف الشخصي' },
      label: 'profile',
      position: 1,
      questions: [
        {
          label: { en: 'What is your gender?', ar: 'ما هو جنسك؟' },
          required: true,
          choices: [
            { en: 'Male', ar: 'ذكر' },
            { en: 'Female', ar: 'أنثى' }
          ]
        }
      ]
    };
    expect(() => SurveyFileSchema.parse(section)).not.toThrow();
  });
});
```

**Step 2: Run tests**

```bash
pnpm test src/lib/validators/survey-schema.test.ts
```

Expected: All tests pass

---

## Task 12: Convert One Survey YAML to Test Translation

**Files:**
- Modify: `survey/1-profile.yml`

**Step 1: Read current profile YAML**

```bash
cat survey/1-profile.yml
```

**Step 2: Convert first question to translated format**

Update the first question in `survey/1-profile.yml` to use translation format:

```yaml
title:
  en: Profile
  ar: الملف الشخصي
label: profile
position: 1
questions:
  - label:
      en: What is your gender?
      ar: ما هو جنسك؟
    required: true
    multiple: false
    choices:
      - en: Male
        ar: ذكر
      - en: Female
        ar: أنثى

  # Keep remaining questions as plain strings for now
  - label: What is your age?
    required: true
    choices:
      - Younger than 18 years
      - 18 to 24 years
      - 25 to 34 years
      - 35 to 44 years
      - 45 or older

  # ... rest of questions unchanged
```

**Step 3: Build and verify**

```bash
pnpm build
```

Expected: Build succeeds, no YAML parsing errors

**Step 4: Test survey loads correctly**

```bash
pnpm preview
```

Navigate to `/before-start`, select Arabic, verify first question shows in Arabic.

---

## Task 13: Add RTL CSS Adjustments

**Files:**
- Create: `src/styles/rtl.css`
- Modify: `src/components/layout.astro`

**Step 1: Create RTL stylesheet**

Create `src/styles/rtl.css`:

```css
/* RTL-specific adjustments for Arabic survey */

/* Flip flex direction for button groups in RTL */
[dir="rtl"] .survey-actions {
  flex-direction: row-reverse;
}

/* Ensure text aligns correctly */
[dir="rtl"] {
  text-align: right;
}

/* Fix choice alignment in RTL */
[dir="rtl"] input[type="radio"],
[dir="rtl"] input[type="checkbox"] {
  margin-left: 0.5rem;
  margin-right: 0;
}

/* Back button arrow flip */
[dir="rtl"] .group svg {
  transform: scaleX(-1);
}

[dir="rtl"] .group:hover svg {
  transform: scaleX(-1) translateX(0.25rem);
}
```

**Step 2: Import RTL styles in layout**

Add import in `src/components/layout.astro` head section:

```astro
<link rel="stylesheet" href="/src/styles/rtl.css" />
```

**Step 3: Verify build**

```bash
pnpm build
```

Expected: Build succeeds

---

## Task 14: Update Component Tests for Translations

**Files:**
- Modify: `src/components/survey/survey-form.test.tsx`

**Step 1: Add LanguageProvider wrapper to tests**

Add import at top of file:

```typescript
import { LanguageProvider } from '@/lib/language-context';
```

**Step 2: Wrap test components with LanguageProvider**

Update render calls to wrap with LanguageProvider:

```typescript
// Example update - apply to all test renders
render(
  <LanguageProvider lang="en">
    <SurveyForm />
  </LanguageProvider>
);
```

**Step 3: Add test for Arabic rendering**

Add new test:

```typescript
it('renders in Arabic when lang=ar', () => {
  const mockSections = [
    {
      title: { en: 'Profile', ar: 'الملف الشخصي' },
      label: 'profile',
      position: 1,
      questions: [
        {
          label: { en: 'Test?', ar: 'اختبار؟' },
          required: true,
          choices: [
            { en: 'Choice A', ar: 'خيار أ' },
            'Choice B'  // Plain string
          ]
        }
      ]
    }
  ];

  render(
    <LanguageProvider lang="ar">
      <SurveyForm sections={mockSections} />
    </LanguageProvider>
  );

  expect(screen.getByText(/اختبار؟/)).toBeInTheDocument();
  expect(screen.getByText('خيار أ')).toBeInTheDocument();
  expect(screen.getByText('Choice B')).toBeInTheDocument(); // Fallback
});
```

**Step 4: Add RTL dir test**

Add test for RTL:

```typescript
it('applies dir=rtl when Arabic selected', () => {
  render(
    <LanguageProvider lang="ar">
      <SurveyForm />
    </LanguageProvider>
  );

  const surveyContent = screen.getByRole('main').querySelector('[dir]');
  expect(surveyContent).toHaveAttribute('dir', 'rtl');
});
```

**Step 5: Run tests**

```bash
pnpm test
```

Expected: All tests pass

---

## Task 15: Final Verification and Build

**Files:**
- None (verification only)

**Step 1: Run type checking**

```bash
pnpm check
```

Expected: No type errors

**Step 2: Run linting**

```bash
pnpm lint
```

Expected: No linting errors

**Step 3: Run all tests**

```bash
pnpm test
```

Expected: All tests pass

**Step 4: Build for production**

```bash
pnpm build
```

Expected: Build succeeds

**Step 5: Test full flow**

```bash
pnpm preview
```

Manual testing:
1. Navigate to `/before-start`
2. Select Arabic language
3. Click "ابدأ الاستبيان"
4. Verify first question shows in Arabic with RTL layout
5. Verify buttons show Arabic text
6. Navigate back to before-start
7. Select English
8. Verify survey shows in English

**Step 6: Commit changes**

```bash
git add .
git commit -m "feat: add Arabic survey support with RTL layout

- Add translation infrastructure (context, helpers, translations)
- Update survey schema to support translatable fields
- Add language picker on before-start page
- Implement RTL layout for Arabic survey sections
- Update all UI text with translations
- Add comprehensive tests for translation logic
- Convert profile section first question to bilingual

🤖 Generated with Claude Code"
```

---

## Notes

### Remaining Work (Not in Plan)

After this implementation, the following tasks remain:
1. Translate all remaining survey YAML questions to Arabic
2. Translate Steps component section titles
3. Add language toggle in survey header (optional)
4. Test on mobile devices for RTL layout
5. Add accessibility testing for screen readers

### Migration Path

Existing YAMLs work without changes. To translate:
1. Convert `title: "Text"` → `title: { en: "Text", ar: "نص" }`
2. Convert each question label and choices similarly
3. Can translate incrementally - mixed formats supported

### Performance Considerations

- No runtime overhead - direct object property access
- Translations bundled with JavaScript (no extra requests)
- YAML parsing unchanged
- Consider code splitting translations if bundle size becomes an issue
