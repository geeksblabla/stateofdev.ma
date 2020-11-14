import React, { useState } from "react"
import { PieChart } from "react-minimal-pie-chart"
import ReactTooltip from "react-tooltip"

const colors = [
  "#00D6BF",
  "#577EFF",
  "#0f8974",
  "#C13C37",
  "#ff9800",
  "#795548",
]

function makeTooltipContent(entry) {
  return `${entry.label} (${entry.value})`
}

const normalizeData = data =>
  data.map((d, i) => ({ ...d, title: d.label, color: colors[i] || "#6A2135" }))

function Pie({ results }) {
  const [hovered, setHovered] = useState(null)

  const data = normalizeData(results).map((entry, i) => {
    if (hovered === i) {
      return {
        ...entry,
      }
    }
    return entry
  })

  const lineWidth = 60

  return (
    <div className="pie-chart">
      <div data-tip="" data-for="chart">
        <PieChart
          style={{
            fontSize: "8px",
            maxHeight: "300px",
          }}
          data={data}
          radius={PieChart.defaultProps.radius - 6}
          lineWidth={60}
          segmentsStyle={{ transition: "stroke .3s", cursor: "pointer" }}
          animate
          label={({ dataEntry }) => Math.round(dataEntry.percentage) + "%"}
          labelPosition={100 - lineWidth / 2}
          labelStyle={{
            fill: "#fff",
            opacity: 0.75,
            pointerEvents: "none",
          }}
          onMouseOver={(_, index) => {
            setHovered(index)
          }}
          onMouseOut={() => {
            setHovered(null)
          }}
        />
        <ReactTooltip
          id="chart"
          getContent={() =>
            typeof hovered === "number"
              ? makeTooltipContent(data[hovered])
              : null
          }
        />
      </div>
      <ul>
        {data.map((e, i) => (
          <li data-color={e.color} key={`item-${i}`}>
            <div
              style={{
                height: "15px",
                width: "15px",
                backgroundColor: e.color,
                marginRight: "5px",
              }}
            />
            {e.label}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Pie
