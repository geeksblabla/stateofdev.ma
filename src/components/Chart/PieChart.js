import React, { useState } from "react"
import { PieChart } from "react-minimal-pie-chart"
import ReactTooltip from "react-tooltip"

const colors = [
  "#1EBA83",
  "#dd2f2e",
  "#F6AA2F",
  "#4DAFEA",
  "#132034",
  "#4543C5",
]

function makeTooltipContent(entry, total) {
  return `${entry.label} (${entry.value}/${total} res)`
}

const normalizeData = data =>
  data.map((d, i) => ({ ...d, title: d.label, color: colors[i] || "#6A2135" }))

function Pie({ results, total }) {
  const [hovered, setHovered] = useState(null)

  const data = normalizeData(results).map((entry, i) => {
    if (hovered === i) {
      return {
        ...entry,
      }
    }
    return entry
  })

  const lineWidth = 40

  return (
    <div className="pie-chart">
      <div data-tip="" data-for="chart" className="chart-content">
        <PieChart
          style={{
            fontSize: "8px",
          }}
          data={data}
          radius={PieChart.defaultProps.radius - 6}
          lineWidth={lineWidth}
          paddingAngle={2}
          segmentsStyle={{ transition: "stroke .3s", cursor: "pointer" }}
          animate
          label={({ dataEntry }) => Math.round(dataEntry.percentage) + "%"}
          labelPosition={100 - lineWidth / 2}
          labelStyle={{
            fontSize: "7px",
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
          backgroundColor="#222"
          arrowColor="#222"
          color="#FFF"
          getContent={() =>
            typeof hovered === "number"
              ? makeTooltipContent(data[hovered], total)
              : null
          }
        />
      </div>
      <ul>
        {data.map((e, i) => (
          <li data-color={e.color} key={`item-${i}`}>
            <div
              className="square"
              style={{
                backgroundColor: e.color,
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
