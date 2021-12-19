const admin = require("firebase-admin")
const fs = require("fs")
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

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

function getFileName() {
  const now = new Date()
  return `./scripts/${now.getFullYear()}-${
    now.getMonth() + 1
  }-${now.getDate()}----${now.getUTCHours()}H-${now.getMinutes()}min.json`
}

function writeToFile(filename, data) {
  fs.writeFile(filename, JSON.stringify(data), err => {
    if (err) {
      console.log(err)
    } else {
      console.log(`[SUCCESS] ${new Date()} JSON saved to ${filename}`)
    }
  })
}

const getResults = () => getFirebase().firestore().collection("/results")

const exportResults = async () => {
  const data = { results: [] }
  const results = await getResults().get()
  results.forEach(element => {
    const tmp = { userId: element.id, ...normalize_element(element.data()) }
    data.results.push(tmp)
  })
  writeToFile(getFileName(), data)
}

const normalize_element = element => {
  const tmp = element
  for (const [key, value] of Object.entries(element)) {
    if (typeof value === "string" && key !== "userId")
      tmp[key] = parseInt(value)
    if (Array.isArray(value)) tmp[key] = value.map(v => parseInt(v))
  }
  return tmp
}

exportResults()
