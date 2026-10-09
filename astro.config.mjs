import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://clubedosoficiaiscbmdf.com.br",
  integrations: [sitemap({
    serialize(item) {
      const url = new URL(item.url);
      url.pathname = url.pathname.replace(/\/index\.html$/, "/").replace(/\.html$/, "").replace(/\/$/, "") || "/";
      return { ...item, url: url.toString() };
    },
  })],
  trailingSlash: "never",
  output: "static",
  build: {
    // Vercel cleanUrls serves these files at extensionless URLs with 308 redirects.
    format: "file",
  },
});
