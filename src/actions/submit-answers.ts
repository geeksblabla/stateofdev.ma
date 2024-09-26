import { app } from "@/lib/firebase/server";
import { defineAction } from "astro:actions";
import { getAuth } from "firebase-admin/auth";
import { z } from "astro:schema";
import { saveAnswers } from "@/lib/firebase/database";

export const submitAnswers = defineAction({
  accept: "json",
  input: z.object({
    answers: z.record(
      z.string(),
      z.union([z.number(), z.string().max(200), z.array(z.number()), z.null()])
    )
  }),
  handler: async ({ answers }, { cookies }) => {
    const auth = getAuth(app);
    /* Verify Session */
    const sessionCookie = cookies.get("__session")?.value;
    if (!sessionCookie) {
      return {
        error: "No session is active, please initialize a session first"
      };
    }
    /* Get User */
    try {
      const decodedCookie = await auth.verifySessionCookie(sessionCookie);
      const user = await auth.getUser(decodedCookie.uid);
      if (!user) {
        return {
          error:
            "Can't find user from session, please initialize a session first"
        };
      }
      /* Save answers to database */
      await saveAnswers(user.uid, answers);
      console.log("answers saved");
    } catch (error) {
      console.error("Error token or saving answers:", error);
      return {
        error: "Error token or saving answers"
      };
    }
  }
});
