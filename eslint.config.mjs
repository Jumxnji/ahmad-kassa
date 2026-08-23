import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import eslintConfigPrettier from "eslint-config-prettier";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  eslintConfigPrettier,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // AI coding-assistant scaffold/skill directories — not application
    // source, not meant to be linted under this project's rules.
    ".agents/**",
    ".augment/**",
    ".claude/**",
    ".codebuddy/**",
    ".codex/**",
    ".continue/**",
    ".cursor/**",
    ".factory/**",
    ".gemini/**",
    ".github/**",
    ".kilocode/**",
    ".kiro/**",
    ".opencode/**",
    ".qoder/**",
    ".roo/**",
    ".trae/**",
    ".warp/**",
    ".windsurf/**",
  ]),
]);

export default eslintConfig;
