import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { MDXRenderer } from "gatsby-plugin-mdx"
import { Layout } from "./Layout"
import { Download } from "./Download"
import { Hero } from "../Home/Hero"
import TableOfContent, { slugify } from "./TableOfContent"
import "./index.scss"
import { Footer } from "../Footer"

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
              <hr />
            </section>
          ))}
        </div>
      </div>
      <div className="container">
        <Download />
      </div>
      <Footer />
    </Layout>
  )
}

export default Results
