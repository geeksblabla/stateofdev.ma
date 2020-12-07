import React from "react"

const colors = [
  "#1EBA83",
  "#dd2f2e",
  "#F6AA2F",
  "#4DAFEA",
  "#132034",
  "#4543C5",
]

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
  if (results[0]?.grouped) console.log(results[0])

  return (
    <>
      <table>
        <tbody>
          {results.map((choice, i) => (
            <tr key={`item-${i}`}>
              <td className="label">
                <p> {choice.label || "No Response "} </p>
                <p>
                  {`${choice.percent}%`}
                  <span>/{total} resp</span>
                </p>
              </td>
              <td className="value">
                <div
                  className="bar"
                  style={{ width: `${choice.percent * x}%` }}
                >
                  {choice?.grouped?.results?.map(c => (
                    <div
                      style={{
                        width: `${(c.value * 100) / choice?.grouped?.total}%`,
                        background: colors[c.key],
                        height: "100%",
                      }}
                    />
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="choices">
        {results[0]?.grouped?.choices?.map((c, i) => (
          <li data-color={c} key={`item-${i}`}>
            <div
              className="square"
              style={{
                backgroundColor: colors[i],
              }}
            />
            {c}
          </li>
        ))}
      </div>
    </>
  )
}
