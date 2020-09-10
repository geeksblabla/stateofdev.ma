import React from "react"

export default ({ question, index, register, categoryId, selected }) => {
  const { label, choices } = question
  // console.log("selected ", selected, index)

  return (
    <div
      className="quiz-form__quiz"
      style={{ display: selected ? "block" : "none" }}
    >
      <p className="quiz-form__question">
        {`${index + 1}. ${label}`} {question.required ? "*" : ""}
      </p>
      {choices.map((c, i) => (
        <Choice
          text={c}
          id={`${categoryId}-q-${index}-${i}`}
          name={`${categoryId}-q-${index}`}
          index={i + 1}
          register={register}
          key={`${categoryId}-q-${index}-${i}`}
        />
      ))}
    </div>
  )
}

const Choice = ({ text, id, index, name, register }) => {
  return (
    <label htmlFor={id}>
      <input
        type="radio"
        name={name}
        ref={register({
          required: true,
        })}
        id={id}
        value={index}
      ></input>
      <div className="quiz-form__ans">
        <span className="design">{index}</span>
        <span className="text">{text}</span>
      </div>
    </label>
  )
}
