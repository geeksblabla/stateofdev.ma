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
        <div>
          <h1> State Of Dev In Morocco 2020 </h1>
          <p>
            Take part in the survey and let the us know what the developer’s job
            really looks like in Morocco 🇲🇦
          </p>
          <div className="actions">
            <Link className="primary" to="/beforeStart">
              Take Part In The Survey
            </Link>
            <p>
              <TimeIcon /> 5 min
            </p>
          </div>
        </div>
        <Crea />
      </main>
    </div>
  </div>
)
