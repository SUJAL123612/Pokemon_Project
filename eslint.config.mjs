import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  {
    rules: {
      "@next/next/no-img-element": "off", // allow <img>
      "@typescript-eslint/no-explicit-any": "off", // allow 'any' type
      "@typescript-eslint/no-unused-vars": "off", // ignore unused vars
      "react-hooks/exhaustive-deps": "off", // ignore dependency warnings
    },
  },
];

export default eslintConfig;
