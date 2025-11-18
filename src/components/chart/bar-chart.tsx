import { getPercent, type FinalResult } from "./utils";

// Chart colors from theme
const colors = [
  "bg-chart-1",
  "bg-chart-2",
  "bg-chart-3",
  "bg-chart-4",
  "bg-chart-5",
  "bg-chart-6",
  "bg-chart-7",
  "bg-chart-8",
  "bg-chart-9",
  "bg-chart-10"
];

type BarChartProps = {
  results: FinalResult | null;
  sortByTotal?: boolean;
  showEmptyOptions?: boolean;
};

type BarProps = {
  result: FinalResult["results"][number];
  index: number;
  total: number;
};

const Tooltip = ({ result }: { result: FinalResult["results"][number] }) => {
  if (!result.grouped) return null;

  return (
    <span className="absolute h-fit left-1/2 overflow-visible transform -translate-x-1/2 -translate-y-full -mt-[36px] bg-card border-2 border text-card-foreground text-xs p-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
      <div className="text-muted-foreground">
        <p className="font-semibold py-1">
          {result.label} : {result.total}{" "}
        </p>
        {result.grouped.results.length > 6 ? (
          <div className="flex flex-wrap">
            {Array.from({
              length: Math.ceil(result.grouped.results.length / 6)
            }).map((_, tableIndex) => (
              <table key={tableIndex} className="w-1/2 pr-2">
                <tbody className="divide-y divide-border">
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
            <tbody className="divide-y divide-border">
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
          fill="var(--card)"
          className="stroke-border"
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
      <div className="text-foreground relative w-full bg-muted/50 h-7 border">
        <div className="flex z-10 absolute px-2 h-full w-full items-center justify-between mb-1">
          <span className="text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis">
            {result.label}
          </span>
          <div className="flex flex-row min-w-fit">
            <span className="text-sm text-muted-foreground text-right">
              {getPercent(result.total, total)}% -{" "}
            </span>
            <span className="text-sm text-muted-foreground min-w-[33px] text-right">
              {result.total}
            </span>
          </div>
        </div>
        {!result.grouped ? (
          <div
            className="bg-primary opacity-60 h-full relative"
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

export const BarChart = ({
  results,
  sortByTotal = true,
  showEmptyOptions = true
}: BarChartProps) => {
  if (!results) return null;

  const displayResults = sortByTotal
    ? [...results.results].sort((a, b) => b.total - a.total)
    : results.results;

  const filteredResults = showEmptyOptions
    ? displayResults
    : displayResults.filter((result) => result.total > 0);

  // Create a set of unique labels for the legend
  const legendLabels = new Set<string>();
  filteredResults.forEach((result) => {
    if (result.grouped) {
      result.grouped.results.forEach((group) => legendLabels.add(group.label));
    }
  });

  return (
    <div className="w-full max-w-5xl mx-auto">
      {filteredResults.map((result, index) => (
        <Bar
          key={result.choiceIndex}
          result={result}
          index={index}
          total={results.total}
        />
      ))}
      <div className="flex justify-between pb-1">
        <span className="text-xs text-muted-foreground">
          {results.isFiltered && "NOTE: Filters applied"}
        </span>
        <span className="text-sm text-muted-foreground">
          Total: {results.total}
        </span>
      </div>
      {/*  legend for grouped questions */}
      {legendLabels.size > 0 && (
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
      )}
    </div>
  );
};
