import React, { useState } from "react";
import { BarChart } from "../report/bar-chart";
import {
  getQuestion,
  type FinalResult,
  type QuestionCondition,
} from "../report/utils";
import { getSurveyData, type Year, type QuestionMap } from "../report/data";
import { PlaygroundForm, type PlaygroundFormData } from "./survey-form";

export const SurveyPlayground: React.FC = () => {
  const [result, setResult] = useState<FinalResult | null>(null);
  const [questions, setQuestions] = useState<QuestionMap>({});

  const handleFormChange = (formData: PlaygroundFormData) => {
    const { questions } = getSurveyData(formData.year as Year);
    setQuestions(questions);

    if (formData.questionId) {
      const condition: QuestionCondition = formData.filters
        .filter((f) => f.questionId && f.values.length > 0)
        .map((f) => ({ question_id: f.questionId, values: f.values }));
      const result = getQuestion({
        id: formData.questionId,
        year: formData.year,
        condition: condition.length > 0 ? condition : undefined,
        groupBy: formData.groupBy || undefined,
      });
      setResult(result);
    } else {
      setResult(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2">
          <PlaygroundForm questions={questions} onChange={handleFormChange} />
        </div>
        <div className="w-full md:w-1/2">
          {result ? (
            <BarChart results={result} title={true} />
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
