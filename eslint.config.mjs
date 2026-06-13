import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  // Prose-heavy content files: apostrophes and quotes in running English text
  // are expected, so the unescaped-entities rule is off here.
  {
    files: [
      "lib/articles.js",
      "app/privacy-policy/page.js",
      "app/terms/page.js",
      "app/contact/ContactForm.js",
      "components/AssetDifferentiatorPage.js",
    ],
    rules: {
      "react/no-unescaped-entities": "off",
    },
  },
]);

export default eslintConfig;
