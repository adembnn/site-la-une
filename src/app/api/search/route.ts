/**
 * API ROUTE : /api/search
 *
 * Renvoie la liste de tous les articles pour la recherche Fuse.js.
 * Cache de 60 secondes pour éviter de requêter Sanity à chaque frappe.
 */

import { NextResponse } from "next/server";
import { getArticlesForSearch } from "@/sanity/queries";

export async function GET() {
  const articles = await getArticlesForSearch();

  return NextResponse.json(articles, {
    headers: {
      // Cache côté navigateur : 60s, stale-while-revalidate : 5 min
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
}
