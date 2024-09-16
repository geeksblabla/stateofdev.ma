import React from "react";
import { BarChart } from "./bar-chart";
import { PieChart } from "./pie-chart";
import { type FinalResult } from "./utils";
import { ChartActions } from "./chart-actions";

type ChartProps = {
  results: FinalResult | null;
  sortByTotal?: boolean;
  title?: boolean;
  playgroundButton?: boolean;
  pie?: boolean;
};

export const Chart: React.FC<ChartProps> = ({
  results,
  sortByTotal = true,
  title = false,
  playgroundButton = false,
  pie = false
}) => {
  if (!results) return null;

  const ChartComponent = pie ? PieChart : BarChart;

  return (
    <div>
      {title && <p className="text-lg py-4 font-bold mb-4">{results.label}</p>}
      <ChartComponent results={results} sortByTotal={sortByTotal} />
      <ChartActions playgroundButton={playgroundButton} results={results} />
    </div>
  );
};
