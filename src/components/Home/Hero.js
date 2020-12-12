import React from "react"
import { Header } from "../Header"
import Crea from "../../assets/Crea.svg"
// import TimeIcon from "../../assets/time.svg"
// import { Link } from "gatsby"

export const Hero = () => (
  <div className="hero">
    <div className="container ">
      <Header />
      <main>
        <div className="intro">
          <h1> State Of Dev In Morocco 2020 </h1>
          <p>
            In November 2020, <strong> 2287 developers from Morocco 🇲🇦 </strong>
            told us about their jobs satisfaction, salaries, and community
            contribution, how they learn and level up, which tools they’re
            using, and what they want to learn next.
          </p>
          <div className="actions">
            <a className="primary" href="#overview">
              Read Report
              {/* Take Part In The Survey */}
            </a>
            {/* <p>
              <TimeIcon /> 5 min
            </p> */}
          </div>
        </div>
        <div className="crea">
          <Crea />
        </div>
      </main>
    </div>
  </div>
)
