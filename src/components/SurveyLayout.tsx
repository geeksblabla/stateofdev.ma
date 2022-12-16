import React from "react"
import "react-toastify/dist/ReactToastify.css"
import "../styles/commons.scss"
import { ToastContainer } from "react-toastify"
import { Layout } from "./Layout"

export const SurveyLayout = ({ children }) => (
  <>
    <ToastContainer />
    <Layout>{children}</Layout>
  </>
)
