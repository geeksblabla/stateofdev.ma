/**
 * This file is used to define the types for the results.json and questions.json files
 * Mainly to prevent code editor from loading typing from json files which is can be very heavy
 */

type Question = {
  label: string;
  choices: string[];
  multiple: boolean | null;
  required: boolean | null;
};

type QuestionMap = {
  [key: string]: Question;
};

type Results = {
  results: { [key: string]: number | number[] | string | string[] | null }[];
};

// 2020
declare module "@/results/2020/data/results.json" {
  const value: Results;
  export default value;
}

declare module "@/results/2020/data/questions.json" {
  const value: QuestionMap;
  export default value;
}

// 2021
declare module "@/results/2021/data/results.json" {
  const value: Results;
  export default value;
}

declare module "@/results/2021/data/questions.json" {
  const value: QuestionMap;
  export default value;
}

// 2022
declare module "@/results/2022/data/results.json" {
  const value: Results;
  export default value;
}

declare module "@/results/2022/data/questions.json" {
  const value: QuestionMap;
  export default value;
}

// 2023
declare module "@/results/2023/data/results.json" {
  const value: Results;
  export default value;
}

declare module "@/results/2023/data/questions.json" {
  const value: QuestionMap;
  export default value;
}
