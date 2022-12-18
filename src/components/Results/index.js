import React from "react"
import { Layout } from "../Layout"
import { Actions } from "./Actions"
import { Episode } from "./Episode"
import { Hero } from "./Hero"
import TableOfContent from "./TableOfContent"
import "./index.scss"
import { MDXContent } from "./MdxContent"

const Results = ({ year = 2020, data }) => {
  const content = data.allMdx.edges.map(({ node }) => ({
    body: node.body,
    title: node.frontmatter.title,
  }))
  const titles = data.allMdx.edges.map(({ node }) => node.frontmatter.title)
  return (
    <Layout year={year}>
      <Hero year={year} />
      <div className="lg:mx-auto  flex flex-row max-w-screen-xl  mx-4">
        <TableOfContent titles={titles} />
        <MDXContent year={year} content={content} />
      </div>
      <Actions year={year} />
      <Episode year={year} />
    </Layout>
  )
}

export default Results
