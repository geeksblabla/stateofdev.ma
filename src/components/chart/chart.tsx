import React from "react";
import { BarChart } from "./bar-chart";
import { PieChart } from "./pie-chart";
import { type FinalResult } from "./utils";
import { ChartActions, PlaygroundButton } from "./chart-actions";

type ChartProps = {
  results: FinalResult | null;
  sortByTotal?: boolean;
  title?: boolean;
  isPlayground?: boolean;
  pie?: boolean;
};

export const Chart: React.FC<ChartProps> = ({
  results,
  sortByTotal = true,
  title = false,
  isPlayground = false,
  pie = false
}) => {
  if (!results) return null;

  const ChartComponent = pie ? PieChart : BarChart;

  return (
    <div className="bg-white border border-gray-200 shadow-sm p-4 rounded-md">
      {title && (
        <p className="text-md py-4 font-semibold mb-4">{results.label}</p>
      )}
      {!isPlayground && (
        <div className="flex justify-end pb-2">
          <PlaygroundButton results={results} />
        </div>
      )}
      <ChartComponent results={results} sortByTotal={sortByTotal} />
      {!isPlayground && <ChartActions results={results} />}
    </div>
  );
};
