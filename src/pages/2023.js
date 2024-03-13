import React from "react"
import Results from "../components/Results/index"
import { graphql } from "gatsby"

export const query = graphql`
  {
    allMdx(
      sort: { fields: frontmatter___position, order: ASC }
      filter: { fileAbsolutePath: { regex: "/2023/" } }
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

const Results2023 = ({ data }) => {
  return <Results data={data} year={2023} />
}

export default Results2023
