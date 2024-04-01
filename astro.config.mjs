import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import path from "path";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [svelte(), tailwind()],
  vite: {
    resolve: {
      alias: {
        $lib: path.resolve("./src/lib"),
      },
    },
  },
});
