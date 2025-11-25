/**
 * Module declaration for YAML imports
 * Types are now imported from @/lib/validators/survey-schema (Zod-inferred)
 */

declare module "@/survey/*.yml" {
  import type { SurveyQuestionsYamlFile } from "@/lib/validators/survey-schema";
  const value: SurveyQuestionsYamlFile;
  export default value;
}
