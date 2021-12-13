import React from "react"
import { MDXRenderer } from "gatsby-plugin-mdx"
import { Layout } from "./Layout"
import { Actions } from "./Actions"
import { Episode } from "./Episode"
import { Hero } from "./Hero"
import TableOfContent, { slugify } from "./TableOfContent"
import "./index.scss"

const Results = ({ year = 2020, data }) => {
  const content = data.allMdx.edges.map(({ node }) => ({
    body: node.body,
    title: node.frontmatter.title,
  }))
  const titles = data.allMdx.edges.map(({ node }) => node.frontmatter.title)
  return (
    <Layout year={year}>
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
    </Layout>
  )
}

export default Results
