import type { APIRoute } from "astro";
import { SESSION_COOKIE } from "@/lib/firebase/session";

export const prerender = false;

export const GET: APIRoute = async ({ redirect, cookies }) => {
  cookies.delete(SESSION_COOKIE, {
    path: "/"
  });
  return redirect("/before-start");
};
