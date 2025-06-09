import { defineConfig } from "vite";

import glsl from "vite-plugin-glsl";

export default defineConfig({
  server: {
    open: true,
  },
  build: {
    outDir: "docs", // 构建输出到 docs 目录
  },
  plugins: [glsl()],
});
