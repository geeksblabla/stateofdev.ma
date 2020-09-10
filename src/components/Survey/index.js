import React, { useEffect, useState } from "react"
import { navigate } from "gatsby"
import Category from "./Category"
import "./index.scss"
import { Header } from "../Header"

//

const Survey = ({ data }) => {
  const [index, setIndex] = useState(0)
  const [finished, setFinished] = useState(false)
  const category = data[index].node

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
        <p> Play some music</p>
      </Header>
      <main>
        <Category category={category} next={next} key={category.id} />
      </main>
    </>
  )
}

export default Survey
