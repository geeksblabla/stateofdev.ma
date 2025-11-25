import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  evaluateCondition,
  getVisibleSectionIndices,
  getNextVisibleQuestionIndex,
  getPrevVisibleQuestionIndex,
  getFirstVisibleQuestionIndex,
  getLastVisibleQuestionIndex,
  hasNextVisibleQuestion,
  hasPrevVisibleQuestion,
  type Answers,
  type QuestionList,
  type SectionList
} from "./conditions";

describe("evaluateCondition", () => {
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
  });

  describe("no condition", () => {
    it("returns true when condition is undefined", () => {
      expect(evaluateCondition(undefined, {})).toBe(true);
    });
  });

  describe("invalid question ID format", () => {
    it("returns true and warns for empty question ID", () => {
      const condition = { question: "", equals: 1 };
      expect(evaluateCondition(condition, {})).toBe(true);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining("Invalid question ID format")
      );
    });

    it("returns true and warns for invalid format without -q-", () => {
      const condition = { question: "profile-0", equals: 1 };
      expect(evaluateCondition(condition, {})).toBe(true);
      expect(consoleWarnSpy).toHaveBeenCalled();
    });

    it("returns true and warns for uppercase question ID", () => {
      const condition = { question: "Profile-q-0", equals: 1 };
      expect(evaluateCondition(condition, {})).toBe(true);
      expect(consoleWarnSpy).toHaveBeenCalled();
    });

    it("accepts valid question ID formats", () => {
      const answers: Answers = { "profile-q-0": 1 };
      const condition = { question: "profile-q-0", equals: 1 };
      expect(evaluateCondition(condition, answers)).toBe(true);
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it("accepts kebab-case section labels", () => {
      const answers: Answers = { "learning-education-q-5": 2 };
      const condition = { question: "learning-education-q-5", equals: 2 };
      expect(evaluateCondition(condition, answers)).toBe(true);
    });
  });

  describe("unanswered questions", () => {
    it("returns false when answer is null", () => {
      const answers: Answers = { "profile-q-0": null };
      const condition = { question: "profile-q-0", equals: 1 };
      expect(evaluateCondition(condition, answers)).toBe(false);
    });

    it("returns false when answer is undefined (not in answers)", () => {
      const answers: Answers = {};
      const condition = { question: "profile-q-0", equals: 1 };
      expect(evaluateCondition(condition, answers)).toBe(false);
    });
  });

  describe("equals operator", () => {
    it("returns true when answer equals expected value", () => {
      const answers: Answers = { "profile-q-0": 2 };
      const condition = { question: "profile-q-0", equals: 2 };
      expect(evaluateCondition(condition, answers)).toBe(true);
    });

    it("returns false when answer does not equal expected value", () => {
      const answers: Answers = { "profile-q-0": 1 };
      const condition = { question: "profile-q-0", equals: 2 };
      expect(evaluateCondition(condition, answers)).toBe(false);
    });

    it("returns false and warns when answer is an array", () => {
      const answers: Answers = { "profile-q-0": [1, 2] };
      const condition = { question: "profile-q-0", equals: 1 };
      expect(evaluateCondition(condition, answers)).toBe(false);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining("equals operator used on non-number answer")
      );
    });

    it("returns false and warns when answer is a string", () => {
      const answers: Answers = { "profile-q-0": "text" };
      const condition = { question: "profile-q-0", equals: 1 };
      expect(evaluateCondition(condition, answers)).toBe(false);
      expect(consoleWarnSpy).toHaveBeenCalled();
    });

    it("handles equals: 0 correctly", () => {
      const answers: Answers = { "profile-q-0": 0 };
      const condition = { question: "profile-q-0", equals: 0 };
      expect(evaluateCondition(condition, answers)).toBe(true);
    });
  });

  describe("notEquals operator", () => {
    it("returns true when answer does not equal expected value", () => {
      const answers: Answers = { "profile-q-0": 1 };
      const condition = { question: "profile-q-0", notEquals: 2 };
      expect(evaluateCondition(condition, answers)).toBe(true);
    });

    it("returns false when answer equals expected value", () => {
      const answers: Answers = { "profile-q-0": 2 };
      const condition = { question: "profile-q-0", notEquals: 2 };
      expect(evaluateCondition(condition, answers)).toBe(false);
    });

    it("returns false and warns when answer is an array", () => {
      const answers: Answers = { "profile-q-0": [1, 2] };
      const condition = { question: "profile-q-0", notEquals: 1 };
      expect(evaluateCondition(condition, answers)).toBe(false);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining("notEquals operator used on non-number answer")
      );
    });
  });

  describe("in operator", () => {
    it("returns true when answer is in the expected array", () => {
      const answers: Answers = { "profile-q-0": 2 };
      const condition = { question: "profile-q-0", in: [1, 2, 3] };
      expect(evaluateCondition(condition, answers)).toBe(true);
    });

    it("returns false when answer is not in the expected array", () => {
      const answers: Answers = { "profile-q-0": 5 };
      const condition = { question: "profile-q-0", in: [1, 2, 3] };
      expect(evaluateCondition(condition, answers)).toBe(false);
    });

    it("returns true when answer is the only value in array", () => {
      const answers: Answers = { "profile-q-0": 1 };
      const condition = { question: "profile-q-0", in: [1] };
      expect(evaluateCondition(condition, answers)).toBe(true);
    });

    it("returns false and warns when answer is an array", () => {
      const answers: Answers = { "profile-q-0": [1, 2] };
      const condition = { question: "profile-q-0", in: [1, 2, 3] };
      expect(evaluateCondition(condition, answers)).toBe(false);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining("in operator used on non-number answer")
      );
    });
  });

  describe("notIn operator", () => {
    it("returns true when answer is not in the expected array", () => {
      const answers: Answers = { "profile-q-0": 5 };
      const condition = { question: "profile-q-0", notIn: [1, 2, 3] };
      expect(evaluateCondition(condition, answers)).toBe(true);
    });

    it("returns false when answer is in the expected array", () => {
      const answers: Answers = { "profile-q-0": 2 };
      const condition = { question: "profile-q-0", notIn: [1, 2, 3] };
      expect(evaluateCondition(condition, answers)).toBe(false);
    });

    it("returns false and warns when answer is an array", () => {
      const answers: Answers = { "profile-q-0": [4, 5] };
      const condition = { question: "profile-q-0", notIn: [1, 2, 3] };
      expect(evaluateCondition(condition, answers)).toBe(false);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining("notIn operator used on non-number answer")
      );
    });
  });

  describe("no valid operator", () => {
    it("returns true and warns when no operator is provided", () => {
      const answers: Answers = { "profile-q-0": 1 };
      const condition = { question: "profile-q-0" } as {
        question: string;
        equals?: number;
      };
      expect(evaluateCondition(condition, answers)).toBe(true);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining("No valid operator found")
      );
    });
  });
});

describe("getVisibleSectionIndices", () => {
  it("returns all indices when no conditions exist", () => {
    const sections = [
      { questions: [{}] },
      { questions: [{}] },
      { questions: [{}] }
    ] as SectionList;
    const answers: Answers = {};
    expect(getVisibleSectionIndices(sections, answers)).toEqual([0, 1, 2]);
  });

  it("filters out sections with failing showIf conditions", () => {
    const sections = [
      { showIf: undefined, questions: [{}] },
      { showIf: { question: "profile-q-0", equals: 1 }, questions: [{}] },
      { showIf: undefined, questions: [{}] }
    ] as SectionList;
    const answers: Answers = { "profile-q-0": 0 };
    expect(getVisibleSectionIndices(sections, answers)).toEqual([0, 2]);
  });

  it("includes sections when showIf condition passes", () => {
    const sections = [
      { showIf: undefined, questions: [{}] },
      { showIf: { question: "profile-q-0", equals: 1 }, questions: [{}] }
    ] as SectionList;
    const answers: Answers = { "profile-q-0": 1 };
    expect(getVisibleSectionIndices(sections, answers)).toEqual([0, 1]);
  });

  it("filters out sections with no questions", () => {
    const sections = [
      { questions: [{}] },
      { questions: [] },
      { questions: [{}] }
    ] as SectionList;
    const answers: Answers = {};
    expect(getVisibleSectionIndices(sections, answers)).toEqual([0, 2]);
  });

  it("filters out sections where all questions are hidden", () => {
    const sections = [
      { questions: [{}] },
      {
        questions: [
          { showIf: { question: "profile-q-0", equals: 1 } },
          { showIf: { question: "profile-q-0", equals: 1 } }
        ]
      }
    ] as SectionList;
    const answers: Answers = { "profile-q-0": 0 };
    expect(getVisibleSectionIndices(sections, answers)).toEqual([0]);
  });

  it("includes sections with at least one visible question", () => {
    const sections = [
      {
        questions: [
          { showIf: { question: "profile-q-0", equals: 1 } },
          { showIf: undefined }
        ]
      }
    ] as SectionList;
    const answers: Answers = { "profile-q-0": 0 };
    expect(getVisibleSectionIndices(sections, answers)).toEqual([0]);
  });
});

describe("getNextVisibleQuestionIndex", () => {
  it("returns next index when no conditions exist", () => {
    const questions: QuestionList = [{}, {}, {}];
    expect(getNextVisibleQuestionIndex(questions, 0, {})).toBe(1);
    expect(getNextVisibleQuestionIndex(questions, 1, {})).toBe(2);
  });

  it("returns undefined when at last question", () => {
    const questions: QuestionList = [{}, {}, {}];
    expect(getNextVisibleQuestionIndex(questions, 2, {})).toBeUndefined();
  });

  it("skips hidden questions", () => {
    const questions: QuestionList = [
      {},
      { showIf: { question: "profile-q-0", equals: 1 } },
      {}
    ];
    const answers: Answers = { "profile-q-0": 0 };
    expect(getNextVisibleQuestionIndex(questions, 0, answers)).toBe(2);
  });

  it("returns undefined when all remaining questions are hidden", () => {
    const questions: QuestionList = [
      {},
      { showIf: { question: "profile-q-0", equals: 1 } },
      { showIf: { question: "profile-q-0", equals: 1 } }
    ];
    const answers: Answers = { "profile-q-0": 0 };
    expect(getNextVisibleQuestionIndex(questions, 0, answers)).toBeUndefined();
  });

  it("finds visible question after multiple hidden ones", () => {
    const questions: QuestionList = [
      {},
      { showIf: { question: "profile-q-0", equals: 1 } },
      { showIf: { question: "profile-q-0", equals: 1 } },
      {}
    ];
    const answers: Answers = { "profile-q-0": 0 };
    expect(getNextVisibleQuestionIndex(questions, 0, answers)).toBe(3);
  });
});

describe("getPrevVisibleQuestionIndex", () => {
  it("returns previous index when no conditions exist", () => {
    const questions: QuestionList = [{}, {}, {}];
    expect(getPrevVisibleQuestionIndex(questions, 2, {})).toBe(1);
    expect(getPrevVisibleQuestionIndex(questions, 1, {})).toBe(0);
  });

  it("returns undefined when at first question", () => {
    const questions: QuestionList = [{}, {}, {}];
    expect(getPrevVisibleQuestionIndex(questions, 0, {})).toBeUndefined();
  });

  it("skips hidden questions", () => {
    const questions: QuestionList = [
      {},
      { showIf: { question: "profile-q-0", equals: 1 } },
      {}
    ];
    const answers: Answers = { "profile-q-0": 0 };
    expect(getPrevVisibleQuestionIndex(questions, 2, answers)).toBe(0);
  });

  it("returns undefined when all previous questions are hidden", () => {
    const questions: QuestionList = [
      { showIf: { question: "profile-q-0", equals: 1 } },
      { showIf: { question: "profile-q-0", equals: 1 } },
      {}
    ];
    const answers: Answers = { "profile-q-0": 0 };
    expect(getPrevVisibleQuestionIndex(questions, 2, answers)).toBeUndefined();
  });
});

describe("getFirstVisibleQuestionIndex", () => {
  it("returns 0 when first question is visible", () => {
    const questions: QuestionList = [{}, {}, {}];
    expect(getFirstVisibleQuestionIndex(questions, {})).toBe(0);
  });

  it("skips hidden first questions", () => {
    const questions: QuestionList = [
      { showIf: { question: "profile-q-0", equals: 1 } },
      {},
      {}
    ];
    const answers: Answers = { "profile-q-0": 0 };
    expect(getFirstVisibleQuestionIndex(questions, answers)).toBe(1);
  });

  it("returns undefined when all questions are hidden", () => {
    const questions: QuestionList = [
      { showIf: { question: "profile-q-0", equals: 1 } },
      { showIf: { question: "profile-q-0", equals: 1 } }
    ];
    const answers: Answers = { "profile-q-0": 0 };
    expect(getFirstVisibleQuestionIndex(questions, answers)).toBeUndefined();
  });
});

describe("getLastVisibleQuestionIndex", () => {
  it("returns last index when last question is visible", () => {
    const questions: QuestionList = [{}, {}, {}];
    expect(getLastVisibleQuestionIndex(questions, {})).toBe(2);
  });

  it("skips hidden last questions", () => {
    const questions: QuestionList = [
      {},
      {},
      { showIf: { question: "profile-q-0", equals: 1 } }
    ];
    const answers: Answers = { "profile-q-0": 0 };
    expect(getLastVisibleQuestionIndex(questions, answers)).toBe(1);
  });

  it("returns undefined when all questions are hidden", () => {
    const questions: QuestionList = [
      { showIf: { question: "profile-q-0", equals: 1 } },
      { showIf: { question: "profile-q-0", equals: 1 } }
    ];
    const answers: Answers = { "profile-q-0": 0 };
    expect(getLastVisibleQuestionIndex(questions, answers)).toBeUndefined();
  });
});

describe("hasNextVisibleQuestion", () => {
  it("returns true when there is a next visible question", () => {
    const questions: QuestionList = [{}, {}];
    expect(hasNextVisibleQuestion(questions, 0, {})).toBe(true);
  });

  it("returns false when at last question", () => {
    const questions: QuestionList = [{}, {}];
    expect(hasNextVisibleQuestion(questions, 1, {})).toBe(false);
  });

  it("returns false when all remaining questions are hidden", () => {
    const questions: QuestionList = [
      {},
      { showIf: { question: "profile-q-0", equals: 1 } }
    ];
    const answers: Answers = { "profile-q-0": 0 };
    expect(hasNextVisibleQuestion(questions, 0, answers)).toBe(false);
  });
});

describe("hasPrevVisibleQuestion", () => {
  it("returns true when there is a previous visible question", () => {
    const questions: QuestionList = [{}, {}];
    expect(hasPrevVisibleQuestion(questions, 1, {})).toBe(true);
  });

  it("returns false when at first question", () => {
    const questions: QuestionList = [{}, {}];
    expect(hasPrevVisibleQuestion(questions, 0, {})).toBe(false);
  });

  it("returns false when all previous questions are hidden", () => {
    const questions: QuestionList = [
      { showIf: { question: "profile-q-0", equals: 1 } },
      {}
    ];
    const answers: Answers = { "profile-q-0": 0 };
    expect(hasPrevVisibleQuestion(questions, 1, answers)).toBe(false);
  });
});
