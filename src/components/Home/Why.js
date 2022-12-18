import React from "react"
import Community from "../../assets/Community.svg"
import Trends from "../../assets/Trends.svg"
import Protips from "../../assets/Protips.svg"

import Knowledge from "../../assets/Knowledge.svg"

export const Why = () => (
  <div className="relative w-screen">
    <div className="mx-auto my-20 w-full max-w-screen-xl px-4 relative z-[99]">
      <div className="w-12 border-b-2 border-pink-500 lg:border-b-4"></div>
      <h2 className=" text-center mt-6 mb-10 text-3xl font-semibold tracking-wide text-gray-800 sm:text-4xl">
        Why Should You Take Part In The Survey?
      </h2>
      <div className="flex flex-col justify-between lg:flex-row lg:flex-wrap">
        <Card title="Share Knowledge" icon={<Knowledge />}>
          You’ll co-create a report that’ll be available for everyone across the
          world, shedding more light on the state of development in Morocco.
        </Card>
        <Card title="More Community Impact" icon={<Community />}>
          The report will help local communities to make dissension about what
          people want to learn and help make more impact.
        </Card>
        <Card title="Get Inspiration" icon={<Protips />}>
          You’ll definitely find inspiration in what other people think, getting
          to know new tools and solutions – ready to use in your own work.
        </Card>
        <Card title="Market Trends" icon={<Trends />}>
          You'll have an idea about trending and most requested Technologies in
          the market and you’ll get the chance to compare yourself with other
          developers.
        </Card>
      </div>
    </div>
  </div>
)

const Card = ({ title, icon, children }) => (
  <div className="mt-8 lg:mt-10 lg:w-1/2">
    <div className="flex flex-col items-start lg:pr-16">
      <div className="w-16">{icon}</div>
      <h2 className="lg: mt-6 flex items-center text-base font-semibold tracking-wide text-gray-800 lg:mt-6 lg:text-2xl">
        <span className="mr-5 text-2xl">{title}</span>
      </h2>
      <p className="lg: mt-1 text-sm tracking-normal text-gray-800 lg:mt-1 lg:text-xl">
        {children}
      </p>
    </div>
  </div>
)
