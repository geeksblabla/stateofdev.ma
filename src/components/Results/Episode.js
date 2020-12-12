import React from "react"
import { Link } from "gatsby"

export const Episode = () => {
  return (
    <div className="episode">
      <p> Watch what community said about results </p>
      <div class="video-container">
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/RDhE0RUbkJI"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
    </div>
  )
}

function DownloadIcon(props) {
  return (
    <svg
      style={{ marginRight: 10 }}
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12.121 15.436V3.395M15.037 12.508l-2.916 2.928-2.916-2.928"
        stroke="#2b2d2f"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.754 8.128h.933a3.684 3.684 0 013.684 3.685v4.884a3.675 3.675 0 01-3.675 3.675H6.556a3.685 3.685 0 01-3.685-3.685v-4.885a3.675 3.675 0 013.675-3.674h.942"
        stroke="#2b2d2f"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
