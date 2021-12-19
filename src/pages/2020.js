import React from "react"
import { graphql } from "gatsby"
import Results from "../components/Results/index"

export const query = graphql`
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

const Results2020 = ({ data }) => {
  console.log(data)
  return <Results data={data} year={2020} />
}

export default Results2020
