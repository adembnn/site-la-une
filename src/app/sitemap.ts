import { MetadataRoute } from "next";
import { client } from "@/sanity/client";

const siteUrl = "https://site-la-une-w8a6.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Pages statiques
  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/articles`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/a-propos`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/equipe`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/newsletter`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  // Articles dynamiques depuis Sanity
  const articles = await client.fetch<{ slug: string; datePublication: string }[]>(
    `*[_type == "article" && defined(slug.current)] | order(datePublication desc) {
      "slug": slug.current,
      datePublication
    }`
  );

  const articlePages: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${siteUrl}/articles/${article.slug}`,
    lastModified: new Date(article.datePublication),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Catégories/rubriques
  const categories = await client.fetch<{ slug: string }[]>(
    `*[_type == "categorie" && defined(slug.current)] { "slug": slug.current }`
  );

  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${siteUrl}/rubriques/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...articlePages, ...categoryPages];
}
