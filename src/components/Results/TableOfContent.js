import React from "react"

export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "")
}

const TableOfContent = ({ titles }) => {
  React.useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const id = entry.target.getAttribute("id")
        console.log("id", id)
        if (entry.intersectionRatio > 0) {
          document
            .querySelector(`li a[href="#${id}"]`)
            .parentElement.classList.add("active")
        } else {
          document
            .querySelector(`li a[href="#${id}"]`)
            .parentElement.classList.remove("active")
        }
      })
    })

    // Track all sections that have an `id` applied
    document.querySelectorAll("section[id]").forEach(section => {
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
