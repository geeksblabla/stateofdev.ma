import React from "react"
import "react-toastify/dist/ReactToastify.css"
import "../styles/commons.scss"
import { ToastContainer } from "react-toastify"
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3"
import { Layout } from "./Layout"

export const SurveyLayout = ({ children }) => (
  <GoogleReCaptchaProvider reCaptchaKey={process.env.GATSBY_RECAPTCHA_KEY}>
    <ToastContainer />
    <Layout>{children}</Layout>
  </GoogleReCaptchaProvider>
)
