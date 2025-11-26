import type { SurveyQuestionsYamlFile } from "@/lib/validators/survey-schema";
import { assign, fromPromise, setup } from "xstate";
import {
  getFirstVisibleQuestionIndex,
  getLastVisibleQuestionIndex,
  getNextVisibleQuestionIndex,
  getPrevVisibleQuestionIndex,
  getVisibleSectionIndices,
  hasNextVisibleQuestion,
  hasPrevVisibleQuestion
} from "@/lib/conditions";
import { goToThanksPage, submitAnswers } from "./utils";

const ERROR_TIMEOUT_MS = 3000;

export interface SurveyContext {
  sections: SurveyQuestionsYamlFile[];
  currentSectionIdx: number;
  currentQuestionIdx: number;
  answers: Record<string, number | number[] | null | string>;
  error: string | null;
  visibleSectionIndices: number[];
}

export type SurveyEvents
  = | { type: "NEXT" }
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
function normalizeAnswers(answers: Record<string, number | number[] | null | string | boolean>) {
  const convertedAnswers: Record<string, number | number[] | null | string>
    = {};

  for (const [key, value] of Object.entries(answers)) {
    if (key.endsWith("others")) {
      convertedAnswers[key]
        = typeof value === "string" ? value.slice(0, 200) : "";
    }
    else if (value === null) {
      convertedAnswers[key] = null;
    }
    else if (Array.isArray(value)) {
      convertedAnswers[key] = value;
    }
    else if (typeof value === "boolean") {
      // skipping a question with multiple choices will return boolean
      convertedAnswers[key] = [];
    }
    else {
      convertedAnswers[key] = value;
    }
  }

  return convertedAnswers;
}

// Scroll to section on mobile
function scrollToSection(selector: string) {
  if (document.body.clientWidth < 600) {
    document.querySelector(selector)?.scrollIntoView?.({ behavior: "smooth" });
  }
}

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
      if (!question.required)
        return false;

      const questionId = `${section.label}-q-${context.currentQuestionIdx}`;
      const value = context.answers[questionId];
      return value == null || (Array.isArray(value) && !value.length);
    },
    isLastQuestion: ({ context }) => {
      const section = context.sections[context.currentSectionIdx];
      return !hasNextVisibleQuestion(
        section.questions,
        context.currentQuestionIdx,
        context.answers
      );
    },
    isNotLastQuestion: ({ context }) => {
      const section = context.sections[context.currentSectionIdx];
      return hasNextVisibleQuestion(
        section.questions,
        context.currentQuestionIdx,
        context.answers
      );
    },
    isLastSection: ({ context }) => {
      return (
        context.currentSectionIdx
        === context.visibleSectionIndices[context.visibleSectionIndices.length - 1]
      );
    },
    isNotLastSection: ({ context }) => {
      return (
        context.currentSectionIdx
        !== context.visibleSectionIndices[context.visibleSectionIndices.length - 1]
      );
    },
    canGoBackInSection: ({ context }) => {
      const section = context.sections[context.currentSectionIdx];
      return hasPrevVisibleQuestion(
        section.questions,
        context.currentQuestionIdx,
        context.answers
      );
    },
    canGoBackToSection: ({ context }) => {
      const section = context.sections[context.currentSectionIdx];
      const hasPrevInSection = hasPrevVisibleQuestion(
        section.questions,
        context.currentQuestionIdx,
        context.answers
      );
      const currentVisibleSectionIdx = context.visibleSectionIndices.indexOf(
        context.currentSectionIdx
      );
      return !hasPrevInSection && currentVisibleSectionIdx > 0;
    }
  },
  actions: {
    computeVisibleIndices: assign({
      visibleSectionIndices: ({ context }) =>
        getVisibleSectionIndices(context.sections, context.answers)
    }),
    updateAnswer: assign({
      answers: ({ context, event }) => {
        if (event.type !== "ANSWER_CHANGE")
          return context.answers;
        return {
          ...context.answers,
          [event.questionId]: event.value
        };
      }
    }),
    incrementQuestion: assign({
      currentQuestionIdx: ({ context }) => {
        const section = context.sections[context.currentSectionIdx];
        const next = getNextVisibleQuestionIndex(
          section.questions,
          context.currentQuestionIdx,
          context.answers
        );
        return next ?? context.currentQuestionIdx;
      }
    }),
    decrementQuestion: assign({
      currentQuestionIdx: ({ context }) => {
        const section = context.sections[context.currentSectionIdx];
        const prev = getPrevVisibleQuestionIndex(
          section.questions,
          context.currentQuestionIdx,
          context.answers
        );
        return prev ?? context.currentQuestionIdx;
      }
    }),
    incrementSection: assign({
      currentSectionIdx: ({ context }) => {
        const currentIdx = context.visibleSectionIndices.indexOf(
          context.currentSectionIdx
        );
        const nextVisibleIdx = context.visibleSectionIndices[currentIdx + 1];
        return nextVisibleIdx ?? context.currentSectionIdx;
      },
      currentQuestionIdx: ({ context }) => {
        const currentIdx = context.visibleSectionIndices.indexOf(
          context.currentSectionIdx
        );
        const nextSectionIdx = context.visibleSectionIndices[currentIdx + 1];
        if (nextSectionIdx != null) {
          const nextSection = context.sections[nextSectionIdx];
          const firstVisible = getFirstVisibleQuestionIndex(
            nextSection.questions,
            context.answers
          );
          return firstVisible ?? 0;
        }
        return 0;
      }
    }),
    goToLastQuestionInPreviousSection: assign({
      currentSectionIdx: ({ context }) => {
        const currentIdx = context.visibleSectionIndices.indexOf(
          context.currentSectionIdx
        );
        const prevVisibleIdx = context.visibleSectionIndices[currentIdx - 1];
        return prevVisibleIdx ?? context.currentSectionIdx;
      },
      currentQuestionIdx: ({ context }) => {
        const currentIdx = context.visibleSectionIndices.indexOf(
          context.currentSectionIdx
        );
        const prevSectionIdx = context.visibleSectionIndices[currentIdx - 1];
        if (prevSectionIdx != null) {
          const prevSection = context.sections[prevSectionIdx];
          const lastVisible = getLastVisibleQuestionIndex(
            prevSection.questions,
            context.answers
          );
          return lastVisible ?? 0;
        }
        return 0;
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
        if (event.type !== "GO_TO_SECTION")
          return 0;
        return event.sectionIdx;
      },
      currentQuestionIdx: 0
    }),
    goToQuestion: assign({
      currentSectionIdx: ({ event }) => {
        if (event.type !== "GO_TO_QUESTION")
          return 0;
        return event.sectionIdx;
      },
      currentQuestionIdx: ({ event }) => {
        if (event.type !== "GO_TO_QUESTION")
          return 0;
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
  context: ({ input }) => {
    const sections = input.sections;
    const answers = input.persisted?.answers ?? {};

    return {
      sections,
      currentSectionIdx: input.persisted?.currentSectionIdx ?? 0,
      currentQuestionIdx: input.persisted?.currentQuestionIdx ?? 0,
      answers,
      error: null,
      visibleSectionIndices: getVisibleSectionIndices(sections, answers)
    };
  },
  states: {
    answering: {
      entry: ["computeVisibleIndices"],
      after: {
        ERROR_TIMEOUT: {
          guard: ({ context }) => !!context.error,
          actions: ["clearError"]
        }
      },
      on: {
        CLEAR_ERROR: {
          actions: ["clearError"]
        },
        ANSWER_CHANGE: {
          actions: ["updateAnswer", "computeVisibleIndices", "clearError"]
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
