import { getPercent, getQuestion } from "./utils";
type BarChartProps = {
  id: string;
};

export const BarChart = ({ id }: BarChartProps) => {
  const dataQuestion = getQuestion({
    id,
  });

  if (!dataQuestion) return null;
  return (
    <div className="w-full max-w-5xl mx-auto">
      {dataQuestion.results.map((result) => (
        <div key={result.choiceIndex} className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">
              {result.label}
            </span>
            <span className="text-sm text-gray-500">
              {getPercent(result.total, dataQuestion.total)}% - {result.total}/
              {dataQuestion.total} resp
            </span>
          </div>
          <div className="w-full bg-gray-200  h-3">
            <div
              className="bg-green-500 h-3"
              style={{
                width: `${getPercent(result.total, dataQuestion.total)}%`,
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
