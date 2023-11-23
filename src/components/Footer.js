import React from "react"
import Logo from "../assets/logo.svg"

export const Footer = () => {
  return (
    <footer className="">
      <div className="mx-auto grid max-w-screen-xl gap-y-8 gap-x-12 px-4 py-10 sm:px-20 md:grid-cols-2 xl:grid-cols-3 xl:px-10">
        <div className="max-w-sm">
          <div className="mb-6 flex h-10 items-center space-x-2">
            <Logo />
          </div>
          <div className="text-gray-500">
            Participate and let us know what working in tech really looks like
            in Morocco 🇲🇦
          </div>
        </div>
        <div className="">
          <div className="mt-4 mb-2 font-medium xl:mb-4">Community</div>
          <nav aria-label="Guides Navigation" className="text-gray-500">
            <ul className="space-y-3">
              <li>
                <a
                  className="hover:text-emerald-600 hover:underline"
                  href="https://geeksblabla.com"
                  target="_blank"
                >
                  geeksblabla.com
                </a>
              </li>
              <li>
                <a
                  className="hover:text-emerald-600 hover:underline"
                  href="https://stateofdev.ma"
                  target="_blank"
                >
                  stateofdev.ma
                </a>
              </li>
              <li>
                <a
                  className="hover:text-emerald-600 hover:underline"
                  href="https://github.com/geeksblabla/awesome-morocco"
                  target="_blank"
                >
                  awesome-morocco.dev
                </a>
              </li>
              <li>
                <a
                  className="hover:text-emerald-600 hover:underline"
                  href="https://tally.so/r/meqj6E"
                  target="_blank"
                >
                  Join the team
                </a>
              </li>
              <li>
                <a
                  className="hover:text-emerald-600 hover:underline"
                  href="https://links.geeksblabla.com"
                  target="_blank"
                >
                  More
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="">
          <div className="mt-4 mb-2 font-medium xl:mb-4">Links</div>
          <nav aria-label="Footer Navigation" className="text-gray-500">
            <ul className="space-y-3">
              <li>
                <a
                  className="hover:text-emerald-600 hover:underline"
                  href="https://www.youtube.com/c/GeeksBlaBla01"
                  target="_blank"
                >
                  Youtube
                </a>
              </li>
              <li>
                <a
                  className="hover:text-emerald-600 hover:underline"
                  href="https://www.linkedin.com/company/geeksblabla/"
                  target="_blank"
                >
                  Linkedin
                </a>
              </li>
              <li>
                <a
                  className="hover:text-emerald-600 hover:underline"
                  href="https://www.facebook.com/geeksblabla"
                  target="_blank"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  className="hover:text-emerald-600 hover:underline"
                  href="https://twitter.com/geeksblabla"
                  target="_blank"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  className="hover:text-emerald-600 hover:underline"
                  href="https://instagram.com/geeksblabla"
                  target="_blank"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  className="hover:text-emerald-600 hover:underline"
                  href="https://github.com/geeksblabla"
                  target="_blank"
                >
                  Github
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <div className="border-t">
        <div className="mx-auto flex max-w-screen-xl flex-col gap-y-4 px-4 py-3 text-center text-gray-500 sm:px-20 lg:flex-row lg:justify-between lg:text-left xl:px-10">
          <p className="">Made with ❤️ by Geeksblabla Team</p>
          <p className="">
            © {new Date().getFullYear()} Geeksblabla | All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  )
}
