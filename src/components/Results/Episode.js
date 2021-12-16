import React from "react"
const links = {
  2020: `https://www.youtube.com/embed/RDhE0RUbkJI`,
  2021: `https://www.youtube.com/embed/bEkwDuGGD34`,
}
export const Episode = ({ year = 2020 }) => {
  return (
    <div className="episode" id="video-episode">
      <div className="container">
        <h2> Watch community members reacting to the survey results</h2>
        <div className="video-container">
          <iframe
            width="560"
            height="315"
            src={links[year]}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  )
}
