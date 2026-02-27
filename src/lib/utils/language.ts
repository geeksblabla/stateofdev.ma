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
