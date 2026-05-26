// @ts-check
import { defineConfig } from "astro/config";

import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://marcoladatema.com",

  i18n: {
    defaultLocale: "tr",
    locales: ["tr", "en"],
    routing: {
      prefixDefaultLocale: true,
    },
  },

  integrations: [sitemap()],
});