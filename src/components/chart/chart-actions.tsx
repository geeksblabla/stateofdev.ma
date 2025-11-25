import type { Year } from "./data";
import type { FinalResult } from "./utils";
import queryString from "query-string";
import { ShareButtons } from "./share-buttons";

interface ShareButtonsProps {
  results: FinalResult;
  year?: Year;
}

export function ChartActions({ results, year }: ShareButtonsProps) {
  const shareUrl = `/#${new URLSearchParams({
    question_id: results.id
  }).toString()}`;
  const shareTitle = `Check out this report: ${results.label}`;
  return (
    <div className="bg-muted px-6 py-4 flex justify-between items-center border-t border-border">
      <ShareButtons url={shareUrl} title={shareTitle} />
      <PlaygroundButton results={results} year={year} />
    </div>
  );
}

function PlaygroundButton({
  results,
  year
}: {
  results: FinalResult;
  year?: Year;
}) {
  return (
    <a
      href={`/playground#${queryString.stringify(
        {
          question_id: results.id,
          year: year || ""
        },
        { skipEmptyString: true }
      )}`}
      className="!text-muted-foreground text-sm hover:!text-foreground decoration-none transition-colors flex items-center pl-2 relative group"
      aria-label="Open in playground"
    >
      <svg
        width="24px"
        height="24px"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative"
      >
        <path
          d="M4 5L10 5M10 5C10 6.10457 10.8954 7 12 7C13.1046 7 14 6.10457 14 5M10 5C10 3.89543 10.8954 3 12 3C13.1046 3 14 3.89543 14 5M14 5L20 5M4 12H16M16 12C16 13.1046 16.8954 14 18 14C19.1046 14 20 13.1046 20 12C20 10.8954 19.1046 10 18 10C16.8954 10 16 10.8954 16 12ZM8 19H20M8 19C8 17.8954 7.10457 17 6 17C4.89543 17 4 17.8954 4 19C4 20.1046 4.89543 21 6 21C7.10457 21 8 20.1046 8 19Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute hidden md:block bottom-full left-1/2 transform -translate-x-1/2 bg-popover text-popover-foreground text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
        Open in playground
      </span>
    </a>
  );
}
