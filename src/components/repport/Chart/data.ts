import DATA_2020 from "@/results/2020/data/results.json";
import Questions_2020 from "@/results/2020/data/questions.json";
import DATA_2021 from "@/results/2021/data/results.json";
import Questions_2021 from "@/results/2021/data/questions.json";

import DATA_2022 from "@/results/2022/data/results.json";
import Questions_2022 from "@/results/2022/data/questions.json";

import DATA_2023 from "@/results/2023/data/results.json";
import Questions_2023 from "@/results/2023/data/questions.json";

export type Year = "2020" | "2021" | "2022" | "2023";
export type Question = globalThis.Question;
export type QuestionMap = globalThis.QuestionMap;
export type Results = globalThis.Results;

export type SurveyDataType = {
  [year in Year]: {
    questions: QuestionMap;
    results: Results["results"];
  };
};

const surveyData: SurveyDataType = {
  "2020": {
    questions: Questions_2020 as unknown as QuestionMap,
    results: DATA_2020.results as unknown as Results["results"],
  },
  "2021": {
    questions: Questions_2021 as unknown as QuestionMap,
    results: DATA_2021.results as unknown as Results["results"],
  },
  "2022": {
    questions: Questions_2022 as unknown as QuestionMap,
    results: DATA_2022.results as unknown as Results["results"],
  },
  "2023": {
    questions: Questions_2023 as unknown as QuestionMap,
    results: DATA_2023.results as unknown as Results["results"],
  },
};

export const getSurveyData = (year: Year) => {
  return surveyData[year];
};
