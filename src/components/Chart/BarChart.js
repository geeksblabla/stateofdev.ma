import React from "react"
import ReactTooltip from "react-tooltip"
import { getPercent } from "./utils"

const colors = [
  "#059669",
  "#10B981",
  "#34D399",
  "#6EE7B7",
  "#A7F3D0",
  "#D1FAE5",
  "#ECFDF5",
  "#dd2f2e",
  "#F6AA2F",
  "#4DAFEA",
  "#132034",
  "#4543C5",
]

function makeTooltipContent(data) {
  if (!data) return null
  return (
    <>
      <ul>
        {data?.results?.map((c, i) => (
          <li key={`label-${i}`}>
            {c.label} : {c.value} : {`${getPercent(c.value, data?.total)}%`}
          </li>
        ))}
      </ul>
    </>
  )
}

export const BarChart = ({ results, total }) => {
  const [hovered, setHovered] = React.useState(null)
  console.log(hovered)
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
    <>
      <table data-tip="" data-for="bar">
        <tbody>
          {results.map((choice, i) => (
            <Bar
              choice={choice}
              key={`item-${i}`}
              x={x}
              total={total}
              index={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            />
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
      <ReactTooltip
        id="bar"
        aria-haspopup="true"
        getContent={() => makeTooltipContent(results[hovered]?.grouped)}
      />
    </>
  )
}

const Bar = ({ choice, x, total, onMouseEnter, onMouseLeave }) => {
  return (
    <>
      <tr onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
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
            style={{
              width: `${choice.percent * x}%`,
              background: choice?.grouped ? "transparent" : "var(--green)",
            }}
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
    </>
  )
}
