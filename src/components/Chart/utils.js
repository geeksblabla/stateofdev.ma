import DATA from "../../../results/2020/data/results.json"
import Questions from "../../../results/2020/data/questions.json"

const reducer = (accumulator, currentValue) => {
  if (currentValue === undefined || currentValue === null) return accumulator
  if (Array.isArray(currentValue)) {
    currentValue.forEach(element => {
      accumulator[element] = (accumulator[element] || 0) + 1
    })
  } else {
    accumulator[currentValue] = (accumulator[currentValue] || 0) + 1
  }
  accumulator["total"] = (accumulator["total"] || 0) + 1

  return accumulator
}

const filter = (data, condition) => {
  if (typeof condition === "function") return data.filter(condition)
  return data
}

// condition here is a function  (v) => v['profile-q-0'] === 1
export const getQuestion = (id, condition) => {
  const question = Questions[id]
  const results = []
  const d = filter(DATA.results, condition)
    .map(r => r[id])
    .reduce(reducer, {})
  Object.keys(d).map(function (key) {
    if (key !== undefined && key !== "total") {
      results.push({ label: question.choices[key] || key, value: d[key] })
    }
  })
  return { ...question, results, total: d.total }
}

export const getPercent = (value, total) => {
  return ((value * 100) / total).toFixed(1)
}
