import React, { useCallback, useState } from "react"
import { useForm } from "react-hook-form"
import Question from "./Question"
import { setAnswers } from "./service"

export default React.memo(({ category, next, setProgress }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const { register, getValues } = useForm()
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
    scrollToSection("#steps")
  }
  const backToPreviousQ = () => {
    if (QIndex > 0) {
      setQIndex(QIndex => QIndex - 1)
      setProgress(-1)
    }
  }

  const submitData = useCallback(async () => {
    const data = getValues()
    setLoading(true)
    try {
      await setAnswers(data)
      next()
    } catch (error) {
      console.log(error)
    }
  }, [])

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
      <div className="actions flex flex-row justify-between mt-3">
        <div>
          {QIndex > 0 && <BackButton onClick={() => backToPreviousQ()} />}
        </div>
        <div className="relative">
          {isRequired ? null : (
            <button
              type="button"
              className="tooltips focus:outline-4 rounded-xl bg-white px-6 md:px-8 py-3 font-medium  text-emerald-600 underline border-emerald-600 transition  mr-2"
              onClick={() => nextQuestion()}
            >
              Skip
            </button>
          )}
          <button
            type="button"
            className="tooltips focus:outline-4 rounded-xl bg-emerald-600 px-8 md:px-10 py-3 font-medium text-white shadow-md outline-white transition hover:bg-emerald-500 "
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

const BackButton = ({ onClick }) => (
  <div
    onClick={onClick}
    className="group flex w-full cursor-pointer items-center justify-center rounded-md bg-transparent  pr-6 py-2 text-gray-500 hover:text-gray-700 transition"
  >
    <svg
      className="flex-0 ml-4 h-7 w-7 transition-all group-hover:-translate-x-1 rotate-180"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="3"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M14 5l7 7m0 0l-7 7m7-7H3"
      />
    </svg>
    <span className="group flex w-full items-center justify-center rounded py-1 text-center font-bold">
      Back
    </span>
  </div>
)
