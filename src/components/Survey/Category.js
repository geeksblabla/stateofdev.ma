import React, { useState } from "react"
import { useForm } from "react-hook-form"
import Question from "./Question"
import { setAnswers } from "./service"

export default ({ category, next }) => {
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, errors } = useForm()

  const onSubmit = async data => {
    setLoading(true)
    try {
      await setAnswers(data)
      next()
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <>
      <div className="heading">
        <h1 className="heading__text">{category.title}</h1>
      </div>
      <form className="quiz-form" onSubmit={handleSubmit(onSubmit)}>
        {category.questions.map((q, i) => (
          <Question
            question={q}
            index={i}
            key={`question-${i}`}
            register={register}
            categoryId={category.label}
          />
        ))}
        <input
          className="submit"
          type="submit"
          value={loading ? "loading" : "Submit"}
        />
      </form>
    </>
  )
}
