import { Link } from "gatsby"
import React from "react"
import Logo from "../assets/logo.svg"
import Github from "../assets/github.svg"
import Chart from "../assets/Chart.svg"

export const Header = () => {
  return (
    <header className=" z-[99] relative flex bg-transparent max-w-screen-xl flex-col overflow-hidden px-4 py-4 text-emerald-900 md:mx-auto md:flex-row md:items-center">
      <Link to="/">
        <div className="flex cursor-pointer items-center whitespace-nowrap text-2xl font-black">
          <Logo />
        </div>
      </Link>
      <input type="checkbox" className="peer hidden" id="navbar-open" />
      <label
        className="absolute top-5 right-7 cursor-pointer md:hidden"
        htmlFor="navbar-open"
      >
        <span className="sr-only">Toggle Navigation</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </label>
      <nav
        aria-label="Header Navigation"
        className="peer-checked:mt-8 peer-checked:max-h-56 flex max-h-0 w-full flex-col items-center justify-between overflow-hidden transition-all md:ml-24 md:max-h-full md:flex-row md:items-start"
      >
        <ul className="flex flex-col items-center space-y-2 md:ml-auto md:flex-row md:space-y-0">
          <li className="md:mr-6 inline-flex">
            <Link to="/2020">
              <ReportLink year={2020} />
            </Link>
          </li>
          <li className="md:mr-6">
            <Link to="/2021">
              <ReportLink year={2021} />
            </Link>
          </li>
          <li className="md:mr-6">
            <Link to="/2022">
              <ReportLink year={2022} />
            </Link>
          </li>
          <li className="md:mr-6">
            <Link to="/playground">
              <PlaygroundLink />
            </Link>
          </li>
          <li className="md:mr-6">
            <a
              href="https://github.com/geeksblabla/stateofdev.ma"
              target="_blank"
            >
              <GithubLink />
            </a>
          </li>
        </ul>
      </nav>
    </header>
  )
}

const ReportLink = ({ year }) => (
  <LinkWIcon label={year} icon={<ReportIcon />} />
)

const PlaygroundLink = () => (
  <LinkWIcon
    label="Playground"
    icon={<Chart height="24" width="24" className="" />}
  />
)

const GithubLink = () => (
  <LinkWIcon label="Github" icon={<Github height="22" width="22" />} />
)

const LinkWIcon = ({ label, icon }) => (
  <div className="flex cursor-pointer items-center text-emerald-900 hover:text-emerald-600 pt-2 ">
    <div className="-mr-2 flex-shrink-0 ">
      <div className="h-8 w-8 mt-2">{icon}</div>
    </div>
    <div className="shadow-xs  underline underline-offset-4">{label}</div>
  </div>
)

const ReportIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    role="img"
    width="24"
    height="24"
    preserveAspectRatio="xMidYMid meet"
    viewBox="0 0 32 32"
  >
    <path
      fill="currentColor"
      d="m25.7 9.3l-7-7c-.2-.2-.4-.3-.7-.3H8c-1.1 0-2 .9-2 2v24c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V10c0-.3-.1-.5-.3-.7zM18 4.4l5.6 5.6H18V4.4zM24 28H8V4h8v6c0 1.1.9 2 2 2h6v16z"
    />
    <path fill="currentColor" d="M10 22h12v2H10zm0-6h12v2H10z" />
  </svg>
)
