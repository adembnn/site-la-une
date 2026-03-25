import { getArticlesForRSS } from "@/sanity/queries";

const siteUrl = "https://launessec.fr";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const articles = await getArticlesForRSS();

  const items = articles
    .map(
      (a: { titre: string; sousTitre?: string; slug: string; datePublication: string; categories?: { nom: string }[] }) => `
    <item>
      <title>${escapeXml(a.titre)}</title>
      <link>${siteUrl}/articles/${a.slug}</link>
      <guid isPermaLink="true">${siteUrl}/articles/${a.slug}</guid>
      <pubDate>${new Date(a.datePublication).toUTCString()}</pubDate>
      ${a.sousTitre ? `<description>${escapeXml(a.sousTitre)}</description>` : ""}
      ${a.categories?.map((c: { nom: string }) => `<category>${escapeXml(c.nom)}</category>`).join("\n      ") ?? ""}
    </item>`,
    )
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>La UN'e ESSEC</title>
    <link>${siteUrl}</link>
    <description>Journal de géopolitique et de diplomatie de l'ESSEC Business School par UN'ESSEC</description>
    <language>fr</language>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
    },
  });
}
