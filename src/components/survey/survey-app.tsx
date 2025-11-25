import { SurveyProvider } from "./survey-context";
import { SurveyForm } from "./survey-form";
import type { SurveyQuestionsYamlFile } from "@/lib/validators/survey-schema";

type Props = {
  questions: SurveyQuestionsYamlFile[];
};

export const SurveyApp = ({ questions }: Props) => {
  return (
    <SurveyProvider sections={questions}>
      <SurveyForm />
    </SurveyProvider>
  );
};
