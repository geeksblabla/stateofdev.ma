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
          console.log(selector, document.querySelector(selector))
          if (!document.querySelector(selector)) return
          if (entry.intersectionRatio > 0.1) {
            document
              .querySelector(selector)
              .parentElement.classList.add("active")
          } else {
            document
              .querySelector(selector)
              .parentElement.classList.remove("active")
          }
        })
      },
      { threshold: [0.0, 0.1, 0.02, 0.9, 1.0] }
    )

    // Track all sections that have an `id` applied
    document.querySelectorAll("section[id]").forEach(section => {
      console.log(section)
      observer.observe(section)
    })

    return () => {
      observer.disconnect()
    }
  }, [])
  return (
    <div className="table-of-content">
      <div>
        <h2> Table of contents</h2>
        <ul>
          {titles.map((title, index) => (
            <li key={`item-${index}`}>
              <a href={`#${slugify(title)}`}>
                0{index + 1}: {title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default TableOfContent
