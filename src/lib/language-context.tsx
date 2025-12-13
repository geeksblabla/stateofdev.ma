import { useMemo } from "react";

export type Language = "en" | "ar";

/**
 * Hook to get current language from URL parameter
 * Reads ?lang=ar or ?lang=en from the URL
 * Defaults to 'en' if not specified or invalid
 */
export function useLanguage(): Language {
  return useMemo(() => {
    if (typeof window === "undefined")
      return "en";

    const params = new URLSearchParams(window.location.search);
    const lang = params.get("lang");

    if (lang === "ar" || lang === "en") {
      return lang;
    }

    return "en";
  }, []);
}
