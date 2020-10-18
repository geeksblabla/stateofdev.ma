import React, { useState, useEffect } from "react"
import { Link, graphql, useStaticQuery } from "gatsby"

import firebase from "gatsby-plugin-firebase"
import Survey from "../components/Survey"
import { logIn, startSurvey } from "../components/Survey/service"
import { Layout, Header } from "../components"

const SurveyData = graphql`
  {
    allSurveyYaml {
      edges {
        node {
          id
          title
          label
          position
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
  const survey = useStaticQuery(SurveyData)
  const data = survey.allSurveyYaml.edges.sort(
    (a, b) => a.node.position > b.position
  )
  const [ready, setReady] = useState(false)
  useEffect(() => {
    if (!firebase) return
    logIn()
    return firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        setReady(true)
        await startSurvey()
      }
    })
  }, [firebase])

  return (
    <Layout>
      <div className="survey">
        <div className="container">
          {ready ? (
            <Survey data={data} />
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
