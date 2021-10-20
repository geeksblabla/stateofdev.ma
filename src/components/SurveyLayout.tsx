import React from "react"
import { Footer } from "./Footer"
import "../styles/commons.scss"
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3"
import { Layout } from "./Layout"

export const SurveyLayout = ({ children }) => (
  <GoogleReCaptchaProvider reCaptchaKey={process.env.GATSBY_RECAPTCHA_KEY}>
    <Layout>{children}</Layout>
  </GoogleReCaptchaProvider>
)
