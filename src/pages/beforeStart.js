import React, { useState, useEffect, useRef } from "react"
import { navigate } from "gatsby"
import ReCAPTCHA from "react-google-recaptcha"

import firebase from "gatsby-plugin-firebase"
import { logIn } from "../components/Survey/service"
import { Layout, Header } from "../components"

const RECAPTCHA_KEY = "6Lf63dgZAAAAAB-8Iw8zXdVMAtDTh0eeef-uQDjg"

export default () => {
  const [ready, setReady] = useState(false)
  const recaptchaRef = useRef()

  const startSurvey = async () => {
    await recaptchaRef.current.executeAsync()
    const reCaptchaValue = recaptchaRef.current.getValue()
    if (ready && reCaptchaValue) navigate("/start")
  }
  useEffect(() => {
    if (!firebase) return
    logIn()
    return firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        console.log("test login")
        setReady(true)
      }
    })
  }, [firebase])

  return (
    <Layout>
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
                We care about privacy; that's why all your answers are
                completely anonymous. We rely on anonymous sessions to avoid
                spam
              </li>
              <li>All Questions are required unless you have a skip button</li>
              <li>Questions with (m) accepts multiple answers</li>
              <li>
                The survey is divided into 4 part: Profile, Work, Technology and
                Community
              </li>
              <li>
                Please be honest. Our goal is to understand the Moroccan IT
                market and share results with the community.
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
        <ReCAPTCHA
          sitekey={RECAPTCHA_KEY}
          size="invisible"
          ref={recaptchaRef}
        />
      </div>
    </Layout>
  )
}
