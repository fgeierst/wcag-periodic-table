/// <reference types="vitest" />
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/vitest/**"],
    /* for example, use global to avoid globals imports (describe, test, expect): */
    // globals: true,
    coverage: {
      include: ["src/**"],
    },
  },
});
