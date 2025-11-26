import type { SurveyQuestionsYamlFile } from "@/lib/validators/survey-schema";
import { SurveyProvider } from "./survey-context";
import { SurveyForm } from "./survey-form";

interface Props {
  questions: SurveyQuestionsYamlFile[];
}

export function SurveyApp({ questions }: Props) {
  return (
    <SurveyProvider sections={questions}>
      <SurveyForm />
    </SurveyProvider>
  );
}
