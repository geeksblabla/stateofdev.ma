/* eslint-disable no-console */
import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { getAuth } from "firebase-admin/auth";
import { passesCaptcha } from "@/lib/captcha";
import { initUserSubmission } from "@/lib/firebase/database";
import { getActiveApp } from "@/lib/firebase/server";

export const initSession = defineAction({
  accept: "json",
  input: z.object({
    idToken: z.string(),
    captchaToken: z.string().optional()
  }),
  handler: async ({ idToken, captchaToken }, { cookies }) => {
    const auth = getAuth(getActiveApp());
    if (!idToken) {
      throw new ActionError({
        code: "UNAUTHORIZED",
        message: "No idToken provided"
      });
    }

    if (!(await passesCaptcha(captchaToken))) {
      throw new ActionError({
        code: "UNAUTHORIZED",
        message: "Invalid captcha"
      });
    }

    try {
      const decodedToken = await auth.verifyIdToken(idToken);
      const user = await auth.getUser(decodedToken.uid);
      if (!user) {
        throw new ActionError({
          code: "UNAUTHORIZED",
          message: "User not found"
        });
      }
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
    }
    catch (error) {
      console.error("Error signing in:", error);
      throw new ActionError({
        code: "UNAUTHORIZED",
        message: "Error signing in"
      });
    }
  }
});
