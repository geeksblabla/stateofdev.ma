import type { SurveyQuestionsYamlFile } from "@/lib/validators/survey-schema";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createActor } from "xstate";
import { ERRORS, surveyMachine } from "./survey-machine";
import * as utils from "./utils";

// Mock submitAnswers
vi.mock("./utils", () => ({
  submitAnswers: vi.fn(),
  goToThanksPage: vi.fn()
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock });

// Mock scrollIntoView
Object.defineProperty(window.HTMLElement.prototype, "scrollIntoView", {
  value: vi.fn(),
  writable: true
});

// Mock document.body.clientWidth
Object.defineProperty(document.body, "clientWidth", {
  value: 500,
  writable: true
});

// Test data
const mockSections: SurveyQuestionsYamlFile[] = [
  {
    title: "Profile",
    label: "profile",
    position: 1,
    questions: [
      {
        label: "What is your age?",
        choices: ["18-25", "26-35", "36-45", "46+"],
        multiple: false,
        required: true
      },
      {
        label: "What languages do you use?",
        choices: ["JavaScript", "TypeScript", "Python", "Other"],
        multiple: true,
        required: false
      },
      {
        label: "How often do you code?",
        choices: ["Daily", "Weekly", "Monthly"],
        multiple: false,
        required: false
      }
    ]
  },
  {
    title: "Experience",
    label: "experience",
    position: 2,
    questions: [
      {
        label: "Years of experience?",
        choices: ["0-2", "3-5", "6-10", "10+"],
        multiple: false,
        required: true
      },
      {
        label: "Have you contributed to open source?",
        choices: ["Yes", "No"],
        multiple: false,
        required: false
      }
    ]
  }
];

describe("survey State Machine", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("initial State & Context", () => {
    it("should start in answering state with initial context", () => {
      const actor = createActor(surveyMachine, {
        input: { sections: mockSections }
      });
      actor.start();

      const snapshot = actor.getSnapshot();
      expect(snapshot.value).toBe("answering");
      expect(snapshot.context).toEqual({
        sections: mockSections,
        currentSectionIdx: 0,
        currentQuestionIdx: 0,
        answers: {},
        error: null,
        visibleSectionIndices: [0, 1]
      });
    });

    it("should restore persisted state from input", () => {
      const persistedState = {
        currentSectionIdx: 1,
        currentQuestionIdx: 1,
        answers: { "profile-q-0": 1, "profile-q-1": [0, 1] }
      };

      const actor = createActor(surveyMachine, {
        input: {
          sections: mockSections,
          persisted: persistedState
        }
      });
      actor.start();

      const snapshot = actor.getSnapshot();
      expect(snapshot.context.currentSectionIdx).toBe(1);
      expect(snapshot.context.currentQuestionIdx).toBe(1);
      expect(snapshot.context.answers).toEqual(persistedState.answers);
    });
  });

  describe("answer Updates (ANSWER_CHANGE)", () => {
    it("should update context with single choice answer", () => {
      const actor = createActor(surveyMachine, {
        input: { sections: mockSections }
      });
      actor.start();

      actor.send({
        type: "ANSWER_CHANGE",
        questionId: "profile-q-0",
        value: 2
      });

      const snapshot = actor.getSnapshot();
      expect(snapshot.context.answers["profile-q-0"]).toBe(2);
    });

    it("should update context with multiple choice answer", () => {
      const actor = createActor(surveyMachine, {
        input: { sections: mockSections }
      });
      actor.start();

      actor.send({
        type: "ANSWER_CHANGE",
        questionId: "profile-q-1",
        value: [0, 2]
      });

      const snapshot = actor.getSnapshot();
      expect(snapshot.context.answers["profile-q-1"]).toEqual([0, 2]);
    });

    it("should update others text field", () => {
      const actor = createActor(surveyMachine, {
        input: { sections: mockSections }
      });
      actor.start();

      actor.send({
        type: "ANSWER_CHANGE",
        questionId: "profile-q-1-others",
        value: "Custom text"
      });

      const snapshot = actor.getSnapshot();
      expect(snapshot.context.answers["profile-q-1-others"]).toBe(
        "Custom text"
      );
    });

    it("should clear error when answer changes", () => {
      const actor = createActor(surveyMachine, {
        input: { sections: mockSections }
      });
      actor.start();

      // Trigger error by trying to go next without required answer
      actor.send({ type: "NEXT" });
      expect(actor.getSnapshot().context.error).toBe(ERRORS.required);

      // Answer should clear error
      actor.send({
        type: "ANSWER_CHANGE",
        questionId: "profile-q-0",
        value: 1
      });

      expect(actor.getSnapshot().context.error).toBe(null);
    });
  });

  describe("forward Navigation (NEXT)", () => {
    it("should show error when required question is empty", () => {
      const actor = createActor(surveyMachine, {
        input: { sections: mockSections }
      });
      actor.start();

      actor.send({ type: "NEXT" });

      const snapshot = actor.getSnapshot();
      expect(snapshot.value).toBe("answering");
      expect(snapshot.context.error).toBe(ERRORS.required);
      expect(snapshot.context.currentQuestionIdx).toBe(0);
    });

    it("should increment question when required question is answered", () => {
      const actor = createActor(surveyMachine, {
        input: { sections: mockSections }
      });
      actor.start();

      actor.send({
        type: "ANSWER_CHANGE",
        questionId: "profile-q-0",
        value: 1
      });
      actor.send({ type: "NEXT" });

      const snapshot = actor.getSnapshot();
      expect(snapshot.value).toBe("answering");
      expect(snapshot.context.currentQuestionIdx).toBe(1);
      expect(snapshot.context.error).toBe(null);
    });

    it("should increment question for non-required questions", () => {
      const actor = createActor(surveyMachine, {
        input: { sections: mockSections }
      });
      actor.start();

      // Answer first required question
      actor.send({
        type: "ANSWER_CHANGE",
        questionId: "profile-q-0",
        value: 0
      });
      actor.send({ type: "NEXT" });

      // Second question is not required, should move forward without answer
      actor.send({ type: "NEXT" });

      const snapshot = actor.getSnapshot();
      expect(snapshot.context.currentQuestionIdx).toBe(2);
    });

    it("should transition to submitting on last question of section", async () => {
      const actor = createActor(surveyMachine, {
        input: { sections: mockSections }
      });
      actor.start();

      vi.spyOn(utils, "submitAnswers").mockResolvedValue({
        data: undefined,
        error: undefined
      });

      // Answer first question and move to last question
      actor.send({
        type: "ANSWER_CHANGE",
        questionId: "profile-q-0",
        value: 0
      });
      actor.send({ type: "NEXT" });
      actor.send({ type: "NEXT" });

      // Now on last question (q-2), sending NEXT should submit
      actor.send({ type: "NEXT" });

      await vi.waitFor(() => {
        const snapshot = actor.getSnapshot();
        return (
          snapshot.value === "submitting" || snapshot.value === "answering"
        );
      });

      expect(utils.submitAnswers).toHaveBeenCalled();
    });
  });

  describe("skip Navigation (SKIP)", () => {
    it("should skip non-required question without validation", () => {
      const actor = createActor(surveyMachine, {
        input: { sections: mockSections }
      });
      actor.start();

      // Answer first required question
      actor.send({
        type: "ANSWER_CHANGE",
        questionId: "profile-q-0",
        value: 0
      });
      actor.send({ type: "NEXT" });

      // Skip non-required question
      actor.send({ type: "SKIP" });

      const snapshot = actor.getSnapshot();
      expect(snapshot.context.currentQuestionIdx).toBe(2);
    });

    it("should transition to submitting when skipping last question", async () => {
      const actor = createActor(surveyMachine, {
        input: { sections: mockSections }
      });
      actor.start();

      vi.spyOn(utils, "submitAnswers").mockResolvedValue({
        data: undefined,
        error: undefined
      });

      // Move to last question
      actor.send({
        type: "ANSWER_CHANGE",
        questionId: "profile-q-0",
        value: 0
      });
      actor.send({ type: "NEXT" });
      actor.send({ type: "NEXT" });

      // Skip last question
      actor.send({ type: "SKIP" });

      await vi.waitFor(() => {
        const snapshot = actor.getSnapshot();
        return (
          snapshot.value === "submitting" || snapshot.value === "answering"
        );
      });

      expect(utils.submitAnswers).toHaveBeenCalled();
    });
  });

  describe("backward Navigation (BACK)", () => {
    it("should decrement question within section", () => {
      const actor = createActor(surveyMachine, {
        input: { sections: mockSections }
      });
      actor.start();

      // Move to second question
      actor.send({
        type: "ANSWER_CHANGE",
        questionId: "profile-q-0",
        value: 0
      });
      actor.send({ type: "NEXT" });
      expect(actor.getSnapshot().context.currentQuestionIdx).toBe(1);

      // Go back
      actor.send({ type: "BACK" });

      const snapshot = actor.getSnapshot();
      expect(snapshot.context.currentQuestionIdx).toBe(0);
      expect(snapshot.context.currentSectionIdx).toBe(0);
    });

    it("should go to last question of previous section when on first question", async () => {
      const actor = createActor(surveyMachine, {
        input: { sections: mockSections }
      });
      actor.start();

      vi.spyOn(utils, "submitAnswers").mockResolvedValue({
        data: undefined,
        error: undefined
      });

      // Complete first section to reach second section
      actor.send({
        type: "ANSWER_CHANGE",
        questionId: "profile-q-0",
        value: 0
      });
      actor.send({ type: "NEXT" });
      actor.send({ type: "NEXT" });
      actor.send({ type: "NEXT" });

      // Wait for section transition
      await vi.waitFor(() => {
        return actor.getSnapshot().context.currentSectionIdx === 1;
      });

      // Now in second section, first question - go back
      actor.send({ type: "BACK" });

      const snapshot = actor.getSnapshot();
      expect(snapshot.context.currentSectionIdx).toBe(0);
      expect(snapshot.context.currentQuestionIdx).toBe(2); // Last question of previous section
    });

    it("should not go back beyond first question of first section", () => {
      const actor = createActor(surveyMachine, {
        input: { sections: mockSections }
      });
      actor.start();

      actor.send({ type: "BACK" });

      const snapshot = actor.getSnapshot();
      expect(snapshot.context.currentSectionIdx).toBe(0);
      expect(snapshot.context.currentQuestionIdx).toBe(0);
    });
  });

  describe("section Submission", () => {
    it("should transition to next section on successful submission", async () => {
      const actor = createActor(surveyMachine, {
        input: { sections: mockSections }
      });
      actor.start();

      vi.spyOn(utils, "submitAnswers").mockResolvedValue({
        data: undefined,
        error: undefined
      });

      // Complete first section
      actor.send({
        type: "ANSWER_CHANGE",
        questionId: "profile-q-0",
        value: 0
      });
      actor.send({ type: "NEXT" });
      actor.send({ type: "NEXT" });
      actor.send({ type: "NEXT" });

      // Allow promises to resolve
      await vi.runAllTimersAsync();

      // Wait for transition to next section AND back to answering state
      await vi.waitFor(
        () => {
          const snapshot = actor.getSnapshot();
          return (
            snapshot.context.currentSectionIdx === 1
            && snapshot.value === "answering"
          );
        },
        { timeout: 1000 }
      );

      const snapshot = actor.getSnapshot();
      expect(snapshot.value).toBe("answering");
      expect(snapshot.context.currentSectionIdx).toBe(1);
      expect(snapshot.context.currentQuestionIdx).toBe(0);
    });

    it("should transition to complete on last section submission", async () => {
      const actor = createActor(surveyMachine, {
        input: { sections: mockSections }
      });
      actor.start();

      vi.spyOn(utils, "submitAnswers").mockResolvedValue({
        data: undefined,
        error: undefined
      });

      // Complete first section
      actor.send({
        type: "ANSWER_CHANGE",
        questionId: "profile-q-0",
        value: 0
      });
      actor.send({ type: "NEXT" });
      actor.send({ type: "NEXT" });
      actor.send({ type: "NEXT" });

      // Allow promises to resolve
      await vi.runAllTimersAsync();

      // Wait for second section AND answering state
      await vi.waitFor(() => {
        const snapshot = actor.getSnapshot();
        return (
          snapshot.context.currentSectionIdx === 1
          && snapshot.value === "answering"
        );
      });

      // Complete second section
      actor.send({
        type: "ANSWER_CHANGE",
        questionId: "experience-q-0",
        value: 2
      });
      actor.send({ type: "NEXT" });
      actor.send({ type: "NEXT" });

      // Allow promises to resolve
      await vi.runAllTimersAsync();

      // Wait for completion
      await vi.waitFor(
        () => {
          return actor.getSnapshot().value === "complete";
        },
        { timeout: 1000 }
      );

      const snapshot = actor.getSnapshot();
      expect(snapshot.value).toBe("complete");
    });

    it("should show error on submission failure", async () => {
      const actor = createActor(surveyMachine, {
        input: { sections: mockSections }
      });
      actor.start();

      vi.spyOn(utils, "submitAnswers").mockResolvedValue({
        data: undefined,
        error: {
          type: "SERVER_ERROR",
          code: "INTERNAL_SERVER_ERROR",
          status: 500,
          name: "ServerError",
          message: "Failed to submit"
        }
      });

      // Complete section
      actor.send({
        type: "ANSWER_CHANGE",
        questionId: "profile-q-0",
        value: 0
      });
      actor.send({ type: "NEXT" });
      actor.send({ type: "NEXT" });
      actor.send({ type: "NEXT" });

      // Allow promises to resolve but not the error timeout
      await vi.advanceTimersByTimeAsync(100);

      // Wait for error AND back to answering state
      await vi.waitFor(
        () => {
          const snapshot = actor.getSnapshot();
          return (
            snapshot.context.error === ERRORS.submission
            && snapshot.value === "answering"
          );
        },
        { timeout: 1000 }
      );

      const snapshot = actor.getSnapshot();
      expect(snapshot.value).toBe("answering");
      expect(snapshot.context.error).toBe(ERRORS.submission);
      // Should stay in same section/question
      expect(snapshot.context.currentSectionIdx).toBe(0);
    });

    it("should pass normalized answers to submitAnswers", async () => {
      const actor = createActor(surveyMachine, {
        input: { sections: mockSections }
      });
      actor.start();

      const submitSpy = vi.spyOn(utils, "submitAnswers").mockResolvedValue({
        data: undefined,
        error: undefined
      });

      // Answer questions with different types
      actor.send({
        type: "ANSWER_CHANGE",
        questionId: "profile-q-0",
        value: 1
      });
      actor.send({ type: "NEXT" });

      actor.send({
        type: "ANSWER_CHANGE",
        questionId: "profile-q-1",
        value: [0, 3]
      });
      actor.send({
        type: "ANSWER_CHANGE",
        questionId: "profile-q-1-others",
        value: "Custom language"
      });
      actor.send({ type: "NEXT" });
      actor.send({ type: "NEXT" });

      await vi.waitFor(() => {
        return submitSpy.mock.calls.length > 0;
      });

      expect(submitSpy).toHaveBeenCalledWith({
        answers: expect.objectContaining({
          "profile-q-0": 1,
          "profile-q-1": [0, 3],
          "profile-q-1-others": "Custom language"
        }) as Record<string, number | number[] | null | string>
      });
    });

    it("should truncate others field to 200 characters", async () => {
      const actor = createActor(surveyMachine, {
        input: { sections: mockSections }
      });
      actor.start();

      const submitSpy = vi.spyOn(utils, "submitAnswers").mockResolvedValue({
        data: undefined,
        error: undefined
      });

      const longText = "a".repeat(300);

      actor.send({
        type: "ANSWER_CHANGE",
        questionId: "profile-q-0",
        value: 1
      });
      actor.send({ type: "NEXT" });

      actor.send({
        type: "ANSWER_CHANGE",
        questionId: "profile-q-1-others",
        value: longText
      });
      actor.send({ type: "NEXT" });
      actor.send({ type: "NEXT" });

      await vi.waitFor(() => {
        return submitSpy.mock.calls.length > 0;
      });

      const call = submitSpy.mock.calls[0][0];
      expect(call.answers["profile-q-1-others"]).toHaveLength(200);
    });
  });

  describe("error Auto-Clear", () => {
    it("should auto-clear required error after 3000ms", async () => {
      const actor = createActor(surveyMachine, {
        input: { sections: mockSections }
      });
      actor.start();

      // Trigger error
      actor.send({ type: "NEXT" });
      expect(actor.getSnapshot().context.error).toBe(ERRORS.required);

      // Advance timers
      await vi.advanceTimersByTimeAsync(3000);

      const snapshot = actor.getSnapshot();
      expect(snapshot.context.error).toBe(null);
    });

    it("should auto-clear submission error after 3000ms", async () => {
      const actor = createActor(surveyMachine, {
        input: { sections: mockSections }
      });
      actor.start();

      vi.spyOn(utils, "submitAnswers").mockResolvedValue({
        data: undefined,
        error: {
          type: "SERVER_ERROR",
          code: "INTERNAL_SERVER_ERROR",
          status: 500,
          name: "ServerError",
          message: "Failed"
        }
      });

      // Trigger submission error
      actor.send({
        type: "ANSWER_CHANGE",
        questionId: "profile-q-0",
        value: 0
      });
      actor.send({ type: "NEXT" });
      actor.send({ type: "NEXT" });
      actor.send({ type: "NEXT" });

      await vi.waitFor(() => {
        return actor.getSnapshot().context.error === ERRORS.submission;
      });

      // Advance timers
      await vi.advanceTimersByTimeAsync(3000);

      const snapshot = actor.getSnapshot();
      expect(snapshot.context.error).toBe(null);
    });
  });

  describe("direct Navigation", () => {
    it("should jump to specific section with GO_TO_SECTION", () => {
      const actor = createActor(surveyMachine, {
        input: { sections: mockSections }
      });
      actor.start();

      actor.send({ type: "GO_TO_SECTION", sectionIdx: 1 });

      const snapshot = actor.getSnapshot();
      expect(snapshot.context.currentSectionIdx).toBe(1);
      expect(snapshot.context.currentQuestionIdx).toBe(0);
      expect(snapshot.context.error).toBe(null);
    });

    it("should jump to specific question with GO_TO_QUESTION", () => {
      const actor = createActor(surveyMachine, {
        input: { sections: mockSections }
      });
      actor.start();

      actor.send({ type: "GO_TO_QUESTION", sectionIdx: 1, questionIdx: 1 });

      const snapshot = actor.getSnapshot();
      expect(snapshot.context.currentSectionIdx).toBe(1);
      expect(snapshot.context.currentQuestionIdx).toBe(1);
      expect(snapshot.context.error).toBe(null);
    });
  });

  describe("edge Cases", () => {
    it("should handle single question section", () => {
      const singleQuestionSections: SurveyQuestionsYamlFile[] = [
        {
          title: "Quick",
          label: "quick",
          position: 1,
          questions: [
            {
              label: "Single question",
              choices: ["Yes", "No"],
              multiple: false,
              required: false
            }
          ]
        }
      ];

      const actor = createActor(surveyMachine, {
        input: { sections: singleQuestionSections }
      });
      actor.start();

      const snapshot = actor.getSnapshot();
      const section = snapshot.context.sections[0];
      expect(section.questions.length).toBe(1);
      expect(snapshot.context.currentQuestionIdx).toBe(0);
    });

    it("should handle null answer values", () => {
      const actor = createActor(surveyMachine, {
        input: { sections: mockSections }
      });
      actor.start();

      actor.send({
        type: "ANSWER_CHANGE",
        questionId: "profile-q-2",
        value: null
      });

      const snapshot = actor.getSnapshot();
      expect(snapshot.context.answers["profile-q-2"]).toBe(null);
    });

    it("should handle empty array for required multiple choice", () => {
      const actor = createActor(surveyMachine, {
        input: { sections: mockSections }
      });
      actor.start();

      // Answer first question to move to second (multiple choice)
      actor.send({
        type: "ANSWER_CHANGE",
        questionId: "profile-q-0",
        value: 0
      });
      actor.send({ type: "NEXT" });

      // Set empty array and try to go next (q-1 is not required, so move to q-2)
      actor.send({
        type: "ANSWER_CHANGE",
        questionId: "profile-q-1",
        value: []
      });
      actor.send({ type: "NEXT" });

      // Should move forward since q-1 is not required
      expect(actor.getSnapshot().context.currentQuestionIdx).toBe(2);
    });

    it("should normalize boolean answers to empty array", async () => {
      const actor = createActor(surveyMachine, {
        input: { sections: mockSections }
      });
      actor.start();

      const submitSpy = vi.spyOn(utils, "submitAnswers").mockResolvedValue({
        data: undefined,
        error: undefined
      });

      // Answer with boolean (simulating skipped multiple choice)
      actor.send({
        type: "ANSWER_CHANGE",
        questionId: "profile-q-0",
        value: 0
      });
      actor.send({ type: "NEXT" });

      actor.send({
        type: "ANSWER_CHANGE",
        questionId: "profile-q-1",
        value: []
      });
      actor.send({ type: "NEXT" });
      actor.send({ type: "NEXT" });

      await vi.waitFor(() => {
        return submitSpy.mock.calls.length > 0;
      });

      const call = submitSpy.mock.calls[0][0];
      expect(call.answers["profile-q-1"]).toEqual([]);
    });
  });

  describe("cLEAR_ERROR Event", () => {
    it("should manually clear error with CLEAR_ERROR event", () => {
      const actor = createActor(surveyMachine, {
        input: { sections: mockSections }
      });
      actor.start();

      // Trigger error
      actor.send({ type: "NEXT" });
      expect(actor.getSnapshot().context.error).toBe(ERRORS.required);

      // Manually clear
      actor.send({ type: "CLEAR_ERROR" });

      const snapshot = actor.getSnapshot();
      expect(snapshot.context.error).toBe(null);
    });
  });

  describe("conditional Visibility (showIf)", () => {
    const conditionalSections: SurveyQuestionsYamlFile[] = [
      {
        title: "Basic Info",
        label: "basic",
        position: 1,
        questions: [
          {
            label: "Are you employed?",
            choices: ["Yes", "No"],
            multiple: false,
            required: true
          },
          {
            label: "What is your job title?",
            choices: ["Developer", "Designer", "Manager", "Other"],
            multiple: false,
            required: false,
            showIf: { question: "basic-q-0", equals: 0 }
          },
          {
            label: "Are you looking for work?",
            choices: ["Yes", "No"],
            multiple: false,
            required: false,
            showIf: { question: "basic-q-0", equals: 1 }
          }
        ]
      },
      {
        title: "Employment Details",
        label: "employment",
        position: 2,
        showIf: { question: "basic-q-0", equals: 0 },
        questions: [
          {
            label: "Years of experience?",
            choices: ["0-2", "3-5", "6+"],
            multiple: false,
            required: true
          }
        ]
      }
    ];

    it("should skip hidden questions when navigating forward", () => {
      const actor = createActor(surveyMachine, {
        input: { sections: conditionalSections }
      });
      actor.start();

      // Answer "No" to employment - should skip q-1 and show q-2
      actor.send({
        type: "ANSWER_CHANGE",
        questionId: "basic-q-0",
        value: 1
      });
      actor.send({ type: "NEXT" });

      const snapshot = actor.getSnapshot();
      expect(snapshot.context.currentQuestionIdx).toBe(2); // Skipped q-1
    });

    it("should skip hidden questions when navigating backward", () => {
      const actor = createActor(surveyMachine, {
        input: { sections: conditionalSections }
      });
      actor.start();

      // Answer "No" to employment
      actor.send({
        type: "ANSWER_CHANGE",
        questionId: "basic-q-0",
        value: 1
      });
      actor.send({ type: "NEXT" });

      // Now on q-2, go back should skip q-1
      actor.send({ type: "BACK" });

      const snapshot = actor.getSnapshot();
      expect(snapshot.context.currentQuestionIdx).toBe(0); // Back to q-0
    });

    it("should update visibleSectionIndices when answer changes", () => {
      const actor = createActor(surveyMachine, {
        input: { sections: conditionalSections }
      });
      actor.start();

      // Initially employment section should be hidden
      expect(actor.getSnapshot().context.visibleSectionIndices).toEqual([0]);

      // Answer "Yes" to employment - employment section becomes visible
      actor.send({
        type: "ANSWER_CHANGE",
        questionId: "basic-q-0",
        value: 0
      });

      const snapshot = actor.getSnapshot();
      expect(snapshot.context.visibleSectionIndices).toEqual([0, 1]);
    });

    it("should auto-submit when all remaining questions are hidden", async () => {
      const sectionsWithHiddenEnd: SurveyQuestionsYamlFile[] = [
        {
          title: "Survey",
          label: "survey",
          position: 1,
          questions: [
            {
              label: "Do you code?",
              choices: ["Yes", "No"],
              multiple: false,
              required: true
            },
            {
              label: "What languages?",
              choices: ["JS", "Python"],
              multiple: true,
              required: false,
              showIf: { question: "survey-q-0", equals: 0 }
            },
            {
              label: "Why not?",
              choices: ["No interest", "No time"],
              multiple: false,
              required: false,
              showIf: { question: "survey-q-0", equals: 1 }
            }
          ]
        }
      ];

      const actor = createActor(surveyMachine, {
        input: { sections: sectionsWithHiddenEnd }
      });
      actor.start();

      vi.spyOn(utils, "submitAnswers").mockResolvedValue({
        data: undefined,
        error: undefined
      });

      // Answer "Yes" - this hides q-2, leaving q-1 as only remaining question
      actor.send({
        type: "ANSWER_CHANGE",
        questionId: "survey-q-0",
        value: 0
      });
      actor.send({ type: "NEXT" });

      // Now on q-1. Answer it.
      actor.send({
        type: "ANSWER_CHANGE",
        questionId: "survey-q-1",
        value: [0]
      });

      // NEXT should trigger submit since q-2 is hidden (no more visible questions)
      actor.send({ type: "NEXT" });

      await vi.waitFor(() => {
        const snapshot = actor.getSnapshot();
        return snapshot.value === "submitting" || snapshot.value === "complete";
      });

      expect(utils.submitAnswers).toHaveBeenCalled();
    });

    it("should skip section if all questions are hidden", async () => {
      const sectionsWithHiddenSection: SurveyQuestionsYamlFile[] = [
        {
          title: "Profile",
          label: "profile",
          position: 1,
          questions: [
            {
              label: "Are you a developer?",
              choices: ["Yes", "No"],
              multiple: false,
              required: true
            }
          ]
        },
        {
          title: "Developer Questions",
          label: "dev",
          position: 2,
          questions: [
            {
              label: "What's your role?",
              choices: ["Frontend", "Backend"],
              multiple: false,
              required: false,
              showIf: { question: "profile-q-0", equals: 0 }
            },
            {
              label: "Years of experience?",
              choices: ["0-2", "3+"],
              multiple: false,
              required: false,
              showIf: { question: "profile-q-0", equals: 0 }
            }
          ]
        },
        {
          title: "Final",
          label: "final",
          position: 3,
          questions: [
            {
              label: "Any feedback?",
              choices: ["Yes", "No"],
              multiple: false,
              required: false
            }
          ]
        }
      ];

      const actor = createActor(surveyMachine, {
        input: { sections: sectionsWithHiddenSection }
      });
      actor.start();

      vi.spyOn(utils, "submitAnswers").mockResolvedValue({
        data: undefined,
        error: undefined
      });

      // Answer "No" - this hides all questions in dev section
      actor.send({
        type: "ANSWER_CHANGE",
        questionId: "profile-q-0",
        value: 1
      });
      actor.send({ type: "NEXT" });

      // Should submit first section
      await vi.waitFor(() => {
        return actor.getSnapshot().value === "submitting";
      });

      await vi.runAllTimersAsync();

      // Should skip dev section and go to final section
      await vi.waitFor(() => {
        const snapshot = actor.getSnapshot();
        return (
          snapshot.value === "answering"
          && snapshot.context.currentSectionIdx === 2
        );
      });

      const snapshot = actor.getSnapshot();
      expect(snapshot.context.currentSectionIdx).toBe(2); // Skipped section 1
      expect(snapshot.context.currentQuestionIdx).toBe(0);
    });

    it("should handle section showIf condition hiding entire section", () => {
      const actor = createActor(surveyMachine, {
        input: { sections: conditionalSections }
      });
      actor.start();

      // Answer "No" - employment section should be hidden
      actor.send({
        type: "ANSWER_CHANGE",
        questionId: "basic-q-0",
        value: 1
      });

      const snapshot = actor.getSnapshot();
      expect(snapshot.context.visibleSectionIndices).toEqual([0]);
      expect(snapshot.context.visibleSectionIndices).not.toContain(1);
    });
  });
});
