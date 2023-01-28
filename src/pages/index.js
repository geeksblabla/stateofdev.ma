import React from "react"
import Results from "../components/Results/index"
import { graphql } from "gatsby"

export const query = graphql`
  {
    allMdx(
      sort: { fields: frontmatter___position, order: ASC }
      filter: { fileAbsolutePath: { regex: "/2021/" } }
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

const Results2021 = ({ data }) => {
  return <Results data={data} year={2021} />
}

export default Results2021

// import React from "react"
// import Home from "../components/Home"
// import { Layout } from "../components/Layout"

// const IndexPage = () => {
//   return (
//     <Layout>
//       <Home />
//     </Layout>
//   )
// }

// export default IndexPage
