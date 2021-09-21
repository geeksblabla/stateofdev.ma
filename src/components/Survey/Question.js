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
        {`${index + 1}. ${label}`} {question.multiple ? "(m)" : ""}
      </p>
      <div className={fitContent ? "quiz-form_fit-content" : ""}>
        {choices.map((c, i) => (
          <Choice
            text={c}
            id={`${categoryId}-q-${index}-${i}`}
            name={`${categoryId}-q-${index}`}
            index={i + 1}
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

const Choice = ({
  text,
  id,
  index,
  name,
  register,
  required,
  multiple,
  fitContent,
}) => {
  return (
    <label htmlFor={id}>
      <input
        type={multiple ? "checkbox" : "radio"}
        name={name}
        {...register(name, { required })}
        id={id}
        value={index}
      />
      <div
        className={
          fitContent
            ? "quiz-form__ans quiz-form__ans_fit-content"
            : "quiz-form__ans"
        }
      >
        <span className="design">{index}</span>
        <span className="text">{text}</span>
      </div>
    </label>
  )
}
