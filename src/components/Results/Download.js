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
            <svg
              style={{ marginRight: 10 }}
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.1211 15.436L12.1211 3.39502"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M15.0371 12.5083L12.1211 15.4363L9.20511 12.5083"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M16.7541 8.12793H17.6871C19.7221 8.12793 21.3711 9.77693 21.3711 11.8129V16.6969C21.3711 18.7269 19.7261 20.3719 17.6961 20.3719L6.55609 20.3719C4.52109 20.3719 2.87109 18.7219 2.87109 16.6869V11.8019C2.87109 9.77293 4.51709 8.12793 6.54609 8.12793L7.48809 8.12793"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
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
