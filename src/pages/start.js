import React, { useState, useEffect } from "react"
import { Link, graphql, useStaticQuery } from "gatsby"

import firebase from "gatsby-plugin-firebase"
import Survey from "../components/Survey"
import { logIn } from "../components/Survey/service"
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
    return firebase.auth().onAuthStateChanged(user => {
      if (user) {
        setReady(true)
        console.log("User:", user.uid)
      }
    })
  }, [firebase])

  return (
    <Layout>
      <div className="survey">
        <div className="container">
          <Header>
            <p>Part 1: The community</p>
            <p> Play some music</p>
          </Header>
          {ready ? <Survey data={data.allArYaml.edges} /> : "loading"}
        </div>
      </div>
    </Layout>
  )
}
