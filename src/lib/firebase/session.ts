import type { AstroCookies } from "astro";
import { auth } from "./server";

const SESSION_COOKIE = "__session";
const SESSION_MAX_AGE_MS = 60 * 60 * 24 * 5 * 1000;

export async function setSessionCookie(cookies: AstroCookies, idToken: string) {
  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: SESSION_MAX_AGE_MS
  });
  cookies.set(SESSION_COOKIE, sessionCookie, {
    path: "/",
    maxAge: SESSION_MAX_AGE_MS / 1000,
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: "lax"
  });
}

// firebase-admin throws on expired/tampered/revoked cookies and deleted/disabled users; treat all as "no session"
export async function getSessionUid(cookies: AstroCookies) {
  const sessionCookie = cookies.get(SESSION_COOKIE)?.value;
  if (!sessionCookie)
    return null;
  try {
    const { uid } = await auth.verifySessionCookie(sessionCookie, true);
    return uid;
  }
  catch (error) {
    console.warn("Invalid session:", error);
    return null;
  }
}
