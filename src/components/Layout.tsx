import React from "react"
import "../styles/commons.scss"
import { Footer } from "./Footer"
export const Layout = ({ children }) => (
  <>
    {children} <Footer />
  </>
)
