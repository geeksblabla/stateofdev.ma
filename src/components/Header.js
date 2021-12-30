import React from "react"
import Logo from "../assets/logo.svg"
import { Link } from "gatsby"

export const Header = ({ children }) => (
  <div className="header">
    <Link to="/">
      <Logo />
    </Link>
    {children}
    {/* {children ? <Logo style={{ visibility: "hidden" }} /> : null} */}
  </div>
)
