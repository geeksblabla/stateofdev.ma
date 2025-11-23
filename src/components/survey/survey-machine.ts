import { setup, assign, fromPromise } from "xstate";
import { submitAnswers, goToThanksPage } from "./utils";

const ERROR_TIMEOUT_MS = 3000;

export type SurveyContext = {
  sections: SurveyQuestionsYamlFile[];
  currentSectionIdx: number;
  currentQuestionIdx: number;
  answers: Record<string, number | number[] | null | string>;
  error: string | null;
};

export type SurveyEvents =
  | { type: "NEXT" }
  | { type: "BACK" }
  | { type: "SKIP" }
  | {
      type: "ANSWER_CHANGE";
      questionId: string;
      value: number | number[] | null | string;
    }
  | { type: "GO_TO_SECTION"; sectionIdx: number }
  | { type: "GO_TO_QUESTION"; sectionIdx: number; questionIdx: number }
  | { type: "CLEAR_ERROR" };

export const ERRORS = {
  none: null,
  required: "Please select an option.",
  submission: "Error submitting your answers, please try again."
} as const;

// Normalize answers for backend submission
const normalizeAnswers = (
  answers: Record<string, number | number[] | null | string | boolean>
) => {
  const convertedAnswers: Record<string, number | number[] | null | string> =
    {};

  for (const [key, value] of Object.entries(answers)) {
    if (key.endsWith("others")) {
      convertedAnswers[key] =
        typeof value === "string" ? value.slice(0, 200) : "";
    } else if (value === null) {
      convertedAnswers[key] = null;
    } else if (Array.isArray(value)) {
      convertedAnswers[key] = value;
    } else if (typeof value === "boolean") {
      // skipping a question with multiple choices will return boolean
      convertedAnswers[key] = [];
    } else {
      convertedAnswers[key] = value;
    }
  }

  return convertedAnswers;
};

// Scroll to section on mobile
const scrollToSection = (selector: string) => {
  if (document.body.clientWidth < 600) {
    document.querySelector(selector)?.scrollIntoView?.({ behavior: "smooth" });
  }
};

export const surveyMachine = setup({
  types: {
    context: {} as SurveyContext,
    events: {} as SurveyEvents,
    input: {} as {
      sections: SurveyQuestionsYamlFile[];
      persisted?: Partial<SurveyContext>;
    }
  },
  guards: {
    isRequiredAndEmpty: ({ context }) => {
      const section = context.sections[context.currentSectionIdx];
      const question = section.questions[context.currentQuestionIdx];
      if (!question.required) return false;

      const questionId = `${section.label}-q-${context.currentQuestionIdx}`;
      const value = context.answers[questionId];
      return value === null || value === undefined;
    },
    isLastQuestion: ({ context }) => {
      const section = context.sections[context.currentSectionIdx];
      return context.currentQuestionIdx === section.questions.length - 1;
    },
    isNotLastQuestion: ({ context }) => {
      const section = context.sections[context.currentSectionIdx];
      return context.currentQuestionIdx < section.questions.length - 1;
    },
    isLastSection: ({ context }) => {
      return context.currentSectionIdx === context.sections.length - 1;
    },
    isNotLastSection: ({ context }) => {
      return context.currentSectionIdx < context.sections.length - 1;
    },
    canGoBackInSection: ({ context }) => {
      return context.currentQuestionIdx > 0;
    },
    canGoBackToSection: ({ context }) => {
      return context.currentQuestionIdx === 0 && context.currentSectionIdx > 0;
    }
  },
  actions: {
    updateAnswer: assign({
      answers: ({ context, event }) => {
        if (event.type !== "ANSWER_CHANGE") return context.answers;
        return {
          ...context.answers,
          [event.questionId]: event.value
        };
      }
    }),
    incrementQuestion: assign({
      currentQuestionIdx: ({ context }) => context.currentQuestionIdx + 1
    }),
    decrementQuestion: assign({
      currentQuestionIdx: ({ context }) => context.currentQuestionIdx - 1
    }),
    incrementSection: assign({
      currentSectionIdx: ({ context }) => context.currentSectionIdx + 1,
      currentQuestionIdx: 0
    }),
    goToLastQuestionInPreviousSection: assign({
      currentSectionIdx: ({ context }) => context.currentSectionIdx - 1,
      currentQuestionIdx: ({ context }) => {
        const prevSection = context.sections[context.currentSectionIdx - 1];
        return prevSection.questions.length - 1;
      }
    }),
    setRequiredError: assign({
      error: ERRORS.required
    }),
    setSubmissionError: assign({
      error: ERRORS.submission
    }),
    clearError: assign({
      error: ERRORS.none
    }),
    scrollToTop: () => {
      scrollToSection("#steps");
    },
    goToThanksPage,
    goToSection: assign({
      currentSectionIdx: ({ event }) => {
        if (event.type !== "GO_TO_SECTION") return 0;
        return event.sectionIdx;
      },
      currentQuestionIdx: 0
    }),
    goToQuestion: assign({
      currentSectionIdx: ({ event }) => {
        if (event.type !== "GO_TO_QUESTION") return 0;
        return event.sectionIdx;
      },
      currentQuestionIdx: ({ event }) => {
        if (event.type !== "GO_TO_QUESTION") return 0;
        return event.questionIdx;
      }
    })
  },
  actors: {
    submitSection: fromPromise(
      async ({
        input
      }: {
        input: { answers: Record<string, number | number[] | null | string> };
      }) => {
        const normalizedAnswers = normalizeAnswers(input.answers);
        const result = await submitAnswers({ answers: normalizedAnswers });
        if (result.error) {
          throw new Error("Submission failed");
        }
        return result;
      }
    )
  },
  delays: {
    ERROR_TIMEOUT: ERROR_TIMEOUT_MS
  }
}).createMachine({
  id: "survey",
  initial: "answering",
  context: ({ input }) => ({
    sections: input.sections,
    currentSectionIdx: input.persisted?.currentSectionIdx ?? 0,
    currentQuestionIdx: input.persisted?.currentQuestionIdx ?? 0,
    answers: input.persisted?.answers ?? {},
    error: null
  }),
  states: {
    answering: {
      after: {
        ERROR_TIMEOUT: {
          guard: ({ context }) => context.error !== null,
          actions: ["clearError"]
        }
      },
      on: {
        CLEAR_ERROR: {
          actions: ["clearError"]
        },
        ANSWER_CHANGE: {
          actions: ["updateAnswer", "clearError"]
        },
        NEXT: [
          {
            guard: "isRequiredAndEmpty",
            target: "answering",
            reenter: true,
            actions: ["setRequiredError"]
          },
          {
            guard: "isLastQuestion",
            target: "submitting",
            actions: ["clearError"]
          },
          {
            guard: "isNotLastQuestion",
            actions: ["incrementQuestion", "scrollToTop", "clearError"]
          }
        ],
        SKIP: [
          {
            guard: "isLastQuestion",
            target: "submitting",
            actions: ["clearError"]
          },
          {
            guard: "isNotLastQuestion",
            actions: ["incrementQuestion", "scrollToTop", "clearError"]
          }
        ],
        BACK: [
          {
            guard: "canGoBackInSection",
            actions: ["decrementQuestion", "scrollToTop", "clearError"]
          },
          {
            guard: "canGoBackToSection",
            actions: [
              "goToLastQuestionInPreviousSection",
              "scrollToTop",
              "clearError"
            ]
          }
        ],
        GO_TO_SECTION: {
          actions: ["goToSection", "scrollToTop", "clearError"]
        },
        GO_TO_QUESTION: {
          actions: ["goToQuestion", "scrollToTop", "clearError"]
        }
      }
    },
    submitting: {
      invoke: {
        src: "submitSection",
        input: ({ context }) => ({
          answers: context.answers
        }),
        onDone: [
          {
            guard: "isLastSection",
            target: "complete"
          },
          {
            guard: "isNotLastSection",
            target: "answering",
            actions: ["incrementSection", "scrollToTop"]
          }
        ],
        onError: {
          target: "answering",
          actions: ["setSubmissionError"]
        }
      }
    },
    complete: {
      type: "final",
      entry: ["goToThanksPage"]
    }
  }
});
