import { getPercent, type FinalResult } from "./utils";

// Add this array of colors
const colors = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-teal-500",
  "bg-orange-500",
  "bg-gray-500"
];

type BarChartProps = {
  results: FinalResult | null;
  sortByTotal?: boolean;
};

type BarProps = {
  result: FinalResult["results"][number];
  index: number;
  total: number;
};

const Tooltip = ({ result }: { result: FinalResult["results"][number] }) => {
  if (!result.grouped) return null;

  return (
    <span className="absolute h-fit left-1/2 overflow-visible transform -translate-x-1/2 -translate-y-full -mt-[36px] bg-white border border-gray-300 text-black text-xs rounded p-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 shadow-md">
      <div className="text-gray-700">
        <p className="font-semibold py-1">
          {result.label} : {result.total}{" "}
        </p>
        {result.grouped.results.length > 6 ? (
          <div className="flex flex-wrap">
            {Array.from({
              length: Math.ceil(result.grouped.results.length / 6)
            }).map((_, tableIndex) => (
              <table key={tableIndex} className="w-1/2 pr-2">
                <tbody className="divide-y divide-gray-200">
                  {result?.grouped?.results
                    .slice(tableIndex * 6, (tableIndex + 1) * 6)
                    .map((group, index) => (
                      <tr key={index}>
                        <td className="py-1">{group.label}</td>
                        <td className="text-right font-semibold py-1">
                          {group.total} (
                          {((group.total / result.total) * 100).toFixed(1)}
                          %)
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            ))}
          </div>
        ) : (
          <table className="w-full">
            <tbody className="divide-y divide-gray-200">
              {result.grouped.results.map((group, index) => (
                <tr key={index}>
                  <td className="py-1">{group.label}</td>
                  <td className="text-right font-semibold py-1">
                    {group.total} (
                    {((group.total / result.total) * 100).toFixed(1)}%)
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <svg
        className="absolute left-1/2 transform -translate-x-1/2 top-full w-3 h-3 -mt-[3px] z-11"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 10 5"
      >
        <path
          d="M0,0 L5,5 L10,0"
          fill="white"
          className="stroke-gray-300"
          strokeWidth="0.5"
        />
      </svg>
    </span>
  );
};

const Bar = ({ result, index, total }: BarProps) => {
  const displayResults = result.grouped ? result.grouped.results : [result];

  return (
    <div className="mb-3 relative group">
      <div className=" text-black relative w-full bg-gray-200/50 h-7 rounded-[3px]">
        <div className="flex z-10 absolute px-2 h-full w-full items-center justify-between mb-1">
          <span className="text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis">
            {result.label}
          </span>
          <div className="flex flex-row min-w-fit">
            <span className="text-sm text-gray-600  text-right">
              {getPercent(result.total, total)}% -{" "}
            </span>
            <span className="text-sm text-gray-600 min-w-[33px] text-right ">
              {result.total}
            </span>
          </div>
        </div>
        {!result.grouped ? (
          <div
            className="bg-green-500 opacity-60 h-full animate-grow-bar rounded-[3px] relative" // Add relative positioning
            style={{
              width: `${getPercent(result.total, total)}%`,
              animationDelay: `${index * 0.1}s`
            }}
          />
        ) : (
          <div className="flex flex-row">
            {displayResults.map((group, groupIndex) => (
              <div
                key={group.choiceIndex}
                className={`h-6 relative opacity-60 ${
                  colors[groupIndex % colors.length]
                }`}
                style={{
                  width: `${getPercent(group.total, total)}%`,
                  animationDelay: `${index * 0.1}s`
                }}
              />
            ))}
          </div>
        )}

        <Tooltip result={result} />
      </div>
    </div>
  );
};

export const BarChart = ({ results, sortByTotal = true }: BarChartProps) => {
  if (!results) return null;

  const displayResults = sortByTotal
    ? [...results.results].sort((a, b) => b.total - a.total)
    : results.results;

  // Create a set of unique labels for the legend
  const legendLabels = new Set<string>();
  displayResults.forEach((result) => {
    if (result.grouped) {
      result.grouped.results.forEach((group) => legendLabels.add(group.label));
    }
  });

  return (
    <div className="w-full max-w-5xl mx-auto">
      {displayResults.map((result, index) => (
        <Bar
          key={result.choiceIndex}
          result={result}
          index={index}
          total={results.total}
        />
      ))}
      <div className="flex items-end  justify-end">
        <span className="text-sm text-gray-600">Total: {results.total}</span>
      </div>
      {/*  legend for grouped questions */}
      <div className="mt-6 flex flex-wrap justify-center">
        {Array.from(legendLabels).map((label, index) => (
          <div key={label} className="flex items-center mr-4 mb-2">
            <div
              className={`w-4 h-4 ${
                colors[index % colors.length]
              } mr-2 opacity-60`}
            ></div>
            <span className="text-sm">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
