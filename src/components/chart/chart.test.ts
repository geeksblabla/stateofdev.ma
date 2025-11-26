import { describe, expect, it } from "vitest";
import { getQuestion } from "./utils";

const questions = {
  "profile-q-0": {
    label: "question 0",
    choices: ["choice 0", "choice 1"],
    required: true,
    multiple: false
  },
  "profile-q-1": {
    label: "question 1",
    choices: ["choice 0", "choice 1", "choice 2"],
    required: true,
    multiple: true
  },
  "profile-q-2": {
    label: "question 1",
    choices: ["choice 0", "choice 1", "choice 2"],
    required: true,
    multiple: false
  },
  "profile-q-3": {
    label: "question 2",
    choices: ["choice 0", "choice 1", "choice 2", "choice 3"],
    required: true,
    multiple: true
  },
  "profile-q-4": {
    label: "question 4",
    choices: ["choice 0", "choice 1", "choice 2", "choice 3", "choice 4"],
    required: true,
    multiple: false
  },
  "profile-q-5": {
    label: "question 5",
    choices: [
      "choice 0",
      "choice 1",
      "choice 2",
      "choice 3",
      "choice 4",
      "choice 5"
    ],
    required: true,
    multiple: true
  }
};

const results = [
  {
    "userId": "user-0",
    "profile-q-0": 0,
    "profile-q-1": [0],
    "profile-q-2": 1,
    "profile-q-3": [0, 1],
    "profile-q-4": 0,
    "profile-q-5": [0, 1, 2, 3]
  },
  {
    "userId": "user-1",
    "profile-q-0": 1,
    "profile-q-1": [0, 1],
    "profile-q-2": 1,
    "profile-q-3": [1, 2, 3],
    "profile-q-4": 2,
    "profile-q-5": [2, 3, 4]
  },
  {
    "userId": "user-2",
    "profile-q-0": 0,
    "profile-q-1": [1, 2],
    "profile-q-2": 2,
    "profile-q-3": [0, 3],
    "profile-q-4": 1,
    "profile-q-5": [0, 1, 4, 5]
  },
  {
    "userId": "user-3",
    "profile-q-0": 1,
    "profile-q-1": [0],
    "profile-q-2": 0,
    "profile-q-3": [2],
    "profile-q-4": 3,
    "profile-q-5": [1, 3, 5]
  },
  {
    // no answer for q-2
    "userId": "user-4",
    "profile-q-0": 1,
    "profile-q-1": [0],
    "profile-q-3": [2],
    "profile-q-4": 3,
    "profile-q-5": [1, 3, 5]
  }
];

const dataSource = {
  questions,
  results
};

describe("getQuestion Simple calculations", () => {
  it("throws error for non-existent question id", () => {
    const result = getQuestion({ id: "non-existent-id", dataSource });
    expect(result).toBeNull();
  });

  it("handles empty results", () => {
    const emptyDataSource = { ...dataSource, results: [] };
    const result = getQuestion({
      id: "profile-q-0",
      dataSource: emptyDataSource
    });
    expect(result).not.toBeNull();
    expect(result?.total).toBe(0);
    expect(result?.results).toHaveLength(2);
    expect(result?.results.every(r => r.total === 0)).toBeTruthy();
  });

  it("returns correct data for a simple question", () => {
    const result = getQuestion({ id: "profile-q-0", dataSource });
    expect(result?.label).toBe("question 0");
    expect(result?.total).toBe(5);
    expect(result?.results).toHaveLength(
      questions["profile-q-0"].choices.length
    );
    expect(result?.results[0].total).toBe(2);
    expect(result?.results[1].total).toBe(3);
  });

  it("handles missing answers correctly", () => {
    const result = getQuestion({ id: "profile-q-2", dataSource });
    expect(result?.total).toBe(4); // user-4 didn't answer this question
  });
  it("returns all choices even if not present in results", () => {
    const result = getQuestion({ id: "profile-q-4", dataSource });
    expect(result?.results).toHaveLength(5);
    expect(result?.results.some(r => r.total === 0)).toBeTruthy();
  });

  it("handles multiple choice questions correctly", () => {
    const result = getQuestion({ id: "profile-q-1", dataSource });
    expect(result?.total).toBe(5);
    expect(result?.results).toHaveLength(
      questions["profile-q-1"].choices.length
    );
    expect(result?.results[0].total).toBe(4);
    expect(result?.results[1].total).toBe(2);
    expect(result?.results[2].total).toBe(1);
  });

  it("total should equal the total of all results if the question is not multiple", () => {
    const result = getQuestion({ id: "profile-q-0", dataSource });
    if (!result)
      return;
    const totalAllChoices = result.results.reduce(
      (acc, curr) => acc + curr.total,
      0
    );
    expect(result.total).toBe(totalAllChoices);
  });
});

describe("getQuestion Filters", () => {
  // filters
  it("applies simple condition filter correctly with non multiple choice question", () => {
    const result = getQuestion({
      id: "profile-q-0",
      dataSource,
      condition: (v) => {
        const value = v["profile-q-4"];
        return typeof value === "number" && value === 3;
      }
    });
    if (!result)
      return;
    const totalAllChoices = result.results.reduce(
      (acc, curr) => acc + curr.total,
      0
    );
    expect(result.total).toBe(totalAllChoices);
    expect(result.results[0].total).toBe(0);
    expect(result.results[1].total).toBe(2);
  });

  it("applies simple condition filter correctly with multiple choice question", () => {
    const result = getQuestion({
      id: "profile-q-0",
      dataSource,
      condition: (v) => {
        const value = v["profile-q-5"];
        return Array.isArray(value) && (value as number[]).includes(3);
      }
    });
    expect(result?.total).toBe(4);
  });

  it("handles array condition filter", () => {
    const result = getQuestion({
      id: "profile-q-0",
      dataSource,
      condition: [{ question_id: "profile-q-4", values: ["3"] }]
    });
    expect(result?.total).toBe(2);
  });
  it("handles multiple value array condition filter", () => {
    const result = getQuestion({
      id: "profile-q-0",
      dataSource,
      condition: [{ question_id: "profile-q-4", values: ["3", "1"] }]
    });
    expect(result?.total).toBe(3);
  });

  it("handles multiple value array condition filter with multiple questions", () => {
    const result = getQuestion({
      id: "profile-q-0",
      dataSource,
      condition: [
        { question_id: "profile-q-4", values: ["3"] },
        { question_id: "profile-q-5", values: ["1", "3"] }
      ]
    });
    expect(result?.total).toBe(2);
    expect(result?.results[0].total).toBe(0);
    expect(result?.results[1].total).toBe(2);
  });

  it("handles complex array condition filter with multiple questions", () => {
    const result = getQuestion({
      id: "profile-q-0",
      dataSource,
      condition: [
        { question_id: "profile-q-4", values: ["0", "1"] },
        { question_id: "profile-q-5", values: ["0", "1"] }
      ]
    });
    expect(result?.total).toBe(2);
    expect(result?.results[0].total).toBe(2);
    expect(result?.results[1].total).toBe(0);
  });

  it("handles array condition filter with no matching values", () => {
    const result = getQuestion({
      id: "profile-q-0",
      dataSource,
      condition: [{ question_id: "profile-q-4", values: ["999"] }]
    });
    expect(result?.total).toBe(0);
    expect(result?.results.every(r => r.total === 0)).toBeTruthy();
  });

  it("handles array condition filter with empty values array", () => {
    const result = getQuestion({
      id: "profile-q-0",
      dataSource,
      condition: [{ question_id: "profile-q-4", values: [] }]
    });
    expect(result?.total).toBe(5);
  });

  it("handles function condition with complex logic", () => {
    const result = getQuestion({
      id: "profile-q-0",
      dataSource,
      condition: (v) => {
        const value4 = v["profile-q-4"];
        const value5 = v["profile-q-5"];
        return typeof value4 === "number" && value4 % 2 === 0 && Array.isArray(value5) && (value5 as number[]).includes(1);
      }
    });
    expect(result?.total).toBe(1);
    expect(result?.results[0].total).toBe(1);
    expect(result?.results[1].total).toBe(0);
  });

  it("applies filter correctly to multiple choice questions", () => {
    const result = getQuestion({
      id: "profile-q-1",
      dataSource,
      condition: [{ question_id: "profile-q-0", values: ["1"] }]
    });
    if (!result)
      return;
    expect(result.total).toBe(3);
    expect(result.results[0].total).toBe(3);
    expect(result.results[1].total).toBe(1);
    expect(result.results[2].total).toBe(0);
  });

  it("handles missing answers in filter conditions", () => {
    const result = getQuestion({
      id: "profile-q-0",
      dataSource,
      condition: [{ question_id: "profile-q-2", values: ["0", "1", "2"] }]
    });
    expect(result?.total).toBe(4); // user-4 should be excluded due to missing answer
  });

  it("sets isFiltered correctly", () => {
    const resultNoFilter = getQuestion({ id: "profile-q-0", dataSource });
    expect(resultNoFilter?.isFiltered).toBe(false);

    const resultWithFunctionFilter = getQuestion({
      id: "profile-q-0",
      dataSource,
      condition: (v) => {
        const value = v["profile-q-4"];
        return typeof value === "number" && value === 3;
      }
    });
    expect(resultWithFunctionFilter?.isFiltered).toBe(true);

    const resultWithEmptyArrayFilter = getQuestion({
      id: "profile-q-0",
      dataSource,
      condition: [{ question_id: "profile-q-4", values: [] }]
    });
    expect(resultWithEmptyArrayFilter?.isFiltered).toBe(false);

    const resultWithNonEmptyArrayFilter = getQuestion({
      id: "profile-q-0",
      dataSource,
      condition: [{ question_id: "profile-q-4", values: ["3"] }]
    });
    expect(resultWithNonEmptyArrayFilter?.isFiltered).toBe(true);
  });
});

describe("getQuestion Grouping", () => {
  it("groups results correctly", () => {
    const result = getQuestion({
      id: "profile-q-0",
      dataSource,
      groupBy: "profile-q-4"
    });
    if (!result)
      return;
    expect(result.results).toHaveLength(2);
    expect(result.results[0].grouped).not.toBeNull();
    expect(result.results[0].grouped?.results).toHaveLength(5);
  });

  it("groups results correctly for single-choice questions", () => {
    const result = getQuestion({
      id: "profile-q-0",
      dataSource,
      groupBy: "profile-q-4"
    });
    if (!result)
      return;
    expect(result.results).toHaveLength(2);
    expect(result.results[0].grouped).not.toBeNull();
    expect(result.results[0].grouped?.results).toHaveLength(5);
    expect(result.results[1].grouped?.results).toHaveLength(5);
    expect(result.results[0].grouped?.total).toBe(2);
    expect(result.results[1].grouped?.total).toBe(3);
  });

  it("groups results correctly for multiple-choice questions", () => {
    const result = getQuestion({
      id: "profile-q-1",
      dataSource,
      groupBy: "profile-q-0"
    });
    if (!result)
      return;
    expect(result.results).toHaveLength(3);
    expect(result.results[0].grouped).not.toBeNull();
    expect(result.results[0].grouped?.results).toHaveLength(2);
    expect(result.results[1].grouped?.results).toHaveLength(2);
    expect(result.results[2].grouped?.results).toHaveLength(2);
  });

  it("handles grouping with missing answers", () => {
    const result = getQuestion({
      id: "profile-q-2",
      dataSource,
      groupBy: "profile-q-0"
    });
    if (!result)
      return;
    expect(result.results).toHaveLength(3);
    expect(result.results[0].grouped?.results).toHaveLength(2);
    expect(result.results[1].grouped?.results).toHaveLength(2);
    expect(result.results[2].grouped?.results).toHaveLength(2);
    expect(result.results[0].grouped?.total).toBe(1);
    expect(result.results[1].grouped?.total).toBe(2);
    expect(result.results[2].grouped?.total).toBe(1);
  });

  it("groups results correctly with a filter applied", () => {
    const result = getQuestion({
      id: "profile-q-0",
      dataSource,
      groupBy: "profile-q-4",
      condition: (v) => {
        const value = v["profile-q-5"];
        return Array.isArray(value) && (value as number[]).includes(3);
      }
    });
    if (!result)
      return;
    expect(result.results).toHaveLength(
      questions["profile-q-0"].choices.length
    );
    expect(result.results[0].grouped).not.toBeNull();
    expect(result.results[0].grouped?.results).toHaveLength(
      questions["profile-q-4"].choices.length
    );
    expect(result.results[1].grouped?.results).toHaveLength(
      questions["profile-q-4"].choices.length
    );
    expect(result.results[0].grouped?.total).toBe(result.results[0].total);
    expect(result.results[1].grouped?.total).toBe(result.results[1].total);
  });

  it("handles grouping by a question with more choices than answers", () => {
    const result = getQuestion({
      id: "profile-q-0",
      dataSource,
      groupBy: "profile-q-5"
    });
    if (!result)
      return;
    expect(result.results).toHaveLength(2);
    expect(result.results[0].grouped?.results).toHaveLength(6);
    expect(result.results[1].grouped?.results).toHaveLength(6);
  });

  it("nested grouping works correctly", () => {
    const result = getQuestion({
      id: "profile-q-0",
      dataSource,
      groupBy: "profile-q-1"
    });
    if (!result)
      return;
    expect(result.results).toHaveLength(2);
    expect(result.results[0].grouped?.results).toHaveLength(3);
    expect(result.results[1].grouped?.results).toHaveLength(3);

    // Check nested grouping
    const nestedGroup = result.results[0].grouped?.results[0].grouped;
    expect(nestedGroup).toBeNull();
  });

  it("grouping preserves all choices even if not present in results", () => {
    const result = getQuestion({
      id: "profile-q-4",
      dataSource,
      groupBy: "profile-q-0"
    });
    if (!result)
      return;
    expect(result.results).toHaveLength(5);
    expect(
      result.results.every(r => r.grouped?.results.length === 2)
    ).toBeTruthy();
    expect(result.results.some(r => r.total === 0)).toBeTruthy();
  });

  it("grouping handles condition that filters out all results", () => {
    const result = getQuestion({
      id: "profile-q-0",
      dataSource,
      groupBy: "profile-q-4",
      condition: () => false
    });
    if (!result)
      return;
    expect(result.results).toHaveLength(2);
    expect(result.results[0].grouped?.total).toBe(0);
    expect(result.results[1].grouped?.total).toBe(0);
    expect(
      result.results[0].grouped?.results.every(r => r.total === 0)
    ).toBeTruthy();
    expect(
      result.results[1].grouped?.results.every(r => r.total === 0)
    ).toBeTruthy();
  });

  it("grouping with array condition filter", () => {
    const result = getQuestion({
      id: "profile-q-0",
      dataSource,
      groupBy: "profile-q-4",
      condition: [{ question_id: "profile-q-5", values: ["3"] }]
    });
    if (!result)
      return;
    expect(result.results).toHaveLength(2);
    expect(result.total).toBe(4);
    expect(result.results[0].grouped?.total).toBe(result.results[0].total);
    expect(result.results[1].grouped?.total).toBe(result.results[1].total);
  });
});
