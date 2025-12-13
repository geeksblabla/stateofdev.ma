import { useLanguage } from "@/lib/language-context";

export function LanguagePicker() {
  // Use the URL-based hook for current language
  const lang = useLanguage();

  const handleLanguageChange = (newLang: "en" | "ar") => {
    const url = new URL(window.location.href);
    url.searchParams.set("lang", newLang);
    window.location.href = url.toString();
  };

  return (
    <div className="flex gap-4 justify-center mb-8">
      <button
        type="button"
        onClick={() => handleLanguageChange("en")}
        className={`px-6 py-3 font-medium border-2 transition ${
          lang === "en"
            ? "bg-primary text-primary-foreground border-primary"
            : "bg-background text-foreground border-border hover:border-primary"
        }`}
        aria-label="Switch to English"
        aria-pressed={lang === "en"}
      >
        English
      </button>
      <button
        type="button"
        onClick={() => handleLanguageChange("ar")}
        className={`px-6 py-3 font-medium border-2 transition ${
          lang === "ar"
            ? "bg-primary text-primary-foreground border-primary"
            : "bg-background text-foreground border-border hover:border-primary"
        }`}
        aria-label="التبديل إلى العربية"
        aria-pressed={lang === "ar"}
      >
        العربية
      </button>
    </div>
  );
}
