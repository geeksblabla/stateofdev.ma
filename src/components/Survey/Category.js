import React, { useCallback, useState } from "react"
import { useGoogleReCaptcha } from "react-google-recaptcha-v3"
import { useForm } from "react-hook-form"
import Question from "./Question"
import { setAnswers } from "./service"

export default React.memo(({ category, next, setProgress }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const { register, getValues } = useForm()
  const { executeRecaptcha } = useGoogleReCaptcha()
  const [QIndex, setQIndex] = useState(0)
  const isLastQuestion = category.questions.length === QIndex + 1
  const isRequired = !!category.questions[QIndex].required

  const nextQuestion = async () => {
    setError(false)
    const name = `${category.label}-q-${QIndex}`
    const value = getValues(name)
    // value === null   default value for simple questions and false for multiple ones
    if (isRequired && (value === null || value === false)) {
      setError(true)
      return
    }

    if (isLastQuestion) {
      await submitData()
      setProgress(1)
    } else {
      setQIndex(QIndex => QIndex + 1)
      setProgress(1)
    }
    scrollToSection(".quiz-form")
  }
  const backToPreviousQ = () => {
    if (QIndex > 0) {
      setQIndex(QIndex => QIndex - 1)
      setProgress(-1)
    }
  }

  const submitData = useCallback(async () => {
    if (!executeRecaptcha) {
      // console.log("Execute recaptcha not yet available")
    } else {
      const token = await executeRecaptcha("start")
      if (token) {
        const data = getValues()
        setLoading(true)
        try {
          await setAnswers(token, data)
          next()
        } catch (error) {
          console.log(error)
        }
      }
    }
  }, [executeRecaptcha])

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
          required={q.required}
          multiple={q.multiple}
        />
      ))}
      <div className="actions">
        <div>
          {QIndex > 0 && (
            <button
              type="button"
              className="back"
              onClick={() => backToPreviousQ()}
            >
              Back
            </button>
          )}
        </div>
        <div className="submit_actions">
          {isRequired ? null : (
            <button
              type="button"
              className="skip"
              onClick={() => nextQuestion()}
            >
              Skip
            </button>
          )}
          <button
            type="button"
            className="tooltips"
            onClick={() => nextQuestion()}
          >
            {loading ? "Loading..." : "Next"}
            {error && (
              <span className="error">
                Question required, Make sure to select an option first
              </span>
            )}
          </button>
        </div>
      </div>
    </form>
  )
})

const scrollToSection = selector => {
  if (document.body.clientWidth < 600)
    document.querySelector(selector)?.scrollIntoView?.({
      behavior: "smooth",
    })
}
