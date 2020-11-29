import React from "react"
import { MDXProvider } from "@mdx-js/react"
import { Chart } from "../Chart"
import { TabItem, Tabs } from "../Tab"

const components = {
  Chart: Chart,
  Tabs,
  TabItem,
}

export const Layout = ({ children }) => (
  <MDXProvider components={components}>
    <div className="results">{children} </div>
  </MDXProvider>
)
