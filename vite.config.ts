import { defineConfig } from "vite";

import glsl from "vite-plugin-glsl";

export default defineConfig({
  base: "/yuanshen/",
  server: {
    open: true,
  },
  build: {
    outDir: "docs",
  },
  plugins: [glsl()],
});
