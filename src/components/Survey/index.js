import React, { useEffect, useState, useMemo } from "react"
import LoadingBar from "react-top-loading-bar"
import { navigate } from "gatsby"
import Category from "./Category"
import "./index.scss"
import { Header } from "../Header"

//

const Survey = ({ data }) => {
  const [index, setIndex] = useState(0)
  const [finished, setFinished] = useState(false)
  const [progress, setPr] = useState(0)

  const category = data[index].node
  const totalQuestions = useMemo(
    () =>
      data.reduce((previousValue, currentValue) => {
        return previousValue + currentValue.node.questions.length
      }, 0),
    [data]
  )
  const setProgress = n => {
    const step = 100 / totalQuestions
    setPr(progress + step * n)
  }
  useEffect(() => {
    if (finished) navigate("/thanks")
  }, [finished])

  const next = () => {
    if (index + 1 < data.length) {
      setIndex(prv => prv + 1)
    } else setFinished(true)
  }

  return (
    <>
      <Header>
        <p>
          Part {index + 1}: {category.title}
        </p>
      </Header>
      <LoadingBar color="#3dbe71" progress={progress} height={10} />
      <main>
        <Category
          category={category}
          next={next}
          key={category.id}
          setProgress={setProgress}
        />
      </main>
    </>
  )
}

export default Survey
