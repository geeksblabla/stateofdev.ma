import React from "react"

const TableOfContent = ({ titles }) => (
  <div className="table-of-content">
    <div>
      <h2> Table of contents</h2>
      <ul>
        <li className="active">01: Overview</li>
        {titles.map((title, index) => (
          <li key={`item-${index}`}>
            0{index + 1}: {title}
          </li>
        ))}
      </ul>
    </div>
  </div>
)

export default TableOfContent
