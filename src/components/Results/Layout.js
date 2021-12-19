import React from "react"
import { MDXProvider } from "@mdx-js/react"
import { GatsbySeo } from "gatsby-plugin-next-seo"
import { Chart } from "../Chart"
import { TabItem, Tabs } from "../Tab"
import Link from "../Link"

const components = {
  Tabs,
  TabItem,
  a: Link,
}

export const Layout = ({ children, year = 2020 }) => (
  <>
    <GatsbySeo
      title={`State Of Dev In Morocco ${year} 🇲🇦`}
      description={`State Of Dev In Morocco ${year} 🇲🇦 | Moroccan developers jobs satisfaction, salaries, and community contribution, how they learn and level up, which tools they’re using, and what they want to learn next. `}
      canonical="https://stateofdev.ma"
      openGraph={{
        url: `https://stateofdev.ma/${year}`,
        title: `State Of Dev In Morocco ${year} 🇲🇦`,
        description: `State Of Dev In Morocco ${year} 🇲🇦 | Moroccan developers jobs satisfaction, salaries, and community contribution, how they learn and level up, which tools they’re using, and what they want to learn next. `,
        images: [{ url: "https://www.stateofdev.ma/images/cover.png" }],
        site_name: "StateOfDevMa",
      }}
    />
    <MDXProvider
      components={{
        ...components,
        Chart: props => <Chart year={year} {...props} />,
      }}
    >
      <div className="results">{children} </div>
    </MDXProvider>
  </>
)
