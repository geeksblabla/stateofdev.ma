import firebase from "gatsby-plugin-firebase"

export const logIn = async () => {
  await firebase.auth().signInAnonymously()
}

export const startSurvey = () => {
  //TODO: use server timestamp
  const startTime = Date.now()
  const userId = firebase.auth().currentUser.uid
  return firebase
    .firestore()
    .collection("users")
    .doc(userId)
    .set({ startTime }, { merge: true })
}
export const setAnswers = data => {
  const lastSubmit = Date.now()
  const userId = firebase.auth().currentUser.uid
  return firebase
    .firestore()
    .collection("users")
    .doc(userId)
    .set({ ...data, lastSubmit }, { merge: true })
}
