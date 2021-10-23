import "./index.scss"

import React from "react"
import { Hero } from "./Hero"
import { Why } from "./Why"
import { Interested } from "./Interested"
import { Layout } from "../Layout"
import { LastYear } from "./LastYear"

const Home = () => {
  return (
    <Layout>
      <Hero />
      <Why />
      <LastYear />
      <Interested />
    </Layout>
  )
}

export default Home
