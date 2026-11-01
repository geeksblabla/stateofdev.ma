import { defineAction } from "astro:actions";
import { SESSION_COOKIE } from "@/lib/firebase/session";

export const removeSession = defineAction({
  accept: "json",
  handler: async (_input, { cookies }) => {
    cookies.delete(SESSION_COOKIE, {
      path: "/"
    });

    return {
      success: true
    };
  }
});
