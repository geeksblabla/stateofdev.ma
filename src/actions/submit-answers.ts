/* eslint-disable no-console */
import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { saveAnswers } from "@/lib/firebase/database";
import { getSessionUid } from "@/lib/firebase/session";

export const submitAnswers = defineAction({
  accept: "json",
  input: z.object({
    answers: z.record(
      z.string(),
      z.union([z.number(), z.string().max(200), z.array(z.number()), z.null()])
    )
  }),
  handler: async ({ answers }, { cookies }) => {
    const uid = await getSessionUid(cookies);
    if (!uid) {
      throw new ActionError({
        code: "UNAUTHORIZED",
        message: "No valid session, please initialize a session first"
      });
    }
    try {
      await saveAnswers(uid, answers);
      console.log("answers saved");
    }
    catch (error) {
      console.error("Error saving answers:", error);
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error saving answers"
      });
    }
  }
});
