import React from "react"
import { Layout, Header } from "../components"
import Share from "../components/Share"

export default function Thanks() {
  return (
    <Layout>
      <div className="lg:min-h-[800px] mx-auto h-full px-4 py-10 lg:py-10 sm:max-w-xl md:max-w-full md:px-24 md:py-36 lg:max-w-screen-xl lg:px-8 relative">
        <div class=" mx-auto mt-4 mb-20 flex w-full flex-wrap items-center flex-col justify-center space-x-4 md:px-10  px-0 py-2">
          <img src="/images/tarbouch.png" className="w-[300px] my-10" />
          <h1 className="text-4xl text-center font-bold my-2">
            Well done! <br /> Tarbouch Off to you!{" "}
          </h1>
          <p>
            Help us spread the word and share the survey with your friends.{" "}
            <br></br>
          </p>
          <Share shareUrl="https://stateofdev.ma/" />
        </div>
      </div>
    </Layout>
  )
}
