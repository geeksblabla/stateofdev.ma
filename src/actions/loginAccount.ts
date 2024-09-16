import { projectAuth } from "@/firebase/config";
import { defineAction } from "astro:actions";
import { z } from "astro:schema";

import { signInWithEmailAndPassword } from "firebase/auth";

export const loginAccount = defineAction({
  accept: "form",
  input: z.object({
    email: z.string().email(),
    password: z.string()
  }),
  handler: async ({ email, password }) => {
    await signInWithEmailAndPassword(projectAuth, email, password);
  }
});
