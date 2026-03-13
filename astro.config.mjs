import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://clubedosoficiaiscbmdf.com.br",
  integrations: [sitemap()],
  output: "static",
  build: {
    format: "file",
  },
});
