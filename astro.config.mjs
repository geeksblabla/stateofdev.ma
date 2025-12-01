import mdx from "@astrojs/mdx";
import netlify from "@astrojs/netlify";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import yaml from "@rollup/plugin-yaml";

import icon from "astro-icon";

import { defineConfig } from "astro/config";

const SURVEY_OPEN = true;

const redirects = !SURVEY_OPEN
  ? {
      "/before-start": "/",
      "/survey": "/",
      "/thanks": "/"
    }
  : {};

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), icon(), mdx(), react()],
  trailingSlash: "never",
  output: "server",
  adapter: netlify(),
  redirects: {
    ...redirects
  },
  vite: {
    plugins: [yaml()]
  }
});
