import React from "react"
const links = {
  2020: `https://www.youtube.com/embed/RDhE0RUbkJI`,
  2021: `https://www.youtube.com/embed/bEkwDuGGD34`,
}
export const Episode = ({ year = 2020 }) => {
  return (
    <section
      className="bg-emerald-500 px-2 py-12 justify-center align-middle items-center"
      id="video-episode"
    >
      <div className="relative w-full max-w-[1000px] m-auto">
        <h2 className="text-center text-2xl font-medium text-white py-8">
          Watch community members reacting to the survey results
        </h2>
        <div className="w-full ">
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              src={links[year]}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  )
}
