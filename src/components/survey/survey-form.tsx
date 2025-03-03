import { useCallback, useEffect, useMemo, useState } from "react";
import LoadingBar from "react-top-loading-bar";
import { Steps } from "./steps";
import Section from "./section";
import { goToThanksPage } from "./utils";

type Props = {
  questions: SurveyQuestionsYamlFile[];
};

export const SurveyForm = ({ questions }: Props) => {
  const savedSectionIndex = parseInt(
    localStorage.getItem("savedSelectedSectionIndex") || "0"
  );
  const [selectedSectionIndex, setSelectedSectionIndex] =
    useState(savedSectionIndex);
  const [progress, setPr] = useState(0);

  useEffect(() => {
    localStorage.setItem(
      "savedSelectedSectionIndex",
      selectedSectionIndex.toString()
    );
  }, [selectedSectionIndex]);

  const section = useMemo(
    () => questions[selectedSectionIndex],
    [questions, selectedSectionIndex]
  );
  const totalQuestions = useMemo(
    () =>
      questions.reduce(
        (previousValue: number, currentValue: SurveyQuestionsYamlFile) => {
          return previousValue + currentValue.questions.length;
        },
        0
      ),
    [questions]
  );

  const sectionsLabels = useMemo(
    () => questions.map((question) => question.label),
    [questions]
  );
  const setProgress = useCallback(
    (n: number) => {
      const step = 100 / totalQuestions;
      setPr((prv) => prv + step * n);
    },
    [progress, totalQuestions]
  );

  const next = useCallback(() => {
    if (selectedSectionIndex + 1 < questions.length) {
      setSelectedSectionIndex((prv) => prv + 1);
      localStorage.setItem("savedQIndex", "0");
    } else {
      goToThanksPage();
    }
  }, [questions, selectedSectionIndex]);

  return (
    <div className="min-h-screen pt-10">
      <Steps selectedIndex={selectedSectionIndex} sections={sectionsLabels} />
      <LoadingBar color="#3dbe71" progress={progress} height={10} />
      <main className="flex flex-1 justify-center items-center">
        <Section
          section={section}
          next={next}
          key={section.label}
          setProgress={setProgress}
          questions={questions}
        />
      </main>
    </div>
  );
};
