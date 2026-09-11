import js from "@eslint/js";
import tseslint from "typescript-eslint";
import astro from "eslint-plugin-astro";
import jsxA11y from "eslint-plugin-jsx-a11y";

export default tseslint.config(
  // Global ignores
  { ignores: ["dist/", "output/", "node_modules/", "*.mjs", ".astro/"] },

  // Base JS rules
  js.configs.recommended,

  // TypeScript rules
  ...tseslint.configs.recommended,

  // Astro rules
  ...astro.configs.recommended,

  // JSX a11y rules
  jsxA11y.flatConfigs.recommended,

  // Project-specific overrides
  {
    rules: {
      // Relax some rules for the project's conventions
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "no-console": ["warn", { allow: ["warn", "error", "info"] }],
    },
  },

  // Allow console in build scripts
  {
    files: ["src/scripts/**", "scripts/**"],
    rules: {
      "no-console": "off",
    },
  },

  // Relax a11y rules for existing interactive game components
  {
    files: ["src/components/interactive/**"],
    rules: {
      "jsx-a11y/click-events-have-key-events": "warn",
      "jsx-a11y/no-noninteractive-element-interactions": "warn",
    },
  },
);
