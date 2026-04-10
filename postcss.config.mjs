import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import("postcss-load-config").Config} */
const config = {
  // Avoid importing `@tailwindcss/postcss` here (Turbopack + lightningcss `.node`); use string plugin id.
  plugins: {
    "@tailwindcss/postcss": {
      base: __dirname,
    },
  },
};

export default config;
