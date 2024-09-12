/**
 * this is a context that we use to pass the year to the bar chart based on the page the chart is used on
 * This only work with static generation for report page and do not work with the playground
 * We do that because in our report files in `results/year/sections/` we only calling the chart with questionId and the year is implicit based on the folder name
 */

import React, { createContext, useContext, type ReactNode } from "react";
import { BarChart as BarChartComponent } from "../chart/bar-chart";
import { getQuestion } from "../chart/utils";
import type { Year } from "../chart/data";

interface ChartContextProps {
  year: Year;
}

const ChartContext = createContext<ChartContextProps | undefined>(undefined);

export const ChartProvider: React.FC<{
  year: Year;
  children: ReactNode;
}> = ({ year, children }) => {
  return (
    <ChartContext.Provider value={{ year }}>{children}</ChartContext.Provider>
  );
};

export const useChartContext = () => {
  const context = useContext(ChartContext);
  console.log(context);
  if (context === undefined) {
    return { year: "2023" };
  }
  return context;
};

export const BarChart = ({ id, year }: { id: string; year: Year }) => {
  const { year: globalYear } = useChartContext();
  const nYear = year || globalYear;
  console.log(nYear);
  const results = getQuestion({ id, year: nYear });

  return <BarChartComponent results={results} />;
};
