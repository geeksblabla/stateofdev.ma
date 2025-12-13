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

export type Language = "en" | "ar";
