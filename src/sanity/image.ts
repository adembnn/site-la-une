/**
 * UTILITAIRE IMAGE SANITY
 *
 * Quand tu uploades une image dans Sanity, elle n'est pas stockée
 * comme une simple URL. Sanity stocke une RÉFÉRENCE (un ID) vers
 * l'image hébergée sur son CDN.
 *
 * Ce fichier crée un "builder" qui transforme cette référence
 * en URL utilisable dans une balise <img>.
 *
 * Exemple :
 *   L'image dans Sanity : { _type: "image", asset: { _ref: "image-abc123-800x600-jpg" } }
 *   → urlFor(image).width(800).url() → "https://cdn.sanity.io/images/.../abc123-800x600.jpg?w=800"
 *
 * Le builder permet aussi de redimensionner, recadrer, etc.
 */

import imageUrlBuilder from "@sanity/image-url";
import { client } from "./client";

const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source).auto("format");
}
