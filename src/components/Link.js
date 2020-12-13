import React from "react"
import { Link as GatsbyLink } from "gatsby"
export default function Link({ children, href }) {
  if (href.startsWith("/")) {
    // Use Gatsby's Link component for internal site navigation
    // to benefit from the preloading features
    // See: https://www.gatsbyjs.org/docs/gatsby-link/
    return <GatsbyLink to={href}>{children}</GatsbyLink>
  }
  // Check if the link is for a section on the page
  // We don't want to add the attributes for the on page links
  const onPage = href.startsWith("#")
  return (
    <a
      href={href}
      // Open the link in a new page
      target={onPage ? null : "_blank"}
      // Add noopener and noreferrer for security reasons
      rel={onPage ? null : "noopener noreferrer"}
    >
      {children}
    </a>
  )
}
