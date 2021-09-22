import React, { useState } from "react"
import { graphql, useStaticQuery } from "gatsby"

import Survey from "../components/Survey"
import { startSurvey, useAuth } from "../components/Survey/service"
import { Layout, Header } from "../components"

const SurveyData = graphql`
  {
    allSurveyYaml(sort: { fields: position, order: ASC }) {
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
  const data = survey.allSurveyYaml.edges
  const [ready, setReady] = useState(false)
  useAuth(() => {
    setReady(true)
    startSurvey()
  })

  return (
    <Layout>
      <div className="survey">
        <div className="container">
          {ready ? (
            <Survey data={data} />
          ) : (
            <>
              <Header />
              <main>loading</main>
            </>
          )}
        </div>
      </div>
    </Layout>
  )
}
