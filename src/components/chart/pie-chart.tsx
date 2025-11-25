import type { FinalResult } from "./utils";
import { useMemo } from "react";
import { getPercent } from "./utils";

// Chart colors using CSS variables
const colors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
  "var(--chart-7)",
  "var(--chart-8)",
  "var(--chart-9)",
  "var(--chart-10)"
];

interface PieChartProps {
  results: FinalResult | null;
  sortByTotal?: boolean;
}
function PieSlice({
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
}) {
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  const x1 = 50 + 50 * Math.cos((Math.PI * startAngle) / 180);
  const y1 = 50 + 50 * Math.sin((Math.PI * startAngle) / 180);
  const x2 = 50 + 50 * Math.cos((Math.PI * endAngle) / 180);
  const y2 = 50 + 50 * Math.sin((Math.PI * endAngle) / 180);

  const midAngle = (startAngle + endAngle) / 2;
  const textX = 50 + 35 * Math.cos((Math.PI * midAngle) / 180);
  const textY = 50 + 35 * Math.sin((Math.PI * midAngle) / 180);

  const percentage = Number.parseFloat(getPercent(result.total, total));

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
          {percentage}
          %
        </text>
      )}
      <title>{`${result.label}: ${result.total} (${percentage}%)`}</title>
    </g>
  );
}

export function PieChart({ results, sortByTotal = true }: PieChartProps) {
  const displayResults = useMemo(() => {
    if (!results)
      return [];
    return sortByTotal
      ? [...results.results].sort((a, b) => b.total - a.total)
      : results.results;
  }, [results, sortByTotal]);

  const slicesWithAngles = useMemo(() => {
    if (!results)
      return [];
    return displayResults.reduce<Array<{ result: FinalResult["results"][number]; index: number; startAngle: number; endAngle: number }>>((acc, result, index) => {
      const sliceAngle = (result.total / results.total) * 360;
      const previousEndAngle = acc.length > 0 ? acc[acc.length - 1].endAngle : 0;
      const startAngle = previousEndAngle;
      const endAngle = previousEndAngle + sliceAngle;
      acc.push({
        result,
        index,
        startAngle,
        endAngle
      });
      return acc;
    }, []);
  }, [displayResults, results]);

  if (!results)
    return null;

  return (
    <div className="flex flex-col md:flex-row items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-64 h-64">
        {slicesWithAngles.map(({ result, index, startAngle, endAngle }) => (
          <PieSlice
            key={result.choiceIndex}
            result={result}
            total={results.total}
            startAngle={startAngle}
            endAngle={endAngle}
            color={colors[index % colors.length]}
          />
        ))}
      </svg>
      <div className="mt-6 md:mt-0 md:ml-8">
        {displayResults.map((result, index) => (
          <div key={result.choiceIndex} className="flex items-center mb-2">
            <div
              className="w-4 h-4 mr-2"
              style={{ backgroundColor: colors[index % colors.length] }}
            >
            </div>
            <span className="text-sm">
              {result.label}
              :
              {result.total}
              {" "}
              (
              {getPercent(result.total, results.total)}
              %)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
