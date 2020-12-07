import Questions from "../../../results/2020/data/questions.json"
import { getQuestion } from "./utils"

const results = [
  {
    userId: "020Tufn7jzE0BYz39j53",
    "profile-q-12": 1,
    "profile-q-14": [0, 1],
    "profile-q-3": 0,
    "profile-q-0": 0,
    "profile-q-1": 2,
    "profile-q-11": [0],
    "profile-q-2": 0,
    "profile-q-6": 0,
  },
  {
    userId: "020TufnjwQTTT0C7jzE0BYz39j53",
    "profile-q-12": 1,
    "profile-q-14": [0, 1],
    "profile-q-3": 1,
    "profile-q-0": 1,
    "profile-q-1": 2,
    "profile-q-11": [0],
    "profile-q-2": 0,
    "profile-q-6": 0,
  },
  {
    userId: "020TufnjwQTTT0C7z39j53",
    "profile-q-12": 1,
    "profile-q-14": [1, 2],
    "profile-q-3": 1,
    "profile-q-0": 1,
    "profile-q-1": 2,
    "profile-q-11": [0],
    "profile-q-2": 0,
    "profile-q-6": 0,
  },
  {
    userId: "020TufnjwQTTT0C7z39j53",
    "profile-q-12": 0,
    "profile-q-14": [0, 3],
    "profile-q-3": 2,
    "profile-q-0": 1,
    "profile-q-1": 1,
    "profile-q-11": [0],
    "profile-q-2": 0,
    "profile-q-6": 0,
  },
]

test("should return correct values data ", () => {
  const data = getQuestion({ id: "profile-q-0", source: results })
  expect(data.total).toBe(4)
  expect(data.results[0].label).toBe(Questions["profile-q-0"].choices[0])
  expect(data.results[0].value).toBe(1)
  expect(data.results[1].value).toBe(3)
})

test("should return correct values data with condition with function  ", () => {
  const condition = v => v["profile-q-12"] === 1
  const data = getQuestion({
    id: "profile-q-0",
    source: results,
    condition,
  })
  expect(data.total).toBe(3)
  expect(data.results[0].label).toBe(Questions["profile-q-0"].choices[0])
  expect(data.results[0].value).toBe(1)
  expect(data.results[1].value).toBe(2)
})
test("should return correct values data with condition for multi choices questions ", () => {
  const condition = v => {
    if (Array.isArray(v["profile-q-14"])) return v["profile-q-14"].includes(1)
    else return v["profile-q-14"] === 1
  }
  const data = getQuestion({
    id: "profile-q-0",
    source: results,
    condition,
  })
  expect(data.total).toBe(3)
  expect(data.results[0].label).toBe(Questions["profile-q-0"].choices[0])
  expect(data.results[0].value).toBe(1)
  expect(data.results[1].value).toBe(2)
})

test("should return correct values data with condition with object  ", () => {
  const condition = [{ question_id: "profile-q-12", value: ["1"] }]
  const data = getQuestion({
    id: "profile-q-0",
    source: results,
    condition,
  })
  expect(data.total).toBe(3)
  expect(data.results[0].label).toBe(Questions["profile-q-0"].choices[0])
  expect(data.results[0].value).toBe(1)
  expect(data.results[1].value).toBe(2)
})
test("should return correct values data with condition with object for multi choices questions ", () => {
  const condition = [{ question_id: "profile-q-14", value: ["1"] }]
  const data = getQuestion({
    id: "profile-q-0",
    source: results,
    condition,
  })
  console.log(JSON.stringify(data, null, 2))
  expect(data.total).toBe(3)
  expect(data.results[0].label).toBe(Questions["profile-q-0"].choices[0])
  expect(data.results[0].value).toBe(1)
  expect(data.results[1].value).toBe(2)
})

test("should be grouped correctly ", () => {
  const data = getQuestion({
    id: "profile-q-0",
    source: results,
    groupBy: "profile-q-1",
  })

  expect(data.total).toBe(4)
  expect(data.results[0].value).toBe(data.results[0].grouped.total)
  expect(data.results[1].value).toBe(data.results[1].grouped.total)
})
