import firebase from "gatsby-plugin-firebase-app"
import { useEffect } from "react"

export const logIn = async () => {
  await firebase?.auth().signInAnonymously()
}

export const submitResponse = async data => {
  const token = await firebase.auth().currentUser.getIdToken()
  // send token in header
}
export const startSurvey = async () => {
  //TODO: use server timestamp
  const startTime = Date.now()
  const token = await firebase.auth().currentUser.getIdToken()
  console.log({ token, startTime })
  // return firebase
  //   .firestore()
  //   .collection("results")
  //   .doc(userId)
  //   .set({ startTime }, { merge: true })
}
export const setAnswers = data => {
  const lastSubmit = Date.now()
  const userId = firebase.auth().currentUser.uid
  console.log({ userId, lastSubmit })
  // return firebase
  //   ?.firestore()
  //   .collection("results")
  //   .doc(userId)
  //   .set({ ...data, lastSubmit }, { merge: true })
}

export const setRemarks = remarks => {
  const userId = firebase.auth().currentUser.uid
  return firebase
    .firestore()
    .collection("results")
    .doc(userId)
    .set({ remarks }, { merge: true })
}

export const useAuth = clk => {
  useEffect(() => {
    if (!firebase.auth) return
    console.log(firebase)
    logIn()
    firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        clk(user)
      }
    })
  }, [firebase])
}
