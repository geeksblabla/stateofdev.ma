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
            <h1> Before You Start </h1>
            <p>
              * we care about privacy that why we are using an anonymous
              authentication system to make sure we have 1 submission per user{" "}
            </p>
            <p>
              * Question with (*) is required and (multiple) are multiple
              answers allowed and You can skip question using skip button if its
              not required and the question scope not include you{" "}
            </p>
            <p>
              * Try to be honest answering questions As this will reflect our
              final result.
            </p>
            <p>
              * Please do not refresh the page while submitting your answers{" "}
            </p>
            <p>You can play some music during the survey</p>
            <p>....</p>
            <p> </p>
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
