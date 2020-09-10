import firebase from "gatsby-plugin-firebase"

export const logIn = async () => {
  await firebase.auth().signInAnonymously()
}

export const users = firebase.firestore().collection("users")

export const setAnswers = data => {
  const userId = firebase.auth().currentUser.uid
  return firebase
    .firestore()
    .collection("users")
    .doc(userId)
    .set(data, { merge: true })
}
