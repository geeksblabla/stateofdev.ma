import React from "react"

import { SurveyLayout } from "../components"
import { navigate } from "gatsby-link"
import { Link } from "gatsby"

const rules = [
  "We care about privacy; that's why all your answers are completely anonymous. We only rely on anonymous sessions to avoid spam",
  "All Questions are required unless you have a skip button",
  "The survey is divided into 6 part: Profile, Learning & Education,AI, Work, Technology and Community",
  "Please be honest. Our goal is to understand the Moroccan IT market and share results with the community.",
  "Do not refresh the questions page before submitting your answers",
]

const Rules = () => {
  return (
    <div className="mx-auto my-8 p-8 sm:rounded-xl md:py-16 lg:mx-0 lg:my-16">
      <div className="mx-auto max-w-xl">
        <h2 className="mb-6 max-w-lg text-md font-bold sm:text-xl">
          Before you start, here is a list of things you need to know:
        </h2>

        <ul className="mb-8 flex flex-wrap gap-4">
          {rules.map((rule, index) => (
            <li className="flex space-x-2 " key={`rule${index}`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="shrink-0 h-6 w-6 text-emerald-700"
              >
                <path
                  fillRule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-gray-800">{rule}</p>
            </li>
          ))}
        </ul>
        <div className=" flex flex-row-reverse">
          <Link
            to="/start"
            className="focus:outline-4 rounded-xl bg-emerald-700 px-4 py-3 font-medium text-white shadow-md outline-white transition hover:bg-emerald-500"
          >
            Let’s do it
          </Link>
        </div>
      </div>
    </div>
  )
}

const BeforeStart = () => {
  return (
    <SurveyLayout>
      <Rules />
    </SurveyLayout>
  )
}

export default BeforeStart
