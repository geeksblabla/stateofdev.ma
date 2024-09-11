import { ShareButtons } from "./share-buttons";
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
  "bg-gray-500",
];

type BarChartProps = {
  results: FinalResult | null;
  sortByTotal?: boolean;
  title?: boolean;
  playgroundButton?: boolean;
};

type BarProps = {
  result: FinalResult["results"][number];
  index: number;
  total: number;
};

const Bar = ({ result, index, total }: BarProps) => {
  const displayResults = result.grouped ? result.grouped.results : [result];

  return (
    <div className="mb-4 relative group">
      {" "}
      {/* Add group class */}
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">
          {result.label}
        </span>
        <span className="text-sm text-gray-500">
          {getPercent(result.total, total)}% - {result.total}/{total} resp
        </span>
      </div>
      <div className="w-full bg-gray-200 h-4 rounded-[3px]">
        {!result.grouped ? (
          <div
            className="bg-green-500 h-4 animate-grow-bar rounded-[3px] relative" // Add relative positioning
            style={{
              width: `${getPercent(result.total, total)}%`,
              animationDelay: `${index * 0.1}s`,
            }}
          />
        ) : (
          <div className="flex flex-row">
            {displayResults.map((group, groupIndex) => (
              <div
                key={group.choiceIndex}
                className={`h-4 relative ${colors[groupIndex % colors.length]}`}
                style={{
                  width: `${getPercent(group.total, total)}%`,
                  animationDelay: `${index * 0.1}s`,
                }}
              />
            ))}
          </div>
        )}

        <span className="absolute left-1/2 overflow-visible transform -translate-x-1/2 -translate-y-full -mt-[26px] bg-white border border-gray-300 text-black text-xs rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 shadow-md">
          <div className="text-gray-700">
            <p className="font-semibold py-1">
              {result.label} : {result.total}{" "}
            </p>
            {result.grouped &&
              (result.grouped.results.length > 6 ? (
                <div className="flex flex-wrap">
                  {Array.from({
                    length: Math.ceil(result.grouped.results.length / 6),
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
                                {((group.total / result.total) * 100).toFixed(
                                  1
                                )}
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
              ))}
          </div>
          <svg
            className="absolute left-1/2 transform -translate-x-1/2 top-full w-3 h-3 -mt-[3px] z-11" // Position the SVG arrow
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
      </div>
    </div>
  );
};

export const BarChart = ({
  results,
  sortByTotal = true,
  title = false,
  playgroundButton = false,
}: BarChartProps) => {
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

  const shareUrl = `/playground?questionId=${results.id}`;
  const shareTitle = `Check out this report: ${results.label}`;

  return (
    <div>
      {title && <p className="text-lg py-4 font-bold mb-4">{results.label}</p>}
      <div className="w-full max-w-5xl mx-auto">
        {displayResults.map((result, index) => (
          <Bar
            key={result.choiceIndex}
            result={result}
            index={index}
            total={results.total}
          />
        ))}
        {/* Add legend */}
        <div className="mt-6 flex flex-wrap justify-center">
          {Array.from(legendLabels).map((label, index) => (
            <div key={label} className="flex items-center mr-4 mb-2">
              <div
                className={`w-4 h-4 ${colors[index % colors.length]} mr-2`}
              ></div>
              <span className="text-sm">{label}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-end items-center mt-6">
          {playgroundButton && (
            <a
              href={`/playground?questionId=${results.id}`}
              className="text-gray-400 text-sm visited:text-gray-400 hover:text-gray-700 decoration-none transition-colors flex items-center pl-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="pr-2">Open in playground</span>
            </a>
          )}
          <ShareButtons url={shareUrl} title={shareTitle} />
        </div>
      </div>
    </div>
  );
};
