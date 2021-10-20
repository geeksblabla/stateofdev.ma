import React, { useState } from "react"

import { useAuth } from "../components/Survey/service"
import { Header } from "../components"
import { navigate } from "gatsby-link"

const BeforeStart = () => {
  const [ready, setReady] = useState(false)
  // authenticate user
  // TODO: show error in case we cant creat an account to the user
  useAuth(() => {})

  const startSurvey = () => {
    navigate("/start")
  }

  return (
    <div className="survey">
      <div className="container">
        <Header>
          {/* <p>Before You Start</p> */}
          {/* <p> Play some music</p> */}
        </Header>
        <div className="rules">
          <h1> Before You Start : </h1>
          <ul>
            <li>
              We care about privacy; that's why all your answers are completely
              anonymous. We only rely on anonymous sessions to avoid spam
            </li>
            <li>All Questions are required unless you have a skip button</li>
            <li>Questions with (m) accepts multiple answers</li>
            <li>
              The survey is divided into 5 part: Profile, Learning & Education,
              Work, Technology and Community
            </li>
            <li>
              Please be honest. Our goal is to understand the Moroccan IT market
              and share results with the community.
            </li>
            <li>
              Do not refresh the questions page before submitting your answers
            </li>
          </ul>
          <br />
          <a className="primary" onClick={startSurvey}>
            Let’s do it
          </a>
        </div>
      </div>
    </div>
  )
}

export default BeforeStart
