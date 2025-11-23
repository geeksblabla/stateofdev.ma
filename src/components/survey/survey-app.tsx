import { SurveyProvider } from "./survey-context";
import { SurveyForm } from "./survey-form";

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
