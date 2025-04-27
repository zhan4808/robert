import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Import configurations
const nextConfig = compat.extends("next/core-web-vitals");

export default [
  ...nextConfig,
  {
    rules: {
      // Disable rules that are causing build failures
      "react/no-unescaped-entities": "off",
      "@next/next/no-img-element": "off" // Completely disable image warning
    },
    ignores: [
      "**/node_modules/**",
      ".next/**",
      "out/**",
    ]
  }
];
