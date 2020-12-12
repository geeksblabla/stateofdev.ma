import React from "react"
import { Link } from "gatsby"

export const Download = () => {
  return (
    <div className="download">
      <div className="d-main">
        <h1> Play with survey results using online playground </h1>
        <div className="actions">
          <a
            className="primary"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            download
            target="_blank"
            href="https://github.com/DevC-Casa/stateofdev.ma/blob/results_prview/results/2020/state-od-dev-ma-2020.zip?raw=true"
          >
            <DownloadIcon />
            Download Survey Results
          </a>
          <Link to="/playground" className="outline">
            Open Playground
          </Link>
        </div>
      </div>
    </div>
  )
}

function DownloadIcon(props) {
  return (
    <svg
      style={{ marginRight: 10 }}
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12.121 15.436V3.395M15.037 12.508l-2.916 2.928-2.916-2.928"
        stroke="#fff"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.754 8.128h.933a3.684 3.684 0 013.684 3.685v4.884a3.675 3.675 0 01-3.675 3.675H6.556a3.685 3.685 0 01-3.685-3.685v-4.885a3.675 3.675 0 013.675-3.674h.942"
        stroke="#fff"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
