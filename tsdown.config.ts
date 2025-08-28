import { defineConfig } from "tsdown";

export default defineConfig({
  entry: "src/index.ts",
  outDir: "bin",
  format: "es",
  platform: "node",
  target: "node24",
  clean: true,
  dts: false,
  tsconfig: "tsconfig.build.json",
  minify: true,
});
