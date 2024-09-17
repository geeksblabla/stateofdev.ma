import { defineAction } from "astro:actions";

export const removeSession = defineAction({
  accept: "json",
  handler: async (_input, { cookies }) => {
    cookies.delete("__session", {
      path: "/"
    });

    return {
      success: true
    };
  }
});
