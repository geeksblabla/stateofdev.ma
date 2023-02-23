import React from "react"
import { useForm } from "react-hook-form"
import queryString from "query-string"
import { Layout } from "../Layout"
import { Header } from "../Header"
import FilterForm from "./FilterForm"
import "./index.scss"
import { Chart } from "../Chart/index"
export const isBrowser = () => typeof window !== "undefined"

const getDefaultValues = () => {
  const {
    question = "profile-q-0",
    groupBy = null,
    year = 2022,
    condition: c,
  } = isBrowser() ? queryString.parse(window.location.hash) : {}
  let condition = []
  try {
    condition = JSON.parse(c)
  } catch (error) {
    condition = undefined
  }

  return { question, condition, groupBy, year }
}

export default function Index() {
  const { register, handleSubmit, errors, control, watch } = useForm({
    defaultValues: getDefaultValues(),
  })
  const year = watch("year")
  const { isLoading, data, error } = useData(year)
  const question = watch("question")
  const condition = watch("condition")
  const groupBy = watch("groupBy")
  React.useEffect(() => {
    const search = {
      year,
      question,
      condition: JSON.stringify(condition),
      groupBy,
    }
    if (isBrowser()) window.location.hash = queryString.stringify(search)
  }, [question, condition, groupBy, year])

  // console.log(condition, groupBy)

  if (isLoading)
    return (
      <div className="container">
        <Header />
        <p style={{ textAlign: "center" }}> Loading playground data .... </p>
      </div>
    )
  if (error) return <p> Error loading data </p>

  return (
    <Layout>
      <main className="container playground">
        {data?.questions && (
          <FilterForm
            questions={data.questions}
            {...{ register, handleSubmit, errors, control }}
          />
        )}

        <div className="result">
          {data?.results?.results && (
            <Chart
              id={question}
              condition={condition}
              source={data.results.results}
              groupBy={groupBy}
              sort={false}
              year={parseInt(year)}
            />
          )}
        </div>
      </main>
    </Layout>
  )
}

const useData = (year = 2022) => {
  const {
    isLoading: isl,
    data: questions,
    error: QErrors,
  } = useFetch(
    `https://raw.githubusercontent.com/DevC-Casa/stateofdev.ma/master/results/${year}/data/questions.json`
  )

  const {
    isLoading,
    data: results,
    error,
  } = useFetch(
    `https://raw.githubusercontent.com/DevC-Casa/stateofdev.ma/master/results/${year}/data/results.json`
  )

  return {
    isLoading: isLoading || isl,
    errors: { ...QErrors, ...error },
    data: { questions, results },
  }
}

const useFetch = (url, options) => {
  const [data, setData] = React.useState(null)
  const [error, setError] = React.useState(null)
  const [isLoading, setIsLoading] = React.useState(false)
  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const res = await fetch(url, options)
        const json = await res.json()
        setData(json)
        setIsLoading(false)
      } catch (error) {
        setError(error)
      }
    }
    fetchData()
  }, [url])
  return { data, error, isLoading }
}
