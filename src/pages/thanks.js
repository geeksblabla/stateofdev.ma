import React from "react"
import { Layout, Header } from "../components"

export default function Thanks() {
  return (
    <Layout>
      <div className="survey">
        <div className="container">
          <Header />
          <main>
            <div>
              <h1> Thank you for being part of the survey </h1>
              <p>
                Now , you need to Share date with your friend as More submission
                mean more accurate result
              </p>
            </div>
          </main>
        </div>
      </div>
    </Layout>
  )
}
