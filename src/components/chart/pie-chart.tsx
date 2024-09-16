import { getPercent, type FinalResult } from "./utils";
import { ChartActions } from "./chart-actions";

// Reuse the colors array from bar-chart.tsx
const colors = [
  "#EF4444",
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
  "#6366F1",
  "#14B8A6",
  "#F97316",
  "#6B7280"
];

type PieChartProps = {
  results: FinalResult | null;
  sortByTotal?: boolean;
};
const PieSlice = ({
  result,
  total,
  startAngle,
  endAngle,
  color
}: {
  result: FinalResult["results"][number];
  total: number;
  startAngle: number;
  endAngle: number;
  color: string;
}) => {
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  const x1 = 50 + 50 * Math.cos((Math.PI * startAngle) / 180);
  const y1 = 50 + 50 * Math.sin((Math.PI * startAngle) / 180);
  const x2 = 50 + 50 * Math.cos((Math.PI * endAngle) / 180);
  const y2 = 50 + 50 * Math.sin((Math.PI * endAngle) / 180);

  const midAngle = (startAngle + endAngle) / 2;
  const textX = 50 + 35 * Math.cos((Math.PI * midAngle) / 180);
  const textY = 50 + 35 * Math.sin((Math.PI * midAngle) / 180);

  const percentage = parseFloat(getPercent(result.total, total));

  return (
    <g className="group">
      <path
        d={`M50,50 L${x1},${y1} A50,50 0 ${largeArcFlag},1 ${x2},${y2} Z`}
        fill={color}
        className="opacity-80 hover:opacity-100 transition-opacity duration-300"
      />
      {percentage >= 5 && (
        <text
          x={textX}
          y={textY}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fontSize="8px"
          className="font-medium"
        >
          {percentage}%
        </text>
      )}
      <title>{`${result.label}: ${result.total} (${percentage}%)`}</title>
    </g>
  );
};

export const PieChart = ({ results, sortByTotal = true }: PieChartProps) => {
  if (!results) return null;

  const displayResults = sortByTotal
    ? [...results.results].sort((a, b) => b.total - a.total)
    : results.results;

  let startAngle = 0;

  return (
    <div className="flex flex-col md:flex-row items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-64 h-64">
        {displayResults.map((result, index) => {
          const sliceAngle = (result.total / results.total) * 360;
          const endAngle = startAngle + sliceAngle;
          const slice = (
            <PieSlice
              key={result.choiceIndex}
              result={result}
              total={results.total}
              startAngle={startAngle}
              endAngle={endAngle}
              color={colors[index % colors.length]}
            />
          );
          startAngle = endAngle;
          return slice;
        })}
      </svg>
      <div className="mt-6 md:mt-0 md:ml-8">
        {displayResults.map((result, index) => (
          <div key={result.choiceIndex} className="flex items-center mb-2">
            <div
              className="w-4 h-4 mr-2"
              style={{ backgroundColor: colors[index % colors.length] }}
            ></div>
            <span className="text-sm">
              {result.label}: {result.total} (
              {getPercent(result.total, results.total)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
