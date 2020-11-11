import React from "react"
import { MDXProvider } from "@mdx-js/react"
import { Chart } from "./Chart"

const components = {
  Chart: Chart,
}

export const Layout = ({ children }) => (
  <MDXProvider components={components}>
    <div className="container"> {children}</div>
  </MDXProvider>
)
