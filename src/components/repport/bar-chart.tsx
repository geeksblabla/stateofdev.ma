import { getPercent, type FinalResult } from "./utils";

type BarChartProps = {
  results: FinalResult | null;
};

export const BarChart = ({ results }: BarChartProps) => {
  if (!results) return null;

  return (
    <div className="w-full max-w-5xl mx-auto">
      {results.results.map((result, index) => (
        <div key={result.choiceIndex} className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">
              {result.label}
            </span>
            <span className="text-sm text-gray-500">
              {getPercent(result.total, results.total)}% - {result.total}/
              {results.total} resp
            </span>
          </div>
          <div className="w-full bg-gray-200 h-4 rounded-[3px]">
            <div
              className="bg-green-500 h-4 animate-grow-bar rounded-[3px]"
              style={{
                width: `${getPercent(result.total, results.total)}%`,
                animationDelay: `${index * 0.1}s`,
              }}
            ></div>
          </div>
        </div>
      ))}
      <div className="flex justify-end mt-4 space-x-4">
        <button className="text-blue-600 hover:underline">Share result</button>
        <button className="text-blue-600 hover:underline">
          Open in playground
        </button>
      </div>
    </div>
  );
};
