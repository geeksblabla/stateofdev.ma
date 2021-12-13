import React from "react"
import { MDXProvider } from "@mdx-js/react"
import { Chart } from "../Chart"
import { TabItem, Tabs } from "../Tab"
import Link from "../Link"

const components = {
  Tabs,
  TabItem,
  a: Link,
}

export const Layout = ({ children, year = 2020 }) => (
  <MDXProvider
    components={{
      ...components,
      Chart: props => <Chart {...props} year={year} />,
    }}
  >
    <div className="results">{children} </div>
  </MDXProvider>
)
