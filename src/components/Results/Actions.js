import React from "react"
import { Link } from "gatsby"
import Playground from "../../assets/Playground.svg"
import Download from "../../assets/Download.svg"
import Article from "../../assets/Article.svg"

export const Actions = ({ year = 2021 }) => {
  return (
    <div className="actions-list">
      <div className="container">
        <div className="action-item">
          <Playground />
          <p> Play with survey results using online playground </p>
          <Link to={`/playground/#year=${year}`} className="outline">
            Open results playground
          </Link>
        </div>

        <div className="action-item">
          <Download />
          <p> Interested to go further with the survey results? </p>
          <a
            className="outline"
            download
            target="_blank"
            href={`https://github.com/DevC-Casa/stateofdev.ma/blob/master/results/${year}/state-of-dev-ma-${year}.zip?raw=true`}
          >
            Download raw results
          </a>
        </div>

        <div className="action-item">
          <Article />
          <p> Share your perspective about the results </p>
          <a
            className="outline"
            download
            target="_blank"
            href="https://github.com/DevC-Casa/stateofdev.ma/"
          >
            Write an article
          </a>
        </div>
      </div>
    </div>
  )
}
