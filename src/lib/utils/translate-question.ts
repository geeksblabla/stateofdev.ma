import type { Lang, TranslationValue } from "@/constants/translations";
import type { SurveyQuestion, SurveyQuestionsYamlFile } from "@/lib/validators/survey-schema";
import { t } from "@/constants/translations";

/**
 * Translate question label and choices based on language
 * @param question - Survey question with potentially bilingual content
 * @param lang - Target language
 * @returns Question with translated label and choices as strings
 */
export function translateQuestion(
  question: SurveyQuestion,
  lang: Lang
): SurveyQuestion & { label: string; choices: string[] } {
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

/**
 * Translate entire survey file
 * @param file - Survey file with potentially bilingual content
 * @param lang - Target language
 * @returns Survey file with all content translated to strings
 */
export function translateSurveyFile(
  file: SurveyQuestionsYamlFile,
  lang: Lang
): SurveyQuestionsYamlFile & { title: string; questions: Array<SurveyQuestion & { label: string; choices: string[] }> } {
  return {
    ...file,
    title: translateSectionTitle(file.title as TranslationValue, lang),
    questions: file.questions.map(q => translateQuestion(q, lang))
  };
}
