import React from "react"
import { GatsbySeo } from "gatsby-plugin-next-seo"
import { Footer } from "./Footer"
import "../styles/commons.scss"
export const Layout = ({ children }) => (
  <>
    <GatsbySeo
      title="State Of Dev In Morocco"
      description="Participate and let  us know what working in tech really looks like in Morocco 🇲🇦"
      canonical="https://stateofdev.ma"
      openGraph={{
        url: "https://stateofdev.ma",
        title: "State Of Dev In Morocco",
        description:
          "Participate and let  us know what working in tech really looks like in Morocco 🇲🇦",
        images: [{ url: "https://www.stateofdev.ma/images/cover.png" }],
        site_name: "StateOfDevMa",
      }}
    />
    {children}
    <Footer />
  </>
)
