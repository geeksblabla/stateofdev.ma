import React from "react"

export default ({
  question,
  index,
  register,
  categoryId,
  selected,
  required,
  multiple,
}) => {
  const { label, choices } = question
  const fitContent = choices.length > 10

  return (
    <div
      className={
        selected ? " quiz-form__quiz selected " : "quiz-form__quiz unselected "
      }
    >
      <p className="quiz-form__question">
        {`${index + 1}. ${label}`} <br />
        <span
          style={{
            fontWeight: "normal",
            fontSize: "14px",
            paddingLeft: "10px",
          }}
        >
          {question.multiple ? "- You can choose multiple answers " : ""}
        </span>
        <span
          style={{
            fontWeight: "normal",
            fontSize: "14px",
            paddingLeft: "10px",
          }}
        >
          {question.required ? "" : "- Click skip button if not applicable"}
        </span>
      </p>
      <div className={fitContent ? "quiz-form_fit-content" : ""}>
        {choices.map((c, i) => (
          <Choice
            text={c}
            id={`${categoryId}-q-${index}-${i}`}
            name={`${categoryId}-q-${index}`}
            index={i}
            register={register}
            key={`${categoryId}-q-${index}-${i}`}
            required={required}
            multiple={multiple}
            fitContent={fitContent}
          />
        ))}
      </div>
    </div>
  )
}

const Choice = ({ text, id, index, name, register, required, multiple }) => {
  return (
    <>
      <div class="relative w-full overflow-hidden flex  items-center  bg-gray-50 py-3 px-4 pl-14 mb-4  font-medium text-gray-800 ">
        <input
          class="peer hidden"
          type={multiple ? "checkbox" : "radio"}
          name={name}
          {...register(name, { required })}
          id={id}
          value={index}
        />
        <label
          class="absolute left-0 top-0 h-full w-full cursor-pointer rounded-lg  peer-checked:border-emerald-600 peer-checked:bg-emerald-100  border-solid border-2 border-gray-200"
          htmlFor={id}
        ></label>
        <div
          class={`absolute pointer-events-none left-4 h-5 w-5 ${
            multiple ? "rounded" : "rounded-full"
          } border-solid border-2 border-gray-300 bg-gray-200 ring-emerald-600 ring-offset-2 peer-checked:border-transparent peer-checked:bg-emerald-600 peer-checked:ring-2`}
        ></div>
        <span class="pointer-events-none z-10">{text}</span>
      </div>
    </>
  )
}
