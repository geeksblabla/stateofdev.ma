import { projectAuth } from "@/firebase/config";
import { defineAction, z } from "astro:actions";

export const logoutAccount = defineAction({
  handler: async () => {
    await projectAuth.signOut();
  },
});
