import React, { useState, useEffect } from "react"
import { Link } from "gatsby"

import firebase from "gatsby-plugin-firebase"
import { logIn } from "../components/Survey/service"
import { Layout, Header } from "../components"

export default () => {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    if (!firebase) return
    logIn()
    return firebase.auth().onAuthStateChanged(async user => {
      if (user) {
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
                We care about privacy that's why all your answers is completely
                anonymous, we only use an anonymous session to prevent spam.
              </li>
              <li>
                Questions with <strong>(*)</strong> are required, if it's not
                the case, you can skip question using skip button.
              </li>
              <li>
                Questions with <strong> (multiple) </strong> are multiple
                answers allowed
              </li>
              <li>
                The survey is divided into 4 part: Profile, Work, Technology and
                Community
              </li>
              <li>
                Try to be honest answering questions As this will reflect our
                final result.
              </li>
              <li>
                Please do not refresh the page while submitting your answers
              </li>
            </ul>
            <br />
            <Link className="primary" to="/start">
              Let’s do it
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  )
}
