import React, { useState, useEffect } from "react"
import { Link, graphql, useStaticQuery } from "gatsby"

import firebase from "gatsby-plugin-firebase"
import Survey from "../components/Survey"
import { logIn, startSurvey } from "../components/Survey/service"
import { Layout, Header } from "../components"

const QuiZ = graphql`
  {
    allArYaml {
      edges {
        node {
          id
          title
          label
          questions {
            label
            choices
            required
            multiple
          }
        }
      }
    }
  }
`

export default () => {
  const data = useStaticQuery(QuiZ)
  const [ready, setReady] = useState(false)
  useEffect(() => {
    if (!firebase) return
    logIn()
    return firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        setReady(true)
        await startSurvey()
        console.log("User:", user.uid)
      }
    })
  }, [firebase])

  return (
    <Layout>
      <div className="survey">
        <div className="container">
          {ready ? (
            <Survey data={data.allArYaml.edges} />
          ) : (
            <>
              <Header>
                <p> Play some music</p>
              </Header>
              <main>loading</main>
            </>
          )}
        </div>
      </div>
    </Layout>
  )
}
