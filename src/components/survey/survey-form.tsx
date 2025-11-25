import { Steps } from "./steps";
import { Question } from "./question";
import { SurveyMachineContext } from "./survey-context";
import { SurveyActions } from "./survey-controls";

const QUESTION_CONTAINER_MIN_HEIGHT = "300px";

export const SurveyForm = () => {
  const actorRef = SurveyMachineContext.useActorRef();

  // Select all needed state
  const context = SurveyMachineContext.useSelector((state) => state.context);

  // Compute derived state
  const currentSection = context.sections[context.currentSectionIdx];
  const currentQuestion = currentSection?.questions[context.currentQuestionIdx];

  const questionId = `${currentSection.label}-q-${context.currentQuestionIdx}`;

  const handleAnswerChange = (value: number | number[] | null | string) => {
    actorRef.send({
      type: "ANSWER_CHANGE",
      questionId,
      value
    });
  };

  const handleOthersChange = (value: string) => {
    actorRef.send({
      type: "ANSWER_CHANGE",
      questionId: `${questionId}-others`,
      value
    });
  };

  if (!currentSection || !currentQuestion) {
    return null;
  }

  return (
    <div className="min-h-screen pt-10">
      <Steps />
      <main className="flex flex-1 justify-center items-center">
        <div
          id={currentSection.label}
          className="md:w-[700px] w-full px-4 md:px-0"
        >
          <div
            className="mb-10 min-h-screen transition-all duration-1000"
            style={{
              minHeight: `min(${QUESTION_CONTAINER_MIN_HEIGHT}, 100vh)`
            }}
          >
            <Question
              selected={true}
              question={currentQuestion}
              index={context.currentQuestionIdx}
              key={questionId}
              sectionId={currentSection.label}
              value={
                context.answers[questionId] as
                  | number
                  | number[]
                  | null
                  | undefined
              }
              othersValue={
                context.answers[`${questionId}-others`] as string | undefined
              }
              onAnswerChange={handleAnswerChange}
              onOthersChange={handleOthersChange}
            />
          </div>

          <SurveyActions />
        </div>
      </main>
    </div>
  );
};
