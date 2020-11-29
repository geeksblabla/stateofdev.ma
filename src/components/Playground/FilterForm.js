import React, { useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import "./index.scss"

export default function FilterForm({
  questions,
  register,
  handleSubmit,
  control,
}) {
  const qs = Object.entries(questions).map(q => ({ id: q[0], ...q[1] }))

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "condition", // unique name for your Field Array
      // keyName: "id", default to "id", you can change the key name
    }
  )
  const onSubmit = data => console.log(JSON.stringify(data))
  return (
    <div className="filter-form">
      <p> form here </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label> Select Question : </label>
        <select name="question" ref={register}>
          {qs.map(q => (
            <option key={q.id} value={q.id}>
              {q.label}
            </option>
          ))}
        </select>

        <label> Filters: </label>
        <div className="filters">
          {fields.map((field, index) => (
            <Question
              key={field.id}
              question={questions[field.question_id]}
              register={register}
              index={index}
              field={field}
              remove={() => remove(index)}
            />
          ))}
          Add Question filter
          <select
            name="Question"
            onChange={e => append({ question_id: e.target.value })}
          >
            {qs.map(q => (
              <option key={q.id} value={q.id}>
                {q.label}
              </option>
            ))}
          </select>
        </div>

        <input type="submit" />
      </form>
    </div>
  )
}

const Question = ({ question, field, register, index, remove }) => {
  return (
    <div className="filter">
      <label> {question.label} </label>{" "}
      <button onClick={remove}> remove filter</button>
      <input
        name={`condition[${index}].question_id`}
        ref={register()}
        value={field.question_id}
        style={{ visibility: "hidden" }}
        readOnly
      />
      {question.choices.map((c, i) => (
        <div className="radio" key={`option-${i}`}>
          <input
            type="checkbox"
            name={`condition[${index}].value`}
            ref={register()}
            defaultValue={field.value}
            value={i}
          />
          {c}
        </div>
      ))}
    </div>
  )
}
