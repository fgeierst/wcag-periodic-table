import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://astro.build/config
export default defineConfig({
  redirects: {
    "/criteria/target-size/": "/criteria/target-size-enhanced/",
    "/criteria/parsing/": "/wcag/2.1/criteria/parsing/",
  },
  integrations: [svelte()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        $lib: path.resolve("./src/lib"),
      },
    },
  },
});
