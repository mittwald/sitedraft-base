import type { AstroIntegration } from "astro";

// Legally required notice that the site's code is AI-generated. Injected as a
// middleware instead of living in RootLayout.astro, because the agent rewrites
// layouts freely and would drop the comment without anyone noticing.
export default function aiNotice(): AstroIntegration {
  return {
    name: "sitedraft-ai-notice",
    hooks: {
      "astro:config:setup": ({ addMiddleware }) => {
        // "pre" wraps any middleware the agent writes in src/middleware.ts, so
        // the notice is applied to the final response.
        addMiddleware({
          order: "pre",
          entrypoint: new URL("./ai-notice-middleware.ts", import.meta.url),
        });
      },
    },
  };
}
