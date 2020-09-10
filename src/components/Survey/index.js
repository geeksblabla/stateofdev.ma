import React, { useEffect, useState } from "react"
import { navigate } from "gatsby"
import Category from "./Category"
import "./index.scss"

//

const Survey = ({ data }) => {
  const [index, setIndex] = useState(0)
  const [finished, setFinished] = useState(false)
  const category = data[index].node
  const next = () => {
    if (index + 1 < data.length) {
      setIndex(prv => prv + 1)
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    } else setFinished(true)
  }

  return (
    <div>
      {finished ? (
        <h1> Thank you for being part of the survey </h1>
      ) : (
        <Category category={category} next={next} key={category.id} />
      )}
    </div>
  )
}

export default Survey
