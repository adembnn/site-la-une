// Couleurs distinctes par rubrique
export const couleursRubriques: Record<string, { bg: string; text: string; badge: string }> = {
  europe: {
    bg: "bg-blue-50",
    text: "text-blue-600",
    badge: "bg-blue-100 text-blue-700",
  },
  france: {
    bg: "bg-blue-50",
    text: "text-blue-500",
    badge: "bg-blue-100 text-blue-600",
  },
  "moyen-orient-and-afrique-du-nord": {
    bg: "bg-amber-50",
    text: "text-amber-600",
    badge: "bg-amber-100 text-amber-700",
  },
  asie: {
    bg: "bg-red-50",
    text: "text-red-600",
    badge: "bg-red-100 text-red-700",
  },
  chine: {
    bg: "bg-red-50",
    text: "text-red-500",
    badge: "bg-red-100 text-red-600",
  },
  "indo-pacifique": {
    bg: "bg-cyan-50",
    text: "text-cyan-600",
    badge: "bg-cyan-100 text-cyan-700",
  },
  ameriques: {
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    badge: "bg-emerald-100 text-emerald-700",
  },
  "amerique-latine": {
    bg: "bg-lime-50",
    text: "text-lime-600",
    badge: "bg-lime-100 text-lime-700",
  },
  "amerique-du-nord": {
    bg: "bg-teal-50",
    text: "text-teal-600",
    badge: "bg-teal-100 text-teal-700",
  },
  "afrique-subsaharienne": {
    bg: "bg-orange-50",
    text: "text-orange-600",
    badge: "bg-orange-100 text-orange-700",
  },
  "organisations-internationales": {
    bg: "bg-violet-50",
    text: "text-violet-600",
    badge: "bg-violet-100 text-violet-700",
  },
  geoeconomie: {
    bg: "bg-indigo-50",
    text: "text-indigo-600",
    badge: "bg-indigo-100 text-indigo-700",
  },
};

export function getCouleurRubrique(slug: string) {
  return couleursRubriques[slug] || {
    bg: "bg-gray-50",
    text: "text-gray-600",
    badge: "bg-gray-100 text-gray-700",
  };
}
