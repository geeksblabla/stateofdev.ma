import { Link } from "gatsby"
import React from "react"

const reports = [
  {
    title: `2022 Report`,
    link: `/2022`,
    description: `In December 2022, 1617 developers from Morocco told us about their job satisfaction, salaries, and community contributions. They shared information on how they learn and level up, the tools they're using, and what they want to learn next.`,
  },

  {
    title: `2021 Report`,
    link: `/2021`,
    description: `In November 2021, 1,098 developers from Morocco told us about their job satisfaction, salaries, and community contributions. They shared insights on how they learn and level up, the tools they're using, and what they want to learn next.`,
  },
  {
    title: `2020 Report`,
    link: `/2020`,
    description: `In November 2020, 2,287 developers from Morocco told us about their job satisfaction, salaries, and community contributions. They shared information on how they learn and level up, the tools they're using, and what they want to learn next.`,
  },
]

export const PastReports = () => (
  <section className="bg-emerald-500">
    <div className="mx-auto max-w-lg  px-4 py-16 md:max-w-screen-xl md:px-8 lg:grid-cols-3">
      <h2 className="text-4xl font-medium text-white">Last Years Reports:</h2>
    </div>
    <div className="mx-auto grid max-w-lg gap-x-8 gap-y-12 px-4 pb-32 md:max-w-screen-xl md:grid-cols-2 md:px-8 lg:grid-cols-3">
      {reports.map((report, index) => (
        <ReportCard {...report} key={`report-${index}`} />
      ))}
    </div>
  </section>
)

export const ReportCard = ({ title, link, description }) => (
  <Link to={link}>
    <div className="border-white/40 border-solid relative border-4 px-4 pt-14 pb-8 hover:scale-105 transition duration-200">
      <div className="absolute -top-8 left-8 bg-emerald-500 px-4 text-white">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          role="img"
          width="24"
          height="24"
          preserveAspectRatio="xMidYMid meet"
          viewBox="0 0 32 32"
          className="h-14 w-14"
        >
          <path
            fill="currentColor"
            d="m25.7 9.3l-7-7c-.2-.2-.4-.3-.7-.3H8c-1.1 0-2 .9-2 2v24c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V10c0-.3-.1-.5-.3-.7zM18 4.4l5.6 5.6H18V4.4zM24 28H8V4h8v6c0 1.1.9 2 2 2h6v16z"
          />
          <path fill="currentColor" d="M10 22h12v2H10zm0-6h12v2H10z" />
        </svg>
      </div>
      <p className="mb-3 text-2xl font-medium uppercase text-white">{title}</p>
      <p className="text-gray-100/90">{description}</p>
    </div>
  </Link>
)
