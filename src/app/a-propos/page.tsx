export const metadata = {
  title: "À propos",
  description: "Découvrez l'association UN'ESSEC et son journal La UN'e.",
};

export default function AProposPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <h1 className="font-serif text-3xl md:text-4xl font-bold text-bleu-fonce">
        À propos
      </h1>

      <div className="h-0.5 bg-dore w-16 mt-4 mb-8" />

      <div className="space-y-6 text-gris leading-relaxed">
        <p>
          <strong className="text-bleu-fonce">UN&apos;ESSEC</strong>{" "}est l&apos;association de géopolitique et de diplomatie de l&apos;ESSEC
          Business School. Fondée par des étudiants passionnés par les relations
          internationales, elle a pour vocation de décrypter l&apos;actualité
          mondiale et de former les futurs acteurs de la scène internationale.
        </p>

        <p>
          Chaque semaine, notre journal <strong className="text-bleu-fonce">La UN&apos;e</strong>{" "}publie
          cinq articles rédigés par nos membres : quatre articles courts
          couvrant l&apos;actualité géopolitique et un dossier approfondi sur un
          enjeu majeur.
        </p>

        <h2 className="font-serif text-2xl font-bold text-bleu-fonce pt-4">
          Notre mission
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Décrypter les grands enjeux géopolitiques contemporains</li>
          <li>Former les étudiants à l&apos;analyse des relations internationales</li>
          <li>Participer à des simulations diplomatiques (MUN, etc.)</li>
          <li>Créer un espace de débat et de réflexion ouvert</li>
        </ul>

        <h2 className="font-serif text-2xl font-bold text-bleu-fonce pt-4">
          Nos couleurs
        </h2>
        <p>
          Le bleu et le doré, couleurs de l&apos;ONU, reflètent notre
          engagement pour le multilatéralisme et la diplomatie. Ils symbolisent
          notre volonté de comprendre le monde dans toute sa complexité.
        </p>
      </div>
    </div>
  );
}
