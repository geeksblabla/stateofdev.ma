import { useMemo } from "react";
import { Steps } from "./steps";
import { Question } from "./question";
import { SurveyMachineContext } from "./survey-context";
import { ErrorMessage, BackButton } from "./survey-controls";

const QUESTION_CONTAINER_MIN_HEIGHT = "300px";

export const SurveyForm = () => {
  const actorRef = SurveyMachineContext.useActorRef();

  // Select all needed state
  const context = SurveyMachineContext.useSelector((state) => state.context);
  const isSubmitting = SurveyMachineContext.useSelector((state) =>
    state.matches("submitting")
  );

  // Compute derived state
  const currentSection = context.sections[context.currentSectionIdx];
  const currentQuestion = currentSection?.questions[context.currentQuestionIdx];

  const sectionsLabels = useMemo(
    () => context.sections.map((q) => q.label),
    [context.sections]
  );

  const isRequired = !!currentQuestion?.required;
  const canGoBack =
    context.currentSectionIdx > 0 || context.currentQuestionIdx > 0;

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

  const handleNext = () => {
    // If no answer selected for multiple choice, set to empty array
    const currentAnswer = context.answers[questionId];
    if (currentAnswer === undefined && currentQuestion.multiple) {
      actorRef.send({
        type: "ANSWER_CHANGE",
        questionId,
        value: []
      });
    }
    actorRef.send({ type: "NEXT" });
  };

  const handleSkip = () => {
    // Set answer to null for single choice or [] for multiple choice when skipping
    const value = currentQuestion.multiple ? [] : null;
    actorRef.send({
      type: "ANSWER_CHANGE",
      questionId,
      value
    });
    actorRef.send({ type: "SKIP" });
  };

  const handleBack = () => {
    actorRef.send({ type: "BACK" });
  };

  const handleSectionClick = (sectionIdx: number) => {
    actorRef.send({ type: "GO_TO_SECTION", sectionIdx });
  };

  if (!currentSection || !currentQuestion) {
    return null;
  }

  return (
    <div className="min-h-screen pt-10">
      <Steps
        selectedIndex={context.currentSectionIdx}
        sections={sectionsLabels}
        onStepClick={handleSectionClick}
      />
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

          <div className="relative flex flex-row justify-between mt-3 sticky bottom-0 bg-background py-4 border-t-2 border-border z-20 transition-all duration-1000">
            <ErrorMessage
              error={context.error}
              onClose={() => actorRef.send({ type: "CLEAR_ERROR" })}
            />
            <div>{canGoBack && <BackButton onClick={handleBack} />}</div>
            <div className="relative">
              {!isRequired && (
                <button
                  type="button"
                  className="focus:outline-4 bg-background px-6 md:px-8 py-3 font-medium text-primary underline border-border transition mr-2"
                  onClick={handleSkip}
                  data-testid="skip-button"
                >
                  Skip
                </button>
              )}
              <button
                data-testid="next-button"
                type="button"
                className="px-4 py-2 min-w-[120px] bg-primary text-primary-foreground border-2 border-primary transition hover:opacity-90"
                onClick={handleNext}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Loading..." : "Next"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
