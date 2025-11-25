/* eslint-disable no-console */
import type { ShowIfCondition } from "./validators/survey-schema";

export type AnswerValue = number | number[] | null | string;
export type Answers = Record<string, AnswerValue>;
export type QuestionList = Array<{ showIf?: ShowIfCondition }>;
export type SectionList = Array<{
  showIf?: ShowIfCondition;
  questions?: QuestionList;
}>;

/**
 * Evaluates a showIf condition against current answers
 * @param condition - The condition to evaluate
 * @param answers - Current survey answers
 * @returns true if condition is met (show question/section), false otherwise
 */
export function evaluateCondition(
  condition: ShowIfCondition | undefined,
  answers: Answers
): boolean {
  // No condition means always show
  if (!condition)
    return true;

  const {
    question,
    equals,
    notEquals,
    in: inArray,
    notIn: notInArray
  } = condition;

  // Validate question ID format
  if (!question || !/^[a-z0-9-]+-q-\d+$/.test(question)) {
    console.log(
      `[Condition] Invalid question ID format: "${question}". Showing question by default.`
    );
    return true;
  }

  // Get answer value
  const answerValue = answers[question];

  // Handle unanswered questions - hide if condition depends on it
  if (answerValue == null) {
    return false;
  }

  // Evaluate operators
  if (equals != null) {
    return evaluateEquals(answerValue, equals);
  }

  if (notEquals != null) {
    return evaluateNotEquals(answerValue, notEquals);
  }

  if (inArray) {
    return evaluateIn(answerValue, inArray);
  }

  if (notInArray) {
    return evaluateNotIn(answerValue, notInArray);
  }

  // No valid operator found
  console.log(
    `[Condition] No valid operator found in condition for question "${question}". Showing by default.`
  );
  return true;
}

/**
 * Checks if answer equals expected value
 */
function evaluateEquals(answer: AnswerValue, expected: number): boolean {
  if (typeof answer !== "number") {
    console.log(
      `[Condition] equals operator used on non-number answer. Expected number, got ${typeof answer}`
    );
    return false;
  }
  return answer === expected;
}

/**
 * Checks if answer does not equal expected value
 */
function evaluateNotEquals(answer: AnswerValue, expected: number): boolean {
  if (typeof answer !== "number") {
    console.log(
      `[Condition] notEquals operator used on non-number answer. Expected number, got ${typeof answer}`
    );
    return false;
  }
  return answer !== expected;
}

/**
 * Checks if answer is one of expected values
 */
function evaluateIn(answer: AnswerValue, expected: number[]): boolean {
  if (typeof answer !== "number") {
    console.log(
      `[Condition] in operator used on non-number answer. Expected number, got ${typeof answer}`
    );
    return false;
  }
  return expected.includes(answer);
}

/**
 * Checks if answer is not one of expected values
 */
function evaluateNotIn(answer: AnswerValue, expected: number[]): boolean {
  if (typeof answer !== "number") {
    console.log(
      `[Condition] notIn operator used on non-number answer. Expected number, got ${typeof answer}`
    );
    return false;
  }
  return !expected.includes(answer);
}

/**
 * Filters sections based on their showIf conditions and whether they have visible questions
 * @param sections - All survey sections
 * @param answers - Current survey answers
 * @returns Array of section indices that should be visible
 */
export function getVisibleSectionIndices(
  sections: SectionList,
  answers: Answers
): number[] {
  return sections
    .map((section, index) => {
      const sectionVisible = evaluateCondition(section.showIf, answers);
      if (!sectionVisible)
        return { index, visible: false };

      // Check if section has at least one visible question
      const questions = section.questions;
      if (!questions?.length) {
        return { index, visible: false };
      }

      const hasVisibleQuestion = questions.some(q =>
        evaluateCondition(q.showIf, answers)
      );

      return {
        index,
        visible: hasVisibleQuestion
      };
    })
    .filter(item => item.visible)
    .map(item => item.index);
}

/**
 * Finds the next visible question after the given index
 * @param questions - All questions in a section
 * @param fromIdx - Current question index
 * @param answers - Current survey answers
 * @returns Index of next visible question, or undefined if none
 */
export function getNextVisibleQuestionIndex(
  questions: QuestionList,
  fromIdx: number,
  answers: Answers
): number | undefined {
  for (let i = fromIdx + 1; i < questions.length; i++) {
    if (evaluateCondition(questions[i].showIf, answers)) {
      return i;
    }
  }
  return undefined;
}

/**
 * Finds the previous visible question before the given index
 * @param questions - All questions in a section
 * @param fromIdx - Current question index
 * @param answers - Current survey answers
 * @returns Index of previous visible question, or undefined if none
 */
export function getPrevVisibleQuestionIndex(
  questions: QuestionList,
  fromIdx: number,
  answers: Answers
): number | undefined {
  for (let i = fromIdx - 1; i >= 0; i--) {
    if (evaluateCondition(questions[i].showIf, answers)) {
      return i;
    }
  }
  return undefined;
}

/**
 * Finds the first visible question in a section
 * @param questions - All questions in a section
 * @param answers - Current survey answers
 * @returns Index of first visible question, or undefined if none
 */
export function getFirstVisibleQuestionIndex(
  questions: QuestionList,
  answers: Answers
): number | undefined {
  return getNextVisibleQuestionIndex(questions, -1, answers);
}

/**
 * Finds the last visible question in a section
 * @param questions - All questions in a section
 * @param answers - Current survey answers
 * @returns Index of last visible question, or undefined if none
 */
export function getLastVisibleQuestionIndex(
  questions: QuestionList,
  answers: Answers
): number | undefined {
  return getPrevVisibleQuestionIndex(questions, questions.length, answers);
}

/**
 * Checks if there's a visible question after the given index
 * @param questions - All questions in a section
 * @param fromIdx - Current question index
 * @param answers - Current survey answers
 * @returns true if there's a next visible question
 */
export function hasNextVisibleQuestion(
  questions: QuestionList,
  fromIdx: number,
  answers: Answers
): boolean {
  return getNextVisibleQuestionIndex(questions, fromIdx, answers) != null;
}

/**
 * Checks if there's a visible question before the given index
 * @param questions - All questions in a section
 * @param fromIdx - Current question index
 * @param answers - Current survey answers
 * @returns true if there's a previous visible question
 */
export function hasPrevVisibleQuestion(
  questions: QuestionList,
  fromIdx: number,
  answers: Answers
): boolean {
  return getPrevVisibleQuestionIndex(questions, fromIdx, answers) != null;
}
