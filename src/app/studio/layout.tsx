/**
 * Layout du Studio
 *
 * On masque le Header et Footer du site pour le Studio.
 * En Next.js, seul le layout RACINE (app/layout.tsx) peut définir
 * les balises <html> et <body>. Ici on définit juste un wrapper
 * qui prend toute la hauteur de l'écran.
 *
 * Le Header/Footer sont toujours rendus par le layout racine,
 * mais on les cache visuellement via CSS sur cette route.
 */

export const metadata = {
  title: "La UNE — Studio",
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[100] bg-white">
      {children}
    </div>
  );
}
