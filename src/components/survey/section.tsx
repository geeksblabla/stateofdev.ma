import React, { useCallback, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Question } from "./question";
import { submitAnswers } from "./utils";

type SectionProps = {
  section: SurveyQuestionsYamlFile;
  next: () => void;
  setProgress: (n: number) => void;
  questions: SurveyQuestionsYamlFile[];
};

export const ERRORS = {
  none: "",
  required: "Please select an option.",
  submission: "Error submitting your answers, please try again."
} as const;

// we user this because react hook form does not support using number for select input
const normalizeAnswers = (
  answers: Record<string, string | string[] | null | boolean>
) => {
  const convertedAnswers: Record<string, number | number[] | null | string> =
    {};

  for (const [key, value] of Object.entries(answers)) {
    if (key.endsWith("others")) {
      // text area value we should'nt convert to number and we should limit the length to 200 characters to prevent spamming
      convertedAnswers[key] = (value as string).slice(0, 200);
    } else if (value === null) {
      convertedAnswers[key] = null;
    } else if (Array.isArray(value)) {
      convertedAnswers[key] = value.map(Number);
    } else if (typeof value === "boolean") {
      // this is a special case for multiple choice questions that are not required, if the user skip the question react hook form set the value to false
      convertedAnswers[key] = [];
    } else {
      convertedAnswers[key] = Number(value);
    }
  }

  return convertedAnswers;
};

export default React.memo(
  ({ section, next, setProgress, questions }: SectionProps) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>(ERRORS.none);
    const savedAnswars =
      localStorage.getItem("answars") || JSON.stringify(questions);
    const { register, getValues } = useForm({
      defaultValues: JSON.parse(savedAnswars)
    });
    const savedQIndex = parseInt(localStorage.getItem("savedQIndex") || "0");
    const [QIndex, setQIndex] = useState(savedQIndex);
    const isLastQuestion = section.questions.length === QIndex + 1;
    const isRequired = !!section.questions[QIndex].required;

    const nextQuestion = async () => {
      localStorage.setItem("answars", JSON.stringify(getValues()));
      localStorage.setItem("savedQIndex", QIndex.toString());
      setError(ERRORS.none);
      const name = `${section.label}-q-${QIndex}`;
      const value = getValues(name);
      // value === null   default value for simple questions and false for multiple ones
      if (isRequired && (value === null || value === false)) {
        setError(ERRORS.required);
        return;
      }

      if (isLastQuestion) {
        await submitData();
        setProgress(1);
      } else {
        setQIndex((QIndex) => QIndex + 1);
        setProgress(1);
      }
      scrollToSection("#steps");
    };
    const backToPreviousQ = () => {
      if (QIndex > 0) {
        localStorage.setItem("answars", JSON.stringify(getValues()));
        localStorage.setItem("savedQIndex", QIndex.toString());
        setQIndex((QIndex) => QIndex - 1);
        setProgress(-1);
      }
    };

    const submitData = useCallback(async () => {
      const answers = normalizeAnswers(getValues());
      setLoading(true);
      const { error } = await submitAnswers({
        answers
      });
      if (error) {
        setError(ERRORS.submission);
        setLoading(false);
      } else {
        next();
        setLoading(false);
      }
    }, []);

    // Add useEffect to clear error after 3 seconds
    useEffect(() => {
      if (error) {
        const timer = setTimeout(() => {
          setError(ERRORS.none);
        }, 2000);

        return () => clearTimeout(timer);
      }
    }, [error]);

    return (
      <div id={section.label} className="md:w-[700px] w-full px-4 md:px-0 ">
        <div className="mb-10 md:min-h-[300px] min-h-screen transition-all duration-1000">
          {section.questions.map((q, i) => (
            <Question
              selected={QIndex === i}
              question={q}
              index={i}
              key={`question-${i}`}
              register={register}
              sectionId={section.label}
              getValues={getValues}
            />
          ))}
        </div>
        <div className="flex flex-row justify-between mt-3 sticky bottom-0 bg-white py-4 border-t-2 border-gray-100 z-20 transition-all duration-1000">
          <div>
            {QIndex > 0 && <BackButton onClick={() => backToPreviousQ()} />}
          </div>
          <div className="relative">
            {isRequired ? null : (
              <button
                type="button"
                className="focus:outline-4 rounded-xl bg-white px-6 md:px-8 py-3 font-medium text-emerald-600 underline border-emerald-600 transition mr-2"
                onClick={() => nextQuestion()}
                data-testid="skip-button"
              >
                Skip
              </button>
            )}
            <button
              data-testid="next-button"
              type="button"
              className="px-4 py-2 min-w-[120px] bg-emerald-500 text-white rounded transition hover:bg-emerald-600"
              onClick={() => nextQuestion()}
            >
              {loading ? "Loading..." : "Next"}
              <ErrorMessage error={error} />
            </button>
          </div>
        </div>
      </div>
    );
  }
);

const ErrorMessage = ({ error }: { error: string }) => {
  if (!error) return null;
  return (
    <div
      data-testid="error-message"
      className="absolute right-0 bottom-full mb-2 p-2 bg-red-100 border border-red-400 rounded-md shadow-md max-h-[100px] w-[250px]"
    >
      <span className="text-red-600 text-sm font-medium">
        <svg
          className="inline-block w-4 h-4 mr-1 align-text-bottom"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
        {error}
      </span>
    </div>
  );
};

const scrollToSection = (selector: string) => {
  if (document.body.clientWidth < 600)
    document.querySelector(selector)?.scrollIntoView?.({
      behavior: "smooth"
    });
};

const BackButton = ({ onClick }: { onClick: () => void }) => (
  <div
    onClick={onClick}
    data-testid="back-button"
    className="group flex w-full cursor-pointer items-center justify-center rounded-md bg-transparent  pr-6 py-2 text-gray-400 hover:text-gray-700 transition"
  >
    <svg
      className="flex-0 ml-4 h-7 w-7 transition-all group-hover:-translate-x-1 rotate-180"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="3"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14 5l7 7m0 0l-7 7m7-7H3"
      />
    </svg>
    <span className="group flex w-full items-center justify-center rounded py-1 text-center font-medium">
      Back
    </span>
  </div>
);
