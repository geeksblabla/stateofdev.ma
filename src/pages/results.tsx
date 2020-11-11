import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { MDXRenderer } from "gatsby-plugin-mdx"
import { Layout } from "../components/ResultsLayout"

const DATA = graphql`
  {
    allMdx {
      edges {
        node {
          body
        }
      }
    }
  }
`

const Results = () => {
  const data = useStaticQuery(DATA)
  const content = data.allMdx.edges.map(({ node }) => node.body)
  return (
    <Layout>
      {content.map(c => (
        <>
          <MDXRenderer>{c}</MDXRenderer>
          <hr />
        </>
      ))}
    </Layout>
  )
}

export default Results
