import React, { createContext, useContext, type ReactNode } from "react";
import { BarChart as BarChartComponent } from "./bar-chart";
import { getQuestion } from "./utils";
import type { Year } from "./data";

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
