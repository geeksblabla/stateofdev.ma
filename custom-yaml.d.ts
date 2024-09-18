/**
 * This file is used to define the types for the results.json and questions.json files
 * Mainly to prevent code editor from loading typing from json files which is can be very heavy
 */

type SurveyQuestion = {
  label: string;
  choices: string[];
  multiple: boolean | null;
  required: boolean | null;
};

type SurveyQuestionsYamlFile = {
  title: string;
  label: string;
  position: number;
  questions: SurveyQuestion[];
};

declare module "@/survey/*.yml" {
  const value: SurveyQuestionsYamlFile;
  export default value;
}
