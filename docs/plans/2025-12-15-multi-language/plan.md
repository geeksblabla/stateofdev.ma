# Multi-Language Survey Support Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: use executing-plans skill to implement this plan task-by-task.

**Goal:** Add Arabic and English language support to survey flow (language selection, before-start, survey pages)

**Architecture:** URL-based language parameter (`?lang=en|ar`), flexible YAML format (string or `{en, ar}` object), centralized translation constants, RTL support via `dir` attribute on main container

**Tech Stack:** Astro 5, React 18, TypeScript, Tailwind CSS (with tailwindcss-rtl plugin)

---

## Phase 1: Infrastructure Setup

### Task 1: Install RTL Plugin

**Files:**
- Modify: `package.json`
- Modify: `tailwind.config.mjs`

**Step 1: Install tailwindcss-rtl plugin**

```bash
pnpm add -D tailwindcss-rtl
```

Expected: Package installed successfully

**Step 2: Add plugin to Tailwind config**

In `tailwind.config.mjs`, update plugins array:

```javascript
plugins: [
  require("@tailwindcss/typography"),
  require("tailwindcss-rtl")
]
```

**Step 3: Verify setup**

```bash
pnpm check
```

Expected: No type errors

---

### Task 2: Create Translation Constants File

**Files:**
- Create: `src/constants/translations.ts`

**Step 1: Create translations file with type-safe structure**

```typescript
export const translations = {
  languageSelection: {
    english: { en: "English", ar: "الإنجليزية" },
    arabic: { en: "Arabic", ar: "العربية" }
  },
  beforeStart: {
    title: { en: "Before You Start", ar: "قبل أن تبدأ" },
    subtitle: { en: "Here's what you need to know:", ar: "إليك ما تحتاج معرفته:" },
    startButton: { en: "Start", ar: "ابدأ" },
    initializingSession: { en: "Initializing Session...", ar: "جارٍ تهيئة الجلسة..." },
    rules: [
      {
        en: "We care about privacy; that's why all your answers are **completely anonymous**. We only rely on anonymous sessions to avoid spam",
        ar: "نحن نهتم بالخصوصية؛ لهذا السبب جميع إجاباتك **مجهولة تمامًا**. نحن نعتمد فقط على الجلسات المجهولة لتجنب البريد المزعج"
      },
      {
        en: "**Please be honest**. Our goal is to understand the Moroccan IT market and share results with the community.",
        ar: "**يرجى أن تكون صادقًا**. هدفنا هو فهم سوق تكنولوجيا المعلومات المغربية ومشاركة النتائج مع المجتمع."
      },
      {
        en: "The Survey should take around **8 minutes** to complete",
        ar: "يجب أن يستغرق الاستطلاع حوالي **8 دقائق** لإكماله"
      },
      {
        en: "The survey is divided into **6 parts**: Profile, Learning & Education, AI, Work, Technology, and Community(we submit your answers at the end of each part)",
        ar: "الاستطلاع مقسم إلى **6 أجزاء**: الملف الشخصي، التعلم والتعليم، الذكاء الاصطناعي، العمل، التكنولوجيا، والمجتمع (نرسل إجاباتك في نهاية كل جزء)"
      },
      {
        en: "All Questions are **required** unless you have a **skip button**",
        ar: "جميع الأسئلة **مطلوبة** ما لم يكن لديك **زر تخطي**"
      },
      {
        en: "For questions that accept others as an option, please add them in the **text field**",
        ar: "بالنسبة للأسئلة التي تقبل خيارات أخرى، يرجى إضافتها في **حقل النص**"
      },
      {
        en: "There are two types of questions: **Multiple Choice** (select one or more options) and **Single Select** (choose only one option)",
        ar: "هناك نوعان من الأسئلة: **اختيار متعدد** (حدد خيارًا واحدًا أو أكثر) و **اختيار واحد** (اختر خيارًا واحدًا فقط)"
      }
    ],
    errorMessage: {
      en: "Session initialization failed. Please try again or <a href=\"https://github.com/geeksblabla/stateofdev.ma/issues\" target=\"_blank\" class=\"underline font-semibold\">report the issue</a>.",
      ar: "فشل تهيئة الجلسة. يرجى المحاولة مرة أخرى أو <a href=\"https://github.com/geeksblabla/stateofdev.ma/issues\" target=\"_blank\" class=\"underline font-semibold\">الإبلاغ عن المشكلة</a>."
    }
  },
  survey: {
    next: { en: "Next", ar: "التالي" },
    previous: { en: "Previous", ar: "السابق" },
    submit: { en: "Submit", ar: "إرسال" },
    skip: { en: "Skip", ar: "تخطي" },
    submitting: { en: "Submitting...", ar: "جارٍ الإرسال..." },
    validationRequired: { en: "This question is required", ar: "هذا السؤال مطلوب" },
    validationOthers: { en: "Please specify", ar: "يرجى التحديد" }
  }
} as const;

export type Lang = "en" | "ar";
export type TranslationValue = { en: string; ar: string } | string;

/**
 * Translation helper with English fallback
 * @param value - String or translation object
 * @param lang - Target language
 * @returns Translated text or English fallback
 */
export function t(value: TranslationValue, lang: Lang): string {
  if (typeof value === "string") return value; // English fallback
  return value[lang] || value.en; // Fallback to English if Arabic missing
}
```

**Step 2: Verify no type errors**

```bash
pnpm check
```

Expected: No type errors

---

### Task 3: Create Language Detection Helper

**Files:**
- Create: `src/lib/utils/language.ts`

**Step 1: Create language utility functions**

```typescript
import type { Lang } from "@/constants/translations";

/**
 * Extract language from URL search params
 * @param url - URL object from Astro.url
 * @returns Language code ('en' or 'ar'), defaults to 'en'
 */
export function getCurrentLang(url: URL): Lang {
  const lang = url.searchParams.get("lang");
  return lang === "ar" ? "ar" : "en"; // Default to 'en'
}

/**
 * Preserve language parameter when building URLs
 * @param path - Target path
 * @param lang - Current language
 * @returns Path with lang parameter
 */
export function withLang(path: string, lang: Lang): string {
  return `${path}?lang=${lang}`;
}

/**
 * Get text direction for language
 * @param lang - Language code
 * @returns 'rtl' for Arabic, 'ltr' for English
 */
export function getDir(lang: Lang): "rtl" | "ltr" {
  return lang === "ar" ? "rtl" : "ltr";
}
```

**Step 2: Verify no type errors**

```bash
pnpm check
```

Expected: No type errors

---

### Task 4: Update BaseLayout for Language Support

**Files:**
- Modify: `src/components/layout.astro:8-12,156-158`

**Step 1: Add lang prop and apply dir attribute**

Update Props interface (line 8):

```typescript
interface Props {
  title?: string;
  year?: string;
  description?: string;
  lang?: "en" | "ar";
}
```

Update component frontmatter (line 14):

```typescript
const { title: titleProp, year, description: descriptionProp, lang = "en" } = Astro.props;
```

Update main element (line 156):

```astro
<main dir={lang === "ar" ? "rtl" : "ltr"}>
  <slot />
</main>
```

**Step 2: Verify no type errors**

```bash
pnpm check
```

Expected: No type errors

---

## Phase 2: Create Language Selection Page

### Task 5: Create Language Selection Page

**Files:**
- Create: `src/pages/select-language.astro`

**Step 1: Create minimal language picker page**

```astro
---
import BaseLayout from "@/components/layout.astro";

export const prerender = true;
---

<BaseLayout>
  <div class="max-w-2xl mx-auto py-20 px-4">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <a
        href="/before-start?lang=en"
        class="flex flex-col items-center justify-center p-12 bg-card border-2 border-border hover:border-primary transition-colors duration-200"
      >
        <span class="text-6xl mb-4">🇬🇧</span>
        <span class="text-2xl font-medium text-foreground">English</span>
      </a>

      <a
        href="/before-start?lang=ar"
        class="flex flex-col items-center justify-center p-12 bg-card border-2 border-border hover:border-primary transition-colors duration-200"
      >
        <span class="text-6xl mb-4">🇲🇦</span>
        <span class="text-2xl font-medium text-foreground">العربية</span>
      </a>
    </div>
  </div>
</BaseLayout>
```

**Step 2: Verify page builds correctly**

```bash
pnpm check
```

Expected: No type errors

---

## Phase 3: Localize Before-Start Page

### Task 6: Update Before-Start Page with Translations

**Files:**
- Modify: `src/pages/before-start.astro:1-174`

**Step 1: Replace hardcoded content with translations**

Replace entire file content:

```astro
---
import BaseLayout from "@/components/layout.astro";
import { translations, t } from "@/constants/translations";
import { getCurrentLang, withLang } from "@/lib/utils/language";

export const prerender = false;

const lang = getCurrentLang(Astro.url);
const rules = translations.beforeStart.rules.map(rule => t(rule, lang));
---

<BaseLayout lang={lang}>
  <div class="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <div class="bg-card border-2 border-border">
      <div class="p-6 sm:p-8">
        <h1
          class="text-xl font-sans font-medium text-foreground mb-6 text-center"
        >
          {t(translations.beforeStart.title, lang)}
        </h1>
        <p class="text-base text-foreground mb-8">
          {t(translations.beforeStart.subtitle, lang)}
        </p>
        <ul class="space-y-4 mb-8">
          {
            rules.map((rule, index) => (
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
          {t(translations.beforeStart.startButton, lang)}
        </button>
      </div>
    </div>
  </div>
</BaseLayout>

<script
  src="https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback"
  defer
  is:inline
></script>

<script>
/* eslint-disable no-console */
import { actions } from "astro:actions";
import { signInAnonymously } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { translations, t } from "@/constants/translations";

// Get current language from URL
const urlParams = new URLSearchParams(window.location.search);
const lang = urlParams.get("lang") === "ar" ? "ar" : "en";

const startButton = document.querySelector(
  "#start-survey-btn"
) as HTMLButtonElement;
const errorAlert = document.querySelector("#error-alert") as HTMLDivElement;
const errorMessage = document.querySelector(
  "#error-message"
) as HTMLParagraphElement;
let captchaToken = "";

// @ts-expect-error - Turnstile callback is added to window dynamically
window.onloadTurnstileCallback = function () {
  // @ts-expect-error - Turnstile is added to window dynamically by Cloudflare script
  window.turnstile.render("#captcha-container", {
    sitekey: "0x4AAAAAAAkS5usDr1HhE7Gm",
    callback(token: string) {
      console.log(`Challenge Success ${token}`);
      captchaToken = token;
    },
    theme: "auto"
  });
};

function handleError() {
  errorMessage.innerHTML = t(translations.beforeStart.errorMessage, lang);
  errorAlert.classList.remove("hidden");
  startButton.innerHTML = t(translations.beforeStart.startButton, lang);
  startButton.disabled = false;
  startButton.classList.remove("opacity-50", "cursor-not-allowed");
}

startButton.addEventListener("click", async () => {
  startButton.disabled = true;
  startButton.innerHTML = t(translations.beforeStart.initializingSession, lang);
  startButton.classList.add("opacity-50", "cursor-not-allowed");
  errorAlert.classList.add("hidden");

  try {
    const userCredential = await signInAnonymously(auth);
    const token = await userCredential.user.getIdToken();

    const { error } = await actions.initSession({
      idToken: token,
      captchaToken
    });
    if (error) {
      console.error("Error initializing session:", error);
      handleError();
      return;
    }

    // Preserve language parameter in redirect
    window.location.href = `/survey?lang=${lang}`;
  }
  catch {
    handleError();
  }
});
</script>
```

**Step 2: Verify page builds and renders correctly**

```bash
pnpm check
```

Expected: No type errors, translations load correctly

---

## Phase 4: Update Survey Components for i18n

### Task 7: Update Survey Type Definitions

**Files:**
- Modify: `src/lib/validators/survey-schema.ts`

**Step 1: Find the SurveyQuestion type definition and update it**

Add support for bilingual labels and choices. Look for the type/interface that defines question structure and update it to support:

```typescript
// Update the existing type to support both string and bilingual object
type BilingualText = string | { en: string; ar?: string };

// Update question interface to use BilingualText
interface SurveyQuestion {
  label: BilingualText;
  choices: BilingualText[];
  // ... other existing fields
}
```

**Step 2: Verify types**

```bash
pnpm check
```

Expected: No type errors

---

### Task 8: Create Question Translation Helper

**Files:**
- Create: `src/lib/utils/translate-question.ts`

**Step 1: Create helper to translate question data**

```typescript
import type { Lang, TranslationValue } from "@/constants/translations";
import { t } from "@/constants/translations";
import type { SurveyQuestion } from "@/lib/validators/survey-schema";

/**
 * Translate question label and choices based on language
 * @param question - Survey question with potentially bilingual content
 * @param lang - Target language
 * @returns Question with translated label and choices
 */
export function translateQuestion(
  question: SurveyQuestion,
  lang: Lang
): SurveyQuestion {
  return {
    ...question,
    label: t(question.label as TranslationValue, lang),
    choices: question.choices.map(choice => t(choice as TranslationValue, lang))
  };
}

/**
 * Translate section title
 * @param title - Section title (string or bilingual object)
 * @param lang - Target language
 * @returns Translated title
 */
export function translateSectionTitle(
  title: TranslationValue,
  lang: Lang
): string {
  return t(title, lang);
}
```

**Step 2: Verify no type errors**

```bash
pnpm check
```

Expected: No type errors

---

### Task 9: Update Survey Page to Pass Language

**Files:**
- Modify: `src/pages/survey.astro:1-30`

**Step 1: Extract language and pass to survey component**

Update the frontmatter section:

```astro
---
import { getAuth } from "firebase-admin/auth";
import BaseLayout from "@/components/layout.astro";
import SurveyForm from "@/components/survey/index.astro";
import { getActiveApp } from "@/lib/firebase/server";
import { getCurrentLang } from "@/lib/utils/language";

export const prerender = false;

const auth = getAuth(getActiveApp());

/* Check current session */
if (!Astro.cookies.has("__session")) {
  return Astro.redirect("/before-start");
}
const sessionCookie = Astro.cookies.get("__session")?.value;
if (!sessionCookie) {
  return Astro.redirect("/before-start");
}
const decodedCookie = await auth.verifySessionCookie(sessionCookie);
const user = await auth.getUser(decodedCookie.uid);

if (!user) {
  return Astro.redirect("/before-start");
}

// Extract language from URL
const lang = getCurrentLang(Astro.url);
---

<BaseLayout lang={lang}>
  <SurveyForm lang={lang} />
</BaseLayout>
```

**Step 2: Verify no type errors**

```bash
pnpm check
```

Expected: No type errors

---

### Task 10: Update Survey Index Component

**Files:**
- Modify: `src/components/survey/index.astro:1-44`

**Step 1: Accept lang prop and pass to SurveyApp**

Replace entire file:

```astro
---
import type { Lang } from "@/constants/translations";
import { validateSurveyFile } from "@/lib/validators/survey-schema";
import profileQuestionsRaw from "@/survey/1-profile.yml";
import learningQuestionsRaw from "@/survey/2-learning-and-education.yml";
import workQuestionRaw from "@/survey/3-work.yml";
import aiQuestionRaw from "@/survey/4-ai.yml";
import techQuestionRaw from "@/survey/5-tech.yml";
import communityQuestionRaw from "@/survey/6-community.yml";
import ExitPopup from "./exit-popup.astro";
import { SurveyApp } from "./survey-app";

interface Props {
  lang: Lang;
}

const { lang } = Astro.props;

// Validate each YAML file to ensure data integrity
const profileQuestions = validateSurveyFile(
  profileQuestionsRaw,
  "1-profile.yml"
);
const learningQuestions = validateSurveyFile(
  learningQuestionsRaw,
  "2-learning-and-education.yml"
);
const workQuestion = validateSurveyFile(workQuestionRaw, "3-work.yml");
const aiQuestion = validateSurveyFile(aiQuestionRaw, "4-ai.yml");
const techQuestion = validateSurveyFile(techQuestionRaw, "5-tech.yml");
const communityQuestion = validateSurveyFile(
  communityQuestionRaw,
  "6-community.yml"
);

const questions = [
  profileQuestions,
  learningQuestions,
  workQuestion,
  aiQuestion,
  techQuestion,
  communityQuestion
];
---

<div id="survey-form" class="min-h-screen min-w-full">
  <SurveyApp questions={questions} lang={lang} client:only="react" />
</div>

<ExitPopup />
```

**Step 2: Verify no type errors**

```bash
pnpm check
```

Expected: No type errors

---

### Task 11: Update SurveyApp Component

**Files:**
- Modify: `src/components/survey/survey-app.tsx:1-16`

**Step 1: Accept lang prop and pass to provider**

Replace entire file:

```typescript
import type { Lang } from "@/constants/translations";
import type { SurveyQuestionsYamlFile } from "@/lib/validators/survey-schema";
import { SurveyProvider } from "./survey-context";
import { SurveyForm } from "./survey-form";

interface Props {
  questions: SurveyQuestionsYamlFile[];
  lang: Lang;
}

export function SurveyApp({ questions, lang }: Props) {
  return (
    <SurveyProvider sections={questions} lang={lang}>
      <SurveyForm />
    </SurveyProvider>
  );
}
```

**Step 2: Verify no type errors**

```bash
pnpm check
```

Expected: No type errors

---

### Task 12: Update Survey Context with Language

**Files:**
- Modify: `src/components/survey/survey-context.tsx`

**Step 1: Read current file to understand structure**

First, read the file to see the current implementation:

```bash
# This is for the implementer to understand the context structure
```

**Step 2: Add lang to context and translate questions**

Update the SurveyProvider to:
1. Accept `lang` prop
2. Add `lang` to context value
3. Translate questions using `translateQuestion` helper before passing to state machine

Key changes:
- Import `Lang` type and translation helpers
- Add `lang: Lang` to Props interface
- Add `lang` to context interface
- Map questions through `translateQuestion(q, lang)` before use
- Pass `lang` to context value

**Step 3: Verify no type errors**

```bash
pnpm check
```

Expected: No type errors

---

### Task 13: Update Survey Controls with Translations

**Files:**
- Modify: `src/components/survey/survey-controls.tsx`

**Step 1: Use translation context for button labels**

Update component to:
1. Import translations and `t` function
2. Get `lang` from survey context
3. Replace hardcoded button text with `t(translations.survey.next, lang)`, etc.

Update buttons:
- "Next" → `t(translations.survey.next, lang)`
- "Previous" → `t(translations.survey.previous, lang)`
- "Submit" → `t(translations.survey.submit, lang)`
- "Skip" → `t(translations.survey.skip, lang)`
- "Submitting..." → `t(translations.survey.submitting, lang)`

**Step 2: Verify no type errors**

```bash
pnpm check
```

Expected: No type errors

---

### Task 14: Update Question Component (if needed)

**Files:**
- Modify: `src/components/survey/question.tsx` (if validation messages need translation)

**Step 1: Check if component has validation messages**

Look for hardcoded error/validation text that needs translation.

**Step 2: Replace with translated versions**

If validation messages exist, use `t(translations.survey.validationRequired, lang)` pattern.

**Step 3: Verify no type errors**

```bash
pnpm check
```

Expected: No type errors

---

## Phase 5: Testing & Verification

### Task 15: Test Language Flow End-to-End

**Files:**
- None (testing only)

**Step 1: Build the project**

```bash
pnpm build
```

Expected: Build succeeds with no errors

**Step 2: Manual testing checklist**

Test each scenario (assume dev server is running):

1. Visit `/select-language` - should show two language cards
2. Click English - should go to `/before-start?lang=en` with English text
3. Click Arabic - should go to `/before-start?lang=ar` with Arabic text and RTL layout
4. Complete CAPTCHA and start survey - should preserve lang parameter
5. Navigate through survey sections - all UI should be translated
6. Verify buttons (Next, Previous, Submit, Skip) are translated
7. Check RTL layout works (text alignment, spacing)
8. Test fallback: Visit `/before-start` without lang - should default to English
9. Test invalid lang: `/before-start?lang=fr` - should default to English

**Step 3: Run linting**

```bash
pnpm lint
```

Expected: No linting errors

---

### Task 16: Commit Infrastructure Changes

**Files:**
- All modified files from Phase 1-4

**Step 1: Stage and commit changes**

```bash
git add -A
git commit -m "feat: add multi-language support infrastructure

- Add tailwindcss-rtl plugin
- Create translation constants (src/constants/translations.ts)
- Add language detection helpers
- Update BaseLayout for RTL support
- Create /select-language page
- Localize before-start page
- Update survey components to support translations
- Questions now support string or {en, ar} format

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

Expected: Changes committed successfully

---

## Phase 6: Add Arabic Translations to Survey Questions (Optional)

### Task 17: Translate Profile Section (Example)

**Files:**
- Modify: `survey/1-profile.yml`

**Step 1: Convert first few questions to bilingual format**

Update the first 2-3 questions as examples:

```yaml
title: Profile
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

  - label:
      en: What is your age?
      ar: ما هو عمرك؟
    required: true
    choices:
      - en: Younger than 18 years
        ar: أقل من 18 سنة
      - en: 18 to 24 years
        ar: من 18 إلى 24 سنة
      - en: 25 to 34 years
        ar: من 25 إلى 34 سنة
      - en: 35 to 44 years
        ar: من 35 إلى 44 سنة
      - en: 45 or older
        ar: 45 أو أكبر

  # Keep remaining questions as English strings for gradual translation
  - label: Where are you currently located?
    required: true
    choices:
      - Rabat-Salé-Kénitra
      - Casablanca-Settat
      # ... rest of choices
```

**Step 2: Verify survey validation passes**

```bash
pnpm validate-survey
```

Expected: Validation passes, YAML correctly parsed

**Step 3: Test in browser**

Visit `/survey?lang=ar` and verify translated questions render correctly.

**Step 4: Commit sample translations**

```bash
git add survey/1-profile.yml
git commit -m "feat: add Arabic translations to profile section (sample)

- Translate first 2 questions as example
- Remaining questions use English fallback
- Demonstrates gradual translation approach

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

Expected: Committed successfully

---

## Implementation Complete

**Summary:**
- ✅ RTL support with tailwindcss-rtl
- ✅ Translation infrastructure (constants + helpers)
- ✅ Language selection page
- ✅ Localized before-start page
- ✅ Survey components support bilingual content
- ✅ URL-based language persistence
- ✅ Backward compatible (string fallback)
- ✅ Example translations in profile section

**Next Steps:**
1. Gradually translate remaining survey sections (5 more YAML files)
2. Get community feedback on Arabic translations
3. Consider results pages translation (future enhancement)

**Testing Checklist:**
- [x] Language selection works
- [x] English flow complete
- [x] Arabic flow with RTL
- [x] Fallback to English
- [x] Build succeeds
- [x] No type errors
- [x] Linting passes
