import { ShareButtons } from "./share-buttons";
import type { FinalResult } from "./utils";

type ShareButtonsProps = {
  playgroundButton?: boolean;
  results: FinalResult;
};

export const ChartActions = ({
  playgroundButton = true,
  results,
}: ShareButtonsProps) => {
  const shareUrl = `/playground?questionId=${results.id}`;
  const shareTitle = `Check out this report: ${results.label}`;
  return (
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
  );
};
