type StepProps = {
  label: string;
  selectedIndex: number;
  index: number;
  totalSections: number;
};

const Step = ({ label, selectedIndex, index, totalSections }: StepProps) => {
  const color = index > selectedIndex ? "text-gray-400" : "text-emerald-600";
  return (
    <>
      {index + 1 > selectedIndex ? (
        <>
          <span
            className={`md:h-8 md:w-8 h-6 w-6 items-center justify-center rounded-full bg-white ${color} shadow inline-flex`}
          >
            {index + 1}
          </span>
        </>
      ) : (
        <span className="md:h-8 md:w-8 h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white shadow inline-flex">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="md:h-6 md:w-6 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </span>
      )}

      <span
        className={`${
          index === selectedIndex ? "inline " : "hidden md:inline "
        }   font-semibold ${color} capitalize  `}
      >
        {label}
      </span>
      {index < totalSections - 1 && (
        <>
          {index + 1 > selectedIndex ? (
            <span
              className={`${
                index === selectedIndex ? "inline" : "hidden md:inline"
              }  h-0 md:w-10 w-8 border-t-2 border-dashed border-gray-400 md:inline`}
            ></span>
          ) : (
            <span className="hidden h-0.5 md:w-10 w-8 bg-emerald-600 md:inline"></span>
          )}
        </>
      )}
    </>
  );
};

type StepsProps = {
  selectedIndex: number;
  sections: string[];
};

export const Steps = ({ selectedIndex = 0, sections }: StepsProps) => {
  return (
    <div
      id="steps"
      className="mx-auto mt-4 md:mb-20 mb-10 flex w-full flex-wrap items-center justify-center space-x-4 md:px-10  px-0 py-2 pt-6"
    >
      {sections.map((section, index) => {
        return (
          <Step
            key={`section-${index}`}
            label={section}
            index={index}
            selectedIndex={selectedIndex}
            totalSections={sections.length}
          />
        );
      })}
    </div>
  );
};
