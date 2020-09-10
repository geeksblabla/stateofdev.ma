import React, { useState } from "react"
import { useForm } from "react-hook-form"
import Question from "./Question"
import { setAnswers } from "./service"

export default React.memo(({ category, next }) => {
  const [loading, setLoading] = useState(false)
  const { register, getValues } = useForm()
  const [QIndex, setQIndex] = useState(0)
  const isLastQuestion = category.questions.length === QIndex + 1
  const isRequired = !!category.questions[QIndex].required
  const isMultiple = !!category.questions[QIndex].multiple

  const nextQuestion = async () => {
    const values = getValues()
    const name = `${category.label}-q-${QIndex}`
    const value = getValues(name)
    console.log({ name, value, values })

    if (isRequired && value === "") return

    if (isLastQuestion) {
      await submitData()
    } else {
      setQIndex(QIndex => QIndex + 1)
    }
  }

  const submitData = async () => {
    const data = getValues()
    setLoading(true)
    try {
      await setAnswers(data)
      next()
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <form className="quiz-form">
      {category.questions.map((q, i) => (
        <Question
          selected={QIndex === i}
          question={q}
          index={i}
          key={`question-${i}`}
          register={register}
          categoryId={category.label}
        />
      ))}
      <div className="actions">
        {isRequired ? null : (
          <button type="button" onClick={() => nextQuestion()}>
            Skip
          </button>
        )}
        <button type="button" onClick={() => nextQuestion()}>
          {loading ? "loading" : "submit"}
        </button>
      </div>
    </form>
  )
})
