import firebase from "gatsby-plugin-firebase"
import { useLayoutEffect } from "react"
import { toast } from "react-toastify"
import create from "zustand"
import { startSurvey } from "./service"

interface SurveyState {
  data: Array<any>
  userId: string | null
  index: number
  progress: number
  initAuth(): void
  setData(data: Array<any>): void
}

export const useSurvey = create<SurveyState>(set => ({
  data: [],
  userId: null,
  index: 0,
  finished: false,
  progress: 0,
  setData: data => set({ data }),
  // an action to create a new anonymous user and set the userId
  initAuth: async () => {
    try {
      await firebase?.auth().signInAnonymously()
      const userId = await firebase?.auth?.().currentUser?.getIdToken()
      if (userId) {
        set({ userId })
        await startSurvey()
      } else {
        showErrorMessage(
          "Error starting the survey, Please refresh the page and start again "
        )
      }
    } catch (error) {
      showErrorMessage(
        "Error starting the survey, Please refresh the page and start again "
      )
    }
  },

  setAnswer: async (data: string) => {},
}))

export const setSurveyData = data => useSurvey.getState().setData(data)

export const useIsSurveyReady = () => {
  return useSurvey(state => {
    return state.userId !== null
  })
}

export const useInitAuth = () => {
  useLayoutEffect(() => {
    if (!firebase.auth) return
    useSurvey.getState().initAuth()
  }, [firebase])
}

const showErrorMessage = (message: string) => {
  toast.error(message, {
    position: "top-right",
    autoClose: false,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  })
}
