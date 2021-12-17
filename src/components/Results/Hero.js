import React from "react"
import { Header } from "../Header"
import Crea from "../../assets/Crea.svg"
// import TimeIcon from "../../assets/time.svg"
import { Link } from "gatsby"

// TODO: add a markdown file in results which reflect hero section content

const data = {
  2020: {
    title: `State Of Dev In Morocco 2020`,
    description: `In November 2020,  2287 developers from Morocco 🇲🇦
  told us about their jobs satisfaction, salaries, and community
  contribution, how they learn and level up, which tools they’re
  using, and what they want to learn next.`,
  },

  2021: {
    title: `State Of Dev In Morocco 2021`,
    description: `In November 2021, 1098 developers from Morocco 🇲🇦
  told us about their jobs satisfaction, salaries, and community
  contribution, how they learn and level up, which tools they’re
  using, and what they want to learn next.`,
  },
}

export const Hero = ({ year = 2020 }) => {
  const content = data[year]

  return (
    <div className="hero">
      <div className="container ">
        <Header />
        <main>
          <div className="intro">
            <h1> {content.title} </h1>
            <p>{content.description}</p>
            <div className="actions">
              <Link className="primary" to="/#overview">
                Read the report
              </Link>
              <Link to="/#video-episode" className="outline">
                Watch GeeksBlabla episode
              </Link>
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
}
