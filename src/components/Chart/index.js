import React from "react"
import DATA from "../../../results/2020/data/results.json"
import Questions from "../../../results/2020/data/questions.json"
import "./index.scss"

const reducer = (accumulator, currentValue) => {
  if (currentValue === undefined || currentValue === null) return accumulator
  if (Array.isArray(currentValue)) {
    currentValue.forEach(element => {
      accumulator[element] = (accumulator[element] || 0) + 1
    })
  } else {
    accumulator[currentValue] = (accumulator[currentValue] || 0) + 1
  }
  accumulator["total"] = (accumulator["total"] || 0) + 1

  return accumulator
}

const getQuestion = id => {
  const question = Questions[id]
  const results = []
  const d = DATA.results.map(r => r[id]).reduce(reducer, {})
  Object.keys(d).map(function (key) {
    if (key !== undefined && key !== "total") {
      results.push({ label: question.choices[key] || key, value: d[key] })
    }
  })
  return { ...question, results, total: d.total }
}

const getPercent = (value, total) => {
  return ((value * 100) / total).toFixed(1)
}

export const Chart = ({ id, sort = true }) => {
  const { label, results, total } = getQuestion(id)
  const res = results
    .sort((b, a) =>
      sort ? (a.value > b.value ? 1 : b.value > a.value ? -1 : 0) : 0
    )
    .map(r => {
      return { ...r, percent: getPercent(r.value, total) }
    })
  const x = (
    90 /
    Math.max.apply(
      Math,
      res.map(function (o) {
        return o.percent
      })
    )
  ).toFixed(1)

  return (
    <div className="chart">
      <h4>
        {label} <span style={{ fontSize: "12px" }}> {total} responses </span>
      </h4>
      <table>
        <tbody>
          {res.map((choice, i) => (
            <tr key={`item-${i}`}>
              <td className="label">{choice.label || "No Response "}</td>
              <td className="value">
                <div
                  className="bar"
                  style={{ width: `${choice.percent * x}%` }}
                />
                <p> {`${choice.percent}%`} </p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
