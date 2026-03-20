/**
 * TEMPS DE LECTURE
 *
 * Calcule le temps de lecture estimé d'un article.
 * On utilise 250 mots/minute (vitesse moyenne de lecture en français).
 *
 * Le contenu Sanity est en format "Portable Text" : un tableau de blocs,
 * chaque bloc contenant un tableau de "children" avec le texte.
 * On extrait tout le texte, on compte les mots, et on divise par 250.
 */

type PortableTextBlock = {
  _type: string;
  children?: { text?: string }[];
};

/**
 * Extrait le texte brut d'un contenu Portable Text
 */
function extractText(blocks: PortableTextBlock[]): string {
  if (!blocks || !Array.isArray(blocks)) return "";

  return blocks
    .filter((block) => block._type === "block" && block.children)
    .map((block) =>
      block.children!.map((child) => child.text || "").join("")
    )
    .join(" ");
}

/**
 * Calcule le temps de lecture en minutes.
 * Retourne au minimum 1 minute.
 */
export function calculerTempsLecture(contenu: PortableTextBlock[]): number {
  const texte = extractText(contenu);
  const nbMots = texte.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(nbMots / 250));
}

/**
 * Retourne le texte formaté "X min de lecture"
 */
export function formaterTempsLecture(contenu: PortableTextBlock[]): string {
  const minutes = calculerTempsLecture(contenu);
  return `${minutes} min de lecture`;
}
