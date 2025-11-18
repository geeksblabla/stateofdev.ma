import { useCallback, useState, type SyntheticEvent } from "react";
import type {
  FieldValues,
  UseFormGetValues,
  UseFormRegister
} from "react-hook-form";

type QuestionProps = {
  question: SurveyQuestion;
  index: number;
  register: UseFormRegister<FieldValues>;
  getValues: UseFormGetValues<FieldValues>;
  sectionId: string;
  selected: boolean;
};

export const Question = ({
  question,
  index,
  register,
  sectionId,
  selected,
  getValues
}: QuestionProps) => {
  const { label, choices } = question;
  const fitContent = choices.length > 10;
  const [showOtherInput, setShowOtherInput] = useState(false);

  // this is a simple solution to check if the user has selected "others" or "other" and based on that show the textarea
  const handleChoiceChange = useCallback(
    (_e: SyntheticEvent) => {
      // this is mainly to handle the case where multiple choice have "others" or "other" as one of the choices
      const othersIndices = choices
        .map((c, i) => ({ text: c, index: i }))
        .filter(({ text }) => text.toLowerCase().includes("other"))
        .map(({ index }) => index);

      if (othersIndices.length === 0) return;

      const values = getValues(`${sectionId}-q-${index}`) as string | string[];
      const valuesArray = (Array.isArray(values) ? values : [values]).map((v) =>
        parseInt(v)
      );

      const hasOtherSelected = othersIndices.some((index) =>
        valuesArray.includes(index)
      );
      setShowOtherInput(hasOtherSelected);
    },
    [setShowOtherInput, getValues, sectionId, index, choices]
  );

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
        <label className="block mb-2 ">
          {`${index + 1}. ${label}`} <br />
        </label>

        <span className="font-normal text-sm pl-2.5">
          {question.multiple ? "- You can choose multiple answers " : ""}
        </span>
        <span className="font-normal text-sm pl-2.5">
          {question.required ? "" : "- Click skip button if not applicable"}
        </span>
      </p>
      <div
        className={fitContent ? "grid md:grid-cols-2 gap-4 grid-cols-1" : ""}
      >
        {choices.map((c, i) => (
          <Choice
            text={c}
            id={`${sectionId}-q-${index}-${i}`}
            name={`${sectionId}-q-${index}`}
            index={i}
            register={register}
            key={`${sectionId}-q-${index}-${i}`}
            required={question.required ?? true}
            multiple={question.multiple ?? false}
            onChange={handleChoiceChange}
          />
        ))}
        {showOtherInput && (
          <textarea
            {...register(`${sectionId}-q-${index}-others`, {
              maxLength: {
                value: 200,
                message: "Input must not exceed 200 characters"
              }
            })}
            className="mt-4 w-full p-2 border-2 border-gray-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
            placeholder="Please specify... use comma to separate each item (max 200 characters)"
            rows={3}
            maxLength={200}
            data-testid={`${sectionId}-q-${index}-others`}
          />
        )}
      </div>
    </div>
  );
};

type ChoiceProps = {
  text: string;
  id: string;
  index: number;
  name: string;
  register: UseFormRegister<FieldValues>;
  required: boolean;
  multiple: boolean;
  onChange: (e: SyntheticEvent) => void;
};

const Choice = ({
  text,
  id,
  index,
  name,
  register,
  required,
  multiple,
  onChange
}: ChoiceProps) => {
  return (
    <div className="relative w-full overflow-hidden flex items-center bg-white p-3 pl-14 mb-2 cursor-pointer">
      <input
        className="peer hidden"
        type={multiple ? "checkbox" : "radio"}
        {...register(name, { required, onChange })}
        id={id}
        value={index}
        data-testid={id}
      />
      <label
        className="absolute inset-0 cursor-pointer peer-checked:border-emerald-600 peer-checked:bg-emerald-100 border-2 border-gray-400"
        htmlFor={id}
      ></label>
      <div className="absolute pointer-events-none left-4 h-5 w-5 border-2 border-gray-400 bg-gray-200 ring-emerald-600 ring-offset-2 peer-checked:border-transparent peer-checked:bg-emerald-600 peer-checked:ring-2"></div>
      <span className="pointer-events-none z-10 text-black transition-colors duration-200">
        {text}
      </span>
    </div>
  );
};
