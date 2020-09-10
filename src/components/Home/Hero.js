import React from "react"
import { Header } from "../Header"
import Crea from "../../assets/Crea.svg"
import { Link } from "gatsby"

export const Hero = () => (
  <div className="hero">
    <div className="container ">
      <Header />
      <main>
        <div>
          <h1> State Of Dev In Morocco 2020 </h1>
          <p>
            Take part in the survey and let the us know what the web developer’s
            job really looks like in Morocco
          </p>
          <Link className="primary" to="/start">
            Take Part In The Survey
          </Link>
        </div>
        <Crea />
      </main>
    </div>
  </div>
)
