import * as admin from "firebase-admin"
import fetch from "node-fetch"

const getFirebase = () => {
  const firebasePrivateKey = process.env.FIREBASE_PRIVATE_KEY
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.GATSBY_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // https://stackoverflow.com/a/41044630/1332513
        privateKey: firebasePrivateKey?.replace(/\\n/g, "\n"),
      }),
    })
  }
  return admin
}

const getResults = () => getFirebase().firestore().collection("results")

export const saveAnswer = (userId: string, data: any) => {
  return getResults().doc(userId).set(data, { merge: true })
}

export const getUser = (token: string) => {
  return getFirebase().auth().verifyIdToken(token)
}

//https://developers.google.com/recaptcha/docs/verify
export const verifyRecaptcha = async (recaptcha_token: string) => {
  const url = "https://www.google.com/recaptcha/api/siteverify"
  const params = {
    secret: process.env.RECAPTCHA_SECRET_KEY,
    response: recaptcha_token,
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${params.secret}&response=${params.response}`,
    })
    const res = await response.json() // parses JSON response into native JavaScript objects
    return res
  } catch (error) {
    throw new Error("error verifying recaptcha ")
  }
}
