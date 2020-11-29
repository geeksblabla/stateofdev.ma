import React from "react"

export const BarChart = ({ results, total }) => {
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
            <td className="label">
              <p> {choice.label || "No Response "} </p>
              <p>
                {`${choice.percent}%`}
                <span>/{total} response</span>
              </p>
            </td>
            <td className="value">
              <div
                className="bar"
                style={{ width: `${choice.percent * x}%` }}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
