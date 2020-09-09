import React from "react"
import Community from "../../assets/Community.svg"
import Trends from "../../assets/Trends.svg"
import Protips from "../../assets/Protips.svg"

import Knowledge from "../../assets/Knowledge.svg"

export const Why = () => (
  <div className="container why">
    <h1> Why Should You Take Part In The Survey? </h1>
    <main>
      <Card title="Knowledge" icon={<Knowledge />}>
        <p>
          You’ll co-create a report that’ll be available for everyone across the
          world, shedding more light on the state of frontend development.
        </p>
      </Card>
      <Card title="Community" icon={<Community />}>
        <p>
          When the report is ready, you’ll get the chance to compare yourself
          with other web developers like yourself.
        </p>
      </Card>
      <Card title="Protips" icon={<Protips />}>
        <p>
          You’ll definitely find inspiration in what other people think, getting
          to know new tools and solutions – ready to use in your own work.
        </p>
      </Card>
      <Card title="Trends" icon={<Trends />}>
        <p>
          You’ll definitely find inspiration in what other people think, getting
          to know new tools and solutions – ready to use in your own work.
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
