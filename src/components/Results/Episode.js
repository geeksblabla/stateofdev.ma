import React from "react"
import { Link } from "gatsby"

export const Episode = () => {
  return (
    <div className="episode" id="video-episode">
      <div className="container">
        <h2> Watch community members reacting to the survey results</h2>
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
    </div>
  )
}
