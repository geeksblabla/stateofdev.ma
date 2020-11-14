import React from "react"

export const BarChart = ({ results }) => {
  const x = (
    90 /
    Math.max.apply(
      Math,
      results.map(function (o) {
        return o.percent
      })
    )
  ).toFixed(1)

  return (
    <table>
      <tbody>
        {results.map((choice, i) => (
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
  )
}
