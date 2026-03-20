import { createClient } from "next-sanity";
import { projectId, dataset, apiVersion } from "./env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // En dev : false = données en temps réel (pas de cache)
  // En prod : true = plus rapide grâce au CDN (cache)
  useCdn: process.env.NODE_ENV === "production",
});
