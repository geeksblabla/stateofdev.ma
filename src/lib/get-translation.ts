export type TranslatableField = string | { en: string; ar?: string };

/**
 * Get translation for a field based on language
 * @param field - Plain string or object with en/ar keys
 * @param lang - Language code ('en' or 'ar')
 * @returns Translated string (falls back to English if Arabic missing)
 */
export function getTranslation(
  field: TranslatableField,
  lang: "en" | "ar"
): string {
  // Backward compatible: plain string treated as English
  if (typeof field === "string") {
    return field;
  }

  // Object: use requested language, fallback to English
  return field[lang] || field.en;
}
