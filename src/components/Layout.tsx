import React from "react"
import { GatsbySeo } from "gatsby-plugin-next-seo"
import { Footer } from "./Footer"
import "../styles/commons.scss"
import { ReCAPTCHA } from "react-google-recaptcha"

export const Layout = ({ children }) => (
  <>
    <GatsbySeo
      title="State of Dev In Morocco"
      description="In November 2020, 2287 developers from Morocco 🇲🇦 told us about their jobs satisfaction, salaries, and community contribution, how they learn and level up, which tools they’re using, and what they want to learn next."
      canonical="https://stateofdev.ma"
      openGraph={{
        url: "https://stateofdev.ma",
        title: "State of Dev In Morocco",
        description:
          "In November 2020, 2287 developers from Morocco 🇲🇦 told us about their jobs satisfaction, salaries, and community contribution, how they learn and level up, which tools they’re using, and what they want to learn next.",
        images: [{ url: "https://www.stateofdev.ma/images/cover.png" }],
        site_name: "StateOfDevMa",
      }}
    />
    {children}
    <ReCAPTCHA
      sitekey={process.env.RECAPTCHA_KEY}
      size="invisible"
      // ref={recaptchaRef}
    />
    <Footer />
  </>
)
