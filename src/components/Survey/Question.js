import React from 'react'

export default ({ question, index, register, categoryId }) => {
  const { label, choices } = question

  return (
    <div className="quiz-form__quiz">
      <p className="quiz-form__question">{`${index + 1}. ${label}`}</p>
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
    <label className="quiz-form__ans" htmlFor={id}>
      <input
        type="radio"
        name={name}
        ref={register}
        id={id}
        value={index}
        required
      />
      <span className="design"></span>
      <span className="text">{text}</span>
    </label>
  )
}
