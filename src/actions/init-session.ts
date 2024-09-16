import { app } from "@/firebase/server";
import { defineAction } from "astro:actions";
import { getAuth } from "firebase-admin/auth";
import { z } from "astro:schema";

export const initSession = defineAction({
  accept: "json",
  input: z.object({
    idToken: z.string(),
  }),
  handler: async ({ idToken }, { cookies }) => {
    const auth = getAuth(app);
    if (!idToken) {
      return {
        error: "No idToken provided",
      };
    }
    /* Verify id token */
    try {
      const decodedToken = await auth.verifyIdToken(idToken);
      console.log("Decoded token:", decodedToken);
    } catch (error) {
      console.error("Error verifying id token:", error);
      return {
        error: "Invalid id token",
      };
    }

    try {
      // Create and set session cookie
      const fiveDays = 60 * 60 * 24 * 5 * 1000;
      const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: fiveDays,
      });

      cookies.set("__session", sessionCookie, {
        path: "/",
      });

      return {
        success: true,
      };
    } catch (error) {
      console.error("Error signing in:", error);
      return {
        error: "Error signing in",
      };
    }
  }
});
