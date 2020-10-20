import React from "react"
import { Layout, Header } from "../components"

export default function Index() {
  return (
    <Layout>
      <div className="thanks">
        <div className="container">
          <Header />
          <div className="main">
            <img src="/images/tarbouch.png" />
            <h1> 404 {`:)`} </h1>
          </div>
        </div>
      </div>
    </Layout>
  )
}
