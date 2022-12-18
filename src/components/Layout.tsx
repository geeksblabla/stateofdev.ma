import React from "react"
import { GatsbySeo } from "gatsby-plugin-next-seo"
import { Footer } from "./Footer"
import "../styles/commons.scss"
import { Header } from "./Header"

export const Layout = ({ children, year = undefined }) => (
  <>
    {year === undefined ? (
      <GatsbySeo
        title="State Of Dev In Morocco 🇲🇦"
        description="Participate and let us know what working in tech really looks like in Morocco 🇲🇦"
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
    ) : (
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
    )}
    <Header />
    {children}
    <Footer />
  </>
)
