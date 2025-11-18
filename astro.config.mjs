import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import yaml from "@rollup/plugin-yaml";
import icon from "astro-icon";
import mdx from "@astrojs/mdx";

import react from "@astrojs/react";

import netlify from "@astrojs/netlify";

const SURVEY_OPEN = false;

const redirects = SURVEY_OPEN
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
