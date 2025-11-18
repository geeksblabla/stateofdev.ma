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
  showEmptyOptions?: boolean;
};

export const Chart: React.FC<ChartProps> = ({
  results,
  sortByTotal = true,
  title = false,
  isPlayground = false,
  pie = false,
  year,
  showEmptyOptions = true
}) => {
  if (!results) return null;

  const ChartComponent = pie ? PieChart : BarChart;

  return (
    <div className="bg-gray-100/45 p-3 border border-gray-300 relative font-mono">
      {title && (
        <p className="text-md py-4 font-semibold mb-4">{results.label}</p>
      )}
      <ChartComponent
        results={results}
        sortByTotal={sortByTotal}
        showEmptyOptions={showEmptyOptions}
      />
      {!isPlayground && <ChartActions results={results} year={year} />}
      {results?.otherOptions.length > 0 && (
        <details className="mt-4">
          <summary className="text-sm font-semibold">
            Others ({results?.otherOptions.length})
            <span className="text-xs text-gray-500">
              submitted by participants
            </span>
          </summary>
          <div className="overflow-scroll max-h-[400px]">
            <table className="w-full border-collapse">
              <tbody>
                {results?.otherOptions.map((option, index) => (
                  <tr
                    key={option}
                    className={index % 2 === 0 ? "bg-gray-50" : ""}
                  >
                    <td className="py-1 px-2 border-b border-gray-200">
                      {option}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      )}
    </div>
  );
};
