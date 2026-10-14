import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://astro.build/config
export default defineConfig({
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
