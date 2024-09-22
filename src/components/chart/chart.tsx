import React from "react";
import { BarChart } from "./bar-chart";
import { PieChart } from "./pie-chart";
import { type FinalResult } from "./utils";
import { ChartActions } from "./chart-actions";
import type { Year } from "./data";

type ChartProps = {
  results: FinalResult | null;
  sortByTotal?: boolean;
  title?: boolean;
  isPlayground?: boolean;
  pie?: boolean;
  year?: Year;
  isFiltered?: boolean;
};

export const Chart: React.FC<ChartProps> = ({
  results,
  sortByTotal = true,
  title = false,
  isPlayground = false,
  pie = false,
  year,
  isFiltered = false
}) => {
  if (!results) return null;

  const ChartComponent = pie ? PieChart : BarChart;

  return (
    <div className="bg-gray-100/45  p-3 rounded-md">
      {title && (
        <p className="text-md py-4 font-semibold mb-4">{results.label}</p>
      )}
      <ChartComponent
        results={results}
        sortByTotal={sortByTotal}
        isFiltered={isFiltered}
      />
      {!isPlayground && <ChartActions results={results} year={year} />}
    </div>
  );
};
