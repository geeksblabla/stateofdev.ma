import type { AstroCookies } from "astro";
import { getAuth } from "firebase-admin/auth";
import { getActiveApp } from "./server";

export const SESSION_COOKIE = "__session";

// firebase-admin throws on expired/tampered/revoked cookies and deleted/disabled users; treat all as "no session"
export async function getSessionUid(cookies: AstroCookies) {
  const sessionCookie = cookies.get(SESSION_COOKIE)?.value;
  if (!sessionCookie)
    return null;
  try {
    const auth = getAuth(getActiveApp());
    const { uid } = await auth.verifySessionCookie(sessionCookie, true);
    return uid;
  }
  catch (error) {
    console.warn("Invalid session:", error);
    return null;
  }
}
