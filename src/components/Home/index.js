import React from "react"
import { Hero } from "./Hero"
import { Why } from "./Why"
import { Interested } from "./Interested"
import { PastReports } from "./PastReports"
import { FAQ } from "./FAQ"

const Home = () => {
  return (
    <>
      <Hero />
      <Why />

      <PastReports />
      <FAQ />
      <Interested />
    </>
  )
}

export default Home
