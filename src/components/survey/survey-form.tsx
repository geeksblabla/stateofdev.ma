import { useState, useMemo } from "react";
import LoadingBar from "react-top-loading-bar";
import { Steps } from "./steps";
import Section from "./section";
import { goToThanksPage } from "./utils";

type Props = {
  questions: SurveyQuestionsYamlFile[];
};

export const SurveyForm = ({ questions }: Props) => {
  const [index, setIndex] = useState(0);
  const [progress, setPr] = useState(0);

  const section = questions[index];
  const totalQuestions = useMemo(
    () =>
      questions.reduce((previousValue: number, currentValue: any) => {
        return previousValue + currentValue.questions.length;
      }, 0),
    [questions]
  );
  const setProgress = (n: number) => {
    const step = 100 / totalQuestions;
    setPr(progress + step * n);
  };

  const next = () => {
    if (index + 1 < questions.length) {
      setIndex((prv) => prv + 1);
    } else {
      goToThanksPage();
    }
  };

  return (
    <div className="min-h-screen pt-10">
      <Steps selectedIndex={index} />
      <LoadingBar color="#3dbe71" progress={progress} height={10} />
      <main className="flex flex-1 justify-center items-center">
        <Section
          section={section}
          next={next}
          key={section.label}
          setProgress={setProgress}
        />
      </main>
    </div>
  );
};