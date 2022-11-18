import React from "react"
import { Link } from "gatsby"

export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "")
}

const TableOfContent = ({ titles }) => {
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const id = entry.target.getAttribute("id")
          const selector = `li a[href="#${id}"]`
          if (!document.querySelector(selector)) return
          if (entry.intersectionRatio > 0.1) {
            const el = document.querySelector(selector)
            el.classList.add("text-emerald-700")
            el.classList.add("before:h-1")
          } else {
            const el = document.querySelector(selector)
            el.classList.remove("text-emerald-700")
            el.classList.remove("before:h-1")
          }
        })
      },
      { threshold: [0.0, 0.1, 0.02, 0.9, 1.0] }
    )

    // Track all sections that have an `id` applied
    document.querySelectorAll("section[id]").forEach(section => {
      observer.observe(section)
    })

    return () => {
      observer.disconnect()
    }
  }, [])
  return (
    <>
      <div className=" sm:hidden pl-8 lg:block mt-3 sticky top-20 p-2 pb-12 h-fit min-w-[350px] rounded-md border border-solid border-gray-300/50  ">
        <div>
          <h2 className="text-xl font-bold py-4 "> Table of contents</h2>
          <ul>
            {titles.map((title, index) => (
              <li className="text-lg my-3" key={`item-${index}`}>
                <a
                  href={`#${slugify(title)}`}
                  className="relative before:h-0 hover:before:h-1  hover:text-emerald-600 before:content-[''] before:absolute before:-left-4 before:top-[10px]  before:w-3  before:bg-emerald-600 before:rounded-sm"
                >
                  0{index + 1} - {title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}

export default TableOfContent
