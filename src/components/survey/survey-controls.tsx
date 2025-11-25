import { SurveyMachineContext } from "./survey-context";
import { hasPrevVisibleQuestion } from "@/lib/conditions";

type ErrorMessageProps = {
  error: string | null;
  onClose: () => void;
};

export const ErrorMessage = ({ error, onClose }: ErrorMessageProps) => {
  if (!error) return null;
  return (
    <div
      role="alert"
      aria-live="assertive"
      data-testid="error-message"
      className="absolute bottom-full left-0 right-0 mb-3 flex justify-center animate-slide-shake"
    >
      <div className="bg-destructive text-destructive-foreground px-5 py-3.5 rounded-md shadow-xl border-l-4 border-destructive flex items-center gap-3 max-w-[90%] md:max-w-[500px] relative pr-12">
        <svg
          className="w-6 h-6 flex-shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
        <span className="text-sm font-semibold flex-1">{error}</span>
        <button
          onClick={onClose}
          className="absolute top-1/2 -translate-y-1/2 right-3 w-6 h-6 flex items-center justify-center hover:bg-destructive-foreground/20 rounded transition-colors"
          aria-label="Close error"
          data-testid="error-close-button"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

type BackButtonProps = {
  onClick: () => void;
};

export const BackButton = ({ onClick }: BackButtonProps) => (
  <div
    onClick={onClick}
    data-testid="back-button"
    className="group flex w-full cursor-pointer items-center justify-center bg-transparent pr-6 py-2 text-muted-foreground hover:text-foreground transition"
  >
    <svg
      className="flex-0 ml-4 h-7 w-7 transition-all group-hover:-translate-x-1 rotate-180"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="3"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14 5l7 7m0 0l-7 7m7-7H3"
      />
    </svg>
    <span className="group flex w-full items-center justify-center rounded py-1 text-center font-medium">
      Back
    </span>
  </div>
);

export const SurveyActions = () => {
  const actorRef = SurveyMachineContext.useActorRef();

  const context = SurveyMachineContext.useSelector((state) => state.context);
  const isSubmitting = SurveyMachineContext.useSelector((state) =>
    state.matches("submitting")
  );

  const currentSection = context.sections[context.currentSectionIdx];
  const currentQuestion = currentSection?.questions[context.currentQuestionIdx];

  const isRequired = !!currentQuestion?.required;
  const canGoBack =
    context.visibleSectionIndices.indexOf(context.currentSectionIdx) > 0 ||
    hasPrevVisibleQuestion(
      currentSection.questions,
      context.currentQuestionIdx,
      context.answers
    );

  const questionId = `${currentSection.label}-q-${context.currentQuestionIdx}`;

  const handleNext = () => {
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

  return (
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
  );
};
