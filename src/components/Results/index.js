import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { MDXRenderer } from "gatsby-plugin-mdx"
import { Layout } from "./Layout"
import { Hero } from "../Home/Hero"
import TableOfContent from "./TableOfContent"
import "./index.scss"
import { TabItem, Tabs } from "../Tab"

const DATA = graphql`
  {
    allMdx(sort: { fields: frontmatter___position, order: ASC }) {
      edges {
        node {
          frontmatter {
            title
          }
          body
        }
      }
    }
  }
`

const Results = () => {
  const data = useStaticQuery(DATA)
  const content = data.allMdx.edges.map(({ node }) => node.body)
  const titles = data.allMdx.edges.map(({ node }) => node.frontmatter.title)
  return (
    <Layout>
      <Hero />

      <div className="container main">
        <TableOfContent titles={titles} />
        <div className="content mdx-content">
          {content.map((c, i) => (
            <div key={`item-${i}`}>
              <MDXRenderer>{c}</MDXRenderer>
              <hr />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}

export default Results
