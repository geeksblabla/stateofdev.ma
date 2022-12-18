import React, { useEffect } from "react"
import { graphql, useStaticQuery } from "gatsby"

import Survey from "../components/Survey"
import { SurveyLayout } from "../components"
import { setSurveyData } from "../components/Survey/useSurvey"
import { AuthContainer } from "../components/Survey/AuthContainer"

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

export const Start = () => {
  const survey = useStaticQuery(SurveyData)
  const data = survey.allSurveyYaml.edges

  useEffect(() => {
    setSurveyData(data)
  }, [])

  return <Survey data={data} />
}

const StartPage = () => (
  <SurveyLayout>
    <AuthContainer>
      <Start />
    </AuthContainer>
  </SurveyLayout>
)

export default StartPage
