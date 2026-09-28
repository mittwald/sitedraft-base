import { defineMiddleware } from "astro:middleware";

const NOTICE =
  "<!-- Der Code dieser Website wurde mithilfe von sitedraft AI by mittwald KI-gestützt erstellt. -->";

const DOCTYPE = /^\s*<!doctype[^>]*>/i;

export const onRequest = defineMiddleware(async (_context, next) => {
  const response = await next();
  const contentType = response.headers.get("content-type") ?? "";
  if (!response.body || !contentType.includes("text/html")) return response;

  const html = await response.text();
  const doctype = DOCTYPE.exec(html)?.[0];
  const withNotice = doctype
    ? `${doctype}\n${NOTICE}${html.slice(doctype.length)}`
    : `${NOTICE}\n${html}`;

  const headers = new Headers(response.headers);
  headers.delete("content-length");
  return new Response(withNotice, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
});
