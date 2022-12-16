import React from "react"
import { useInitAuth, useIsSurveyReady } from "./useSurvey"

export const AuthContainer = ({ children }) => {
  const isSurveyReady = useIsSurveyReady()
  useInitAuth()

  if (!isSurveyReady) {
    return (
      <div className="min-h-screen justify-start text-center items-center pt-10 bg-emerald-50/50">
        Initializing Survey...
      </div>
    )
  }
  return (
    <div className="lg:min-h-[800px] mx-auto h-full px-4 py-10 lg:py-10 sm:max-w-xl md:max-w-full md:px-24 md:py-36 lg:max-w-screen-xl lg:px-8 relative">
      {children}
    </div>
  )
}
