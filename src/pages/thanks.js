import React from "react"
import { Layout, Header } from "../components"
import Share from "../components/Share"

export default function Thanks() {
  return (
    <Layout>
      <div className="thanks">
        <div className="container">
          <Header />
          <div style={{ maxWidth: 540, textAlign: "center", margin: "auto" }}>
            <h1> Thank you for taking the time to complete this survey </h1>
            <p>
              Well Done, Help us spread the world and share the survey with your
              friends. <br></br>
            </p>
            <Share shareUrl="https://stateofdev.ma/" />
          </div>
        </div>
      </div>
    </Layout>
  )
}
