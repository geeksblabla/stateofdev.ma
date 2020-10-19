import React from "react"
import { GatsbySeo } from "gatsby-plugin-next-seo"
import { Footer } from "./Footer"
import "../styles/commons.scss"

export const Layout = ({ children }) => (
  <>
    <GatsbySeo
      title="State of Dev In Morocco"
      description="Take part in the survey and let the us know what the developer’s job really looks like in Morocco 🇲🇦"
      canonical="https://stateofdev.ma"
      openGraph={{
        url: "https://stateofdev.ma",
        title: "State of Dev In Morocco",
        description:
          "Take part in the survey and let the us know what the developer’s job really looks like in Morocco 🇲🇦",
        images: [{ url: "https://www.stateofdev.ma/images/cover.png" }],
        site_name: "StateOfDevMa",
      }}
    />
    {children} <Footer />
  </>
)
