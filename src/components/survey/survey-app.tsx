import type { Lang } from "@/constants/translations";
import type { SurveyQuestionsYamlFile } from "@/lib/validators/survey-schema";
import { SurveyProvider } from "./survey-context";
import { SurveyForm } from "./survey-form";

interface Props {
  questions: SurveyQuestionsYamlFile[];
  lang: Lang;
}

export function SurveyApp({ questions, lang }: Props) {
  return (
    <SurveyProvider sections={questions} lang={lang}>
      <SurveyForm />
    </SurveyProvider>
  );
}
