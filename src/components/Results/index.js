import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { MDXRenderer } from "gatsby-plugin-mdx"
import { Layout } from "./Layout"
import { Actions } from "./Actions"
import { Episode } from "./Episode"
import { Hero } from "../Home/Hero"
import TableOfContent, { slugify } from "./TableOfContent"
import "./index.scss"
import { Footer } from "../Footer"

const DATA = graphql`
  {
    allMdx(
      sort: { fields: frontmatter___position, order: ASC }
      filter: { fileAbsolutePath: { regex: "/2020/" } }
    ) {
      edges {
        node {
          body
          id
          frontmatter {
            position
            title
          }
        }
      }
    }
  }
`

const Results = () => {
  const data = useStaticQuery(DATA)
  const content = data.allMdx.edges.map(({ node }) => ({
    body: node.body,
    title: node.frontmatter.title,
  }))
  const titles = data.allMdx.edges.map(({ node }) => node.frontmatter.title)
  return (
    <Layout>
      <Hero />

      <div className="container main">
        <TableOfContent titles={titles} />
        <div className="content mdx-content">
          {content.map((c, i) => (
            <section id={slugify(c.title)} key={`section-${i}`}>
              <MDXRenderer>{c.body}</MDXRenderer>
            </section>
          ))}
        </div>
      </div>

      <Actions />

      <Episode />
      <Footer />
    </Layout>
  )
}

export default Results
