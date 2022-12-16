import type { Handler } from "@netlify/functions"
import { getUser, saveAnswer } from "./db"
import { initSentry, reportError } from "./helpers"

// init sentry to report error
initSentry()

export const handler: Handler = async event => {
  // only accept post requests
  let data = {}
  if (event.httpMethod !== "POST") {
    reportError("This endpoint only responds to POST")
    return {
      statusCode: 405,
      body: JSON.stringify({
        code: "method_unknown",
        message: "This endpoint only responds to POST",
      }),
    }
  }

  // validate data inputs
  try {
    data = JSON.parse(event.body)
  } catch (error) {
    reportError(error)
    return {
      statusCode: 400,
      body: JSON.stringify({
        code: "invalid_request",
        message: "Invalid body data",
      }),
    }
  }

  //  check authentication
  const token = event.headers?.authorization?.replace("Bearer ", "")
  if (!Boolean(token)) {
    reportError("unauthorized request token or recaptcha not valid ")
    return {
      statusCode: 401,
      body: JSON.stringify({
        code: "unauthorized",
        message: "unauthorized request",
      }),
    }
  }

  // save to database
  try {
    const userId = await getUser(token)
    await saveAnswer(userId.uid, data)
  } catch (error) {
    reportError(error)
    return {
      statusCode: 500,
      body: JSON.stringify({
        code: "server-error",
        message: "Server error",
        origin: error,
      }),
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      code: "success",
      message: `response submitted`,
    }),
  }
}
