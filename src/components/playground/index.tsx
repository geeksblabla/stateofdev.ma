import React, { useState } from "react";
import { Chart } from "../chart/chart";
import {
  getQuestion,
  type FinalResult,
  type QuestionCondition
} from "../chart/utils";
import { getSurveyData, type Year, type QuestionMap } from "../chart/data";
import { PlaygroundForm, type PlaygroundFormData } from "./playground-form";

export const SurveyPlayground: React.FC = () => {
  const [result, setResult] = useState<FinalResult | null>(null);
  const [questions, setQuestions] = useState<QuestionMap>({});

  const handleFormChange = React.useCallback((formData: PlaygroundFormData) => {
    const { questions } = getSurveyData(formData.year as Year);
    setQuestions(questions);
    if (formData.question_id) {
      const condition: QuestionCondition = formData.filters
        .filter((f) => f.question_id && f.values.length > 0)
        .map((f) => ({ question_id: f.question_id, values: f.values }));
      const result = getQuestion({
        id: formData.question_id,
        year: formData.year,
        condition: condition.length > 0 ? condition : undefined,
        groupBy: formData.group_by || undefined
      });
      setResult(result);
    } else {
      setResult(null);
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="relative flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2 ">
          <PlaygroundForm questions={questions} onChange={handleFormChange} />
        </div>
        <div className="w-full md:w-1/2 ">
          {result ? (
            <div className="sticky top-6">
              <Chart
                results={result}
                sortByTotal={false}
                title={true}
                playgroundButton={false}
              />
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500 bg-white shadow-md rounded-lg p-6">
              Select a question to generate a chart
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
