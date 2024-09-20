import type { APIRoute } from "astro";
import { app } from "@/lib/firebase/server";
import { getAuth } from "firebase-admin/auth";
// TODO: check if we really need this
export const prerender = false;

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
  const auth = getAuth(app);

  /* Get token from request headers */
  const idToken = request.headers.get("Authorization")?.split("Bearer ")[1];
  if (!idToken) {
    return new Response("No token found", { status: 401 });
  }

  console.log("idToken", idToken);
  /* Verify id token */
  try {
    await auth.verifyIdToken(idToken);
  } catch (error) {
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
