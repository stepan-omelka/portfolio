import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  // dist/ is the compiled app; public/ is the Angular build copied in by scripts/copy-web.mjs.
  globalIgnores(["dist/**", "public/**", ".vercel/**"]),
  js.configs.recommended,
  tseslint.configs.recommended,
  { languageOptions: { globals: globals.node } },
]);
