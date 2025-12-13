import type { ChangeEvent } from "react";
import type { SurveyQuestion } from "@/lib/validators/survey-schema";
import {
  useCallback,
  useMemo
} from "react";
import { getTranslation } from "@/lib/get-translation";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";
import { Choice } from "./choice";

const GRID_LAYOUT_THRESHOLD = 10;

type AnswerValue = number | number[] | null;

interface QuestionProps {
  question: SurveyQuestion;
  index: number;
  sectionId: string;
  selected: boolean;
  value: AnswerValue | undefined;
  othersValue: string | undefined;
  onAnswerChange: (value: AnswerValue) => void;
  onOthersChange: (value: string) => void;
}

export function Question({
  question,
  index,
  sectionId,
  selected,
  value,
  othersValue,
  onAnswerChange,
  onOthersChange
}: QuestionProps) {
  const lang = useLanguage();
  const t = translations[lang].survey;

  const { label, choices } = question;
  const fitContent = choices.length > GRID_LAYOUT_THRESHOLD;

  // Check if "other" options exist
  const othersIndices = useMemo(
    () =>
      choices
        .map((c, i) => {
          const text = typeof c === "string" ? c : c.en;
          return { text, index: i };
        })
        .filter(({ text }) => text.toLowerCase().includes("other"))
        .map(({ index }) => index),
    [choices]
  );

  // Derive showOtherInput from value instead of using useEffect
  const showOtherInput = useMemo(() => {
    if (othersIndices.length === 0) {
      return false;
    }

    const valuesArray = Array.isArray(value)
      ? value
      : value !== null && value !== undefined
        ? [value]
        : [];

    return othersIndices.some(idx => valuesArray.includes(idx));
  }, [value, othersIndices]);

  const handleChoiceChange = useCallback(
    (choiceIndex: number, checked: boolean) => {
      if (question.multiple) {
        // Multiple choice: toggle in array
        const currentArray = Array.isArray(value) ? value : [];
        const newValue = checked
          ? [...currentArray, choiceIndex]
          : currentArray.filter(v => v !== choiceIndex);
        onAnswerChange(newValue);
      }
      else {
        // Single choice: set value
        onAnswerChange(choiceIndex);
      }
    },
    [question.multiple, value, onAnswerChange]
  );

  const handleOthersChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      onOthersChange(e.target.value);
    },
    [onOthersChange]
  );

  const isChecked = useCallback(
    (choiceIndex: number) => {
      if (question.multiple) {
        return Array.isArray(value) && value.includes(choiceIndex);
      }
      return value === choiceIndex;
    },
    [question.multiple, value]
  );

  const questionLabelId = `${sectionId}-q-${index}-label`;

  return (
    <div
      className={`
        grid w-full
        ${selected ? "block animate-fadeIn" : "hidden"}
        mb-6 last:mb-0
      `}
      data-testid={`${sectionId}-q-${index}`}
    >
      <p className="mb-4 text-base font-medium">
        <label id={questionLabelId} className="block mb-2 ">
          {`${index + 1}. ${getTranslation(label, lang)}`}
          {" "}
          <br />
        </label>

        <span className="font-normal text-sm pl-2.5">
          {question.multiple ? t.multipleChoice : ""}
        </span>
        <span className="font-normal text-sm pl-2.5">
          {question.required ? "" : t.skipHint}
        </span>
      </p>
      <div
        role="group"
        aria-labelledby={questionLabelId}
        aria-required={question.required ?? true}
        className={fitContent ? "grid md:grid-cols-2 gap-4 grid-cols-1" : ""}
      >
        {choices.map((c, i) => (
          <Choice
            key={`${sectionId}-q-${index}-${i}`}
            text={getTranslation(c, lang)}
            id={`${sectionId}-q-${index}-${i}`}
            name={`${sectionId}-q-${index}`}
            index={i}
            required={question.required ?? true}
            multiple={question.multiple ?? false}
            checked={isChecked(i)}
            onChange={handleChoiceChange}
          />
        ))}
        {showOtherInput && (
          <textarea
            className="mt-4 w-full p-2 bg-card text-foreground border-2 border-input focus:ring-2 focus:ring-ring focus:border-ring placeholder:text-muted-foreground transition-colors"
            placeholder={t.otherPlaceholder}
            rows={3}
            maxLength={200}
            value={othersValue || ""}
            onChange={handleOthersChange}
            data-testid={`${sectionId}-q-${index}-others`}
          />
        )}
      </div>
    </div>
  );
}
