import React from "react"

export const Footer = () => (
  <div className="footer">
    <div className="container">
      <p>
        Made with ❤️ By{" "}
        <a
          style={{ color: "#3dbe71" }}
          href="https://geeksblabla.com/"
          target="_blank"
        >
          Geeksblabla
        </a>
      </p>
      <p> © Geeksblabla {new Date()?.getFullYear()} </p>
    </div>
  </div>
)
