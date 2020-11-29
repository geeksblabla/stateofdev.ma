import React from "react"
import { useForm } from "react-hook-form"
import { Layout } from "../Layout"
import FilterForm from "./FilterForm"
import "./index.scss"
import { Chart } from "../Chart/index"

export default function Index() {
  const { isLoading, data, error } = useData()
  const { register, handleSubmit, errors, control, watch } = useForm()
  const id = watch("question")
  const condition = watch("condition")

  if (isLoading) return <p> loading playground </p>
  if (error) return <p> Error loading data </p>
  return (
    <Layout>
      <main className="playground">
        {data?.questions && (
          <FilterForm
            questions={data.questions}
            {...{ register, handleSubmit, errors, control }}
          />
        )}

        <div className="result">
          {data?.results?.results && (
            <Chart
              id={id}
              condition={condition}
              source={data.results.results}
            />
          )}
        </div>
      </main>
    </Layout>
  )
}

const useData = () => {
  const { isLoading: isl, data: questions, error: QErrors } = useFetch(
    "https://raw.githubusercontent.com/DevC-Casa/stateofdev.ma/results_prview/results/2020/data/questions.json"
  )

  const { isLoading, data: results, error } = useFetch(
    "https://raw.githubusercontent.com/DevC-Casa/stateofdev.ma/results_prview/results/2020/data/results.json"
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
  }, [])
  return { data, error, isLoading }
}
