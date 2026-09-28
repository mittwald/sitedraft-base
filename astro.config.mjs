// @ts-check
import { existsSync, readFileSync } from "node:fs";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";
import react from "@astrojs/react";
import node from "@astrojs/node";
import icon from "astro-icon";
import sitemap from "@astrojs/sitemap";
import favicons from "astro-favicons";
import elementIds from "./plugins/vite-plugin-element-ids";
import aiNotice from "./plugins/ai-notice";
// Keep in sync with config.site in src/config.ts
const site = "https://example.com";

const faviconSource = ["public/favicon.svg", "public/favicon.png"].find(
  (path) => existsSync(path),
);

// Read, not imported: an import would make src/config.ts a config dependency,
// and every edit to it would trigger astro dev's in-process config reload.
const siteName =
  /^\s*name:\s*"([^"]*)"/m.exec(readFileSync("src/config.ts", "utf-8"))?.[1] ??
  "Website";

// https://astro.build/config
export default defineConfig({
  site,
  output: "static",
  trailingSlash: "never",
  adapter: node({ mode: "standalone" }),
  security: {
    checkOrigin: true,
    allowedDomains: [{ hostname: new URL(site).hostname, protocol: "https" }],
  },

  fonts: [
    {
      provider: fontProviders.google(),
      name: "Inter",
      cssVariable: "--font-inter",
      weights: ["100 900"],
      fallbacks: ["sans-serif"],
    },
  ],

  vite: {
    plugins: [
      elementIds({ enabled: process.env.PUBLIC_VISUAL_EDITOR === "true" }),
      tailwindcss(),
    ],
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-dom/client",
        "lucide-react",
        "radix-ui",
        "class-variance-authority",
        "clsx",
        "tailwind-merge",
        "cmdk",
        "embla-carousel-react",
        "react-day-picker",
        "react-resizable-panels",
        "vaul",
      ],
    },
    server: {
      allowedHosts: [".preview.sitedraft.de"],
      watch: {
        ignored: ["**/.pnpm-store/**", "**/.git/**"],
      },
      hmr: process.env.PREVIEW_DOMAIN
        ? {
            protocol: "wss",
            host: process.env.PREVIEW_DOMAIN,
            clientPort: 443,
          }
        : undefined,
    },
  },

  devToolbar: {
    enabled: false,
  },

  integrations: [
    aiNotice(),
    react(),
    icon(),
    sitemap(),
    ...(faviconSource
      ? [
          favicons({
            input: faviconSource,
            name: siteName,
            short_name: siteName,
          }),
        ]
      : []),
  ],
});
