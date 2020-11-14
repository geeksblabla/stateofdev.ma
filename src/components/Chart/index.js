import React from "react"
import "./index.scss"
import { BarChart } from "./BarChart"
import { getPercent, getQuestion } from "./utils"
import Pie from "./PieChart"

export const Chart = ({ id, sort = true, pie = false, title, condition }) => {
  const { label, results, total } = getQuestion(id, condition)
  const res = results
    .sort((b, a) =>
      sort ? (a.value > b.value ? 1 : b.value > a.value ? -1 : 0) : 0
    )
    .map(r => {
      return { ...r, percent: getPercent(r.value, total) }
    })

  return (
    <div className="chart">
      <h4>
        {title ? title : label}{" "}
        <span style={{ fontSize: "12px" }}> {total} responses </span>
      </h4>
      {pie ? <Pie results={res} /> : <BarChart results={res} />}
    </div>
  )
}
