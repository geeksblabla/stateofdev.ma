import React from "react"
import { MDXProvider } from "@mdx-js/react"
import { MDXRenderer } from "gatsby-plugin-mdx"
import { Chart } from "../Chart"
import { TabItem, Tabs } from "../Tab"
import Link from "../Link"
import { slugify } from "./TableOfContent"

const components = {
  Tabs,
  TabItem,
  a: Link,
}

export const MDXContent = ({ content, year }) => (
  <MDXProvider
    components={{
      ...components,
      Chart: props => <Chart year={year} {...props} />,
    }}
  >
    <article className="lg:pl-16 pt-16  prose max-w-none prose-img:rounded-xl  prose-a:text-emerald-600">
      {content.map((c, i) => (
        <section id={slugify(c.title)} key={`section-${i}`}>
          <MDXRenderer>{c.body}</MDXRenderer>
        </section>
      ))}
    </article>
  </MDXProvider>
)
