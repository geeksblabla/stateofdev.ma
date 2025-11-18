import React, { useState } from "react";
import { Chart } from "../chart/chart";
import {
  getQuestion,
  type FinalResult,
  type QuestionCondition
} from "../chart/utils";
import { getSurveyData, type Year, type QuestionMap } from "../chart/data";
import {
  PlaygroundForm,
  type ChartType,
  type PlaygroundFormData
} from "./playground-form";
import { ShareButtons } from "../chart/share-buttons";

export const SurveyPlayground: React.FC = () => {
  const [result, setResult] = useState<FinalResult | null>(null);
  const [questions, setQuestions] = useState<QuestionMap>({});
  const [chartType, setChartType] = useState<ChartType>("bar");

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
      setChartType(formData.chart_type as ChartType);
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
                isPlayground={true}
                pie={chartType === "pie"}
              />
              <div className="flex justify-end items-center pt-4 pr-2">
                <ShareActions />
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground bg-card border-2 border-border p-6">
              Select a question to generate a chart
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ShareActions = () => {
  const shareUrl = window.location.href;
  const shareTitle = `Check out this report`;
  return <ShareButtons url={shareUrl} title={shareTitle} />;
};
