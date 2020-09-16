import React from "react"
import { Layout, Header } from "../components"

export default function Thanks() {
  return (
    <Layout>
      <div className="thanks">
        <div className="container">
          <Header />
          <main>
            <div>
              <h1> Thank you for being part of the survey </h1>
              <p>
                Well Done, Now you need to Share the survey with your friend as
                more submission mean more accurate results.
              </p>
            </div>
          </main>
        </div>
      </div>
    </Layout>
  )
}
