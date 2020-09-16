import React from "react"
import { GatsbySeo } from "gatsby-plugin-next-seo"
import { Footer } from "./Footer"
import "../styles/commons.scss"

export const Layout = ({ children }) => (
  <>
    <GatsbySeo
      title="State of Dev in Morocco"
      description="State of Dev in Morocco"
      canonical="https://stateofdev.ma"
      openGraph={{
        url: "https://stateofdev.ma",
        title: "State of Dev in Morocco",
        description: "State of Dev in Morocco",
        images: [{ url: "https://www.stateofdev.ma/images/cover.png" }],
        site_name: "StateOfDevMa",
      }}
    />
    {children} <Footer />
  </>
)
