/// <reference types="vitest" />
import { getViteConfig } from "astro/config";
import react from "@vitejs/plugin-react";

export default getViteConfig({
  plugins: [react()],
  test: {
    exclude: ["node_modules"],
    coverage: {
      // you can include other reporters, but 'json-summary' is required, json is recommended
      reporter: ["text", "json-summary", "json"],
      // If you want a coverage reports even if your tests are failing, include the reportOnFailure option
      reportOnFailure: true
    },
    environment: "jsdom",
    setupFiles: "./vitest-setup.js"
  }
});
