import { app } from "@/lib/firebase/server";
import { defineAction } from "astro:actions";
import { getAuth } from "firebase-admin/auth";
import { z } from "astro:schema";
import { initUserSubmission } from "@/lib/firebase/database";
import { isCaptchaValid } from "@/lib/captcha";

export const initSession = defineAction({
  accept: "json",
  input: z.object({
    idToken: z.string(),
    captchaToken: z.string().optional()
  }),
  handler: async ({ idToken, captchaToken }, { cookies }) => {
    const auth = getAuth(app);
    /* Validate inputs */
    if (!captchaToken && import.meta.env.CAPTCHA_ENABLED === "true") {
      return {
        error: "Captcha token is required"
      };
    }
    if (!idToken) {
      return {
        error: "No idToken provided"
      };
    }

    /* Validate captcha */
    if (captchaToken && import.meta.env.CAPTCHA_ENABLED === "true") {
      const isValid = await isCaptchaValid(captchaToken);
      if (!isValid) {
        return {
          error: "Invalid captcha"
        };
      }
    }

    /* Verify id token and save user to database */
    try {
      const decodedToken = await auth.verifyIdToken(idToken);
      const user = await auth.getUser(decodedToken.uid);
      if (!user) {
        return {
          error: "User not found"
        };
      }
      await initUserSubmission(user);
      console.log("user session created");
    } catch (error) {
      console.error("Error verifying id token:", error);
      return {
        error: "Invalid id token"
      };
    }

    try {
      // Create and set session cookie
      const fiveDays = 60 * 60 * 24 * 5 * 1000;
      const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: fiveDays
      });

      // set session cookie
      cookies.set("__session", sessionCookie, {
        path: "/"
      });
      return {
        success: true
      };
    } catch (error) {
      console.error("Error signing in:", error);
      return {
        error: "Error signing in"
      };
    }
  }
});
