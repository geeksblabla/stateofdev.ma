import React from "react"
import { Header } from "../Header"
import Crea from "../../assets/Crea.svg"
import TimeIcon from "../../assets/time.svg"
import { Link } from "gatsby"

export const Hero = () => (
  <div className="hero">
    <div className="container ">
      <Header />
      <main>
        <div className="intro">
          <h1> State Of Dev In Morocco 2021 </h1>
          <p>
          Participate and let the us know what working in tech
            really looks like in Morocco
          </p>
          <div className="actions">
            <Link className="primary" to="/beforeStart">
              Take part in the survey
            </Link>
            <p>
              <TimeIcon /> 8 min
            </p>
          </div>
        </div>
        <div className="crea">
          <Crea />
        </div>
      </main>
    </div>
  </div>
)
