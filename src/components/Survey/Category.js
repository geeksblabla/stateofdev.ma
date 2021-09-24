import React, { useCallback, useState } from "react"
import { useGoogleReCaptcha } from "react-google-recaptcha-v3"
import { useForm } from "react-hook-form"
import Question from "./Question"
import { setAnswers } from "./service"

export default React.memo(({ category, next }) => {
  const [loading, setLoading] = useState(false)
  const { register, getValues } = useForm()
  const { executeRecaptcha } = useGoogleReCaptcha()
  const [QIndex, setQIndex] = useState(0)
  const isLastQuestion = category.questions.length === QIndex + 1
  const isRequired = !!category.questions[QIndex].required

  const nextQuestion = async () => {
    const name = `${category.label}-q-${QIndex}`
    const value = getValues(name)

    if (isRequired && value.length === 0) return

    if (isLastQuestion) {
      await submitData()
    } else {
      setQIndex(QIndex => QIndex + 1)
    }
    scrollToSection(".quiz-form")
  }

  const submitData = useCallback(async () => {
    if (!executeRecaptcha) {
      console.log("Execute recaptcha not yet available")
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

  // const submitData = async () => {
  //   const data = getValues()
  //   setLoading(true)
  //   try {
  //     await setAnswers(data)
  //     next()
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }
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
        {isRequired ? null : (
          <button type="button" className="skip" onClick={() => nextQuestion()}>
            Skip
          </button>
        )}
        <button type="button" onClick={() => nextQuestion()}>
          {loading ? "Loading..." : "Next"}
        </button>
      </div>
    </form>
  )
})

const scrollToSection = selector => {
  if (document.body.clientWidth < 600)
    document.querySelector(selector).scrollIntoView({
      behavior: "smooth",
    })
}
