import React, { useCallback, useState } from "react"
import { graphql, useStaticQuery } from "gatsby"
import { useGoogleReCaptcha } from "react-google-recaptcha-v3"

import Survey from "../components/Survey"
import { startSurvey, useAuth } from "../components/Survey/service"
import { Header, SurveyLayout } from "../components"

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
  const [ready, setReady] = useState(false)
  const { executeRecaptcha } = useGoogleReCaptcha()

  const initSurvey = useCallback(async () => {
    if (!executeRecaptcha) {
      console.log("Execute recaptcha not yet available")
    } else {
      const token = await executeRecaptcha("start")
      console.log({ token })
      if (token) startSurvey(token)
    }
  }, [executeRecaptcha])

  useAuth(() => {
    setReady(true)
    initSurvey()
  }, [initSurvey])

  return (
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
  )
}

const StartPage = () => (
  <SurveyLayout>
    <Start />
  </SurveyLayout>
)

export default StartPage
