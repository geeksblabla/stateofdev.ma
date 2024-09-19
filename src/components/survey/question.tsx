import type { FieldValues, UseFormRegister } from "react-hook-form";

type QuestionProps = {
  question: SurveyQuestion;
  index: number;
  register: UseFormRegister<FieldValues>;
  sectionId: string;
  selected: boolean;
};

export default ({
  question,
  index,
  register,
  sectionId,
  selected
}: QuestionProps) => {
  const { label, choices } = question;
  const fitContent = choices.length > 10;

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
            required={question.required ?? false}
            multiple={question.multiple ?? false}
          />
        ))}
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
};

const Choice = ({
  text,
  id,
  index,
  name,
  register,
  required,
  multiple
}: ChoiceProps) => {
  return (
    <div className="relative w-full overflow-hidden flex items-center bg-white  rounded-lg p-3 pl-14 mb-2 cursor-pointer">
      <input
        className="peer hidden"
        type={multiple ? "checkbox" : "radio"}
        {...register(name, { required })}
        id={id}
        value={index}
        data-testid={id}
      />
      <label
        className="absolute inset-0 cursor-pointer rounded-lg peer-checked:border-emerald-600 peer-checked:bg-emerald-100 border-2 border-gray-400"
        htmlFor={id}
      ></label>
      <div
        className={`absolute pointer-events-none left-4 h-5 w-5 ${
          multiple ? "rounded" : "rounded-full"
        } border-2 border-gray-400 bg-gray-200 ring-emerald-600 ring-offset-2 peer-checked:border-transparent peer-checked:bg-emerald-600 peer-checked:ring-2`}
      ></div>
      <span className="pointer-events-none z-10 text-black transition-colors duration-200">
        {text}
      </span>
    </div>
  );
};
