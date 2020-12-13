import React from "react"
import { useFieldArray } from "react-hook-form"
import "./index.scss"

export default function FilterForm({
  questions,
  register,
  handleSubmit,
  control,
}) {
  const qs = Object.entries(questions).map(q => ({ id: q[0], ...q[1] }))

  const { fields, append, remove } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "condition", // unique name for your Field Array
    // keyName: "id", default to "id", you can change the key name
  })
  const onSubmit = data => console.log(JSON.stringify(data))
  return (
    <div className="filter-form">
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Question</label>
        <select name="question" ref={register}>
          {qs.map(q => (
            <option key={q.id} value={q.id}>
              {q.label}
            </option>
          ))}
        </select>

        <label> Group by </label>
        <select name="groupBy" ref={register}>
          <option value="">None</option>
          {qs.map(q => (
            <option key={q.id} value={q.id}>
              {q.label}
            </option>
          ))}
        </select>

        <label> Filters </label>
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
          <select
            name="Question"
            onChange={e => append({ question_id: e.target.value })}
          >
            <option value="" style={{ color: "var(--green)" }}>
              + Add filter question
            </option>
            {qs.map(q => (
              <option key={q.id} value={q.id}>
                {q.label}
              </option>
            ))}
          </select>
        </div>
        <br />
      </form>
    </div>
  )
}

const Question = ({ question, field, register, index, remove }) => {
  return (
    <div className="filter">
      <div className="title">
        <label> {question.label} </label>
        <button onClick={remove} className="remove">
          <Remove />
        </button>
      </div>

      {question.choices.map((c, i) => (
        <label class="check-container">
          {c}
          <input
            type="checkbox"
            name={`condition[${index}].values`}
            ref={register()}
            defaultChecked={field?.values?.includes(i?.toString())}
            value={parseInt(i, 10)}
          />
          <span class="checkmark"></span>
        </label>
      ))}

      <input
        name={`condition[${index}].question_id`}
        ref={register()}
        value={field.question_id}
        style={{ visibility: "hidden", height: 0 }}
        readOnly
      />
    </div>
  )
}

function Remove(props) {
  return (
    <svg
      width={16}
      height={16}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.74 2.778v.815H1.483a.815.815 0 100 1.63h.814v8.147a2.444 2.444 0 002.445 2.445h6.519a2.444 2.444 0 002.444-2.445V5.222h.815a.815.815 0 000-1.63h-3.26v-.814A2.445 2.445 0 008.816.333h-1.63a2.444 2.444 0 00-2.444 2.445H4.74zm2.445-.815a.815.815 0 00-.814.815v.815H9.63v-.815a.815.815 0 00-.815-.815h-1.63zm0 5.704a.815.815 0 00-1.63 0v4.074a.815.815 0 101.63 0V7.667zm3.26 4.074a.815.815 0 11-1.63 0V7.667a.815.815 0 111.63 0v4.074z"
        fill="#656566"
      />
    </svg>
  )
}
