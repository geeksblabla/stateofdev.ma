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
  if (Array.isArray(condition)) {
    return data.filter(v => {
      for (let index = 0; index < condition.length; index++) {
        const element = condition[index]
        const vs = Array.isArray(v[element.question_id])
          ? v[element.question_id]
          : [v[element.question_id]]
        const intersection =
          vs.filter(x => element.values?.includes(x.toString())) || []
        if (element.values.length !== 0 && intersection.length === 0)
          return false
      }
      return true
    })
  }

  return data
}

// condition here is a function  (v) => v['profile-q-0'] === 1
export const getQuestion = ({
  id,
  condition,
  source = DATA.results,
  groupBy,
}) => {
  const question = Questions[id]
  const results = []
  const filteredData = filter(source, condition)
  const d = filteredData.map(r => r[id]).reduce(reducer, {})
  Object.keys(d).map(function (key) {
    if (key !== undefined && key !== "total") {
      const grouped = groupBy
        ? getQuestion({
            id: groupBy,
            condition: v => {
              if (Array.isArray(v[id])) return v[id].includes(parseInt(key, 10))
              else return v[id] === parseInt(key, 10)
            },
            source: filteredData,
          })
        : null
      results.push({
        key: key,
        label: question.choices[key] || key,
        value: d[key],
        grouped,
      })
    }
  })

  return { ...question, results, total: d.total }
}

export const getPercent = (value, total) => {
  return ((value * 100) / total).toFixed(1)
}
