import { getSurveyData } from "./data";
import type { Year, Question, Results, QuestionMap } from "./data";

/* Calculate the count of each option (choices for a question)
  Return the results as an object with two properties:
  1. 'total': the total number of responses
  2. 'results': an array of objects, each containing:
     - 'choiceIndex': the option/choice index as a string
     - 'total': the count for that option
  Example:
  {
    total: 60,
    results: [
      { choiceIndex: "1", total: 10 },
      { choiceIndex: "2", total: 20 },
      { choiceIndex: "3", total: 30 }
    ]
  }
  */

type OptionsCounts = {
  total: number;
  results: { choiceIndex: string; total: number }[];
};
const calculateChoicesCounts = (
  data: Results["results"],
  id: string
): OptionsCounts => {
  const answers = data
    .map((r) => r[id])
    .filter(
      (v) =>
        v !== undefined && v !== null && (!Array.isArray(v) || v.length > 0)
    ); // in case some answers are missing or empty arrays
  const counts = answers.reduce(
    (acc, curr) => {
      if (curr === undefined || curr === null) return acc;
      if (Array.isArray(curr)) {
        curr.forEach((element) => {
          acc[element] = (acc[element] || 0) + 1;
        });
      } else {
        acc[curr] = (acc[curr] || 0) + 1;
      }
      return acc;
    },
    {} as Record<string, number>
  );

  const total = answers.length;
  const results = Object.keys(counts).map((key) => ({
    choiceIndex: key,
    total: counts[key]
  }));
  return {
    total,
    results
  };
};

/**
 *  the condition can be a function or an array of objects with question_id and values we want to filter by
 */
export type QuestionCondition =
  | ((v: any) => boolean)
  | Array<{ question_id: string; values: string[] }>;

const filterResultByCondition = (
  data: Results["results"],
  condition?: QuestionCondition
): Results["results"] => {
  if (!condition) return data;
  if (typeof condition === "function") return data.filter(condition);
  if (Array.isArray(condition)) {
    return data.filter((v) => {
      for (let index = 0; index < condition.length; index++) {
        const element = condition[index];
        const vs = Array.isArray(v[element.question_id])
          ? v[element.question_id]
          : [v[element.question_id]];

        const intersection =
          //@ts-ignore
          vs.filter((x) => element?.values?.includes(x?.toString())) || [];
        if (element.values.length !== 0 && intersection.length === 0)
          return false;
      }
      return true;
    });
  }

  return data;
};

type GetQuestionParams = {
  id: string;
  condition?: QuestionCondition;
  groupBy?: string;
  dataSource?: {
    questions: QuestionMap;
    results: Results["results"];
  };
  year?: Year;
};

type GroupedResult = {
  choiceIndex: string;
  total: number;
  label: string;
  grouped: FinalResult | null;
};

export type FinalResult = Question & {
  isFiltered: boolean;
  id: string;
  results: GroupedResult[];
  total: number;
  otherOptions: string[];
};

export const getQuestion = ({
  id,
  condition,
  groupBy,
  dataSource,
  year = "2020"
}: GetQuestionParams): FinalResult | null => {
  const data = dataSource ? dataSource : getSurveyData(year);
  const question = data.questions[id];
  if (!question) return null;
  const resultsData = data.results;
  // Filter the data based on the condition
  const filteredResults = filterResultByCondition(resultsData, condition);
  const otherOptions = getOtherOptions(filteredResults, id);
  const resultsWithChoicesCounts = calculateChoicesCounts(filteredResults, id);

  // this way we are handling we make sure we are returning all choices even if they are not in the filtered data
  // normally total will be replaced by resultsWithChoicesCounts corresponding total
  const resultsWithGrouping = question.choices.map((c, index) => ({
    choiceIndex: index.toString(),
    total: 0,
    label: c,
    ...(resultsWithChoicesCounts.results.find(
      (r) => r.choiceIndex === index.toString()
    ) || {}),
    grouped:
      groupBy === undefined
        ? null
        : getQuestion({
            id: groupBy,
            condition: (v) => {
              if (Array.isArray(v[id])) return v[id].includes(index);
              else return v[id] === index;
            },
            dataSource: { ...data, results: filteredResults },
            year
          })
  }));

  const isFiltered =
    typeof condition === "function"
      ? true
      : condition?.find((c) => c.values.length > 0) !== undefined;

  return {
    total: resultsWithChoicesCounts.total,
    results: resultsWithGrouping,
    ...question,
    id,
    isFiltered,
    otherOptions
  } as FinalResult;
};

export const getPercent = (value: number, total: number) => {
  return ((value * 100) / total).toFixed(1);
};

export const getOtherOptions = (data: Results["results"], id: string) => {
  const key = `${id}-others`;
  const results = data.filter((r) => r[key]).map((r) => r[key]);
  return results;
};
