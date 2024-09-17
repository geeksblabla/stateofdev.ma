import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";
import cloudflare from "@astrojs/cloudflare";
import mdx from "@astrojs/mdx";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), icon(), mdx(), react()],
  trailingSlash: "never",
  output: "hybrid",
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
      configPath: "wrangler.toml",
    },
  }),
  vite: {
    ssr: {
      external: ["url", "path", "fs", "crypto", "http", "https", "os","http2","events", "zlib", "node:stream","node:util", "node:events","stream", "util", "buffer", "node:buffer"],
    },
  },
});
