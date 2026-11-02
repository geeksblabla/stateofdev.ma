/* eslint-disable no-console */
import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { isCaptchaValid } from "@/lib/captcha";
import { initUserSubmission } from "@/lib/firebase/database";
import { auth } from "@/lib/firebase/server";
import { setSessionCookie } from "@/lib/firebase/session";

export const initSession = defineAction({
  accept: "json",
  input: z.object({
    idToken: z.string(),
    captchaToken: z.string().optional()
  }),
  handler: async ({ idToken, captchaToken }, { cookies }) => {
    /* Validate inputs */
    if (!captchaToken && import.meta.env.CAPTCHA_ENABLED === "true") {
      throw new ActionError({
        code: "UNAUTHORIZED",
        message: "Captcha token is required"
      });
    }
    if (!idToken) {
      throw new ActionError({
        code: "UNAUTHORIZED",
        message: "No idToken provided"
      });
    }

    /* Validate captcha */
    if (captchaToken && import.meta.env.CAPTCHA_ENABLED === "true") {
      console.log("checking captcha ");

      const isValid = await isCaptchaValid(captchaToken);
      if (!isValid) {
        throw new ActionError({
          code: "UNAUTHORIZED",
          message: "Invalid captcha"
        });
      }
    }

    /* Verify id token and save user to database */
    try {
      const decodedToken = await auth.verifyIdToken(idToken);
      const user = await auth.getUser(decodedToken.uid);
      await initUserSubmission(user);
      console.log("user session created");
    }
    catch (error) {
      console.error("Error verifying id token:", error);
      throw new ActionError({
        code: "UNAUTHORIZED",
        message: "Invalid id token"
      });
    }

    try {
      await setSessionCookie(cookies, idToken);
      return {
        success: true
      };
    }
    catch (error) {
      console.error("Error creating session cookie:", error);
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error creating session"
      });
    }
  }
});
