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
        grid
        ${selected ? "block animate-fadeIn" : "hidden"}
        mb-6 last:mb-0
      `}
    >
      <p className="quiz-form__question">
        {`${index + 1}. ${label}`} <br />
        <span
          style={{
            fontWeight: "normal",
            fontSize: "14px",
            paddingLeft: "10px"
          }}
        >
          {question.multiple ? "- You can choose multiple answers " : ""}
        </span>
        <span
          style={{
            fontWeight: "normal",
            fontSize: "14px",
            paddingLeft: "10px"
          }}
        >
          {question.required ? "" : "- Click skip button if not applicable"}
        </span>
      </p>
      <div className={fitContent ? "quiz-form_fit-content" : ""}>
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
            fitContent={fitContent}
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
  fitContent: boolean;
};

const Choice = ({
  text,
  id,
  index,
  name,
  register,
  required,
  multiple,
  fitContent
}: ChoiceProps) => {
  return (
    <>
      <div className="relative w-full overflow-hidden flex  items-center  bg-gray-50 py-3 px-4 pl-14 mb-4  font-medium text-gray-800 ">
        <input
          className="peer hidden"
          type={multiple ? "checkbox" : "radio"}
          // name={name}
          {...register(name, { required })}
          id={id}
          value={index}
        />
        <label
          className="absolute left-0 top-0 h-full w-full cursor-pointer rounded-lg  peer-checked:border-emerald-600 peer-checked:bg-emerald-100  border-solid border-2 border-gray-200"
          htmlFor={id}
        ></label>
        <div
          className={`absolute pointer-events-none left-4 h-5 w-5 ${
            multiple ? "rounded" : "rounded-full"
          } border-solid border-2 border-gray-300 bg-gray-200 ring-emerald-600 ring-offset-2 peer-checked:border-transparent peer-checked:bg-emerald-600 peer-checked:ring-2`}
        ></div>
        <span className="pointer-events-none z-10">{text}</span>
      </div>
    </>
  );
};
