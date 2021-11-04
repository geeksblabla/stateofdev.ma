import * as Sentry from "@sentry/node"

const { SERVER_SENTRY_DSN } = process.env
let sentryInitialized = false
export function initSentry() {
  if (SERVER_SENTRY_DSN) {
    Sentry.init({ dsn: SERVER_SENTRY_DSN, tracesSampleRate: 1.0 })
    sentryInitialized = true
  }
}

export function reportError(error) {
  console.warn(error)
  if (!sentryInitialized) return

  if (typeof error === "string") {
    Sentry.captureMessage(error)
  } else {
    Sentry.captureException(error)
  }
}
