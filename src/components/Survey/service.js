import firebase from "gatsby-plugin-firebase"
import { useLayoutEffect } from "react"

export const logIn = async () => {
  await firebase?.auth().signInAnonymously()
}

export const saveAnswers = async (recaptcha_token, data) => {
  const userToken = await firebase.auth().currentUser.getIdToken()
  // console.log({ userToken, recaptcha_token })
  const response = await fetch("/.netlify/functions/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-recaptcha-token": recaptcha_token,
      Authorization: `Bearer ${userToken}`,
    },
    body: JSON.stringify(data),
  })
  return response
}

export const startSurvey = async recaptcha_token => {
  const startTime = Date.now()
  saveAnswers(recaptcha_token, { startTime })
}
// TODO we should await here too
export const setAnswers = (recaptcha_token, data) => {
  const lastSubmit = Date.now()
  saveAnswers(recaptcha_token, { lastSubmit, ...data })
}

export const useAuth = (clk, deps = []) => {
  useLayoutEffect(() => {
    if (!firebase.auth) return
    logIn()
    firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        clk(user)
      }
    })
  }, [firebase, ...deps])
}
