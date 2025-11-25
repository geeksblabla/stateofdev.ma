import type { APIRoute } from "astro";
import { getAuth } from "firebase-admin/auth";
import { getActiveApp } from "@/lib/firebase/server";
// TODO: check if we really need this
export const prerender = false;

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
  const auth = getAuth(getActiveApp());

  /* Get token from request headers */
  const idToken = request.headers.get("Authorization")?.split("Bearer ")[1];
  if (!idToken) {
    return new Response("No token found", { status: 401 });
  }

  console.warn("idToken", idToken);
  /* Verify id token */
  try {
    await auth.verifyIdToken(idToken);
  }
  catch {
    return new Response("Invalid token", { status: 401 });
  }

  /* Create and set session cookie */
  const fiveDays = 60 * 60 * 24 * 5 * 1000;
  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: fiveDays
  });

  cookies.set("__session", sessionCookie, {
    path: "/"
  });

  return redirect("/survey");
};
