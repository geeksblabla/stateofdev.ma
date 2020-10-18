import React from "react"
import Community from "../../assets/Community.svg"
import Trends from "../../assets/Trends.svg"
import Protips from "../../assets/Protips.svg"

import Knowledge from "../../assets/Knowledge.svg"

export const Why = () => (
  <div className="container why">
    <h1> Why Should You Take Part In The Survey? </h1>
    <main>
      <Card title="Share Knowledge" icon={<Knowledge />}>
        <p>
          You’ll co-create a report that’ll be available for everyone across the
          world, shedding more light on the state of development in Morocco.
        </p>
      </Card>
      <Card title="More Community Impact" icon={<Community />}>
        <p>
          The report will help local communities to make dissension about what
          people want to learn and help make more impact.
        </p>
      </Card>
      <Card title="Get Inspiration" icon={<Protips />}>
        <p>
          You’ll definitely find inspiration in what other people think, getting
          to know new tools and solutions – ready to use in your own work.
        </p>
      </Card>
      <Card title="Market Trends" icon={<Trends />}>
        <p>
          You'll have an idea about trending and most requested Technologies in
          the market and you’ll get the chance to compare yourself with other
          developers.
        </p>
      </Card>
    </main>
  </div>
)

const Card = ({ title, icon, children }) => (
  <div className="card">
    <div className="icon"> {icon} </div>
    <div className="content">
      <h3> {title}</h3>
      {children}
    </div>
  </div>
)
