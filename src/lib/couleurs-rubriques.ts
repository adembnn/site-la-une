// Couleurs distinctes par rubrique
export const couleursRubriques: Record<string, { bg: string; text: string; badge: string }> = {
  europe: {
    bg: "bg-blue-50",
    text: "text-blue-600",
    badge: "bg-blue-100 text-blue-700",
  },
  "moyen-orient-afrique-du-nord": {
    bg: "bg-amber-50",
    text: "text-amber-600",
    badge: "bg-amber-100 text-amber-700",
  },
  "asie-pacifique": {
    bg: "bg-red-50",
    text: "text-red-600",
    badge: "bg-red-100 text-red-700",
  },
  ameriques: {
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    badge: "bg-emerald-100 text-emerald-700",
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
};

export function getCouleurRubrique(slug: string) {
  return couleursRubriques[slug] || {
    bg: "bg-gray-50",
    text: "text-gray-600",
    badge: "bg-gray-100 text-gray-700",
  };
}
