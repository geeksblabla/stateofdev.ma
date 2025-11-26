import react from "@vitejs/plugin-react";
/// <reference types="vitest" />
import { getViteConfig } from "astro/config";

// eslint-disable-next-line ts/no-unsafe-assignment, ts/no-unsafe-call
const reactPlugin = react();
export default getViteConfig({
  plugins: [reactPlugin],
  // @ts-expect-error - getViteConfig doesn't include test property in types but it's supported
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
