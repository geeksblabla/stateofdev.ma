import { Link } from "gatsby"
import React from "react"

export const LastYear = () => (
  <div className="container last-year">
    <h1> State Of Dev In Morocco 2020 </h1>
    <main>
      <p>
        In November 2020, <strong> 2287 developers from Morocco 🇲🇦 </strong>
        told us about their jobs satisfaction, salaries, and community
        contribution, how they learn and level up, which tools they’re using,
        and what they want to learn next.
      </p>

      <div className="actions">
        <Link className="primary" to="/2020/#overview">
          Read the report
        </Link>
        <Link to="/2020/#video-episode" className="outline">
          Watch GeeksBlabla episode
        </Link>
      </div>
    </main>
  </div>
)
