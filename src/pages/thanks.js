import React from "react"
import { Layout, Header } from "../components"
import Share from "../components/Share"

export default function Thanks() {
  return (
    <Layout>
      <div className="thanks">
        <div className="container">
          <Header />
          <div className="main">
            <img src="/images/tarbouch.png" />
            <h1> Tarbouch Off to you! </h1>
            <p>
              Help us spread the word and share the survey with your friends.{" "}
              <br></br>
            </p>
            <Share shareUrl="https://stateofdev.ma/" />
          </div>
        </div>
      </div>
    </Layout>
  )
}
