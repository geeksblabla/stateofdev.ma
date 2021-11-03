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
          {question.required ? "" : "- Click Skip button if it's not the case "}
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
        <span className="design">{index + 1}</span>
        <span className="text">{text}</span>
      </div>
    </label>
  )
}
