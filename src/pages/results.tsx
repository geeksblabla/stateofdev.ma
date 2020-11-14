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
      {content.map((c, i) => (
        <div key={`item-${i}`}>
          <MDXRenderer>{c}</MDXRenderer>
          <hr />
        </div>
      ))}
    </Layout>
  )
}

export default Results
