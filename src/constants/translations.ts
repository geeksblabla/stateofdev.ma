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
    validationOthers: { en: "Please specify", ar: "يرجى التحديد" },
    multipleAnswers: { en: "You can choose multiple answers", ar: "يمكنك اختيار إجابات متعددة" },
    skipIfNotApplicable: { en: "Click skip button if not applicable", ar: "انقر على زر التخطي إذا لم يكن ذلك قابلاً للتطبيق" }
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
  if (typeof value === "string")
    return value; // English fallback
  return value[lang] || value.en; // Fallback to English if Arabic missing
}
